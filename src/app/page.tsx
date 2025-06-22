'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from './supabaseClient';
import ProfileDropdown from './components/ProfileDropdown';

export default function Home() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      setUserEmail(session?.user?.email || null);
      setLoading(false);
    };
    checkAuth();
  }, []);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      router.push('/dashboard');
    } else {
      router.push('/signup');
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Error logging out:', error);
    else {
      setIsAuthenticated(false);
      setUserEmail(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0A0A0A' }}>
        <div className="flex flex-col items-center space-y-8">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-[#1A1A1A] border-t-[#00C08B]"></div>
            <div className="absolute inset-0 rounded-full animate-pulse" style={{ background: 'linear-gradient(135deg, rgba(0, 192, 139, 0.1) 0%, rgba(0, 176, 213, 0.1) 100%)' }}></div>
          </div>
          <p className="text-white text-xl font-medium animate-pulse" style={{ fontWeight: 500, letterSpacing: '-0.02em' }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen overflow-hidden" style={{ backgroundColor: '#0A0A0A' }}>
      {/* Animated Bubbles Background - keeping existing bubbles code */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Bubble 1 */}
        <div 
          className="absolute rounded-full animate-float-slow opacity-20 blur-3xl"
          style={{
            width: '300px',
            height: '300px',
            background: 'linear-gradient(135deg, rgba(0, 192, 139, 0.4) 0%, rgba(0, 176, 213, 0.4) 100%)',
            top: '10%',
            left: '5%',
            animationDelay: '0s',
            animationDuration: '20s'
          }}
        ></div>
        
        {/* Bubble 2 */}
        <div 
          className="absolute rounded-full animate-float-medium opacity-15 blur-3xl"
          style={{
            width: '400px',
            height: '400px',
            background: 'linear-gradient(135deg, rgba(34, 211, 165, 0.3) 0%, rgba(0, 192, 139, 0.3) 100%)',
            top: '20%',
            right: '10%',
            animationDelay: '5s',
            animationDuration: '25s'
          }}
        ></div>
        
        {/* Bubble 3 */}
        <div 
          className="absolute rounded-full animate-float-fast opacity-25 blur-2xl"
          style={{
            width: '200px',
            height: '200px',
            background: 'linear-gradient(135deg, rgba(0, 176, 213, 0.5) 0%, rgba(34, 211, 165, 0.5) 100%)',
            top: '60%',
            left: '15%',
            animationDelay: '10s',
            animationDuration: '15s'
          }}
        ></div>
        
        {/* Bubble 4 */}
        <div 
          className="absolute rounded-full animate-float-slow opacity-20 blur-3xl"
          style={{
            width: '350px',
            height: '350px',
            background: 'linear-gradient(135deg, rgba(0, 192, 139, 0.3) 0%, rgba(0, 176, 213, 0.3) 100%)',
            bottom: '10%',
            right: '5%',
            animationDelay: '15s',
            animationDuration: '22s'
          }}
        ></div>
        
        {/* Bubble 5 */}
        <div 
          className="absolute rounded-full animate-float-medium opacity-15 blur-3xl"
          style={{
            width: '250px',
            height: '250px',
            background: 'linear-gradient(135deg, rgba(34, 211, 165, 0.4) 0%, rgba(0, 192, 139, 0.4) 100%)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            animationDelay: '8s',
            animationDuration: '18s'
          }}
        ></div>
        
        {/* Bubble 6 */}
        <div 
          className="absolute rounded-full animate-float-fast opacity-10 blur-3xl"
          style={{
            width: '180px',
            height: '180px',
            background: 'linear-gradient(135deg, rgba(0, 176, 213, 0.6) 0%, rgba(34, 211, 165, 0.6) 100%)',
            bottom: '30%',
            left: '30%',
            animationDelay: '3s',
            animationDuration: '12s'
          }}
        ></div>
        
        {/* Bubble 7 */}
        <div 
          className="absolute rounded-full animate-float-slow opacity-20 blur-2xl"
          style={{
            width: '320px',
            height: '320px',
            background: 'linear-gradient(135deg, rgba(0, 192, 139, 0.3) 0%, rgba(34, 211, 165, 0.3) 100%)',
            top: '5%',
            right: '40%',
            animationDelay: '12s',
            animationDuration: '28s'
          }}
        ></div>
        
        {/* Bubble 8 */}
        <div 
          className="absolute rounded-full animate-float-medium opacity-15 blur-3xl"
          style={{
            width: '280px',
            height: '280px',
            background: 'linear-gradient(135deg, rgba(0, 176, 213, 0.4) 0%, rgba(0, 192, 139, 0.4) 100%)',
            bottom: '40%',
            right: '20%',
            animationDelay: '6s',
            animationDuration: '20s'
          }}
        ></div>
      </div>

      {/* Navigation */}
      <nav className="backdrop-blur-xl border-b sticky top-0 z-50" style={{ backgroundColor: 'rgba(10, 10, 10, 0.9)', borderBottomColor: 'rgba(255, 255, 255, 0.08)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-4 md:py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #00C08B 0%, #00B0D5 100%)' }}>
                <svg className="w-3 h-3 sm:w-5 sm:h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white" style={{ fontWeight: 700, letterSpacing: '-0.02em' }}>
                Birthday<span style={{ color: '#22D3A5' }}>Reminder</span>
              </h1>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              {isAuthenticated ? (
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="px-3 py-2 sm:px-6 sm:py-3 text-sm sm:text-base text-white rounded-full font-semibold transition-all duration-300 transform hover:scale-105 border"
                    style={{ 
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                      backgroundColor: 'transparent'
                    }}
                  >
                    Dashboard
                  </button>
                  <ProfileDropdown userEmail={userEmail} />
                </div>
              ) : (
                <>
                  <button
                    onClick={() => router.push('/login')}
                    className="px-3 py-2 sm:px-6 sm:py-3 text-sm sm:text-base text-white rounded-full font-semibold transition-all duration-300 transform hover:scale-105 border"
                    style={{ 
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                      backgroundColor: 'transparent'
                    }}
                  >
                    Sign In
                  </button>
                
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 md:px-8 py-16 sm:py-24 md:py-32 max-w-7xl mx-auto text-center z-10">
        <div className="relative z-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold text-white mb-6 sm:mb-8 md:mb-12 leading-[0.9]" style={{ fontWeight: 800, letterSpacing: '-0.04em' }}>
            Never Miss a{' '}
            <br />
            <span style={{ background: 'linear-gradient(135deg, #00C08B 0%, #00B0D5 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Birthday
            </span>{' '}
            Again
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed max-w-3xl lg:max-w-5xl mx-auto mb-8 sm:mb-12 md:mb-16 px-4" style={{ color: 'rgba(255, 255, 255, 0.7)', fontWeight: 400, lineHeight: 1.6 }}>
            The easiest way to collect, manage and track your friends' birthdays. 
            Generate shareable links, let everyone add their dates, and export calendar files 
            and get it send via email. Simple, efficient, never forgotten.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center px-4">
            <button
              onClick={handleGetStarted}
              className="w-full sm:w-auto px-8 sm:px-12 py-4 sm:py-5 text-lg sm:text-xl font-semibold rounded-full transition-all duration-300 transform hover:scale-105"
              style={{ 
                background: 'linear-gradient(135deg, #00C08B 0%, #00B0D5 100%)',
                color: '#FFFFFF',
                boxShadow: '0 8px 32px rgba(0, 192, 139, 0.4)'
              }}
            >
              Get Started Free
            </button>
            
            <button 
              onClick={() => {
                document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-6 sm:px-8 py-4 sm:py-5 text-lg sm:text-xl font-semibold rounded-full border-2 transition-all duration-300 transform hover:scale-105"
              style={{ 
                borderColor: 'rgba(255, 255, 255, 0.2)',
                color: 'rgba(255, 255, 255, 0.9)',
                backgroundColor: 'transparent'
              }}
            >
              See How It Works
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="how-it-works" className="px-4 sm:px-6 md:px-8 py-16 sm:py-24 md:py-32 relative z-10" style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 md:mb-24">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium mb-6 sm:mb-8 border" 
                 style={{ 
                   background: 'rgba(0, 192, 139, 0.1)', 
                   color: '#22D3A5',
                   borderColor: 'rgba(0, 192, 139, 0.2)'
                 }}>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
              <span>How It Works</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 md:mb-8" style={{ fontWeight: 800, letterSpacing: '-0.03em' }}>
              Three Simple Steps
            </h2>
            <p className="text-lg sm:text-xl max-w-4xl mx-auto px-4" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              From setup to celebration - it's that easy
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 md:gap-12 px-4">
            {/* Step 1 */}
            <div className="backdrop-blur-sm rounded-3xl p-6 sm:p-8 md:p-12 border transition-all duration-500 hover:scale-105 text-center group" 
                 style={{ 
                   backgroundColor: 'rgba(255, 255, 255, 0.02)', 
                   borderColor: 'rgba(255, 255, 255, 0.08)',
                   boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                 }}>
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8 group-hover:scale-110 transition-transform duration-300" 
                   style={{ background: 'rgba(0, 192, 139, 0.15)' }}>
                <svg className="w-8 h-8 sm:w-10 sm:h-10" style={{ color: '#22D3A5' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6" style={{ fontWeight: 700, letterSpacing: '-0.02em' }}>Generate Link</h3>
              <p className="text-base sm:text-lg leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Create a secure shareable link in seconds and send it to your friends and family.
              </p>
            </div>

            {/* Step 2 */}
            <div className="backdrop-blur-sm rounded-3xl p-6 sm:p-8 md:p-12 border transition-all duration-500 hover:scale-105 text-center group" 
                 style={{ 
                   backgroundColor: 'rgba(255, 255, 255, 0.02)', 
                   borderColor: 'rgba(255, 255, 255, 0.08)',
                   boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                 }}>
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8 group-hover:scale-110 transition-transform duration-300" 
                   style={{ background: 'rgba(0, 192, 139, 0.15)' }}>
                <svg className="w-8 h-8 sm:w-10 sm:h-10" style={{ color: '#22D3A5' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6" style={{ fontWeight: 700, letterSpacing: '-0.02em' }}>Collect Birthdays</h3>
              <p className="text-base sm:text-lg leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Everyone adds their birthday through your link - no registration or app downloads required.
              </p>
            </div>

            {/* Step 3 */}
            <div className="backdrop-blur-sm rounded-3xl p-6 sm:p-8 md:p-12 border transition-all duration-500 hover:scale-105 text-center group" 
                 style={{ 
                   backgroundColor: 'rgba(255, 255, 255, 0.02)', 
                   borderColor: 'rgba(255, 255, 255, 0.08)',
                   boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                 }}>
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8 group-hover:scale-110 transition-transform duration-300" 
                   style={{ background: 'rgba(0, 192, 139, 0.15)' }}>
                <svg className="w-8 h-8 sm:w-10 sm:h-10" style={{ color: '#22D3A5' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.828 7l2.828 2.828M9 11a3 3 0 100-6 3 3 0 000 6zm-7 4a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 018.07 9H16a2 2 0 012 2v9a2 2 0 01-2 2H8.07a2 2 0 01-1.664-.89L5.594 20.11A2 2 0 014 19.17V15z" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6" style={{ fontWeight: 700, letterSpacing: '-0.02em' }}>Never Forget</h3>
              <p className="text-base sm:text-lg leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Export to your calendar and receive it via email.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 md:px-8 py-16 sm:py-24 md:py-32 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <div className="backdrop-blur-sm rounded-3xl p-8 sm:p-12 md:p-16 border mx-4" 
               style={{ 
                 backgroundColor: 'rgba(255, 255, 255, 0.02)', 
                 borderColor: 'rgba(255, 255, 255, 0.08)',
                 boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
               }}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 md:mb-8" style={{ fontWeight: 800, letterSpacing: '-0.03em' }}>
              Ready to Get Started?
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 md:mb-12" style={{ color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.6 }}>
              Join thousands who never miss a birthday anymore. 
              Start collecting today - it's completely free.
            </p>
            <button
              onClick={handleGetStarted}
              className="w-full sm:w-auto px-8 sm:px-12 py-4 sm:py-5 text-lg sm:text-xl font-semibold rounded-full transition-all duration-300 transform hover:scale-105"
              style={{ 
                background: 'linear-gradient(135deg, #00C08B 0%, #00B0D5 100%)',
                color: '#FFFFFF',
                boxShadow: '0 8px 32px rgba(0, 192, 139, 0.4)'
              }}
            >
              Sign Up Free
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="backdrop-blur-sm border-t relative z-10" style={{ backgroundColor: 'rgba(10, 10, 10, 0.9)', borderTopColor: 'rgba(255, 255, 255, 0.08)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #00C08B 0%, #00B0D5 100%)' }}>
                <svg className="w-3 h-3 sm:w-5 sm:h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-white" style={{ fontWeight: 700, letterSpacing: '-0.02em' }}>
                Birthday<span style={{ color: '#22D3A5' }}>Reminder</span>
              </div>
            </div>
            <p className="text-base sm:text-lg mb-2 text-white" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              © 2025 BirthdayReminder. Never miss a birthday again.
            </p>
            <p className="text-sm sm:text-base" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
              Builed with love in Madrid by <span style={{ color: '#22D3A5' }}>Carl Lichtl</span>
            </p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(30px, -30px) rotate(90deg); }
          50% { transform: translate(-20px, -60px) rotate(180deg); }
          75% { transform: translate(-40px, -20px) rotate(270deg); }
        }
        
        @keyframes float-medium {
          0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
          33% { transform: translate(-50px, -40px) rotate(120deg) scale(1.1); }
          66% { transform: translate(40px, -80px) rotate(240deg) scale(0.9); }
        }
        
        @keyframes float-fast {
          0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
          20% { transform: translate(60px, -20px) rotate(72deg) scale(1.2); }
          40% { transform: translate(-30px, -70px) rotate(144deg) scale(0.8); }
          60% { transform: translate(-70px, -10px) rotate(216deg) scale(1.1); }
          80% { transform: translate(20px, -50px) rotate(288deg) scale(0.9); }
        }
        
        .animate-float-slow {
          animation: float-slow infinite ease-in-out;
        }
        
        .animate-float-medium {
          animation: float-medium infinite ease-in-out;
        }
        
        .animate-float-fast {
          animation: float-fast infinite ease-in-out;
        }
      `}</style>
    </main>
  );
}