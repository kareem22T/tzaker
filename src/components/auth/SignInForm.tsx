import React, { useState } from 'react';
import { ChevronLeft, Eye, EyeOff } from 'lucide-react';

// Mock Auth Context
const useAuth = () => ({
  signIn: async (email: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (email && password) {
      return { success: true };
    }
    return { success: false, message: 'Invalid credentials' };
  }
});

const SignInForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const auth = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await auth.signIn(email, password);
    setLoading(false);
    if (res.success) {
      alert('Sign in successful!');
    } else {
      setError(res.message || 'Sign in failed');
    }
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#0a1929' }}>
      {/* Left Side - Form */}
      <div className="flex flex-col flex-1">
        <div className="w-full max-w-md pt-10 mx-auto px-6">
          <button className="inline-flex items-center text-sm transition-colors gap-2" style={{ color: '#94a3b8' }}>
            <ChevronLeft className="w-5 h-5" />
            <span className="hover:opacity-80">Back to dashboard</span>
          </button>
        </div>
        
        <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto px-6">
          <div>
            <div className="mb-8">
              <h1 className="mb-2 font-bold text-3xl text-white">Sign In</h1>
              <p className="text-sm" style={{ color: '#94a3b8' }}>
                Enter your email and password to sign in to your sports dashboard!
              </p>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Email <span style={{ color: '#00ff88' }}>*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="info@gmail.com"
                  className="w-full px-4 py-3 rounded-lg border outline-none transition-all"
                  style={{
                    backgroundColor: '#111d2d',
                    borderColor: '#1e3a52',
                    color: 'white'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#00ff88'}
                  onBlur={(e) => e.target.style.borderColor = '#1e3a52'}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Password <span style={{ color: '#00ff88' }}>*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 rounded-lg border outline-none transition-all pr-12"
                    style={{
                      backgroundColor: '#111d2d',
                      borderColor: '#1e3a52',
                      color: 'white'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#00ff88'}
                    onBlur={(e) => e.target.style.borderColor = '#1e3a52'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                    style={{ color: '#94a3b8' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#00ff88'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
                  >
                    {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => setIsChecked(e.target.checked)}
                    className="w-5 h-5 rounded border-2 cursor-pointer"
                    style={{
                      backgroundColor: isChecked ? '#00ff88' : '#111d2d',
                      borderColor: isChecked ? '#00ff88' : '#1e3a52',
                      accentColor: '#00ff88'
                    }}
                  />
                  <span className="text-sm text-white">Keep me logged in</span>
                </label>
              </div>
              
              {error && (
                <p className="text-sm font-medium" style={{ color: '#ff4444' }}>
                  {error}
                </p>
              )}
              
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-3 px-6 rounded-lg font-semibold transition-all disabled:opacity-50"
                style={{
                  backgroundColor: '#00ff88',
                  color: '#0a1929'
                }}
                onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#00dd77')}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#00ff88'}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Branding */}
      <div className="hidden lg:flex items-center justify-center w-1/2 border-l relative" style={{ backgroundColor: '#111d2d', borderColor: '#1e3a52' }}>
        <div className="absolute inset-0 opacity-5">
          <div className="grid grid-cols-12 gap-4 h-full p-8">
            {[...Array(60)].map((_, i) => (
              <div key={i} className="border rounded" style={{ borderColor: '#00ff88' }}></div>
            ))}
          </div>
        </div>
        
        <div className="relative z-10 flex flex-col items-center max-w-xs gap-6">
          <div className="text-center">
            <div className="text-6xl font-black mb-4" style={{ color: '#00ff88' }}>
              WATCH IT
            </div>
            <div className="text-xl font-semibold text-white">
              Sports Dashboard
            </div>
          </div>
          <p className="text-center font-semibold" style={{ color: '#00ff88' }}>
            Track. Analyze. Dominate.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInForm;