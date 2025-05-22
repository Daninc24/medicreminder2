import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  Heart, Menu, X, Calendar, Users, Settings, 
  Bell, LogOut, Home, Clock, User
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import NotificationDropdown from '../components/notifications/NotificationDropdown';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  
  // Close mobile menu on location change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);
  
  // Navigation items based on user role
  const getNavItems = () => {
    const commonItems = [
      { icon: Calendar, label: 'Appointments', path: '/appointments' },
      { icon: Settings, label: 'Settings', path: '/settings' },
    ];
    
    if (user?.role === 'doctor') {
      return [
        { icon: Home, label: 'Dashboard', path: '/doctor' },
        { icon: Users, label: 'Patients', path: '/doctor/patients' },
        ...commonItems
      ];
    }
    
    if (user?.role === 'patient') {
      return [
        { icon: Home, label: 'Dashboard', path: '/patient' },
        { icon: Clock, label: 'History', path: '/patient/history' },
        ...commonItems
      ];
    }
    
    return commonItems;
  };
  
  const navItems = getNavItems();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo and Mobile Menu Button */}
            <div className="flex">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
              >
                {isMobileMenuOpen ? (
                  <X className="block h-6 w-6" />
                ) : (
                  <Menu className="block h-6 w-6" />
                )}
              </button>
              
              {/* Logo */}
              <div className="flex-shrink-0 flex items-center">
                <Heart className="h-6 w-6 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-blue-600">MedRemind</span>
              </div>
            </div>
            
            {/* User Menu */}
            <div className="flex items-center">
              {/* Notifications */}
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-full text-gray-600 hover:bg-gray-100 relative"
                >
                  <Bell className="h-6 w-6" />
                  {notificationCount > 0 && (
                    <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {notificationCount}
                    </span>
                  )}
                </button>
                
                {showNotifications && (
                  <NotificationDropdown 
                    onClose={() => setShowNotifications(false)}
                    onMarkAllAsRead={() => setNotificationCount(0)}
                  />
                )}
              </div>
              
              {/* Profile */}
              <div className="ml-3 relative flex items-center">
                <div className="flex items-center">
                  {user?.profileImage ? (
                    <img
                      className="h-8 w-8 rounded-full object-cover"
                      src={user.profileImage}
                      alt={user.name}
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                  )}
                  <span className="ml-2 text-sm font-medium text-gray-700 hidden md:block">
                    {user?.name}
                  </span>
                </div>
                
                {/* Logout button */}
                <button
                  onClick={handleLogout}
                  className="ml-4 p-2 rounded-full text-gray-600 hover:bg-gray-100"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg absolute inset-x-0 top-16 z-20 transition-all duration-300">
          <div className="pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`${
                  location.pathname === item.path
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                } block pl-3 pr-4 py-2 text-base font-medium w-full text-left flex items-center`}
              >
                <item.icon className="mr-4 h-5 w-5" />
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Main Content with Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation (Desktop) */}
        <nav className="hidden md:block bg-white w-64 flex-shrink-0 border-r border-gray-200">
          <div className="h-full flex flex-col py-6 px-3">
            {/* User Info */}
            <div className="px-3 mb-6">
              <div className="flex items-center">
                {user?.profileImage ? (
                  <img
                    className="h-10 w-10 rounded-full object-cover"
                    src={user.profileImage}
                    alt={user.name}
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
                    <User className="h-6 w-6" />
                  </div>
                )}
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">{user?.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                </div>
              </div>
            </div>
            
            {/* Navigation Links */}
            <div className="space-y-1 flex-1">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`${
                    location.pathname === item.path
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  } group flex items-center px-3 py-2 text-sm font-medium rounded-md w-full`}
                >
                  <item.icon 
                    className={`${
                      location.pathname === item.path ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-600'
                    } mr-3 flex-shrink-0 h-5 w-5`} 
                  />
                  {item.label}
                </button>
              ))}
            </div>
            
            {/* Logout (Desktop Sidebar) */}
            <div className="px-3 mt-auto">
              <button
                onClick={handleLogout}
                className="group flex items-center px-3 py-2 text-sm font-medium rounded-md w-full text-gray-700 hover:bg-gray-50"
              >
                <LogOut className="text-gray-500 group-hover:text-gray-600 mr-3 flex-shrink-0 h-5 w-5" />
                Logout
              </button>
            </div>
          </div>
        </nav>
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;