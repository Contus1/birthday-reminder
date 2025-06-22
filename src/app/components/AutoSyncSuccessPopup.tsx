'use client';

interface AutoSyncSuccessPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AutoSyncSuccessPopup({ isOpen, onClose }: AutoSyncSuccessPopupProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
      <div className="backdrop-blur-sm rounded-2xl shadow-2xl max-w-md w-full mx-auto animate-scale-in relative border max-h-[90vh] overflow-y-auto" 
           style={{ 
             backgroundColor: 'rgba(10, 10, 10, 0.95)', 
             borderColor: 'rgba(255, 255, 255, 0.1)',
             boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
           }}>
        

        {/* Success Header */}
        <div className="text-center pt-8 pb-4 px-6">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" 
               style={{ background: 'rgba(34, 211, 165, 0.15)' }}>
            <svg className="w-8 h-8" style={{ color: '#22D3A5' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          
          <h2 className="text-xl font-bold text-white mb-2" style={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
            Auto-Sync Activated! 🎉
          </h2>
          
          <p className="text-sm leading-relaxed mb-6" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            Your calendar will now <strong style={{ color: '#22D3A5' }}>automatically update</strong> when birthdays are added or changed!
          </p>
        </div>

        {/* Step-by-Step Instructions */}
        <div className="px-6 mb-6">
          <h3 className="text-lg font-bold text-white mb-4" style={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
            What happens next:
          </h3>
          
          <div className="space-y-4">
            {/* Step 1 */}
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold" 
                   style={{ background: 'linear-gradient(135deg, #00C08B 0%, #00B0D5 100%)', color: '#FFFFFF' }}>
                1
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white mb-1">Calendar app should open automatically</h4>
                <p className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Your device's calendar app will ask if you want to subscribe to "BirthdayReminder Calendar"
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold" 
                   style={{ background: 'linear-gradient(135deg, #00C08B 0%, #00B0D5 100%)', color: '#FFFFFF' }}>
                2
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white mb-1">Click "Subscribe" or "Add"</h4>
                <p className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Confirm the subscription in your calendar app (iOS Calendar, Google Calendar, Outlook, etc.)
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold" 
                   style={{ background: 'linear-gradient(135deg, #00C08B 0%, #00B0D5 100%)', color: '#FFFFFF' }}>
                3
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white mb-1">Wait for sync</h4>
                <p className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Birthdays will appear in your calendar. Some apps like iOS Calendar can take up to 1 day to sync.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Important Notice */}
        <div className="mx-6 rounded-xl p-4 mb-6 border" 
             style={{ backgroundColor: 'rgba(255, 193, 7, 0.1)', borderColor: 'rgba(255, 193, 7, 0.2)' }}>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" 
                 style={{ backgroundColor: '#FFC107' }}>
              <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-bold mb-1" style={{ color: '#FFC107' }}>
                Important:
              </h4>
              <p className="text-xs leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                <strong>iOS users:</strong> It can take up to 24 hours for birthdays to appear in your Calendar app. 
                This is normal! The sync happens automatically in the background.
              </p>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="mx-6 rounded-xl p-4 mb-6 border" 
             style={{ backgroundColor: 'rgba(34, 211, 165, 0.1)', borderColor: 'rgba(34, 211, 165, 0.2)' }}>
          <h4 className="text-sm font-bold mb-3" style={{ color: '#22D3A5' }}>
            ✨ Auto-Sync Benefits:
          </h4>
          <ul className="space-y-2 text-xs" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            <li className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#22D3A5' }}></div>
              <span>New birthdays automatically appear in your calendar</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#22D3A5' }}></div>
              <span>Updates sync without re-downloading files</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#22D3A5' }}></div>
              <span>Works with all major calendar apps</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#22D3A5' }}></div>
              <span>Set once, forget about it!</span>
            </li>
          </ul>
        </div>

        {/* Support Section */}
        <div className="mx-6 rounded-xl p-4 mb-6 border" 
             style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
          <div className="text-center">
            <div className="w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2" 
                 style={{ background: 'rgba(255, 107, 107, 0.15)' }}>
              <svg className="w-4 h-4" style={{ color: '#FF6B6B' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            
            <h3 className="text-sm font-bold text-white mb-2" style={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
              Love Auto-Sync?
            </h3>
            
            <p className="text-xs leading-relaxed mb-3" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Support this project to keep features like this running!
            </p>

            {/* PayPal Link */}
            <a
              href="https://www.paypal.me/carllichtl"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block w-full rounded-lg p-3 border mb-2 transition-all duration-300 transform hover:scale-105 hover:border-opacity-30"
              style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.05)', 
                borderColor: 'rgba(255, 255, 255, 0.1)'
              }}
            >
              <div className="flex items-center justify-center space-x-3">
                <div className="w-6 h-6 rounded flex items-center justify-center" 
                     style={{ backgroundColor: '#0070BA' }}>
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h8.418c2.266 0 3.497.24 4.312.745C20.637 1.814 21.359 3.138 21.359 5.082c0 2.516-1.31 4.273-4.147 5.588-1.877.869-4.373 1.306-7.417 1.306H7.342a.75.75 0 0 0-.744.668l-.673 4.262c-.043.272-.26.471-.537.471z"/>
                    <path d="M16.5 0C20.09 0 23 2.91 23 6.5S20.09 13 16.5 13 10 10.09 10 6.5 12.91 0 16.5 0z" opacity="0.6"/>
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-xs mb-1" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Support via PayPal</p>
                  <p className="text-xs font-medium" style={{ color: '#22D3A5' }}>
                    paypal.me/carllichtl
                  </p>
                </div>
                <svg className="w-4 h-4 flex-shrink-0" style={{ color: 'rgba(255, 255, 255, 0.4)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </div>
            </a>

            <p className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
              Thank you! 💝
            </p>
          </div>
        </div>

        {/* Close Button */}
        <div className="px-6 pb-6">
          <button
            onClick={onClose}
            className="w-full font-semibold py-3 rounded-full transition-all duration-300 transform hover:scale-105"
            style={{ 
              background: 'linear-gradient(135deg, #00C08B 0%, #00B0D5 100%)',
              color: '#FFFFFF',
              boxShadow: '0 8px 32px rgba(0, 192, 139, 0.3)'
            }}
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
}