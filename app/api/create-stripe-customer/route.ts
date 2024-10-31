import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";
import initStripe from "stripe"
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({cookies})

  //apiにquery parameterを追加してPublicアクセスを制限
  const query = req.nextUrl.searchParams.get("API_ROUTE_SECRET")
  if(query !== process.env.API_ROUTE_SECRET) {
    return NextResponse.json({
      message: "Non authorized access"
    })
  }
  //reqから顧客情報を取得して、stripe上にカスタマー作成
  const data = await req.json()
  const {id, email} = data.record

  const stripe = new initStripe(process.env.STRIPE_SECRET_KEY!);
  const customer = await stripe.customers.create({
    email,
  })
  // console.log(data)

  //stripeにカスタマー作成と同時にsupabaseのprofileテーブルにstripeのcustomer_idを追加
  const {error} = await supabase
    .from("profile")
    .update({
    stripe_customer: customer.id
  })
    .eq("id", id)
  // console.log(error)


  return NextResponse.json({
    message: `stripe customer created: ${customer.id}`
  })
}