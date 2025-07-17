import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api-client';

// Contact Form Types
export interface CreateContactFormData {
  fullName: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactFormResponse {
  success: boolean;
  message: string;
  data?: {
    _id: string;
    fullName: string;
    email: string;
    subject: string;
    message: string;
    status: 'pending' | 'read' | 'responded';
    createdAt: string;
    updatedAt: string;
  };
  errors?: any[];
}

// Contact Form hook
export function useContactForm() {
  const queryClient = useQueryClient();
  
  // Get API version from environment or config
  const apiVersion = process.env.REACT_APP_API_VERSION || 'v1';
  const endpoint = `/contactForm`;

  // Create contact form submission
  const useCreateContactForm = () => {
    return useMutation<ContactFormResponse, Error, CreateContactFormData>({
      mutationFn: async (contactData: CreateContactFormData) => {
        const { data } = await apiClient.post(endpoint, contactData);
        return data;
      },
      onSuccess: (data) => {
      
      },
      onError: (error) => {
        // Optional: You can add error handling here
        console.error('Error submitting contact form:', error);
      },
    });
  };

  // Optional: Reset any contact-related cache (if you add more queries later)
  const resetContactFormCache = () => {
    queryClient.invalidateQueries({ queryKey: ['contactForm'] });
  };

  return {
    useCreateContactForm,
    resetContactFormCache,
  };
}