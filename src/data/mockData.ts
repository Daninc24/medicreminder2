import { User, Appointment, MedicalRecord, Notification } from '../types';

// Mock Doctors
export const mockDoctors: User[] = [
  {
    id: 'd1',
    name: 'Dr. Sarah Johnson',
    email: 'doctor@example.com',
    role: 'doctor',
    specialization: 'Cardiology',
    profileImage: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: 'd2',
    name: 'Dr. Michael Chen',
    email: 'michael.chen@example.com',
    role: 'doctor',
    specialization: 'Pediatrics',
    profileImage: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
];

// Mock Patients
export const mockPatients: User[] = [
  {
    id: 'p1',
    name: 'Alex Morgan',
    email: 'patient@example.com',
    role: 'patient',
    phone: '(555) 123-4567',
    profileImage: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: 'p2',
    name: 'Emily Davis',
    email: 'emily.davis@example.com',
    role: 'patient',
    phone: '(555) 987-6543',
    profileImage: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: 'p3',
    name: 'James Wilson',
    email: 'james.wilson@example.com',
    role: 'patient',
    phone: '(555) 456-7890',
    profileImage: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
];

// Get today's date as a string
const today = new Date().toISOString().split('T')[0];

// Get tomorrow's date as a string
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
const tomorrowStr = tomorrow.toISOString().split('T')[0];

// Get yesterday's date as a string
const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
const yesterdayStr = yesterday.toISOString().split('T')[0];

// Get next week's date as a string
const nextWeek = new Date();
nextWeek.setDate(nextWeek.getDate() + 7);
const nextWeekStr = nextWeek.toISOString().split('T')[0];

// Mock Appointments
export const mockAppointments: Appointment[] = [
  {
    id: 'a1',
    doctorId: 'd1',
    patientId: 'p1',
    title: 'Annual Checkup',
    date: today,
    time: '10:00:00',
    duration: 30,
    status: 'scheduled',
    notes: 'Regular annual physical examination',
    reminderSent: true,
    reminderChannels: ['email', 'sms'],
  },
  {
    id: 'a2',
    doctorId: 'd1',
    patientId: 'p2',
    title: 'Follow-up Consultation',
    date: today,
    time: '14:30:00',
    duration: 45,
    status: 'scheduled',
    reminderSent: true,
    reminderChannels: ['email'],
  },
  {
    id: 'a3',
    doctorId: 'd2',
    patientId: 'p3',
    title: 'Vaccination',
    date: tomorrowStr,
    time: '09:15:00',
    duration: 15,
    status: 'scheduled',
    reminderSent: true,
    reminderChannels: ['sms'],
  },
  {
    id: 'a4',
    doctorId: 'd1',
    patientId: 'p1',
    title: 'Blood Pressure Check',
    date: yesterdayStr,
    time: '11:00:00',
    duration: 20,
    status: 'completed',
    notes: 'Blood pressure was normal',
    reminderSent: true,
    reminderChannels: ['email', 'sms'],
  },
  {
    id: 'a5',
    doctorId: 'd1',
    patientId: 'p3',
    title: 'Prescription Renewal',
    date: nextWeekStr,
    time: '15:45:00',
    duration: 15,
    status: 'scheduled',
    reminderSent: false,
  },
  {
    id: 'a6',
    doctorId: 'd2',
    patientId: 'p2',
    title: 'Pediatric Checkup',
    date: yesterdayStr,
    time: '13:30:00',
    duration: 30,
    status: 'no-show',
    reminderSent: true,
    reminderChannels: ['email'],
  },
  {
    id: 'a7',
    doctorId: 'd1',
    patientId: 'p2',
    title: 'Lab Results Review',
    date: tomorrowStr,
    time: '16:00:00',
    duration: 30,
    status: 'scheduled',
    reminderSent: true,
    reminderChannels: ['email', 'sms'],
  },
];

// Mock Medical Records
export const mockMedicalRecords: MedicalRecord[] = [
  {
    id: 'mr1',
    patientId: 'p1',
    doctorId: 'd1',
    date: yesterdayStr,
    diagnosis: 'Hypertension',
    prescription: 'Lisinopril 10mg daily',
    notes: 'Patient should monitor blood pressure at home and return for follow-up in 2 weeks.',
  },
  {
    id: 'mr2',
    patientId: 'p2',
    doctorId: 'd2',
    date: '2023-05-15',
    diagnosis: 'Ear Infection',
    prescription: 'Amoxicillin 500mg twice daily for 7 days',
    notes: 'Right ear appears inflamed. Follow up if symptoms don\'t improve within 3 days.',
  },
  {
    id: 'mr3',
    patientId: 'p3',
    doctorId: 'd1',
    date: '2023-06-01',
    diagnosis: 'Seasonal Allergies',
    prescription: 'Loratadine 10mg once daily as needed',
    notes: 'Patient reports seasonal allergy symptoms. Recommended avoiding outdoor activities during high pollen count days.',
  },
  {
    id: 'mr4',
    patientId: 'p1',
    doctorId: 'd1',
    date: '2023-04-10',
    diagnosis: 'Annual Physical',
    notes: 'All vitals normal. Blood work ordered for cholesterol screening.',
  },
];

// Mock Notifications
export const mockNotifications: Notification[] = [
  {
    id: 'n1',
    userId: 'p1',
    title: 'Appointment Reminder',
    message: 'You have an appointment tomorrow at 10:00 AM with Dr. Sarah Johnson',
    isRead: false,
    createdAt: new Date().toISOString(),
    type: 'reminder',
    link: '/appointments/a1',
  },
  {
    id: 'n2',
    userId: 'd1',
    title: 'New Patient Registered',
    message: 'Emily Davis has registered as a new patient',
    isRead: true,
    createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    type: 'system',
    link: '/doctor/patients/p2',
  },
  {
    id: 'n3',
    userId: 'p1',
    title: 'Prescription Ready',
    message: 'Your prescription for Lisinopril is ready for pickup',
    isRead: false,
    createdAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    type: 'message',
  },
];