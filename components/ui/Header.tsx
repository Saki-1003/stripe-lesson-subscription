
import Link from 'next/link'
import React from 'react'
import { Button } from '@/components/ui/button'
import AuthServerButton from '../auth/AuthServerButton'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

const Header = async () => {
  const supabase = createServerComponentClient({cookies})
  const {data: user} = await supabase.auth.getSession()
  return (
    <div className="flex py-4 px-6 border-b border-gray-200">
      <Link href="/">
        <Button variant="outline">Home</Button>
      </Link>
      {user.session && (
        <Link href="/dashboard">
        <Button className='ml-4' variant="outline">Dashboard</Button>
      </Link>
      )}
      <Link href="/pricing">
        <Button className='ml-4' variant="outline">Price</Button>
      </Link>
      <div className='ml-auto' >
        <AuthServerButton />
      </div>
    </div>
  )
}

export default Header