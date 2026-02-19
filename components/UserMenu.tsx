"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { signOut } from "@/lib/actions/auth.actions"

type UserMenuProps = {
  name?: string | null
  email?: string | null
}

const UserMenu = ({ name, email }: UserMenuProps) => {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const displayName =
    name || (email ? email.split("@")[0] : "") || "User"

  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  const handleSignOut = () => {
    startTransition(async () => {
      await signOut()
      router.push("/sign-in")
    })
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-full bg-dark-200/80 border border-primary-200/40 px-3 py-1 hover:bg-dark-200 transition-colors"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-200 text-xs font-bold text-dark-100">
          {initials}
        </div>
        <span className="text-sm font-medium text-light-100 max-w-[140px] truncate">
          {displayName}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 rounded-xl bg-dark-200 border border-primary-200/40 shadow-lg py-1 z-50">
          <button
            type="button"
            onClick={handleSignOut}
            disabled={isPending}
            className="w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-dark-100 rounded-lg disabled:opacity-60"
          >
            {isPending ? "Signing out..." : "Sign out"}
          </button>
        </div>
      )}
    </div>
  )
}

export default UserMenu
