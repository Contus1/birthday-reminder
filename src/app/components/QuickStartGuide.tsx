'use client';

import { useState } from 'react';

interface QuickStartGuideProps {
  variant?: 'home' | 'dashboard';
}

export default function QuickStartGuide({ variant = 'home' }: QuickStartGuideProps) {
  const [isOpen, setIsOpen] = useState(false);

  const steps = variant === 'home' ? [
    {
      number: 1,
      title: "Sign Up Instantly",
      description: "Create your free account with email, Google, or Apple in one click.",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    {
      number: 2,
      title: "Collect Birthdays",
      description: "Add birthdays yourself or generate an invite link for friends to submit theirs.",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      )
    },
    {
      number: 3,
      title: "Add to Your Calendar",
      description: "Choose email invite for one-tap import or subscribe for live auto-sync.",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      )
    }
  ] : [
    {
      number: 1,
      title: "Add or Import",
      description: "Use “+ Add Birthday” or paste your friends’ invite link to import entries.",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      )
    },
    {
      number: 2,
      title: "Share Your Link",
      description: "Generate and send your personal invite link via chat, email, or social media.",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
        </svg>
      )
    },
    {
      number: 3,
      title: "Export or Subscribe",
      description: "Email invites for one-tap adds or subscribe with webcal:// for live updates.",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      )
    }
  ];

  return (
    <div className="relative inline-block">
      {/* Info Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-1.5 rounded-full border transition-all duration-300 hover:scale-105 ${
          variant === 'dashboard' ? 'px-2 py-1 text-xs' : 'px-2.5 py-1.5 text-xs'
        }`}
        style={{
          backgroundColor: 'rgba(34, 211, 165, 0.1)',
          borderColor: 'rgba(34, 211, 165, 0.3)',
          color: '#22D3A5'
        }}
      >
        <span className="font-medium whitespace-nowrap">ⓘ How it works</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 md:absolute md:inset-auto">
          <div
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm md:hidden"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 md:absolute md:top-full md:mt-2 md:left-1/2 md:transform md:-translate-x-1/2 md:w-80 lg:w-96">
            <div
              className="backdrop-blur-xl rounded-t-3xl md:rounded-2xl p-5 md:p-6 border max-h-[70vh] overflow-y-auto"
              style={{
                backgroundColor: 'rgba(10, 10, 10, 0.95)',
                borderColor: 'rgba(34, 211, 165, 0.3)',
                boxShadow: '0 -10px 60px rgba(0, 0, 0, 0.5) md:0 20px 60px rgba(0, 0, 0, 0.5)'
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base md:text-lg font-bold" style={{ color: '#22D3A5' }}>
                  {variant === 'home' ? 'Quick Start' : ' Guide'}
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-full transition-colors duration-200"
                  style={{ color: 'rgba(255, 255, 255, 0.5)' }}
                >
                  
                </button>
              </div>
              <div className="space-y-3">
                {steps.map((step) => (
                  <div key={step.number} className="flex items-start space-x-3">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                      style={{ backgroundColor: '#22D3A5', color: '#000' }}
                    >
                      {step.number}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <div style={{ color: '#22D3A5' }}>{step.icon}</div>
                        <h4 className="text-sm font-semibold text-white">{step.title}</h4>
                      </div>
                      <p className="text-xs leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t" style={{ borderColor: 'rgba(34, 211, 165, 0.2)' }}>
                <p className="text-xs text-center" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                  {variant === 'home'
                    ? '✨ Free, no limits, works with any calendar'
                    : '🔄 Pro tip: subscription keeps it always in sync'}
                </p>
              </div>
              <div className="md:hidden mt-3 flex justify-center">
                <div className="w-10 h-0.5 rounded-full" style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
