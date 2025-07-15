'use client';

import React, { ReactNode } from 'react';
import Navigation from './Navigation';

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navigation />
      {children}
    </>
  );
} 