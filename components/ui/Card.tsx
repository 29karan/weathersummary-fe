interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'interactive' | 'stat';
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  variant = 'default',
  onClick 
}) => {
  const baseClass = 'card';
  const variantClass = variant === 'interactive' ? 'card-interactive' : '';
  
  return (
    <div 
      className={`${baseClass} ${variantClass} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  unit,
  icon,
  trend,
  className = ''
}) => {
  return (
    <Card className={className}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <p className="text-secondary" style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)' }}>
            {title}
          </p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-2)' }}>
            <span className="heading-3">
              {value}
            </span>
            {unit && (
              <span className="text-secondary" style={{ fontSize: 'var(--text-lg)' }}>
                {unit}
              </span>
            )}
          </div>
          {trend && (
            <div style={{ 
              marginTop: 'var(--space-2)', 
              fontSize: 'var(--text-sm)',
              color: trend.isPositive ? 'var(--success)' : 'var(--error)'
            }}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </div>
          )}
        </div>
        {icon && (
          <div style={{ 
            fontSize: 'var(--text-3xl)', 
            opacity: 0.6,
            color: 'var(--primary-500)'
          }}>
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
};
