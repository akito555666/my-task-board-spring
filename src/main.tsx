import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// @ts-ignore: allow importing CSS for side effects without types
import './style.css';
import { App } from './App';

createRoot(document.getElementById('root')!).render(<App />);
