import { LucideProvider } from 'lucide-react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'glassform/styles.css';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Icons default to the surrounding font size (1em), like text; pass `size` for a fixed size. */}
    <LucideProvider size="1em">
      <App />
    </LucideProvider>
  </StrictMode>,
);
