import { Timestamp } from 'firebase/firestore';
export interface users {
  id: string;
  name: string;
  email: string;
}

export interface Car {
  id: string;
  make: string;
  rate: number; 
  image: string;
  available: boolean;
  model: string;
  year: number;
}

export interface Booking {
  carId: string;
  userId: string;
  startDate: Timestamp;
  endDate: Timestamp;
  totalPrice: number;
  status: string;
}

export interface AuthContextType {
  user: users | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
}

export interface RegisterData {
  firstName: string; 
  lastName: string;
  email: string;
  password: string;
}
