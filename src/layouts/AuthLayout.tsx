import { Outlet } from 'react-router-dom';
import { Heart, Activity, Shield } from 'lucide-react';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Branding Side */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-8 md:w-1/2 flex flex-col justify-center">
        <div className="max-w-md mx-auto">
          <div className="flex items-center mb-6">
            <Heart className="w-8 h-8 mr-2 text-white" />
            <h1 className="text-3xl font-bold">MedRemind</h1>
          </div>
          
          <h2 className="text-2xl font-semibold mb-6">The smart way to manage medical appointments</h2>
          
          <p className="mb-8 text-blue-100">Streamline your healthcare scheduling with our comprehensive reminder system designed for both practitioners and patients.</p>
          
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="bg-white/20 p-2 rounded-full mr-4">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Reduce No-Shows</h3>
                <p className="text-blue-100">Multi-channel reminders that ensure patients never miss an appointment</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-white/20 p-2 rounded-full mr-4">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">HIPAA Compliant</h3>
                <p className="text-blue-100">Secure platform designed with patient privacy and data protection</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Auth Form Side */}
      <div className="bg-gray-50 md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;