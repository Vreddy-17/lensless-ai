import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'cyan' | 'emerald' | 'amber' | 'slate' | 'violet' | 'red';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'slate',
  size = 'sm',
  icon,
  className = '',
}) => {
  const mapped =
    variant === 'emerald'
      ? 'ok'
      : variant === 'amber'
        ? 'warn'
        : variant === 'violet' || variant === 'cyan'
          ? 'data'
          : variant === 'red'
            ? 'signal'
            : 'neutral';

  return (
    <span
      data-variant={mapped}
      className={`badge-tech ${size === 'md' ? 'min-h-[28px] px-2.5 text-[10px]' : ''} ${className}`}
    >
      {icon}
      {children}
    </span>
  );
};
