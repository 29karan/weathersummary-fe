interface GridContainerProps {
  children: React.ReactNode;
  className?: string;
  columns?: 1 | 2 | 3 | 4;
}

export const GridContainer: React.FC<GridContainerProps> = ({ 
  children, 
  className = '',
  columns = 3
}) => {
  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gap: 'var(--space-6)',
    gridTemplateColumns: '1fr',
  };
  
  return (
    <div 
      className={`${className}`}
      style={gridStyle}
      data-columns={columns}
    >
      <style jsx>{`
        div[data-columns] {
          grid-template-columns: 1fr;
        }
        
        @media (min-width: 768px) {
          div[data-columns="2"],
          div[data-columns="3"],
          div[data-columns="4"] {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        
        @media (min-width: 1024px) {
          div[data-columns="3"],
          div[data-columns="4"] {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        
        @media (min-width: 1280px) {
          div[data-columns="4"] {
            grid-template-columns: repeat(4, 1fr);
          }
        }
      `}</style>
      {children}
    </div>
  );
};
