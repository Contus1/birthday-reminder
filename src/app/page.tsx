'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from './supabaseClient';

export default function Home() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      setLoading(false);
    };
    checkAuth();
  }, []);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Error logging out:', error);
    else {
      setIsAuthenticated(false);
      // Optionally redirect to login page
      // router.push('/login');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-white">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-200 border-t-pink-500"></div>
          <p className="text-gray-600 animate-pulse">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white overflow-hidden">
      {/* Navigation */}
      <nav className="relative z-10 px-6 py-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold text-gray-900 animate-fade-in">
            Birthday<span className="text-pink-500">Reminder</span>
          </div>
          
          <div className="flex items-center space-x-4 animate-fade-in">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.push('/dashboard')}
                  className="btn-outline"
                >
                  Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="btn-secondary"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => router.push('/login')}
                  className="btn-outline"
                >
                  Sign In
                </button>
                <button
                  onClick={() => router.push('/signup')}
                  className="btn-primary"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 py-20 max-w-6xl mx-auto text-center">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 right-10 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-yellow-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight animate-fade-in-up">
            Welcome to{' '}
            <span className="gradient-text">Birthday</span>
            <span className="text-gray-900">Reminder</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed max-w-4xl mx-auto font-light animate-fade-in-up text-balance" style={{animationDelay: '0.2s'}}>
            The easiest way to collect, manage and never miss your friends' birthdays. 
            Simply generate a shareable link, let everyone add their date, and export a 
            ready-to-import calendar file with one click. Finally, sit back and let automatic 
            email reminders keep you on track!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up" style={{animationDelay: '0.4s'}}>
            <button
              onClick={handleGetStarted}
              className="btn-primary text-lg px-12 py-5 shadow-2xl shadow-pink-500/25"
            >
              Get Started Free
            </button>
            
            <button className="btn-outline text-lg px-8 py-5">
              See How It Works
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 animate-fade-in-up">
              How it works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-fade-in-up" style={{animationDelay: '0.1s'}}>
              Three simple steps to never forget a birthday again
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {/* Step 1 */}
            <div className="feature-card text-center animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-pink-500">1</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Generate Link</h3>
              <p className="text-gray-600 leading-relaxed">
                Create a shareable link in seconds and send it to your friends and family.
              </p>
            </div>

            {/* Step 2 */}
            <div className="feature-card text-center animate-fade-in-up" style={{animationDelay: '0.3s'}}>
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-pink-500">2</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Collect Birthdays</h3>
              <p className="text-gray-600 leading-relaxed">
                Everyone adds their birthday through your link - no registration required.
              </p>
            </div>

            {/* Step 3 */}
            <div className="feature-card text-center animate-fade-in-up" style={{animationDelay: '0.4s'}}>
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-pink-500">3</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Never Forget</h3>
              <p className="text-gray-600 leading-relaxed">
                Export to your calendar and get automatic email reminders before each birthday.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-24 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in-up">
            Ready to get started?
          </h2>
          <p className="text-xl text-gray-300 mb-8 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
            Join thousands of people who never miss a birthday anymore.
          </p>
          <button
            onClick={handleGetStarted}
            className="btn-primary text-lg px-12 py-5 shadow-2xl shadow-pink-500/25 animate-fade-in-up"
            style={{animationDelay: '0.2s'}}
          >
            Start for Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-16 bg-gray-900 text-white border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="text-2xl font-bold mb-4">
              Birthday<span className="text-pink-500">Reminder</span>
            </div>
            <p className="text-gray-400">
              © 2025 BirthdayReminder. Never miss a birthday again. By Carl Lichtl
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}