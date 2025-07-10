'use client'

import { useState } from 'react'
import { Patient } from '@/types'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { useDeletePatient } from '@/hooks/usePatients'
import { useRecoilState } from 'recoil'
import { modalState } from '@/store/atoms'
import { Edit, Trash2, Eye, Phone, Mail } from 'lucide-react'
import { format } from 'date-fns'

interface PatientsTableProps {
  patients: Patient[]
}

export function PatientsTable({ patients }: PatientsTableProps) {
  const { user } = useAuth()
  const [modals, setModals] = useRecoilState(modalState)
  const deletePatient = useDeletePatient()
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)

  const isAdmin = user?.role === 'admin'

  const handleEdit = (patient: Patient) => {
    setModals(prev => ({
      ...prev,
      isEditPatientOpen: true,
      editingPatient: patient
    }))
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      deletePatient.mutate(id)
    }
  }

  const handleView = (patient: Patient) => {
    setSelectedPatient(patient)
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy')
    } catch {
      return dateString
    }
  }

  if (patients.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No patients found</p>
        {isAdmin && (
          <p className="text-sm text-gray-400 mt-2">
            Click "Add Patient" to create your first patient record
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Mobile Cards View */}
      <div className="md:hidden space-y-4">
        {patients.map((patient) => (
          <div key={patient.id} className="bg-white border rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">
                  {patient.firstName} {patient.lastName}
                </h3>
                <p className="text-sm text-gray-600">ID: {patient.id}</p>
              </div>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleView(patient)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                {isAdmin && (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(patient)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(patient.id)}
                      disabled={deletePatient.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-sm">{patient.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-sm">{patient.phoneNumber}</span>
              </div>
              <div className="text-sm text-gray-600">
                <strong>DOB:</strong> {formatDate(patient.dob)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 font-medium">ID</th>
                <th className="text-left p-4 font-medium">Name</th>
                <th className="text-left p-4 font-medium">Email</th>
                <th className="text-left p-4 font-medium">Phone</th>
                <th className="text-left p-4 font-medium">Date of Birth</th>
                <th className="text-left p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr key={patient.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">{patient.id}</td>
                  <td className="p-4">
                    <div className="font-medium">
                      {patient.firstName} {patient.lastName}
                    </div>
                  </td>
                  <td className="p-4">{patient.email}</td>
                  <td className="p-4">{patient.phoneNumber}</td>
                  <td className="p-4">{formatDate(patient.dob)}</td>
                  <td className="p-4">
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleView(patient)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {isAdmin && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(patient)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(patient.id)}
                            disabled={deletePatient.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Patient Detail Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full mx-4 p-6">
            <h2 className="text-xl font-bold mb-4">Patient Details</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Full Name</label>
                <p className="text-lg">{selectedPatient.firstName} {selectedPatient.lastName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p>{selectedPatient.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Phone</label>
                <p>{selectedPatient.phoneNumber}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                <p>{formatDate(selectedPatient.dob)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Created</label>
                <p>{formatDate(selectedPatient.createdAt)}</p>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <Button
                variant="outline"
                onClick={() => setSelectedPatient(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 