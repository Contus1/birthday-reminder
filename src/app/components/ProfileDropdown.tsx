'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../supabaseClient';

interface ProfileDropdownProps {
  userEmail: string | null;
}

export default function ProfileDropdown({ userEmail }: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<{
    email: string;
    created_at: string;
    full_name?: string;
  } | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserProfile({
          email: user.email || '',
          created_at: user.created_at,
          full_name: user.user_metadata?.full_name || user.user_metadata?.name
        });
      }
    };

    fetchUserProfile();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error);
    } else {
      router.push('/');
    }
  };

  const getInitials = (email: string, fullName?: string) => {
    if (fullName) {
      return fullName
        .split(' ')
        .map(name => name.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return email.charAt(0).toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!userProfile) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 p-2 rounded-full transition-all duration-300 hover:bg-white hover:bg-opacity-10"
      >
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
          style={{ background: 'linear-gradient(135deg, #00C08B 0%, #00B0D5 100%)' }}
        >
          {getInitials(userProfile.email, userProfile.full_name)}
        </div>
        <div className="hidden md:block text-left">
          <p className="text-sm font-semibold text-white truncate max-w-32">
            {userProfile.full_name || userProfile.email.split('@')[0]}
          </p>
          <p className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
            {userProfile.email.length > 20 ? `${userProfile.email.slice(0, 20)}...` : userProfile.email}
          </p>
        </div>
        <svg 
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          style={{ color: 'rgba(255, 255, 255, 0.7)' }}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-80 backdrop-blur-xl rounded-2xl border shadow-2xl z-50 overflow-hidden"
          style={{ 
            backgroundColor: 'rgba(10, 10, 10, 0.95)', 
            borderColor: 'rgba(255, 255, 255, 0.1)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
          }}
        >
          {/* Profile Header */}
          <div className="p-6 border-b" style={{ borderBottomColor: 'rgba(255, 255, 255, 0.1)' }}>
            <div className="flex items-center space-x-4">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg"
                style={{ background: 'linear-gradient(135deg, #00C08B 0%, #00B0D5 100%)' }}
              >
                {getInitials(userProfile.email, userProfile.full_name)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-white truncate" style={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
                  {userProfile.full_name || 'Welcome!'}
                </h3>
                <p className="text-sm truncate" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  {userProfile.email}
                </p>
                <div className="flex items-center space-x-2 mt-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#22D3A5' }}></div>
                  <span className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                    Member since {formatDate(userProfile.created_at)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="px-6 py-4 border-b" style={{ borderBottomColor: 'rgba(255, 255, 255, 0.1)' }}>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-lg font-bold" style={{ background: 'linear-gradient(135deg, #00C08B 0%, #00B0D5 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  --
                </div>
                <div className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Birthdays</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold" style={{ background: 'linear-gradient(135deg, #00C08B 0%, #00B0D5 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  --
                </div>
                <div className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Exports</div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <button
              onClick={() => {
                setIsOpen(false);
                router.push('/profile');
              }}
              className="w-full px-6 py-3 text-left flex items-center space-x-3 transition-all duration-200 hover:bg-white hover:bg-opacity-5"
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-medium text-white">Edit Profile</div>
                <div className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Update your information</div>
              </div>
            </button>

            

            <button
              onClick={() => {
                setIsOpen(false);
                router.push('/dashboard/exported');
              }}
              className="w-full px-6 py-3 text-left flex items-center space-x-3 transition-all duration-200 hover:bg-white hover:bg-opacity-5"
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-medium text-white">Export History</div>
                <div className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>View past exports</div>
              </div>
            </button>
          </div>

          {/* Logout Section */}
          <div className="border-t p-2" style={{ borderTopColor: 'rgba(255, 255, 255, 0.1)' }}>
            <button
              onClick={handleLogout}
              className="w-full px-6 py-3 text-left flex items-center space-x-3 transition-all duration-200 hover:bg-red-500 hover:bg-opacity-10 rounded-lg"
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(255, 107, 107, 0.15)' }}>
                <svg className="w-4 h-4" style={{ color: '#FF6B6B' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-medium" style={{ color: '#FF6B6B' }}>Sign Out</div>
                <div className="text-xs" style={{ color: 'rgba(255, 107, 107, 0.7)' }}>Log out of your account</div>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}