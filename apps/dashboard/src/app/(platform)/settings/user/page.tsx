'use client'

import React from 'react'
import UpdateUserFormCard from '@/components/settings/user/update-user-form-card'
import UpdatePasswordFormCard from '@/components/settings/user/update-password-form-card'

export default function UserPage() {
  return (
    <div className="grid gap-6">
      <UpdateUserFormCard />
      <UpdatePasswordFormCard />
    </div>
  )
}
