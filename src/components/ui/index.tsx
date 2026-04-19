import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`glass-card ${onClick ? 'cursor-pointer hover:scale-[1.01] active:scale-[0.99]' : ''} ${className}`}
    >
      {children}
    </div>
  );
};

export const Button: React.FC<{
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit';
}> = ({ children, variant = 'primary', className = '', onClick, disabled, type = 'button' }) => {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'bg-red-500/80 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-red-500/20'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${variants[variant]} ${className} flex items-center justify-center gap-2`}
    >
      {children}
    </button>
  );
};

export const InputField: React.FC<React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
}> = ({ label, error, ...props }) => {
  return (
    <div className="w-full space-y-2">
      {label && <label className="text-sm font-medium text-white/60 ml-1">{label}</label>}
      <input 
        className={`input-field ${error ? 'border-red-500/50 ring-2 ring-red-500/20' : ''}`}
        {...props} 
      />
      {error && <span className="text-xs text-red-400 ml-1">{error}</span>}
    </div>
  );
};
