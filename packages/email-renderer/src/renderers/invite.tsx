import React from 'react'
import { render } from '@react-email/render'
import InviteEmail from '../templates/invite-email'

export default function renderInviteEmail(props: Parameters<typeof InviteEmail>[0]) {
  return render(<InviteEmail {...props} />)
}
