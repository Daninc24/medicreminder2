import { Bell, CheckCircle } from 'lucide-react';
import { mockNotifications } from '../../data/mockData';

interface NotificationDropdownProps {
  onClose: () => void;
  onMarkAllAsRead: () => void;
}

const NotificationDropdown = ({ onClose, onMarkAllAsRead }: NotificationDropdownProps) => {
  // Close when clicking outside
  const handleOutsideClick = (e) => {
    if (e.target.closest('.notification-dropdown')) return;
    onClose();
  };
  
  // Add event listener when component mounts
  document.addEventListener('mousedown', handleOutsideClick);
  
  // Format notification time
  const formatNotificationTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <div className="notification-dropdown absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
      <div className="py-2 px-3 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
        <button 
          onClick={onMarkAllAsRead}
          className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center"
        >
          <CheckCircle className="h-3 w-3 mr-1" />
          Mark all as read
        </button>
      </div>
      
      <div className="max-h-80 overflow-y-auto">
        {mockNotifications.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {mockNotifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${notification.isRead ? '' : 'bg-blue-50'}`}
              >
                <div className="flex items-start">
                  <div className={`p-2 rounded-full ${
                    notification.type === 'reminder' ? 'bg-blue-100 text-blue-600' : 
                    notification.type === 'system' ? 'bg-purple-100 text-purple-600' : 
                    'bg-green-100 text-green-600'
                  }`}>
                    <Bell className="h-5 w-5" />
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{formatNotificationTime(notification.createdAt)}</p>
                  </div>
                  {!notification.isRead && (
                    <div className="ml-2">
                      <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 text-center">
            <Bell className="mx-auto h-8 w-8 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">No notifications yet</p>
          </div>
        )}
      </div>
      
      <div className="py-2 px-3 border-t border-gray-200">
        <button 
          className="text-sm text-blue-600 hover:text-blue-800 font-medium w-full text-center"
        >
          View all notifications
        </button>
      </div>
    </div>
  );
};

export default NotificationDropdown;