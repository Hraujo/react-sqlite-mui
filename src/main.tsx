import { createRoot } from 'react-dom/client'
import './styles/global.css'
import { MainRoutes } from './routes';
import { BrowserRouter } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar.tsx';

createRoot(document.getElementById('root')!).render(
  <>
    <BrowserRouter>
      <Navbar />
      <MainRoutes />
    </BrowserRouter>
  </>
)
