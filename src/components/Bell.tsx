import { Bell as LucideBell } from 'lucide-react';

interface BellProps {
  className?: string;
}

const Bell = ({ className }: BellProps) => {
  return <LucideBell className={className} />;
};

export default Bell;