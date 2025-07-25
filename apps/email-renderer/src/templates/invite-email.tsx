import React from 'react'
import { Html, Head, Preview, Body, Container, Text, Link } from '@react-email/components'

interface InviteEmailProps {
  teamName: string
  inviterName: string
  inviteeName?: string
  inviteLink: string
}

export default function InviteEmail({
  teamName,
  inviterName,
  inviteeName,
  inviteLink,
}: InviteEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>您被邀请加入团队「{teamName}」</Preview>
      <Body style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#ffffff' }}>
        <Container style={{ padding: '24px' }}>
          <Text>您好{inviteeName ? `，${inviteeName}` : ''}：</Text>
          <Text>
            用户 <strong>{inviterName}</strong> 邀请您加入团队 <strong>{teamName}</strong>。
          </Text>
          <Text>
            点击链接接受邀请：
            <br />
            <Link
              href={inviteLink}
              target="_blank"
              style={{
                color: '#1a73e8',
                textDecoration: 'underline',
                wordBreak: 'break-all',
              }}
            >
              {inviteLink}
            </Link>
          </Text>
          <Text>如果您不认识邀请者，请忽略此邮件。</Text>
        </Container>
      </Body>
    </Html>
  )
}
