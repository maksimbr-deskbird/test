import { renderHook, act } from '@testing-library/react'
import { useAuth } from '../useAuth'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { useMutation } from '@tanstack/react-query'
import { api } from '../../lib/api'

// Mock the dependencies
jest.mock('recoil')
jest.mock('@tanstack/react-query')
jest.mock('../../lib/api')

const mockUseRecoilState = useRecoilState as jest.MockedFunction<typeof useRecoilState>
const mockUseSetRecoilState = useSetRecoilState as jest.MockedFunction<typeof useSetRecoilState>
const mockUseMutation = useMutation as jest.MockedFunction<typeof useMutation>
const mockApi = api as jest.Mocked<typeof api>

describe('useAuth', () => {
  const mockSetUser = jest.fn()
  const mockSetIsLoading = jest.fn()
  const mockMutateAsync = jest.fn()
  const mockReset = jest.fn()

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks()
    
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
      },
      writable: true,
    })

    // Setup default mock implementations
    mockUseRecoilState.mockReturnValue([null, mockSetUser])
    mockUseSetRecoilState.mockReturnValue(mockSetIsLoading)
    mockUseMutation.mockReturnValue({
      mutateAsync: mockMutateAsync,
      reset: mockReset,
      isLoading: false,
      isError: false,
      error: null,
    } as any)
  })

  it('should initialize with no user', () => {
    const { result } = renderHook(() => useAuth())
    
    expect(result.current.user).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
  })

  it('should set authenticated state when user exists', () => {
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      role: 'user' as const,
    }
    
    mockUseRecoilState.mockReturnValue([mockUser, mockSetUser])
    
    const { result } = renderHook(() => useAuth())
    
    expect(result.current.user).toBe(mockUser)
    expect(result.current.isAuthenticated).toBe(true)
  })

  it('should handle login successfully', async () => {
    const mockResponse = {
      user: {
        id: 1,
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: 'user' as const,
      },
      access_token: 'mock-token',
    }
    
    mockMutateAsync.mockResolvedValue(mockResponse)
    
    const { result } = renderHook(() => useAuth())
    
    await act(async () => {
      await result.current.login('test@example.com', 'password')
    })
    
    expect(mockMutateAsync).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password',
    })
    expect(mockSetUser).toHaveBeenCalledWith(mockResponse.user)
    expect(localStorage.setItem).toHaveBeenCalledWith('token', mockResponse.access_token)
  })

  it('should handle register successfully', async () => {
    const mockResponse = {
      user: {
        id: 1,
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: 'user' as const,
      },
      access_token: 'mock-token',
    }
    
    mockMutateAsync.mockResolvedValue(mockResponse)
    
    const { result } = renderHook(() => useAuth())
    
    await act(async () => {
      await result.current.register({
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        password: 'password',
        role: 'user',
      })
    })
    
    expect(mockMutateAsync).toHaveBeenCalledWith({
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      password: 'password',
      role: 'user',
    })
    expect(mockSetUser).toHaveBeenCalledWith(mockResponse.user)
    expect(localStorage.setItem).toHaveBeenCalledWith('token', mockResponse.access_token)
  })

  it('should handle logout', () => {
    const { result } = renderHook(() => useAuth())
    
    act(() => {
      result.current.logout()
    })
    
    expect(mockSetUser).toHaveBeenCalledWith(null)
    expect(localStorage.removeItem).toHaveBeenCalledWith('token')
    expect(mockReset).toHaveBeenCalled()
  })

  it('should check if user is admin', () => {
    const adminUser = {
      id: 1,
      email: 'admin@example.com',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin' as const,
    }
    
    mockUseRecoilState.mockReturnValue([adminUser, mockSetUser])
    
    const { result } = renderHook(() => useAuth())
    
    expect(result.current.isAdmin).toBe(true)
  })

  it('should return false for isAdmin when user is not admin', () => {
    const regularUser = {
      id: 1,
      email: 'user@example.com',
      firstName: 'Regular',
      lastName: 'User',
      role: 'user' as const,
    }
    
    mockUseRecoilState.mockReturnValue([regularUser, mockSetUser])
    
    const { result } = renderHook(() => useAuth())
    
    expect(result.current.isAdmin).toBe(false)
  })

  it('should return false for isAdmin when user is null', () => {
    mockUseRecoilState.mockReturnValue([null, mockSetUser])
    
    const { result } = renderHook(() => useAuth())
    
    expect(result.current.isAdmin).toBe(false)
  })
}) 