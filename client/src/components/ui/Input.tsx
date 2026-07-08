import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  fullWidth?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', fullWidth = false, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`bg-[#09090B] text-white/90 border border-[#232323] rounded-xl px-3 py-2 outline-none transition-all duration-300 focus:border-[#38BDF8]/50 focus:ring-1 focus:ring-[#38BDF8]/50 placeholder:text-neutral-600 shadow-sm ${fullWidth ? 'w-full' : ''} ${className}`}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';
