'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRecoilState } from 'recoil'
import { modalState } from '@/store/atoms'
import { useUpdatePatient } from '@/hooks/usePatients'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { X } from 'lucide-react'

const updatePatientSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits'),
  dob: z.string().min(1, 'Date of birth is required'),
})

type UpdatePatientForm = z.infer<typeof updatePatientSchema>

export function EditPatientModal() {
  const [modals, setModals] = useRecoilState(modalState)
  const updatePatient = useUpdatePatient()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<UpdatePatientForm>({
    resolver: zodResolver(updatePatientSchema),
  })

  // Pre-fill form when modal opens
  useEffect(() => {
    if (modals.editingPatient) {
      setValue('firstName', modals.editingPatient.firstName)
      setValue('lastName', modals.editingPatient.lastName)
      setValue('email', modals.editingPatient.email)
      setValue('phoneNumber', modals.editingPatient.phoneNumber)
      setValue('dob', modals.editingPatient.dob)
    }
  }, [modals.editingPatient, setValue])

  const onSubmit = (data: UpdatePatientForm) => {
    if (!modals.editingPatient) return

    updatePatient.mutate(
      { id: modals.editingPatient.id, data },
      {
        onSuccess: () => {
          reset()
          setModals(prev => ({
            ...prev,
            isEditPatientOpen: false,
            editingPatient: null,
          }))
        },
      }
    )
  }

  const handleClose = () => {
    reset()
    setModals(prev => ({
      ...prev,
      isEditPatientOpen: false,
      editingPatient: null,
    }))
  }

  if (!modals.isEditPatientOpen || !modals.editingPatient) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-4 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Edit Patient</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-firstName">First Name</Label>
            <Input
              id="edit-firstName"
              placeholder="Enter first name"
              {...register('firstName')}
            />
            {errors.firstName && (
              <p className="text-sm text-red-500">{errors.firstName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-lastName">Last Name</Label>
            <Input
              id="edit-lastName"
              placeholder="Enter last name"
              {...register('lastName')}
            />
            {errors.lastName && (
              <p className="text-sm text-red-500">{errors.lastName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-email">Email</Label>
            <Input
              id="edit-email"
              type="email"
              placeholder="Enter email address"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-phoneNumber">Phone Number</Label>
            <Input
              id="edit-phoneNumber"
              placeholder="Enter phone number"
              {...register('phoneNumber')}
            />
            {errors.phoneNumber && (
              <p className="text-sm text-red-500">{errors.phoneNumber.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-dob">Date of Birth</Label>
            <Input
              id="edit-dob"
              type="date"
              {...register('dob')}
            />
            {errors.dob && (
              <p className="text-sm text-red-500">{errors.dob.message}</p>
            )}
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={updatePatient.isPending}
            >
              {updatePatient.isPending ? 'Updating...' : 'Update Patient'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
} 