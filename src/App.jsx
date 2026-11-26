import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar  from './components/Navbar';
import Footer  from './components/Footer';
import Home    from './pages/Home';
import Work    from './pages/Work';
import About   from './pages/About';
import Contact from './pages/Contact';
import Admin   from './pages/admin/Admin';

import './styles/global.css';
import './styles/components.css';

function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin — no public navbar/footer */}
        <Route path="/admin/*" element={<Admin />} />

        {/* Public site */}
        <Route path="/" element={
          <PublicLayout><Home /></PublicLayout>
        } />
        <Route path="/work" element={
          <PublicLayout><Work /></PublicLayout>
        } />
        <Route path="/about" element={
          <PublicLayout><About /></PublicLayout>
        } />
        <Route path="/contact" element={
          <PublicLayout><Contact /></PublicLayout>
        } />

        {/* 404 fallback */}
        <Route path="*" element={
          <PublicLayout>
            <main style={{ paddingTop: 'var(--nav-h)', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <p className="label" style={{ color: 'var(--color-orange)', marginBottom: 'var(--space-3)' }}>404 — Not found</p>
                <h1 style={{ marginBottom: 'var(--space-5)' }}>Page not found.</h1>
                <a href="/" className="btn btn--primary">← Back home</a>
              </div>
            </main>
          </PublicLayout>
        } />
      </Routes>
    </BrowserRouter>
  );
}

