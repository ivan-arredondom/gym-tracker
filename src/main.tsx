import './global.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { seedIfNeeded } from './db/seed';
import { App } from './App';

seedIfNeeded().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
});
