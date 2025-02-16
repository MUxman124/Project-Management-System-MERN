'use client'

import { useAuth } from '@/context/AuthContext'
import Sidebar from '@/components/admin/Sidebar'
import ProtectedRoute from '../auth/ProtectedRoutes'
import Header from '@/components/admin/Header'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()

  return (
    <ProtectedRoute  allowedRoles={['admin', 'project_manager', 'team_lead', 'developer']}>
    <div className="flex h-screen">
      <Sidebar user={user} />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
    </ProtectedRoute>
  )
}