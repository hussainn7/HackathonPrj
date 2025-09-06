import React, { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Scroll, BookOpen, Search, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setUserEmail(localStorage.getItem('userEmail'));
    // Listen for changes in localStorage (e.g., login/logout in other tabs)
    const handler = () => setUserEmail(localStorage.getItem('userEmail'));
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  return (
    <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="glass-card px-6 py-3 rounded-full backdrop-blur-lg bg-white/20 border border-white/30">
        <div className="flex items-center gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Scroll className="w-5 h-5 text-primary" />
            </div>
            <span className="font-bold text-foreground font-cinzel">Alexandria</span>
          </div>
          {/* Navigation buttons */}
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm"
              className="text-foreground hover:bg-white/20 hover:text-primary transition-colors"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Library
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-foreground hover:bg-white/20 hover:text-primary transition-colors"
            >
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
            {/* Auth section */}
            {!userEmail ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-2"
                  onClick={() => navigate('/login')}
                >
                  Login
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  className="ml-2"
                  onClick={() => navigate('/create-account')}
                >
                  Create Account
                </Button>
              </>
            ) : (
              <div className="flex items-center gap-2 cursor-pointer select-none">
                <User className="w-6 h-6 text-muted-foreground opacity-60" />
                <UserMenu userEmail={userEmail} />
              </div>
            )}
          </div>
          {/* Blank user icon now appears left of the email/user section */}
        </div>
      </div>
    </nav>
  );
};


// UserMenu component for dropdown and sign out
const UserMenu: React.FC<{ userEmail: string | null }> = ({ userEmail }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    window.location.reload();
  };

  return (
    <div ref={ref} className="relative flex items-center gap-2 cursor-pointer select-none" onClick={() => setOpen((v) => !v)}>
      <span className="font-medium text-foreground text-sm">{userEmail}</span>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <button
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
            onClick={e => { e.stopPropagation(); handleSignOut(); }}
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

export default Navbar;