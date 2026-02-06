interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  headerActions?: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children,
  title = 'UK Weather Dashboard',
  subtitle,
  headerActions
}) => {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--background)',
    }}>
      {/* Header */}
      <header style={{
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}>
        <div className="container-fluid" style={{
          padding: 'var(--space-6) var(--space-6)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 'var(--space-4)',
        }}>
          <div>
            <h1 className="heading-2" style={{ marginBottom: subtitle ? 'var(--space-1)' : 0 }}>
              {title}
            </h1>
            {subtitle && (
              <p className="text-secondary" style={{ fontSize: 'var(--text-sm)' }}>
                {subtitle}
              </p>
            )}
          </div>
          {headerActions && (
            <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
              {headerActions}
            </div>
          )}
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container-fluid" style={{
        paddingTop: 'var(--space-8)',
        paddingBottom: 'var(--space-8)',
      }}>
        {children}
      </main>
      
      {/* Footer */}
      <footer style={{
        background: 'var(--surface)',
        borderTop: '1px solid var(--border)',
        marginTop: 'auto',
      }}>
        <div className="container-fluid" style={{
          padding: 'var(--space-6)',
          textAlign: 'center',
        }}>
          <p className="text-secondary" style={{ fontSize: 'var(--text-sm)' }}>
            UK Regional Weather Data Dashboard © {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
};
