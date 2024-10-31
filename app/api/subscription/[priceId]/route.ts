import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import initStripe from "stripe"

export async function GET(req: NextRequest, {params}: {params: {priceId: string}}) {
  //This is how we inisitialize supabase in api routes
  const supabase = createRouteHandlerClient({cookies})
  const priceId = params.priceId
  const {data} = await supabase.auth.getUser()
  const user = data.user

  if (!user) {
    return NextResponse.json("Unauthorized", {status: 401})
  }
  const {data: stripe_customer_id} = await supabase
    .from("profile")
    .select("stripe_customer")
    .eq("id", user?.id)
    .single()
  

  // CREATE STRIPE CHECKOUT
    //1. First, instatiate Stripe
  const stripe = new initStripe(process.env.STRIPE_SECRET_KEY as string)

    //2. Second, create Stripe checkout session
  const session = await stripe.checkout.sessions.create({
    customer: stripe_customer_id?.stripe_customer,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{price: priceId, quantity: 1}],
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/cancelled`,
  })
   //3. Finally, return checkout session id to SubscriptionButton
  return NextResponse.json({id: session.id})
}