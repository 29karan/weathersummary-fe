'use client';

import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MantineProvider
      theme={{
        primaryColor: 'blue',
        fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
      }}
    >
      {children}
    </MantineProvider>
  );
}
