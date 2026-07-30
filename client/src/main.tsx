import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import AppRouter from '@/components/Router';
import '@/styles/global.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppRouter />
  </StrictMode>
);
