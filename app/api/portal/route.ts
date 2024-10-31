import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import initStripe from "stripe"

export async function GET(req: NextRequest, {params}: {params: {priceId: string}}) {
  const supabase = createRouteHandlerClient({cookies})
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

  const stripe = new initStripe(process.env.STRIPE_SECRET_KEY as string)

  // ManageSubscriptionButtonをクリックしたらStripeのBilling portalに接続して、sessionを返す
  const session = await stripe.billingPortal.sessions.create({
    customer: stripe_customer_id?.stripe_customer,
    return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`,
  })


  return NextResponse.json({url: session.url})
}