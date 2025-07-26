import {
  CalculateCostPayload,
  CalculateCostResponse,
  CalculatorData,
  UpdateCalculatorPayload,
  CalculatorUserPayload,
  SaveCalculatorUserResponse,
  CheckCalculatorUserResponse,
} from './types';
import { handleAuthError } from './auth'; 

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function authenticatedFetch(url: string, options?: RequestInit) {
  const response = await fetch(url, options);

  if (response.status === 401) {
    handleAuthError(); 
    throw new Error('Unauthorized: Session expired or invalid token.');
  }

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error ? JSON.stringify(errorData.error) : `API Error: ${response.statusText}`);
  }

  return response;
}

async function unauthenticatedFetch(url: string, options?: RequestInit) {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options?.headers, 
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message ? JSON.stringify(errorData.message) : `API Error: ${response.statusText}`);
  }

  return response;
}

export async function calculateCost(payload: CalculateCostPayload): Promise<CalculateCostResponse> {
  try {
    const response = await authenticatedFetch(`${API_BASE_URL}/calculate-cost`, {
      method: 'POST',
      headers: getAuthHeaders(), 
      body: JSON.stringify(payload),
    });
    return response.json();
  } catch (error) {
    console.error('Error calculating cost:', error);
    throw error;
  }
}

export async function getCalculatorData(): Promise<CalculatorData> {
  try {
    const response = await authenticatedFetch(`${API_BASE_URL}/calculator-data`, {
      method: 'GET',
      headers: getAuthHeaders(), 
    });
    return response.json();
  } catch (error) {
    console.error('Error fetching calculator data:', error);
    throw error;
  }
}

export async function updateCalculatorData(payload: UpdateCalculatorPayload): Promise<{ message: string }> {
  try {
    const response = await authenticatedFetch(`${API_BASE_URL}/calculator-data`, {
      method: 'PUT',
      headers: getAuthHeaders(), 
      body: JSON.stringify(payload),
    });
    return response.json();
  } catch (error) {
    console.error('Error updating calculator data:', error);
    throw error;
  }
}

export async function saveCalculatorUser(payload: CalculatorUserPayload): Promise<SaveCalculatorUserResponse> {
  try {
    const response = await unauthenticatedFetch(`${API_BASE_URL}/calculator-users`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return response.json();
  } catch (error) {
    console.error('Error saving calculator user:', error);
    throw error;
  }
}

export async function checkCalculatorUser(email: string): Promise<CheckCalculatorUserResponse> {
  try {
    const response = await unauthenticatedFetch(`${API_BASE_URL}/calculator-users/check`, {
      method: 'POST', 
      body: JSON.stringify({ email }),
    });
    return response.json();
  } catch (error) {
    console.error('Error checking calculator user:', error);
    throw error;
  }
}
