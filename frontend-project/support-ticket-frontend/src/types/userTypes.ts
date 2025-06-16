// src/types/userTypes.ts
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'CLIENT' | 'SUPPORT' | 'ADMIN';
  phone_number?: string | null;
  created_at: string;
  // add other fields if your backend user model returns more
}
