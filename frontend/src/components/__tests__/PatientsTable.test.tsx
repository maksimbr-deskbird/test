import { render, screen, fireEvent } from '@testing-library/react'
import { PatientsTable } from '../PatientsTable'
import { useAuth } from '../../hooks/useAuth'
import { usePatients } from '../../hooks/usePatients'
import { useRecoilState } from 'recoil'
import { Patient } from '../../types'

// Mock the dependencies
jest.mock('../../hooks/useAuth')
jest.mock('../../hooks/usePatients')
jest.mock('recoil')

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>
const mockUsePatients = usePatients as jest.MockedFunction<typeof usePatients>
const mockUseRecoilState = useRecoilState as jest.MockedFunction<typeof useRecoilState>

describe('PatientsTable', () => {
  const mockPatients: Patient[] = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phoneNumber: '+1-555-0123',
      dob: '1980-01-15',
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      phoneNumber: '+1-555-0124',
      dob: '1985-03-20',
      createdAt: '2023-01-02T00:00:00.000Z',
      updatedAt: '2023-01-02T00:00:00.000Z',
    },
  ]

  const mockSetCreateModalOpen = jest.fn()
  const mockSetEditModalOpen = jest.fn()
  const mockSetSelectedPatient = jest.fn()
  const mockDeletePatient = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()

    // Mock useAuth
    mockUseAuth.mockReturnValue({
      user: {
        id: 1,
        email: 'admin@example.com',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
      },
      isAuthenticated: true,
      isAdmin: true,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      isLoading: false,
    })

    // Mock usePatients
    mockUsePatients.mockReturnValue({
      patients: mockPatients,
      isLoading: false,
      error: null,
      createPatient: jest.fn(),
      updatePatient: jest.fn(),
      deletePatient: mockDeletePatient,
    })

    // Mock recoil state
    mockUseRecoilState
      .mockReturnValueOnce([false, mockSetCreateModalOpen])
      .mockReturnValueOnce([false, mockSetEditModalOpen])
      .mockReturnValueOnce([null, mockSetSelectedPatient])
  })

  it('should render patients table with data', () => {
    render(<PatientsTable />)

    // Check if table headers are present
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByText('Phone')).toBeInTheDocument()
    expect(screen.getByText('Date of Birth')).toBeInTheDocument()
    expect(screen.getByText('Actions')).toBeInTheDocument()

    // Check if patient data is rendered
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('john.doe@example.com')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    expect(screen.getByText('jane.smith@example.com')).toBeInTheDocument()
  })

  it('should show Add Patient button for admin users', () => {
    render(<PatientsTable />)

    const addButton = screen.getByText('Add Patient')
    expect(addButton).toBeInTheDocument()
  })

  it('should not show Add Patient button for regular users', () => {
    mockUseAuth.mockReturnValue({
      user: {
        id: 1,
        email: 'user@example.com',
        firstName: 'Regular',
        lastName: 'User',
        role: 'user',
      },
      isAuthenticated: true,
      isAdmin: false,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      isLoading: false,
    })

    render(<PatientsTable />)

    expect(screen.queryByText('Add Patient')).not.toBeInTheDocument()
  })

  it('should open create modal when Add Patient button is clicked', () => {
    render(<PatientsTable />)

    const addButton = screen.getByText('Add Patient')
    fireEvent.click(addButton)

    expect(mockSetCreateModalOpen).toHaveBeenCalledWith(true)
  })

  it('should open edit modal when Edit button is clicked', () => {
    render(<PatientsTable />)

    const editButtons = screen.getAllByText('Edit')
    fireEvent.click(editButtons[0])

    expect(mockSetSelectedPatient).toHaveBeenCalledWith(mockPatients[0])
    expect(mockSetEditModalOpen).toHaveBeenCalledWith(true)
  })

  it('should handle delete patient when Delete button is clicked', () => {
    // Mock window.confirm
    global.confirm = jest.fn().mockReturnValue(true)

    render(<PatientsTable />)

    const deleteButtons = screen.getAllByText('Delete')
    fireEvent.click(deleteButtons[0])

    expect(global.confirm).toHaveBeenCalledWith('Are you sure you want to delete this patient?')
    expect(mockDeletePatient).toHaveBeenCalledWith(mockPatients[0].id)
  })

  it('should not delete patient when user cancels confirmation', () => {
    // Mock window.confirm to return false
    global.confirm = jest.fn().mockReturnValue(false)

    render(<PatientsTable />)

    const deleteButtons = screen.getAllByText('Delete')
    fireEvent.click(deleteButtons[0])

    expect(global.confirm).toHaveBeenCalledWith('Are you sure you want to delete this patient?')
    expect(mockDeletePatient).not.toHaveBeenCalled()
  })

  it('should show loading state', () => {
    mockUsePatients.mockReturnValue({
      patients: [],
      isLoading: true,
      error: null,
      createPatient: jest.fn(),
      updatePatient: jest.fn(),
      deletePatient: jest.fn(),
    })

    render(<PatientsTable />)

    expect(screen.getByText('Loading patients...')).toBeInTheDocument()
  })

  it('should show error state', () => {
    mockUsePatients.mockReturnValue({
      patients: [],
      isLoading: false,
      error: new Error('Failed to load patients'),
      createPatient: jest.fn(),
      updatePatient: jest.fn(),
      deletePatient: jest.fn(),
    })

    render(<PatientsTable />)

    expect(screen.getByText('Error loading patients')).toBeInTheDocument()
  })

  it('should show empty state when no patients', () => {
    mockUsePatients.mockReturnValue({
      patients: [],
      isLoading: false,
      error: null,
      createPatient: jest.fn(),
      updatePatient: jest.fn(),
      deletePatient: jest.fn(),
    })

    render(<PatientsTable />)

    expect(screen.getByText('No patients found')).toBeInTheDocument()
  })

  it('should format date of birth correctly', () => {
    render(<PatientsTable />)

    // Check if dates are formatted properly
    expect(screen.getByText('Jan 15, 1980')).toBeInTheDocument()
    expect(screen.getByText('Mar 20, 1985')).toBeInTheDocument()
  })

  it('should show action buttons only for admin users', () => {
    render(<PatientsTable />)

    const editButtons = screen.getAllByText('Edit')
    const deleteButtons = screen.getAllByText('Delete')

    expect(editButtons).toHaveLength(2)
    expect(deleteButtons).toHaveLength(2)
  })

  it('should hide action buttons for regular users', () => {
    mockUseAuth.mockReturnValue({
      user: {
        id: 1,
        email: 'user@example.com',
        firstName: 'Regular',
        lastName: 'User',
        role: 'user',
      },
      isAuthenticated: true,
      isAdmin: false,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      isLoading: false,
    })

    render(<PatientsTable />)

    expect(screen.queryByText('Edit')).not.toBeInTheDocument()
    expect(screen.queryByText('Delete')).not.toBeInTheDocument()
  })
}) 