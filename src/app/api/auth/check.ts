import type { Session } from 'next-auth'

export const isAdmin = (
  session: Session | null
) => {
  return (
    session?.user?.role ===
    'ADMIN'
  )
}

export const isSeniorManager = (
  session: Session | null
) => {
  return (
    session?.user?.role ===
    'SENIOR_MANAGER'
  )
}

export const isManager = (
  session: Session | null
) => {
  return (
    session?.user?.role ===
    'MANAGER'
  )
}

export const isSeniorOrAdmin = (
  session: Session | null
) => {
  return (
    session?.user?.role ===
      'ADMIN' ||
    session?.user?.role ===
      'SENIOR_MANAGER'
  )
}

export const isManagerOrHigher = (
  session: Session | null
) => {
  return (
    session?.user?.role ===
      'ADMIN' ||
    session?.user?.role ===
      'SENIOR_MANAGER' ||
    session?.user?.role ===
      'MANAGER'
  )
}