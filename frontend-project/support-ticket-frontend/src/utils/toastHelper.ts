// src/utils/toastHelper.ts
import { toast, TypeOptions } from 'react-toastify';

interface ToastParams {
  message: string;
  type?: TypeOptions; // 'info', 'success', 'warning', 'error', 'default'
  // You can add more react-toastify options here if needed
}

export const showToast = ({ message, type = 'default' }: ToastParams): void => {
  toast(message, { type });
};

// Specific helpers
export const toastSuccess = (message: string): void => {
  showToast({ message, type: 'success' });
};

export const toastError = (message: string): void => {
  showToast({ message, type: 'error' });
};

export const toastInfo = (message: string): void => {
  showToast({ message, type: 'info' });
};

export const toastWarning = (message: string): void => {
  showToast({ message, type: 'warning' });
};

/**
 * Parses common API error structures and displays a toast.
 * @param error The error object, typically from an Axios catch block.
 * @param defaultMessage A fallback message if the error object doesn't have a standard message.
 */
export const handleApiErrorToast = (error: any, defaultMessage: string = 'An unexpected error occurred.'): void => {
  let message = defaultMessage;
  if (error?.response?.data?.message) {
    message = error.response.data.message;
  } else if (error?.response?.data?.errors && Array.isArray(error.response.data.errors) && error.response.data.errors.length > 0) {
    // Handle express-validator style errors (take the first one)
    message = error.response.data.errors[0].msg;
  } else if (error?.message) {
    message = error.message;
  }
  toastError(message);
};
