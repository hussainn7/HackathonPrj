import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const LibrarianLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Login failed.');
      } else {
  // Store token and email for persistent login
  localStorage.setItem('token', data.token);
  localStorage.setItem('userEmail', email);
  window.location.href = '/';
      }
    } catch (err) {
      setError('Network error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background papyrus-texture flex flex-col">
      <Navbar />
      <main className="flex flex-1 items-center justify-center pt-32">
        <div className="glass-card w-full max-w-md p-8 rounded-3xl shadow-xl border border-white/30 bg-white/60 backdrop-blur-lg">
          <h2 className="mb-6 text-3xl font-bold text-center font-cinzel text-foreground">Librarian Login</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-primary/30 rounded-lg bg-white/80 focus:outline-none focus:ring-2 focus:ring-primary font-medium"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-primary/30 rounded-lg bg-white/80 focus:outline-none focus:ring-2 focus:ring-primary font-medium"
              required
            />
            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
            <button
              type="submit"
              className="w-full py-3 font-semibold text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors shadow-md disabled:opacity-60"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LibrarianLogin;
