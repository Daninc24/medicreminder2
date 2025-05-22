import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, CheckCircle, XCircle, AlertTriangle, Users, Calendar, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Appointment } from '../../types';
import AppointmentCard from '../../components/appointments/AppointmentCard';
import StatCard from '../../components/dashboard/StatCard';
import { mockAppointments, mockPatients } from '../../data/mockData';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState({
    todayAppointments: 0,
    totalPatients: 0,
    completedAppointments: 0,
    cancelledAppointments: 0
  });
  
  useEffect(() => {
    // Filter appointments for today and get stats
    const today = new Date().toISOString().split('T')[0];
    const doctorAppointments = mockAppointments.filter(
      appointment => appointment.doctorId === user?.id
    );
    
    const todaysAppointments = doctorAppointments.filter(
      appointment => appointment.date === today
    );
    
    const upcoming = doctorAppointments
      .filter(appointment => 
        new Date(`${appointment.date}T${appointment.time}`) >= new Date() && 
        appointment.status === 'scheduled'
      )
      .slice(0, 5);
    
    setUpcomingAppointments(upcoming);
    
    setStats({
      todayAppointments: todaysAppointments.length,
      totalPatients: mockPatients.length,
      completedAppointments: doctorAppointments.filter(a => a.status === 'completed').length,
      cancelledAppointments: doctorAppointments.filter(a => a.status === 'cancelled').length
    });
  }, [user?.id]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Doctor Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.name}</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard 
          title="Today's Appointments" 
          value={stats.todayAppointments.toString()} 
          icon={<Clock className="h-6 w-6 text-blue-600" />}
          bgColor="bg-blue-50"
        />
        <StatCard 
          title="Total Patients" 
          value={stats.totalPatients.toString()} 
          icon={<Users className="h-6 w-6 text-indigo-600" />}
          bgColor="bg-indigo-50"
        />
        <StatCard 
          title="Completed" 
          value={stats.completedAppointments.toString()} 
          icon={<CheckCircle className="h-6 w-6 text-emerald-600" />}
          bgColor="bg-emerald-50"
        />
        <StatCard 
          title="Cancellations" 
          value={stats.cancelledAppointments.toString()} 
          icon={<XCircle className="h-6 w-6 text-rose-600" />}
          bgColor="bg-rose-50"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Appointments */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-medium text-gray-900">Upcoming Appointments</h2>
                <p className="text-sm text-gray-500">Your next scheduled sessions</p>
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
                      viewType="doctor"
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No upcoming appointments</h3>
                  <p className="mt-1 text-sm text-gray-500">You don't have any appointments scheduled.</p>
                  <div className="mt-6">
                    <button
                      onClick={() => navigate('/appointments')}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      View Calendar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Patient Reminders */}
        <div>
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg font-medium text-gray-900">Reminder Status</h2>
              <p className="text-sm text-gray-500">Recent reminder notifications</p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <div className="space-y-4">
                <div className="bg-green-50 rounded-md p-4 flex">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">3 reminders sent today</h3>
                    <div className="mt-2 text-sm text-green-700">
                      <p>All patient reminders have been delivered successfully.</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-yellow-50 rounded-md p-4 flex">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">2 pending confirmations</h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>Waiting for patients to confirm their appointments.</p>
                    </div>
                  </div>
                </div>
                
                <button 
                  className="w-full border border-gray-300 shadow-sm rounded-md py-2 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Send Additional Reminders
                </button>
              </div>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="mt-6 bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
            </div>
            <div className="border-t border-gray-200">
              <div className="divide-y divide-gray-200">
                <button 
                  onClick={() => navigate('/doctor/patients')}
                  className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="flex items-center text-sm font-medium text-gray-700">
                    <Users className="mr-3 h-5 w-5 text-gray-500" />
                    View All Patients
                  </span>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </button>
                
                <button 
                  onClick={() => navigate('/appointments')}
                  className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="flex items-center text-sm font-medium text-gray-700">
                    <Calendar className="mr-3 h-5 w-5 text-gray-500" />
                    Manage Appointments
                  </span>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;