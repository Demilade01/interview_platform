import Image from 'next/image'
import Link from 'next/link'
import React, { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { getCurrentUser } from '@/lib/actions/auth.actions'

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const user = await getCurrentUser()

  const displayName =
    user?.name || (user?.email ? user.email.split('@')[0] : '') || 'User'

  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="root-layout">
      <nav className="flex items-center justify-between w-full">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="logo" width={38} height={32} />
          <h2 className="text-primary-100">PrepWise</h2>
        </Link>

        {user ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full bg-dark-200/80 border border-primary-200/40 px-3 py-1">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-200 text-xs font-bold text-dark-100">
                {initials}
              </div>
              <span className="text-sm font-medium text-light-100 max-w-[140px] truncate">
                {displayName}
              </span>
            </div>
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
