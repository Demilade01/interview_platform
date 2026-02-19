import Image from 'next/image'
import Link from 'next/link'
import React, { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { getCurrentUser } from '@/lib/actions/auth.actions'
import UserMenu from '@/components/UserMenu'

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const user = await getCurrentUser()

  return (
    <div className="root-layout">
      <nav className="flex items-center justify-between w-full">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="logo" width={38} height={32} />
          <h2 className="text-primary-100">PrepWise</h2>
        </Link>

        {user ? (
          <div className="flex items-center gap-3">
            <UserMenu name={user.name} email={user.email} />
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" className="hidden sm:inline-flex">
              <Link href="/sign-up">Sign up</Link>
            </Button>

            <Button asChild className="btn-primary">
              <Link href="/sign-in">Sign in</Link>
            </Button>
          </div>
        )}
      </nav>

      {children}
    </div>
  )
}

export default RootLayout
