'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Users,
  Filter,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  UserPlus,
  Calendar,
  Mail,
  ExternalLink,
  Download,
  RefreshCw,
} from 'lucide-react'
import ApplyDetailDialog from '@/components/apply/apply-detail-dialog'
import ApplyActionDialog from '@/components/apply/apply-action-dialog'

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

export default function TeamApplicationsPage() {
  const [selectedApplications, setSelectedApplications] = useState<string[]>([])
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedApplication, setSelectedApplication] = useState<TeamApplication | null>(null)
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null)
  const [showDetailDialog, setShowDetailDialog] = useState(false)
  const [showActionDialog, setShowActionDialog] = useState(false)

  // 模拟申请数据
  const applications: TeamApplication[] = [
    {
      id: 'app-1',
      applicantName: 'Alice Johnson',
      applicantEmail: 'alice.johnson@email.com',
      applicantAvatar: '/placeholder.svg?height=40&width=40',
      reason:
        "I'm passionate about frontend development and have been following your team's work on the new design system. I believe my experience with React and TypeScript would be valuable to your projects.",
      experience:
        '5 years of frontend development experience, specializing in React, TypeScript, and modern CSS. Previously worked at TechCorp where I led the migration from jQuery to React.',
      portfolio: 'https://alice-portfolio.com',
      linkedIn: 'https://linkedin.com/in/alicejohnson',
      github: 'https://github.com/alicejohnson',
      appliedAt: '2024-01-15T10:30:00Z',
      status: 'pending',
      skills: ['React', 'TypeScript', 'CSS', 'Design Systems'],
      location: 'San Francisco, CA',
    },
    {
      id: 'app-2',
      applicantName: 'Bob Smith',
      applicantEmail: 'bob.smith@email.com',
      applicantAvatar: '/placeholder.svg?height=40&width=40',
      reason:
        "I'm excited about the opportunity to contribute to your backend infrastructure. Your team's approach to microservices aligns perfectly with my experience and interests.",
      experience:
        '7 years of backend development with Node.js, Python, and AWS. Built scalable microservices handling millions of requests daily at my current company.',
      github: 'https://github.com/bobsmith',
      appliedAt: '2024-01-14T14:20:00Z',
      status: 'approved',
      reviewedBy: 'John Doe',
      reviewedAt: '2024-01-15T09:15:00Z',
      reviewNotes: 'Strong technical background and good cultural fit.',
      skills: ['Node.js', 'Python', 'AWS', 'Docker', 'Kubernetes'],
      location: 'Remote',
    },
    {
      id: 'app-3',
      applicantName: 'Carol Davis',
      applicantEmail: 'carol.davis@email.com',
      applicantAvatar: '/placeholder.svg?height=40&width=40',
      reason:
        "I'm looking to transition into a more collaborative environment where I can learn from experienced developers while contributing my mobile development skills.",
      experience:
        '3 years of mobile development with React Native and Flutter. Built and published 5 apps on both iOS and Android app stores.',
      portfolio: 'https://carol-apps.com',
      appliedAt: '2024-01-13T16:45:00Z',
      status: 'rejected',
      reviewedBy: 'Jane Smith',
      reviewedAt: '2024-01-14T11:30:00Z',
      reviewNotes: 'Good skills but looking for more senior candidates at this time.',
      skills: ['React Native', 'Flutter', 'iOS', 'Android'],
      location: 'New York, NY',
    },
    {
      id: 'app-4',
      applicantName: 'David Wilson',
      applicantEmail: 'david.wilson@email.com',
      applicantAvatar: '/placeholder.svg?height=40&width=40',
      reason:
        "Your team's focus on DevOps and infrastructure automation is exactly what I'm passionate about. I'd love to help optimize your deployment pipelines.",
      experience:
        '6 years in DevOps and infrastructure. Expert in CI/CD, monitoring, and cloud platforms. Reduced deployment time by 80% at my previous company.',
      linkedIn: 'https://linkedin.com/in/davidwilson',
      github: 'https://github.com/davidwilson',
      appliedAt: '2024-01-12T11:15:00Z',
      status: 'pending',
      skills: ['DevOps', 'CI/CD', 'AWS', 'Terraform', 'Monitoring'],
      location: 'Austin, TX',
    },
    {
      id: 'app-5',
      applicantName: 'Eva Martinez',
      applicantEmail: 'eva.martinez@email.com',
      applicantAvatar: '/placeholder.svg?height=40&width=40',
      reason:
        "I'm impressed by your team's commitment to accessibility and inclusive design. I'd love to contribute my UX research and design skills to your projects.",
      experience:
        '4 years in UX design and research. Led accessibility initiatives that improved user satisfaction by 40%. Strong background in user testing and design systems.',
      portfolio: 'https://eva-ux.design',
      linkedIn: 'https://linkedin.com/in/evamartinez',
      appliedAt: '2024-01-11T09:30:00Z',
      status: 'pending',
      skills: ['UX Design', 'Accessibility', 'User Research', 'Figma'],
      location: 'Los Angeles, CA',
    },
  ]

  const filteredApplications = applications.filter((app) => {
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter
    const matchesSearch =
      searchQuery === '' ||
      app.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.applicantEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.skills.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesStatus && matchesSearch
  })

  const handleSelectApplication = (applicationId: string, checked: boolean) => {
    if (checked) {
      setSelectedApplications([...selectedApplications, applicationId])
    } else {
      setSelectedApplications(selectedApplications.filter((id) => id !== applicationId))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedApplications(filteredApplications.map((app) => app.id))
    } else {
      setSelectedApplications([])
    }
  }

  const handleViewApplication = (application: TeamApplication) => {
    setSelectedApplication(application)
    setShowDetailDialog(true)
  }

  const handleApplicationAction = (application: TeamApplication, action: 'approve' | 'reject') => {
    setSelectedApplication(application)
    setActionType(action)
    setShowActionDialog(true)
  }

  const handleBatchAction = (action: 'approve' | 'reject') => {
    console.log(`Batch ${action} applications:`, selectedApplications)
    // 实际应用中这里会调用 API
    setSelectedApplications([])
  }

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

  const pendingCount = applications.filter((app) => app.status === 'pending').length
  const approvedCount = applications.filter((app) => app.status === 'approved').length
  const rejectedCount = applications.filter((app) => app.status === 'rejected').length

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Admin</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Team Applications</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {/* 统计卡片 */}
        <div className="grid auto-rows-min gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{applications.length}</div>
              <p className="text-xs text-muted-foreground">All time applications</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingCount}</div>
              <p className="text-xs text-muted-foreground">Awaiting your review</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{approvedCount}</div>
              <p className="text-xs text-muted-foreground">Successfully approved</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              <XCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{rejectedCount}</div>
              <p className="text-xs text-muted-foreground">Applications declined</p>
            </CardContent>
          </Card>
        </div>

        {/* 筛选和搜索 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter & Search Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search by name, email, or skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="gap-2 bg-transparent">
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 批量操作 */}
        {selectedApplications.length > 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {selectedApplications.length} application(s) selected
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBatchAction('approve')}
                    className="gap-2 bg-transparent"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Approve Selected
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBatchAction('reject')}
                    className="gap-2 text-red-600 hover:text-red-700 bg-transparent"
                  >
                    <XCircle className="h-4 w-4" />
                    Reject Selected
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 申请列表 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Team Applications</CardTitle>
                <CardDescription>Review and manage applications to join your team</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={
                    selectedApplications.length === filteredApplications.length &&
                    filteredApplications.length > 0
                  }
                  onCheckedChange={handleSelectAll}
                />
                <span className="text-sm text-muted-foreground">Select All</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredApplications.map((application) => (
                <div key={application.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <Checkbox
                    checked={selectedApplications.includes(application.id)}
                    onCheckedChange={(checked) =>
                      handleSelectApplication(application.id, checked as boolean)
                    }
                  />

                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={application.applicantAvatar || '/placeholder.svg'}
                      alt={application.applicantName}
                    />
                    <AvatarFallback>
                      {application.applicantName
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{application.applicantName}</h3>
                      <Badge variant={getStatusColor(application.status) as any} className="gap-1">
                        {getStatusIcon(application.status)}
                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {application.applicantEmail}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(application.appliedAt).toLocaleDateString()}
                      </div>
                      {application.location && (
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {application.location}
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                      {application.reason}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {application.skills.slice(0, 4).map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {application.skills.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{application.skills.length - 4} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {application.status === 'pending' && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleApplicationAction(application, 'approve')}
                          className="gap-2 text-green-600 hover:text-green-700 bg-transparent"
                        >
                          <CheckCircle className="h-4 w-4" />
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleApplicationAction(application, 'reject')}
                          className="gap-2 text-red-600 hover:text-red-700 bg-transparent"
                        >
                          <XCircle className="h-4 w-4" />
                          Reject
                        </Button>
                      </>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewApplication(application)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        {application.portfolio && (
                          <DropdownMenuItem asChild>
                            <a
                              href={application.portfolio}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="mr-2 h-4 w-4" />
                              View Portfolio
                            </a>
                          </DropdownMenuItem>
                        )}
                        {application.github && (
                          <DropdownMenuItem asChild>
                            <a href={application.github} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="mr-2 h-4 w-4" />
                              View GitHub
                            </a>
                          </DropdownMenuItem>
                        )}
                        {application.linkedIn && (
                          <DropdownMenuItem asChild>
                            <a
                              href={application.linkedIn}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="mr-2 h-4 w-4" />
                              View LinkedIn
                            </a>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Mail className="mr-2 h-4 w-4" />
                          Send Message
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}

              {filteredApplications.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <UserPlus className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No applications found matching your criteria</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 申请详情弹窗 */}
      {selectedApplication && (
        <ApplyDetailDialog
          application={selectedApplication}
          open={showDetailDialog}
          onOpenChange={setShowDetailDialog}
          onApprove={() => handleApplicationAction(selectedApplication, 'approve')}
          onReject={() => handleApplicationAction(selectedApplication, 'reject')}
        />
      )}

      {/* 操作确认弹窗 */}
      {selectedApplication && actionType && (
        <ApplyActionDialog
          application={selectedApplication}
          action={actionType}
          open={showActionDialog}
          onOpenChange={setShowActionDialog}
          onConfirm={(notes) => {
            console.log(`${actionType} application:`, selectedApplication.id, 'Notes:', notes)
            setShowActionDialog(false)
            setSelectedApplication(null)
            setActionType(null)
          }}
        />
      )}
    </SidebarInset>
  )
}
