import { atom } from 'recoil';
import { User, Patient } from '@/types';

// Auth state
export const authState = atom<{
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}>({
  key: 'authState',
  default: {
    user: null,
    token: null,
    isAuthenticated: false,
  },
});

// Patients state
export const patientsState = atom<Patient[]>({
  key: 'patientsState',
  default: [],
});

// Loading states
export const loadingState = atom<{
  patients: boolean;
  auth: boolean;
}>({
  key: 'loadingState',
  default: {
    patients: false,
    auth: false,
  },
});

// Modal states
export const modalState = atom<{
  isCreatePatientOpen: boolean;
  isEditPatientOpen: boolean;
  editingPatient: Patient | null;
}>({
  key: 'modalState',
  default: {
    isCreatePatientOpen: false,
    isEditPatientOpen: false,
    editingPatient: null,
  },
}); 