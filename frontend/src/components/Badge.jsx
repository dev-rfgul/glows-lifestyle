import React from 'react';

const Badge = ({ children, variant = "default", className = "" }) => {
  const baseClasses = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium";
  
  const variants = {
    default: "bg-gray-100 text-gray-800 border border-gray-200",
    outline: "bg-transparent text-gray-800 border border-gray-300",
    secondary: "bg-gray-100 text-gray-900",
    destructive: "bg-red-100 text-red-800 border border-red-200",
    success: "bg-green-100 text-green-800 border border-green-200",
  };

  const variantClasses = variants[variant] || variants.default;

  return (
    <span className={`${baseClasses} ${variantClasses} ${className}`}>
      {children}
    </span>
  );
};

export { Badge };
