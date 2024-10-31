import React from 'react'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from "next/headers"
import AuthClientButton from './AuthClientButton'

const AuthServerButton = async () => {
  const supabase = createServerComponentClient({cookies})
  const {data: user} = await supabase.auth.getSession()
  const session = user.session
  // console.log(session)

  return (
    <AuthClientButton session={session} />
  )
}

export default AuthServerButton