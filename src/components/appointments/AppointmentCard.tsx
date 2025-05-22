import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Calendar, CheckCircle, XCircle, AlertTriangle, MoreVertical, MessageSquare, Phone } from 'lucide-react';
import { Appointment } from '../../types';
import { mockDoctors, mockPatients } from '../../data/mockData';
import toast from 'react-hot-toast';

interface AppointmentCardProps {
  appointment: Appointment;
  viewType: 'patient' | 'doctor';
  showActions?: boolean;
}

const AppointmentCard = ({ appointment, viewType, showActions = true }: AppointmentCardProps) => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  
  // Format date and time
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  const formatTime = (timeString: string) => {
    return new Date(`2023-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };
  
  // Get doctor or patient info based on view type
  const getPersonInfo = () => {
    if (viewType === 'patient') {
      return mockDoctors.find(doctor => doctor.id === appointment.doctorId);
    } else {
      return mockPatients.find(patient => patient.id === appointment.patientId);
    }
  };
  
  const person = getPersonInfo();
  
  // Get status badge styles
  const getStatusStyles = () => {
    switch (appointment.status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'no-show':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get status icon
  const getStatusIcon = () => {
    switch (appointment.status) {
      case 'scheduled':
        return <Calendar className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      case 'no-show':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };
  
  // Appointment actions
  const handleReschedule = (e) => {
    e.stopPropagation();
    setShowMenu(false);
    toast.success('Rescheduling functionality would open here');
  };
  
  const handleCancel = (e) => {
    e.stopPropagation();
    setShowMenu(false);
    toast('Appointment cancelled successfully!', {
      icon: '🗑️',
    });
  };
  
  const handleSendReminder = (e) => {
    e.stopPropagation();
    setShowMenu(false);
    toast.success('Reminder sent successfully!');
  };

  return (
    <div 
      className="px-4 py-4 hover:bg-gray-50 transition duration-150 cursor-pointer"
      onClick={() => showActions && navigate(`/appointments/${appointment.id}`)}
    >
      <div className="flex justify-between">
        <div>
          <div className="flex items-center">
            <h3 className="text-sm font-medium text-gray-900">{appointment.title}</h3>
            <span className={`ml-2 px-2 py-0.5 text-xs rounded-full flex items-center ${getStatusStyles()}`}>
              {getStatusIcon()}
              <span className="ml-1 capitalize">{appointment.status}</span>
            </span>
          </div>
          
          <div className="mt-2 flex items-start">
            {person?.profileImage ? (
              <img 
                src={person.profileImage} 
                alt={person.name}
                className="h-8 w-8 rounded-full object-cover mr-3"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                <span className="text-sm font-medium text-gray-600">
                  {person?.name?.charAt(0) || '?'}
                </span>
              </div>
            )}
            
            <div>
              <p className="text-sm text-gray-600">
                {viewType === 'patient' ? 'Dr.' : ''} {person?.name}
              </p>
              <p className="text-xs text-gray-500">
                {viewType === 'doctor' ? 'Patient' : 'Doctor'}
              </p>
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="flex items-start">
            <div>
              <p className="text-sm text-gray-600">{formatDate(appointment.date)}</p>
              <p className="text-xs text-gray-500 flex items-center justify-end">
                <Clock className="h-3 w-3 mr-1" />
                {formatTime(appointment.time)}
              </p>
            </div>
            
            {showActions && (
              <div className="relative ml-2">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(!showMenu);
                  }}
                  className="p-1 rounded-full hover:bg-gray-200"
                >
                  <MoreVertical className="h-5 w-5 text-gray-500" />
                </button>
                
                {showMenu && (
                  <div 
                    className="absolute right-0 z-10 mt-1 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={handleReschedule}
                      className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Calendar className="mr-3 h-4 w-4 text-gray-500" />
                      Reschedule
                    </button>
                    
                    <button
                      onClick={handleSendReminder}
                      className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Bell className="mr-3 h-4 w-4 text-gray-500" />
                      Send Reminder
                    </button>
                    
                    <button
                      onClick={handleCancel}
                      className="flex w-full items-center px-4 py-2 text-sm text-red-700 hover:bg-gray-100"
                    >
                      <XCircle className="mr-3 h-4 w-4 text-red-500" />
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {showActions && appointment.status === 'scheduled' && (
            <div className="mt-2 flex justify-end space-x-2">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  toast('Calling would start here', { icon: '📞' });
                }}
                className="p-1 text-gray-500 hover:text-gray-700"
              >
                <Phone className="h-4 w-4" />
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  toast('Messaging would open here', { icon: '💬' });
                }}
                className="p-1 text-gray-500 hover:text-gray-700"
              >
                <MessageSquare className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentCard;