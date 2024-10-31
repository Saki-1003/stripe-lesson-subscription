"use client"

import React from 'react'
import { Button } from '../ui/button'
import { loadStripe } from '@stripe/stripe-js'

const SubscriptionButton = ({planId}: {planId: string}) => {

  const processSubscription = async () => {
  //buttonでクリックapi/subscription/[priceId]のエンドポイントを叩く。このapiからは最終的にsessionIdがreturnされる。
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/subscription/${planId}`)
    const json = await response.json()

  // client側でStripeを呼び出すには"npm i @stripe/stripe-js"が必要なので注意
  // client側でenvを使うときは"NEXT_PUBLIC_"キーワードが必要なので注意
    const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY as string)
 
    // Stripeの決済ページにリダイレクトさせる関数を書く
    await stripe?.redirectToCheckout({sessionId: json.id})
  }
  return (
    <Button onClick={async() => processSubscription()}>
      Subscribe
    </Button>
  )
}

export default SubscriptionButton