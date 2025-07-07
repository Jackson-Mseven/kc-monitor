'use client'

import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  User,
  Mail,
  Calendar,
  MapPin,
  ExternalLink,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Star,
  Github,
  Linkedin,
  Globe,
} from 'lucide-react'

interface TeamApplication {
  id: string
  applicantName: string
  applicantEmail: string
  applicantAvatar?: string
  reason: string
  experience: string
  portfolio?: string
  linkedIn?: string
  github?: string
  appliedAt: string
  status: 'pending' | 'approved' | 'rejected'
  reviewedBy?: string
  reviewedAt?: string
  reviewNotes?: string
  skills: string[]
  location?: string
}

interface ApplyDetailDialogProps {
  application: TeamApplication
  open: boolean
  onOpenChange: (open: boolean) => void
  onApprove?: () => void
  onReject?: () => void
}

export default function ApplyDetailDialog({
  application,
  open,
  onOpenChange,
  onApprove,
  onReject,
}: ApplyDetailDialogProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'secondary'
      case 'approved':
        return 'default'
      case 'rejected':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Application Details
          </DialogTitle>
          <DialogDescription>
            Review the complete application from {application.applicantName}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            {/* 申请者信息 */}
            <div className="flex items-start gap-4 p-4 border rounded-lg bg-muted/30">
              <Avatar className="h-16 w-16">
                <AvatarImage
                  src={application.applicantAvatar || '/placeholder.svg'}
                  alt={application.applicantName}
                />
                <AvatarFallback className="text-lg">
                  {application.applicantName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-semibold">{application.applicantName}</h3>
                  <Badge variant={getStatusColor(application.status) as any} className="gap-1">
                    {getStatusIcon(application.status)}
                    {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {application.applicantEmail}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Applied {new Date(application.appliedAt).toLocaleDateString()}
                  </div>
                  {application.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {application.location}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 外部链接 */}
            {(application.portfolio || application.github || application.linkedIn) && (
              <div className="space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  External Links
                </h4>
                <div className="flex flex-wrap gap-2">
                  {application.portfolio && (
                    <Button variant="outline" size="sm" asChild className="gap-2 bg-transparent">
                      <a href={application.portfolio} target="_blank" rel="noopener noreferrer">
                        <Globe className="h-4 w-4" />
                        Portfolio
                      </a>
                    </Button>
                  )}
                  {application.github && (
                    <Button variant="outline" size="sm" asChild className="gap-2 bg-transparent">
                      <a href={application.github} target="_blank" rel="noopener noreferrer">
                        <Github className="h-4 w-4" />
                        GitHub
                      </a>
                    </Button>
                  )}
                  {application.linkedIn && (
                    <Button variant="outline" size="sm" asChild className="gap-2 bg-transparent">
                      <a href={application.linkedIn} target="_blank" rel="noopener noreferrer">
                        <Linkedin className="h-4 w-4" />
                        LinkedIn
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* 技能标签 */}
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <Star className="h-4 w-4" />
                Skills & Technologies
              </h4>
              <div className="flex flex-wrap gap-2">
                {application.skills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            {/* 申请理由 */}
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Why They Want to Join
              </h4>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm leading-relaxed">{application.reason}</p>
              </div>
            </div>

            {/* 相关经验 */}
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <User className="h-4 w-4" />
                Relevant Experience
              </h4>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm leading-relaxed">{application.experience}</p>
              </div>
            </div>

            {/* 审核信息（如果已审核） */}
            {application.status !== 'pending' && application.reviewedBy && (
              <>
                <Separator />
                <div className="space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    {application.status === 'approved' ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    Review Information
                  </h4>
                  <div className="bg-muted p-4 rounded-lg space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Reviewed by:</span>
                      <span className="font-medium">{application.reviewedBy}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Review date:</span>
                      <span className="font-medium">
                        {application.reviewedAt &&
                          new Date(application.reviewedAt).toLocaleDateString()}
                      </span>
                    </div>
                    {application.reviewNotes && (
                      <div className="pt-2">
                        <p className="text-sm text-muted-foreground mb-1">Review notes:</p>
                        <p className="text-sm">{application.reviewNotes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {application.status === 'pending' && (
            <>
              <Button
                variant="outline"
                onClick={onReject}
                className="gap-2 text-red-600 hover:text-red-700 bg-transparent"
              >
                <XCircle className="h-4 w-4" />
                Reject
              </Button>
              <Button onClick={onApprove} className="gap-2">
                <CheckCircle className="h-4 w-4" />
                Approve
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
