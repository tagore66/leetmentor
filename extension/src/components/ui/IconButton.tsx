import React from 'react';
import type { HTMLMotionProps } from 'framer-motion';
import { motion } from 'framer-motion';

export interface IconButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'default' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className = '', variant = 'default', size = 'md', children, ...props }, ref) => {
    
    const baseStyles = "inline-flex items-center justify-center transition-colors outline-none cursor-pointer group";
    
    const variants = {
      default: "bg-[#151515] text-[#BDBDBD] border border-[#2A2A2A] hover:bg-[#1f1f1f] hover:text-white hover:border-[#404040] hover:shadow-[0_0_12px_rgba(255,255,255,0.05)]",
      danger: "bg-[#151515] text-[#BDBDBD] border border-[#2A2A2A] hover:bg-rose-900/40 hover:text-rose-400 hover:border-rose-500/30 hover:shadow-[0_0_12px_rgba(244,63,94,0.1)]",
      ghost: "bg-transparent text-neutral-500 hover:text-white hover:bg-neutral-800 border border-transparent"
    };

    const sizes = {
      sm: "p-1.5 rounded-lg",
      md: "p-2 rounded-xl",
      lg: "p-3 rounded-xl"
    };

    return (
      <motion.button
        ref={ref}
        whileHover={variant !== 'ghost' ? { y: -2 } : {}}
        whileTap={{ scale: 0.95 }}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);
IconButton.displayName = 'IconButton';
