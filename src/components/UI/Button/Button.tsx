import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  icon?: typeof LucideIcon;
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  disabled = false,
  loading = false,
  className = '',
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 text-white hover:from-cyan-600 hover:via-blue-600 hover:to-indigo-700 focus:ring-cyan-500 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200',
    secondary: 'bg-gradient-to-r from-slate-100 via-gray-100 to-zinc-200 text-gray-900 hover:from-slate-200 hover:via-gray-200 hover:to-zinc-300 focus:ring-slate-500 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200',
    danger: 'bg-gradient-to-r from-rose-500 via-red-500 to-pink-600 text-white hover:from-rose-600 hover:via-red-600 hover:to-pink-700 focus:ring-rose-500 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200',
    success: 'bg-gradient-to-r from-emerald-500 via-green-500 to-teal-600 text-white hover:from-emerald-600 hover:via-green-600 hover:to-teal-700 focus:ring-emerald-500 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200',
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={classes}
    >
      {loading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        Icon && iconPosition === 'left' && <Icon className="w-4 h-4 mr-2" />
      )}
      {children}
      {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 ml-2" />}
    </button>
  );
};

export default Button;