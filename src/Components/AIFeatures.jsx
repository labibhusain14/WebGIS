import { useState } from 'react';
import { Bot, X, History, Wallet, MessageCircle } from 'lucide-react';
import SmartBudgeting from './SmartBudgeting';
import VirtualAssistant from './VirtualAssistant';
import PropTypes from 'prop-types';

function AIFeatures({ budgetParams, setBudgetParams, fullAddress }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeAssistant, setActiveAssistant] = useState('budgeting');

  return (
    <div className="fixed top-[75px] right-12 z-20 flex items-center space-x-2">
      {/* Tooltip - Only visible on larger screens */}
      <div className="relative bg-gray-800 text-white text-xs p-2 rounded-md max-w-xs hidden sm:block">
        Try AI Features
        <div
          className="absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0
                    border-l-8 border-t-8 border-b-8 border-transparent border-l-gray-800"
        />
      </div>

      {/* Bot Button with Continuous Animation - Fixed clickability */}
      <div className="relative ai-button-container">
        {/* Continuous sparkle effects - Placed BEHIND the button with pointer-events-none */}
        <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-blue-400 sparkle-ping pointer-events-none"></span>
        <span className="absolute -bottom-1 -left-1 h-2 w-2 rounded-full bg-purple-400 sparkle-ping-delay-300 pointer-events-none"></span>
        <span className="absolute top-1/2 -right-2 transform -translate-y-1/2 h-2 w-2 rounded-full bg-teal-400 sparkle-ping-delay-700 pointer-events-none"></span>
        <span className="absolute top-0 left-0 h-2 w-2 rounded-full bg-yellow-300 sparkle-ping-delay-500 pointer-events-none"></span>
        <span className="absolute -bottom-1 right-0 h-1 w-1 rounded-full bg-green-300 sparkle-ping-delay-1000 pointer-events-none"></span>

        {/* Rotating border glow - with pointer-events-none */}
        <div className="absolute inset-0 rounded-md border-glow pointer-events-none"></div>

        {/* Actual button - on top of animations for clickability */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative z-10 flex items-center justify-center bg-[#2C3E50] text-white
                 p-2 rounded-md shadow-lg hover:shadow-xl hover:bg-[#1F2A36] transition-colors
                 button-glow"
          title="AI Features"
        >
          <Bot size={20} className="bot-icon-animate" />
        </button>
      </div>

      {isOpen && (
        // Modal Overlay for mobile
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50 sm:bg-transparent">
          {/* Wrapper for centering on mobile, right-aligned on desktop */}
          <div
            className="
            fixed inset-0 flex items-center justify-center p-4
            sm:inset-auto sm:top-36 sm:right-14
            z-50
          "
          >
            {/* Panel container with improved styling */}
            <div
              className="
              w-full max-w-[450px]
              h-[90vh] max-h-[500px]
              bg-white shadow-xl rounded-lg border border-gray-200
              flex flex-col
              animate-fade-in
            "
            >
              {/* Header with improved styling */}
              <div className="flex justify-between items-center bg-[#2C3E50] text-white p-3 rounded-t-lg">
                <div className="flex">
                  <button className="p-1 rounded-full hover:bg-gray-700 transition-colors" title="History">
                    <History size={18} />
                  </button>
                </div>

                {/* Tabs with improved styling */}
                <div className="flex space-x-2 bg-gray-700 p-1 rounded-full">
                  <button
                    onClick={() => setActiveAssistant('budgeting')}
                    className={`
                      px-3 py-1.5 text-xs font-medium rounded-full transition-all
                      flex items-center gap-1
                      ${activeAssistant === 'budgeting' ? 'bg-blue-500 text-white' : 'text-gray-300 hover:text-white'}
                    `}
                  >
                    <Wallet size={14} />
                    <span>Smart Budgeting</span>
                  </button>
                  <button
                    onClick={() => setActiveAssistant('assistant')}
                    className={`
                      px-3 py-1.5 text-xs font-medium rounded-full transition-all
                      flex items-center gap-1
                      ${activeAssistant === 'assistant' ? 'bg-blue-500 text-white' : 'text-gray-300 hover:text-white'}
                    `}
                  >
                    <MessageCircle size={14} />
                    <span>Virtual Assistant</span>
                  </button>
                </div>

                {/* Close button */}
                <button onClick={() => setIsOpen(false)} className="p-1 rounded-full hover:bg-gray-700 transition-colors" title="Close">
                  <X size={18} />
                </button>
              </div>

              {/* Content with improved styling */}
              <div className="flex-1 overflow-auto bg-gray-50">{activeAssistant === 'assistant' ? <VirtualAssistant /> : <SmartBudgeting budgetParams={budgetParams} setBudgetParams={setBudgetParams} fullAddress={fullAddress} />}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

AIFeatures.propTypes = {
  budgetParams: PropTypes.object.isRequired,
  setBudgetParams: PropTypes.func.isRequired,
  fullAddress: PropTypes.string,
};

// Add custom animation for the AI panel and continuous sparkle effects
const style = document.createElement('style');
style.textContent = `
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fade-in 0.2s ease-out;
  }
  
  /* Button subtle pulse animation */
  @keyframes button-pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
  
  .button-glow {
    animation: button-pulse 3s infinite ease-in-out;
  }
  
  /* Sparkle ping animations */
  @keyframes sparkle-ping {
    0% { transform: scale(0.3); opacity: 1; }
    50% { transform: scale(1.5); opacity: 0.7; }
    100% { transform: scale(0.3); opacity: 1; }
  }
  
  .sparkle-ping {
    animation: sparkle-ping 2s infinite ease-out;
  }
  
  .sparkle-ping-delay-300 {
    animation: sparkle-ping 3s infinite ease-out;
    animation-delay: 0.3s;
  }
  
  .sparkle-ping-delay-500 {
    animation: sparkle-ping 2.5s infinite ease-out;
    animation-delay: 0.5s;
  }
  
  .sparkle-ping-delay-700 {
    animation: sparkle-ping 3.2s infinite ease-out;
    animation-delay: 0.7s;
  }
  
  .sparkle-ping-delay-1000 {
    animation: sparkle-ping 2.8s infinite ease-out;
    animation-delay: 1s;
  }
  
  /* Color changing bot icon */
  @keyframes color-shift {
    0% { color: white; }
    25% { color: #93c5fd; } /* blue-300 */
    50% { color: #a5f3fc; } /* cyan-200 */
    75% { color: #c4b5fd; } /* violet-300 */
    100% { color: white; }
  }
  
  .bot-icon-animate {
    animation: color-shift 4s infinite ease-in-out;
  }
  
  /* Glowing border effect */
  @keyframes border-glow {
    0% { border: 1px solid rgba(147, 197, 253, 0); box-shadow: 0 0 5px rgba(147, 197, 253, 0); }
    50% { border: 1px solid rgba(147, 197, 253, 0.8); box-shadow: 0 0 10px rgba(147, 197, 253, 0.5); }
    100% { border: 1px solid rgba(147, 197, 253, 0); box-shadow: 0 0 5px rgba(147, 197, 253, 0); }
  }
  
  .border-glow {
    animation: border-glow 3s infinite ease-in-out;
  }
  
  /* Container hover effect */
  .ai-button-container:hover .bot-icon-animate {
    animation-duration: 2s;
  }
  
  .ai-button-container:hover .border-glow {
    animation-duration: 1.5s;
  }
`;
document.head.appendChild(style);

export default AIFeatures;
