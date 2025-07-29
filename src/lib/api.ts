import {
  CalculateCostPayload,
  CalculateCostResponse,
  UpdateCalculatorPayload,
  CalculatorData,
  CalculatorUserPayload,
  SaveCalculatorUserResponse,
  CheckCalculatorUserResponse,
} from './types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Helper to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper for API requests
const apiRequest = async <T>(
  url: string,
  method: string,
  body?: object,
  requiresAuth: boolean = false
): Promise<T> => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (requiresAuth) {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication token not found. Please log in.');
    }
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(JSON.stringify(errorData.error || 'Something went wrong'));
  }

  return response.json();
};

export const calculateCost = async (
  payload: CalculateCostPayload
): Promise<CalculateCostResponse> => {
  return apiRequest<CalculateCostResponse>('/calculate-cost', 'POST', payload);
};

export const getCalculatorData = async (): Promise<CalculatorData> => {
  return apiRequest<CalculatorData>('/calculator-data', 'GET', undefined, true);
};

export const updateCalculatorData = async (
  payload: UpdateCalculatorPayload
): Promise<{ message: string }> => {
  return apiRequest<{ message: string }>(
    '/calculator-data',
    'PUT',
    payload,
    true
  );
};

export const saveCalculatorUser = async (
  payload: CalculatorUserPayload
): Promise<SaveCalculatorUserResponse> => {
  return apiRequest<SaveCalculatorUserResponse>('/calculator-users', 'POST', payload);
};

export const checkCalculatorUser = async (
  email: string
): Promise<CheckCalculatorUserResponse> => {
  return apiRequest<CheckCalculatorUserResponse>(`/calculator-users/check?email=${encodeURIComponent(email)}`, 'GET');
};

export const getCalculatorUsers = async (): Promise<CalculatorUserPayload[]> => {
  return apiRequest<CalculatorUserPayload[]>('/calculator-users', 'GET', undefined, true);
};
