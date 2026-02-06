interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md',
  className = '' 
}) => {
  const sizeMap = {
    sm: '1rem',
    md: '2rem',
    lg: '3rem'
  };
  
  return (
    <div 
      className={`animate-spin ${className}`}
      style={{
        width: sizeMap[size],
        height: sizeMap[size],
        border: '3px solid var(--border)',
        borderTopColor: 'var(--primary-500)',
        borderRadius: 'var(--radius-full)',
      }}
      role="status"
      aria-label="Loading"
    />
  );
};

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = 'Loading...',
  className = '' 
}) => {
  return (
    <div 
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--space-4)',
        padding: 'var(--space-8)',
      }}
    >
      <LoadingSpinner size="lg" />
      <p className="text-secondary" style={{ fontSize: 'var(--text-sm)' }}>
        {message}
      </p>
    </div>
  );
};
