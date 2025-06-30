'use client'

import React from 'react'
import CreateTeamDialog from './create-team-dialog'

export default function NoTeam() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-4">You are not in a team yet!</h1>
      <p className="text-gray-600 mb-8">Create a team to start collaborating.</p>
      <CreateTeamDialog />
    </div>
  )
}
