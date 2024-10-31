"use client"

import { useRouter } from "next/navigation"
import { Button } from "../ui/button"

const ManageSubscriptionButton = () => {
  const router = useRouter()

  const loadPortal = async () => {
    //下記apiを叩くとStripeのportalに接続して、urlをリターンする
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/portal`)
    const data = await response.json()

    router.push(data.url)
  }
  return (
    <div>
      <Button onClick={loadPortal}>Manage subscription</Button>
    </div>

  )
}

export default ManageSubscriptionButton