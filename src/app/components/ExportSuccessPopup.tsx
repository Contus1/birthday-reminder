'use client';

import { useState } from 'react';

interface ExportSuccessPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ExportSuccessPopup({ isOpen, onClose }: ExportSuccessPopupProps) {
  const [copied, setCopied] = useState(false);

  const copyPayPal = async () => {
    try {
      await navigator.clipboard.writeText('carllichtl');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
      <div className="backdrop-blur-sm rounded-2xl shadow-2xl max-w-xs w-full mx-auto animate-scale-in relative border" 
           style={{ 
             backgroundColor: 'rgba(10, 10, 10, 0.95)', 
             borderColor: 'rgba(255, 255, 255, 0.1)',
             boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
           }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 transition-colors p-1 rounded-lg hover:bg-white hover:bg-opacity-10"
          style={{ color: 'rgba(255, 255, 255, 0.7)' }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Success Header */}
        <div className="text-center pt-8 pb-4 px-6">
          <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" 
               style={{ background: 'rgba(34, 211, 165, 0.15)' }}>
            <svg className="w-7 h-7" style={{ color: '#22D3A5' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <h2 className="text-xl font-bold text-white mb-2" style={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
            Success! 🎉
          </h2>
          
          <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            Calendar <strong style={{ color: '#22D3A5' }}>downloaded</strong> and sent to your <strong style={{ color: '#22D3A5' }}>email</strong>!
          </p>

          {/* Download & Email Confirmation */}
          <div className="rounded-xl p-3 mb-4 text-left border" 
               style={{ backgroundColor: 'rgba(34, 211, 165, 0.1)', borderColor: 'rgba(34, 211, 165, 0.2)' }}>
            <div className="flex items-center space-x-2 text-xs mb-2" style={{ color: '#22D3A5' }}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="font-medium">File downloaded</span>
            </div>
            <div className="flex items-center space-x-2 text-xs" style={{ color: '#22D3A5' }}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="font-medium">Sent to email</span>
            </div>
          </div>
        </div>

        {/* Support Section */}
        <div className="mx-4 rounded-xl p-4 mb-4 border" 
             style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
          <div className="text-center">
            <div className="w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2" 
                 style={{ background: 'rgba(255, 107, 107, 0.15)' }}>
              <svg className="w-4 h-4" style={{ color: '#FF6B6B' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            
            <h3 className="text-sm font-bold text-white mb-2" style={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
              Love BirthdayReminder?
            </h3>
            
            <p className="text-xs leading-relaxed mb-3" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Support this project to keep it running!
            </p>

            {/* PayPal Info */}
            <div className="rounded-lg p-2 border mb-2" 
                 style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
              <p className="text-xs mb-1" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>PayPal</p>
              <div className="flex items-center justify-center space-x-2">
                <code className="text-xs font-mono px-2 py-1 rounded" 
                      style={{ color: '#22D3A5', backgroundColor: 'rgba(34, 211, 165, 0.1)' }}>
                  carllichtl
                </code>
                <button
                  onClick={copyPayPal}
                  className="text-xs font-medium transition-colors duration-200 hover:text-white"
                  style={{ color: '#22D3A5' }}
                >
                  {copied ? '✓' : 'Copy'}
                </button>
              </div>
            </div>

            <p className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
              Thank you! 💝
            </p>
          </div>
        </div>

        {/* Close Button */}
        <div className="px-4 pb-4">
          <button
            onClick={onClose}
            className="w-full font-semibold py-3 rounded-full transition-all duration-300 transform hover:scale-105"
            style={{ 
              background: 'linear-gradient(135deg, #00C08B 0%, #00B0D5 100%)',
              color: '#FFFFFF',
              boxShadow: '0 8px 32px rgba(0, 192, 139, 0.3)'
            }}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}