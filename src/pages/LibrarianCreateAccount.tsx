import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const LibrarianCreateAccount: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      console.log(res);
      console.log(res.json);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Account creation failed.');
      } else {
        setSuccess(true);
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background papyrus-texture flex flex-col">
      <Navbar />
      <main className="flex flex-1 items-center justify-center pt-32">
        <div className="glass-card w-full max-w-md p-8 rounded-3xl shadow-xl border border-white/30 bg-white/60 backdrop-blur-lg">
          <h2 className="mb-6 text-3xl font-bold text-center font-cinzel text-foreground">Create Librarian Account</h2>
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
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border border-primary/30 rounded-lg bg-white/80 focus:outline-none focus:ring-2 focus:ring-primary font-medium"
              required
            />
            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
            {success && <div className="text-green-600 text-sm text-center">Account created! You can now log in.</div>}
            <button
              type="submit"
              className="w-full py-3 font-semibold text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors shadow-md disabled:opacity-60"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LibrarianCreateAccount;
