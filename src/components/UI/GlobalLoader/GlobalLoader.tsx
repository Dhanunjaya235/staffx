import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';

const GlobalLoader: React.FC = () => {
  const { globalLoading } = useSelector((state: RootState) => state.ui);

  if (!globalLoading) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 shadow-2xl">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-indigo-200 rounded-full animate-spin"></div>
            <div className="absolute top-0 left-0 w-12 h-12 border-4 border-transparent border-t-indigo-600 rounded-full animate-spin"></div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Processing...</h3>
            <p className="text-gray-600">Please wait while we handle your request</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalLoader;