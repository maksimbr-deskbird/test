'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { usePatients } from '@/hooks/usePatients'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PatientsTable } from '@/components/PatientsTable'
import { CreatePatientModal } from '@/components/CreatePatientModal'
import { EditPatientModal } from '@/components/EditPatientModal'
import { useRecoilState } from 'recoil'
import { modalState } from '@/store/atoms'
import { Plus, Users, UserCheck, Shield } from 'lucide-react'

export default function DashboardPage() {
  const { user, isAuthenticated, logout } = useAuth()
  const { data: patients, isLoading, error } = usePatients()
  const [, setModals] = useRecoilState(modalState)
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  const handleCreatePatient = () => {
    setModals(prev => ({ ...prev, isCreatePatientOpen: true }))
  }

  const isAdmin = user?.role === 'admin'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Patients Management
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {isAdmin ? (
                  <Shield className="h-5 w-5 text-blue-600" />
                ) : (
                  <UserCheck className="h-5 w-5 text-green-600" />
                )}
                <span className="text-sm font-medium text-gray-700">
                  {user?.firstName} {user?.lastName}
                </span>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {user?.role}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Patients</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {patients?.length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <UserCheck className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Active Today</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {patients?.filter(p => 
                      new Date(p.createdAt).toDateString() === new Date().toDateString()
                    ).length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Shield className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Access Level</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {isAdmin ? 'Admin' : 'User'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Patients Table */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Patients</CardTitle>
              {isAdmin && (
                <Button onClick={handleCreatePatient}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Patient
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-600">Error loading patients</p>
              </div>
            ) : (
              <PatientsTable patients={patients || []} />
            )}
          </CardContent>
        </Card>
      </main>

      {/* Modals */}
      <CreatePatientModal />
      <EditPatientModal />
    </div>
  )
} 