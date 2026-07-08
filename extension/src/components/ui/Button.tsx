import React from 'react';
import type { HTMLMotionProps } from 'framer-motion';
import { motion } from 'framer-motion';

export interface ButtonProps extends Omit<HTMLMotionProps<"button">, "variant"> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', fullWidth = false, children, ...props }, ref) => {
    
    const baseStyles = "inline-flex items-center justify-center font-medium transition-colors outline-none cursor-pointer";
    
    const variants = {
      primary: "bg-white text-black border border-white hover:bg-neutral-200 shadow-sm hover:shadow-[0_0_15px_rgba(255,255,255,0.15)]",
      secondary: "bg-[#141414] text-white border border-[#2A2A2A] hover:bg-[#1B1B1B] hover:border-[#404040]",
      danger: "bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500 hover:text-white",
      ghost: "bg-transparent text-neutral-400 hover:text-white hover:bg-neutral-900 border border-transparent"
    };

    const sizes = {
      sm: "px-3 py-1.5 text-xs rounded-lg",
      md: "px-4 py-2 text-sm rounded-xl",
      lg: "px-5 py-2.5 text-base rounded-2xl"
    };

    return (
      <motion.button
        ref={ref}
        whileHover={variant !== 'ghost' ? { y: -2, scale: 1.02 } : {}}
        whileTap={{ scale: 0.98 }}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);
Button.displayName = 'Button';
