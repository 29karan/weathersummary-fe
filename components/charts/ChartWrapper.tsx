import { Card } from '../ui/Card';
import { LoadingState } from '../ui/LoadingSpinner';

interface ChartWrapperProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  isLoading?: boolean;
  error?: string;
  className?: string;
  actions?: React.ReactNode;
}

export const ChartWrapper: React.FC<ChartWrapperProps> = ({ 
  children,
  title,
  description,
  isLoading = false,
  error,
  className = '',
  actions
}) => {
  return (
    <Card className={className}>
      {/* Chart Header */}
      {(title || actions) && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 'var(--space-4)',
          gap: 'var(--space-4)',
        }}>
          <div style={{ flex: 1 }}>
            {title && (
              <h3 className="heading-4" style={{ marginBottom: description ? 'var(--space-1)' : 0 }}>
                {title}
              </h3>
            )}
            {description && (
              <p className="text-secondary" style={{ fontSize: 'var(--text-sm)' }}>
                {description}
              </p>
            )}
          </div>
          {actions && <div>{actions}</div>}
        </div>
      )}
      
      {/* Chart Content */}
      <div style={{ 
        minHeight: '300px',
        position: 'relative',
      }}>
        {isLoading ? (
          <LoadingState message="Loading chart data..." />
        ) : error ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '300px',
            gap: 'var(--space-3)',
          }}>
            <div style={{
              fontSize: 'var(--text-4xl)',
              color: 'var(--error)',
            }}>⚠️</div>
            <p className="text-secondary" style={{ fontSize: 'var(--text-sm)' }}>
              {error}
            </p>
          </div>
        ) : (
          children
        )}
      </div>
    </Card>
  );
};
