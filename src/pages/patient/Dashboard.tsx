import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, ChevronRight, Calendar, Bell, FileText, Phone, MessageSquare } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Appointment } from '../../types';
import AppointmentCard from '../../components/appointments/AppointmentCard';
import { mockAppointments, mockMedicalRecords } from '../../data/mockData';

const PatientDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [pastAppointments, setPastAppointments] = useState<Appointment[]>([]);
  
  useEffect(() => {
    if (user?.id) {
      const patientAppointments = mockAppointments.filter(
        appointment => appointment.patientId === user.id
      );
      
      const now = new Date();
      
      // Get upcoming appointments
      const upcoming = patientAppointments
        .filter(appointment => {
          const appointmentDate = new Date(`${appointment.date}T${appointment.time}`);
          return appointmentDate >= now && appointment.status === 'scheduled';
        })
        .sort((a, b) => {
          return new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime();
        })
        .slice(0, 3);
      
      // Get past appointments
      const past = patientAppointments
        .filter(appointment => {
          const appointmentDate = new Date(`${appointment.date}T${appointment.time}`);
          return appointmentDate < now || appointment.status === 'completed';
        })
        .sort((a, b) => {
          return new Date(`${b.date}T${b.time}`).getTime() - new Date(`${a.date}T${a.time}`).getTime();
        })
        .slice(0, 3);
      
      setUpcomingAppointments(upcoming);
      setPastAppointments(past);
    }
  }, [user?.id]);

  // Function to get the next appointment
  const getNextAppointment = () => {
    if (upcomingAppointments.length === 0) return null;
    return upcomingAppointments[0];
  };

  const nextAppointment = getNextAppointment();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Patient Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.name}</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Next Appointment */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg font-medium text-gray-900">Your Next Appointment</h2>
            </div>
            <div className="border-t border-gray-200">
              {nextAppointment ? (
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start">
                    <div className="flex-shrink-0 mb-4 sm:mb-0">
                      <div className="bg-blue-100 text-blue-800 p-3 rounded-lg text-center w-20">
                        <span className="block text-sm font-semibold">
                          {new Date(nextAppointment.date).toLocaleDateString('en-US', { month: 'short' })}
                        </span>
                        <span className="block text-2xl font-bold">
                          {new Date(nextAppointment.date).getDate()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="sm:ml-6 flex-1">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{nextAppointment.title}</h3>
                          <p className="mt-1 text-sm text-gray-500">
                            <Clock className="inline-block h-4 w-4 mr-1" />
                            {new Date(`2023-01-01T${nextAppointment.time}`).toLocaleTimeString('en-US', {
                              hour: 'numeric',
                              minute: '2-digit',
                              hour12: true
                            })}
                            {' - '}
                            {new Date(`2023-01-01T${nextAppointment.time}`).getTime() + (nextAppointment.duration * 60000)}
                          </p>
                        </div>
                        
                        <div className="mt-4 sm:mt-0">
                          <div className="flex space-x-3">
                            <button 
                              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              <Calendar className="h-4 w-4 mr-1" />
                              Reschedule
                            </button>
                            <button 
                              className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              <Phone className="h-4 w-4 mr-1" />
                              Call
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 bg-blue-50 rounded-md p-4">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <Bell className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-blue-800">Appointment Reminder</h3>
                            <div className="mt-2 text-sm text-blue-700">
                              <p>Please arrive 15 minutes before your scheduled time. Bring your insurance card and ID.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No upcoming appointments</h3>
                  <p className="mt-1 text-sm text-gray-500">Schedule your next visit with your doctor.</p>
                  <div className="mt-6">
                    <button
                      onClick={() => navigate('/appointments')}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Schedule New Appointment
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Upcoming Appointments */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-medium text-gray-900">Upcoming Appointments</h2>
                <p className="text-sm text-gray-500">Your scheduled visits</p>
              </div>
              <button 
                onClick={() => navigate('/appointments')}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
              >
                View all
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
            <div className="border-t border-gray-200">
              {upcomingAppointments.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {upcomingAppointments.map((appointment) => (
                    <AppointmentCard 
                      key={appointment.id} 
                      appointment={appointment} 
                      viewType="patient"
                    />
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center">
                  <p className="text-gray-500 text-sm">No upcoming appointments found.</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Past Appointments */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-medium text-gray-900">Recent Visits</h2>
                <p className="text-sm text-gray-500">Your past appointments</p>
              </div>
              <button 
                onClick={() => navigate('/patient/history')}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
              >
                View all history
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
            <div className="border-t border-gray-200">
              {pastAppointments.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {pastAppointments.map((appointment) => (
                    <AppointmentCard 
                      key={appointment.id} 
                      appointment={appointment} 
                      viewType="patient"
                    />
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center">
                  <p className="text-gray-500 text-sm">No past appointments found.</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
            </div>
            <div className="border-t border-gray-200">
              <div className="divide-y divide-gray-200">
                <button 
                  onClick={() => navigate('/appointments')}
                  className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="flex items-center text-sm font-medium text-gray-700">
                    <Calendar className="mr-3 h-5 w-5 text-gray-500" />
                    Schedule Appointment
                  </span>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </button>
                
                <button 
                  className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="flex items-center text-sm font-medium text-gray-700">
                    <MessageSquare className="mr-3 h-5 w-5 text-gray-500" />
                    Message Your Doctor
                  </span>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </button>
                
                <button 
                  className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="flex items-center text-sm font-medium text-gray-700">
                    <FileText className="mr-3 h-5 w-5 text-gray-500" />
                    View Medical Records
                  </span>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Medical Records */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg font-medium text-gray-900">Recent Medical Records</h2>
            </div>
            <div className="border-t border-gray-200">
              <div className="divide-y divide-gray-200">
                {mockMedicalRecords
                  .filter(record => record.patientId === user?.id)
                  .slice(0, 3)
                  .map((record) => (
                    <div key={record.id} className="px-4 py-4">
                      <div className="flex justify-between">
                        <p className="text-sm font-medium text-gray-900">{record.diagnosis}</p>
                        <p className="text-sm text-gray-500">{record.date}</p>
                      </div>
                      <p className="mt-1 text-sm text-gray-500 line-clamp-2">{record.notes}</p>
                    </div>
                  ))}
              </div>
              {mockMedicalRecords.filter(record => record.patientId === user?.id).length === 0 && (
                <div className="px-4 py-6 text-center">
                  <p className="text-gray-500 text-sm">No medical records found.</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Health Tips */}
          <div className="bg-blue-50 rounded-lg shadow-sm overflow-hidden">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg font-medium text-blue-900">Health Tips</h2>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <div className="text-sm text-blue-800 space-y-4">
                <p>• Stay hydrated by drinking at least 8 glasses of water daily.</p>
                <p>• Try to get 7-9 hours of sleep each night for optimal health.</p>
                <p>• Regular exercise can help improve your mood and energy levels.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;