import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, Clock, Calendar, Plus, FileText, MessageSquare, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AppointmentCard from '../../components/appointments/AppointmentCard';
import { mockPatients, mockAppointments, mockMedicalRecords } from '../../data/mockData';
import toast from 'react-hot-toast';

const PatientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [activeTab, setActiveTab] = useState('appointments');
  
  useEffect(() => {
    // Get patient details
    const patientData = mockPatients.find(p => p.id === id);
    if (!patientData) {
      navigate('/doctor/patients');
      return;
    }
    setPatient(patientData);
    
    // Get appointments for this patient
    const patientAppointments = mockAppointments.filter(
      appointment => appointment.patientId === id && appointment.doctorId === user?.id
    );
    setAppointments(patientAppointments);
    
    // Get medical records for this patient
    const records = mockMedicalRecords.filter(
      record => record.patientId === id && record.doctorId === user?.id
    );
    setMedicalRecords(records);
  }, [id, user?.id, navigate]);
  
  if (!patient) {
    return <div className="p-4 text-center">Loading patient data...</div>;
  }
  
  return (
    <div>
      <div className="mb-6">
        <button
          onClick={() => navigate('/doctor/patients')}
          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Patients
        </button>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center">
            {patient.profileImage ? (
              <img 
                src={patient.profileImage} 
                alt={patient.name}
                className="h-16 w-16 rounded-full object-cover"
              />
            ) : (
              <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-800 text-xl font-medium">
                  {patient.name.charAt(0)}
                </span>
              </div>
            )}
            
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-gray-900">{patient.name}</h1>
              <div className="flex items-center text-gray-600 mt-1">
                <Mail className="h-4 w-4 mr-1" />
                {patient.email}
                {patient.phone && (
                  <>
                    <span className="mx-2">•</span>
                    <Phone className="h-4 w-4 mr-1" />
                    {patient.phone}
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-4 sm:mt-0 flex space-x-2">
            <button
              onClick={() => toast.success('Send reminder functionality would open here')}
              className="bg-blue-100 text-blue-700 px-3 py-1 rounded-md hover:bg-blue-200 flex items-center"
            >
              <Bell className="h-4 w-4 mr-1" />
              Send Reminder
            </button>
            <button
              onClick={() => toast.success('Message functionality would open here')}
              className="bg-blue-100 text-blue-700 px-3 py-1 rounded-md hover:bg-blue-200 flex items-center"
            >
              <MessageSquare className="h-4 w-4 mr-1" />
              Message
            </button>
            <button
              onClick={() => navigate('/appointments')}
              className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 flex items-center"
            >
              <Plus className="h-4 w-4 mr-1" />
              Schedule
            </button>
          </div>
        </div>
      </div>
      
      {/* Patient Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h2 className="text-sm font-medium text-gray-500 mb-1">Last Visit</h2>
          <p className="text-lg font-semibold text-gray-900">
            {appointments.length > 0 
              ? new Date(appointments[0].date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })
              : 'No visits yet'}
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h2 className="text-sm font-medium text-gray-500 mb-1">Total Appointments</h2>
          <p className="text-lg font-semibold text-gray-900">{appointments.length}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h2 className="text-sm font-medium text-gray-500 mb-1">Next Appointment</h2>
          <p className="text-lg font-semibold text-gray-900">
            {appointments.some(a => a.status === 'scheduled')
              ? new Date(appointments.find(a => a.status === 'scheduled').date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })
              : 'None scheduled'}
          </p>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('appointments')}
              className={`py-4 px-6 text-sm font-medium border-b-2 ${
                activeTab === 'appointments'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Calendar className="inline-block h-4 w-4 mr-2" />
              Appointments
            </button>
            <button
              onClick={() => setActiveTab('records')}
              className={`py-4 px-6 text-sm font-medium border-b-2 ${
                activeTab === 'records'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FileText className="inline-block h-4 w-4 mr-2" />
              Medical Records
            </button>
          </nav>
        </div>
        
        {/* Tab Content */}
        <div className="p-4">
          {activeTab === 'appointments' ? (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">Patient Appointments</h2>
                <button
                  onClick={() => navigate('/appointments')}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  New Appointment
                </button>
              </div>
              
              {appointments.length > 0 ? (
                <div className="divide-y divide-gray-200 border border-gray-200 rounded-md">
                  {appointments.map(appointment => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      viewType="doctor"
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 bg-gray-50 rounded-lg">
                  <Clock className="mx-auto h-10 w-10 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No appointments</h3>
                  <p className="mt-1 text-sm text-gray-500">This patient doesn't have any appointments yet.</p>
                  <div className="mt-6">
                    <button
                      onClick={() => navigate('/appointments')}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Schedule Appointment
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">Medical Records</h2>
                <button
                  onClick={() => toast.success('Add record functionality would open here')}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Record
                </button>
              </div>
              
              {medicalRecords.length > 0 ? (
                <div className="space-y-4">
                  {medicalRecords.map(record => (
                    <div key={record.id} className="border border-gray-200 rounded-md p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-md font-medium text-gray-900">{record.diagnosis}</h3>
                          <p className="text-sm text-gray-500 mt-1">{record.date}</p>
                        </div>
                        <button
                          onClick={() => toast.success('View record details would open here')}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          View Details
                        </button>
                      </div>
                      
                      {record.notes && (
                        <div className="mt-3">
                          <p className="text-sm text-gray-600">{record.notes}</p>
                        </div>
                      )}
                      
                      {record.prescription && (
                        <div className="mt-3 bg-blue-50 p-3 rounded-md">
                          <h4 className="text-sm font-medium text-blue-800">Prescription</h4>
                          <p className="text-sm text-blue-700 mt-1">{record.prescription}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 bg-gray-50 rounded-lg">
                  <FileText className="mx-auto h-10 w-10 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No medical records</h3>
                  <p className="mt-1 text-sm text-gray-500">Add medical records for this patient.</p>
                  <div className="mt-6">
                    <button
                      onClick={() => toast.success('Add record functionality would open here')}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Medical Record
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDetail;