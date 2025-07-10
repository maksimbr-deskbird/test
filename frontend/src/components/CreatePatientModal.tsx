'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRecoilState } from 'recoil'
import { modalState } from '@/store/atoms'
import { useCreatePatient } from '@/hooks/usePatients'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { X } from 'lucide-react'

const createPatientSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits'),
  dob: z.string().min(1, 'Date of birth is required'),
})

type CreatePatientForm = z.infer<typeof createPatientSchema>

export function CreatePatientModal() {
  const [modals, setModals] = useRecoilState(modalState)
  const createPatient = useCreatePatient()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreatePatientForm>({
    resolver: zodResolver(createPatientSchema),
  })

  const onSubmit = (data: CreatePatientForm) => {
    createPatient.mutate(data, {
      onSuccess: () => {
        reset()
        setModals(prev => ({ ...prev, isCreatePatientOpen: false }))
      },
    })
  }

  const handleClose = () => {
    reset()
    setModals(prev => ({ ...prev, isCreatePatientOpen: false }))
  }

  if (!modals.isCreatePatientOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-4 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add New Patient</h2>
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
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              placeholder="Enter first name"
              {...register('firstName')}
            />
            {errors.firstName && (
              <p className="text-sm text-red-500">{errors.firstName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              placeholder="Enter last name"
              {...register('lastName')}
            />
            {errors.lastName && (
              <p className="text-sm text-red-500">{errors.lastName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter email address"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              placeholder="Enter phone number"
              {...register('phoneNumber')}
            />
            {errors.phoneNumber && (
              <p className="text-sm text-red-500">{errors.phoneNumber.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="dob">Date of Birth</Label>
            <Input
              id="dob"
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
              disabled={createPatient.isPending}
            >
              {createPatient.isPending ? 'Creating...' : 'Create Patient'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
} 