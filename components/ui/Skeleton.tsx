interface SkeletonProps {
  width?: string;
  height?: string;
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  style?: React.CSSProperties;
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  width = '100%',
  height = '1rem',
  className = '',
  variant = 'rectangular',
  style = {}
}) => {
  const getStyles = (): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      width,
      height,
    };
    
    if (variant === 'circular') {
      return {
        ...baseStyles,
        borderRadius: 'var(--radius-full)',
        ...style, // Merge custom styles
      };
    }
    
    if (variant === 'text') {
      return {
        ...baseStyles,
        borderRadius: 'var(--radius-sm)',
        ...style, // Merge custom styles
      };
    }
    
    return {
      ...baseStyles,
      ...style, // Merge custom styles
    };
  };
  
  return (
    <div 
      className={`skeleton ${className}`}
      style={getStyles()}
      aria-hidden="true"
    />
  );
};

export const ChartSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={className} style={{ padding: 'var(--space-6)' }}>
      <Skeleton height="1.5rem" width="40%" style={{ marginBottom: 'var(--space-4)' }} />
      <Skeleton height="250px" style={{ marginTop: 'var(--space-4)' }} />
    </div>
  );
};

export const CardSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`card ${className}`}>
      <Skeleton height="1rem" width="60%" style={{ marginBottom: 'var(--space-3)' }} />
      <Skeleton height="2rem" width="40%" style={{ marginBottom: 'var(--space-2)' }} />
      <Skeleton height="0.875rem" width="30%" />
    </div>
  );
};
