import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Plus, Users, Clock, List, CalendarDays } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AppointmentCard from '../../components/appointments/AppointmentCard';
import { mockAppointments } from '../../data/mockData';
import toast from 'react-hot-toast';

const AppointmentCalendar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState<'calendar' | 'list'>('calendar');
  const [showNewAppointmentModal, setShowNewAppointmentModal] = useState(false);
  
  // Filter appointments based on user role and selected date
  const filteredAppointments = mockAppointments.filter(appointment => {
    const isUserAppointment = user?.role === 'doctor' 
      ? appointment.doctorId === user.id
      : appointment.patientId === user.id;
    
    // For calendar view, only show appointments on the selected date
    if (view === 'calendar') {
      const appointmentDate = new Date(appointment.date).toDateString();
      const selected = selectedDate.toDateString();
      return isUserAppointment && appointmentDate === selected;
    }
    
    // For list view, show all appointments
    return isUserAppointment;
  });
  
  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    
    const startingDayOfWeek = firstDayOfMonth.getDay();
    const daysInMonth = lastDayOfMonth.getDate();
    
    // Previous month days to display
    const prevMonthDays = [];
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const day = new Date(year, month, -i);
      prevMonthDays.push(day);
    }
    
    // Current month days
    const currentMonthDays = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const day = new Date(year, month, i);
      currentMonthDays.push(day);
    }
    
    // Next month days to complete grid
    const nextMonthDays = [];
    const totalDays = prevMonthDays.length + currentMonthDays.length;
    const daysToAdd = Math.ceil(totalDays / 7) * 7 - totalDays;
    
    for (let i = 1; i <= daysToAdd; i++) {
      const day = new Date(year, month + 1, i);
      nextMonthDays.push(day);
    }
    
    return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
  };
  
  // Format date for display
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };
  
  // Check if date has appointments
  const hasAppointments = (date) => {
    const dateString = date.toISOString().split('T')[0];
    return mockAppointments.some(appointment => {
      const isUserAppointment = user?.role === 'doctor' 
        ? appointment.doctorId === user.id
        : appointment.patientId === user.id;
      return isUserAppointment && appointment.date === dateString;
    });
  };
  
  // Navigate to previous/next month
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  
  // Handle new appointment
  const handleNewAppointment = () => {
    setShowNewAppointmentModal(true);
    toast.success('New appointment dialog would open here');
  };
  
  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
          <p className="text-gray-600">Manage your schedule</p>
        </div>
        
        <div className="mt-4 sm:mt-0 flex space-x-2">
          <button
            onClick={() => setView('calendar')}
            className={`p-2 rounded-md ${
              view === 'calendar' 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <CalendarDays className="h-5 w-5" />
          </button>
          <button
            onClick={() => setView('list')}
            className={`p-2 rounded-md ${
              view === 'list' 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <List className="h-5 w-5" />
          </button>
          <button
            onClick={handleNewAppointment}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
          >
            <Plus className="h-5 w-5 mr-1" />
            New Appointment
          </button>
        </div>
      </div>
      
      {view === 'calendar' ? (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Calendar Header */}
          <div className="px-4 py-4 flex items-center justify-between border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={goToPreviousMonth}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              </button>
              <button
                onClick={goToNextMonth}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <ChevronRight className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
          
          {/* Calendar Grid */}
          <div className="p-4">
            {/* Weekday Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center text-sm font-medium text-gray-500">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {generateCalendarDays().map((date, index) => {
                const isCurrentMonth = date.getMonth() === currentDate.getMonth();
                const isToday = date.toDateString() === new Date().toDateString();
                const isSelected = date.toDateString() === selectedDate.toDateString();
                const hasEvents = hasAppointments(date);
                
                return (
                  <button
                    key={index}
                    onClick={() => setSelectedDate(date)}
                    className={`
                      relative aspect-square flex flex-col items-center justify-center rounded-lg
                      ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
                      ${isToday ? 'font-bold' : ''}
                      ${isSelected ? 'bg-blue-100' : 'hover:bg-gray-100'}
                      transition-colors duration-200
                    `}
                  >
                    <span className={`text-sm ${isToday ? 'text-blue-600' : ''}`}>
                      {date.getDate()}
                    </span>
                    
                    {hasEvents && (
                      <div className={`w-1.5 h-1.5 rounded-full mt-1 ${isSelected ? 'bg-blue-600' : 'bg-blue-500'}`} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Selected Day Appointments */}
          <div className="border-t border-gray-200 px-4 py-4">
            <h3 className="text-md font-medium text-gray-900 mb-4">
              Appointments for {formatDate(selectedDate)}
            </h3>
            
            {filteredAppointments.length > 0 ? (
              <div className="space-y-3">
                {filteredAppointments.map((appointment) => (
                  <div key={appointment.id} className="bg-gray-50 rounded-lg overflow-hidden">
                    <AppointmentCard 
                      appointment={appointment} 
                      viewType={user?.role || 'patient'} 
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-gray-50 rounded-lg">
                <Clock className="mx-auto h-10 w-10 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No appointments scheduled</h3>
                <p className="mt-1 text-sm text-gray-500">Schedule an appointment for this day.</p>
                <div className="mt-6">
                  <button
                    onClick={handleNewAppointment}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    New Appointment
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">All Appointments</h2>
          </div>
          
          {filteredAppointments.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {filteredAppointments.map((appointment) => (
                <AppointmentCard 
                  key={appointment.id} 
                  appointment={appointment} 
                  viewType={user?.role || 'patient'} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No appointments found</h3>
              <p className="mt-1 text-sm text-gray-500">Start by creating a new appointment.</p>
              <div className="mt-6">
                <button
                  onClick={handleNewAppointment}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  New Appointment
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AppointmentCalendar;