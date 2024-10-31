import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card'
import React from 'react'
import initStripe, {Stripe} from "stripe"
import { cookies } from 'next/headers'
import { createServerComponentClient, SupabaseClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/lib/database.types'
import Link from 'next/link'
import SubscriptionButton from '@/components/checkout/SubscriptionButton'
import AuthServerButton from '@/components/auth/AuthServerButton'


interface Plan {
  id: string;
  name: string;
  price: string | null;
  interval: Stripe.Price.Recurring.Interval | null;
  currency: string;
}

//stripe上で作ったproduct catalogの一覧を取得する
const getAllPlans = async(): Promise<Plan[]> => {
  const stripe = new initStripe(process.env.STRIPE_SECRET_KEY as string)
  const {data: plansList} = await stripe.plans.list()

  const plans = await Promise.all(
    plansList.map(async (plan) => {
      const product = await stripe.products.retrieve(plan.product as string)
      // console.log(product)
      return {
        id: plan.id,
        name: product.name,
        price: plan.amount_decimal,
        interval: plan.interval,
        currency: plan.currency
    }
  }))
  const sortedPlan = plans.sort((a,b) => parseInt(a.price!) - parseInt(b.price!))
  return plans
}

//stripeからprofile tableの情報を取得する
const getProfileData = async (supabase: SupabaseClient<Database>) => {
  const {data: profile} = await supabase
    .from("profile")
    .select("*")
    .single()
  return profile;
}

const PricingPage = async() => {
  //This is how we inisitialize supabase on client side
  const supabase = createServerComponentClient({cookies})
  const {data: user} = await supabase.auth.getSession()

  const [plans, profile] = await Promise.all([
    await getAllPlans(),
    await getProfileData(supabase)
  ])

  const showSubscribeButton = !!user.session && !profile?.is_subscribed;
  const showLogInButton = !user.session
  const showManageSubscriptionButton = !!user.session && profile?.is_subscribed
  
  return (
    <div className="w-full max-w-3xl mx-auto py-16 flex justify-around">
      {/* <pre>{JSON.stringify(plans, null, 2)}</pre> */}
      {plans.map((plan => (
        <Card className="shadow-md" key={plan.id}>
          <CardHeader>
            <CardTitle>{plan.name}</CardTitle>
            <CardDescription>{plan.name}</CardDescription>
          </CardHeader>
          <CardContent>
            <p>{plan.price} yen/ {plan.interval}</p>
          </CardContent>
          <CardFooter>
            {showSubscribeButton && <SubscriptionButton planId={plan.id}/>}
            {showLogInButton && <AuthServerButton />}
            {showManageSubscriptionButton && (
              <Button>
                <Link href="/dashboard">Manage subscription</Link>
              </Button>
            )}
            
          </CardFooter>
        </Card>

      )))}      
    </div>
  )
}

export default PricingPage