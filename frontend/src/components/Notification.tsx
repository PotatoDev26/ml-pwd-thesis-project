import React, { useEffect } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

type NotificationType = 'success' | 'error';

interface NotificationProps {
  message: string;
  type: NotificationType;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const isSuccess = type === 'success';

  return (
    <div
      role="alert"
      className={`fixed bottom-5 right-5 flex items-center p-4 rounded-lg shadow-lg border-l-4 z-50 transition-all duration-300 transform animate-bounce-subtle
      ${isSuccess ? 'bg-green-50 border-green-500 text-green-800' : 'bg-red-50 border-red-500 text-red-800'}`}
    >
      <div className="mr-3">
        {isSuccess ? <CheckCircle size={20} /> : <XCircle size={20} />}
      </div>

      <div className="flex-1">
        <p className="text-sm font-bold">{isSuccess ? 'Success' : 'Error'}</p>
        <p className="text-xs opacity-90">{message}</p>
      </div>

      <button
        onClick={onClose}
        className="ml-4 text-gray-400 hover:text-gray-600 focus:outline-none"
        aria-label="Close notification"
      >
        <span className="text-xl font-light">&times;</span>
      </button>
    </div>
  );
};

export default Notification;