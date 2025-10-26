import React from 'react';

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'destructive';
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className = '', variant = 'default', ...props }, ref) => {
    const baseClasses = "relative w-full rounded-lg border p-4";
    const variantClasses = {
      default: "bg-white text-gray-900 border-gray-200",
      destructive: "border-red-300 text-red-800 bg-red-50"
    };
    
    const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;

    return (
      <div
        ref={ref}
        role="alert"
        className={classes}
        {...props}
      />
    );
  }
);

Alert.displayName = "Alert";

const AlertDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className = '', ...props }, ref) => (
  <div
    ref={ref}
    className={`text-sm leading-relaxed ${className}`}
    {...props}
  />
));

AlertDescription.displayName = "AlertDescription";

export { Alert, AlertDescription };