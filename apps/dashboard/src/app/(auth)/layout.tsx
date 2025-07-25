import CustomLink from '@/components/base/CustomLink'
import { Card } from '@/components/ui/card'
import React from 'react'

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-600 rounded-lg mb-4">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">KC-Monitor</h1>
        </div>
        <Card className="shadow-xl border-0">{children}</Card>
        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>
            By continuing, you agree to our
            <CustomLink href="#" className="text-purple-600 hover:text-purple-700 hover:underline">
              Terms of Service
            </CustomLink>
            and
            <CustomLink href="#" className="text-purple-600 hover:text-purple-700 hover:underline">
              Privacy Policy
            </CustomLink>
          </p>
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
