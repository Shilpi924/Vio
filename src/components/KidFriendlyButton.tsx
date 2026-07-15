import { ReactNode } from 'react';

interface KidFriendlyButtonProps {
  onClick: () => void;
  children: ReactNode;
  icon?: string;
  color?: string;
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
}

export default function KidFriendlyButton({
  onClick,
  children,
  icon,
  color = 'from-purple-500 to-pink-600',
  size = 'large',
  disabled = false,
}: KidFriendlyButtonProps) {
  const sizeClasses = {
    small: 'py-3 px-6 text-base',
    medium: 'py-4 px-8 text-lg',
    large: 'py-6 px-10 text-xl',
  };

  const iconSize = {
    small: 'text-2xl',
    medium: 'text-3xl',
    large: 'text-4xl',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative overflow-hidden
        bg-gradient-to-br ${color}
        text-white font-bold rounded-2xl
        shadow-lg hover:shadow-xl
        transform hover:scale-105 active:scale-95
        transition-all duration-200
        ${sizeClasses[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      <div className="flex items-center justify-center gap-3">
        {icon && <span className={iconSize[size]}>{icon}</span>}
        <span>{children}</span>
      </div>
      
      {/* Shine effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-500" />
    </button>
  );
}
