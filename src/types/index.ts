// User Types
export type UserRole = 'doctor' | 'patient' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profileImage?: string;
  phone?: string;
  specialization?: string; // For doctors
  medicalHistory?: string; // For patients
}

// Appointment Types
export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled' | 'no-show';

export interface Appointment {
  id: string;
  doctorId: string;
  patientId: string;
  title: string;
  date: string;
  time: string;
  duration: number; // in minutes
  status: AppointmentStatus;
  notes?: string;
  reminderSent: boolean;
  reminderChannels?: ('email' | 'sms' | 'push')[];
}

// Reminder Types
export type ReminderChannel = 'email' | 'sms' | 'push' | 'whatsapp';

export interface Reminder {
  id: string;
  appointmentId: string;
  userId: string;
  channel: ReminderChannel;
  scheduledFor: string;
  message: string;
  status: 'pending' | 'sent' | 'failed';
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  type: 'reminder' | 'system' | 'message';
  link?: string;
}

// Medical Record Types
export interface MedicalRecord {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  diagnosis: string;
  prescription?: string;
  notes?: string;
  attachments?: string[];
}