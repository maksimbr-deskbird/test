import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Patient, CreatePatientDto, UpdatePatientDto } from '@/types';
import toast from 'react-hot-toast';

// Fetch all patients
export const usePatients = () => {
  return useQuery<Patient[]>({
    queryKey: ['patients'],
    queryFn: async () => {
      const response = await api.get('/patients');
      return response.data;
    },
  });
};

// Create patient
export const useCreatePatient = () => {
  const queryClient = useQueryClient();
  
  return useMutation<Patient, Error, CreatePatientDto>({
    mutationFn: async (patientData) => {
      const response = await api.post('/patients', patientData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      toast.success('Patient created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create patient');
    },
  });
};

// Update patient
export const useUpdatePatient = () => {
  const queryClient = useQueryClient();
  
  return useMutation<Patient, Error, { id: number; data: UpdatePatientDto }>({
    mutationFn: async ({ id, data }) => {
      const response = await api.patch(`/patients/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      toast.success('Patient updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update patient');
    },
  });
};

// Delete patient
export const useDeletePatient = () => {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, number>({
    mutationFn: async (id) => {
      await api.delete(`/patients/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      toast.success('Patient deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete patient');
    },
  });
}; 