import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  bgColor?: string;
  textColor?: string;
}

const StatCard = ({ 
  title, 
  value, 
  icon, 
  bgColor = 'bg-blue-50', 
  textColor = 'text-gray-900' 
}: StatCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-5">
        <div className="flex items-center">
          <div className={`${bgColor} p-3 rounded-full`}>
            {icon}
          </div>
          <div className="ml-5">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className={`text-2xl font-semibold ${textColor}`}>{value}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;