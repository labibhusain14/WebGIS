import { useState } from 'react';
import { Bot, X, History, Wallet, MessageCircle } from 'lucide-react';
import SmartBudgeting from './SmartBudgeting';
import VirtualAssistant from './VirtualAssistant';
import PropTypes from 'prop-types';

function AIFeatures({ budgetParams, setBudgetParams, fullAddress }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeAssistant, setActiveAssistant] = useState('budgeting');

  return (
    <div className="fixed top-24 right-2 z-50 flex items-center space-x-2">
      {/* Tooltip */}
      <div className="relative bg-gray-800 text-white text-xs p-2 rounded-md max-w-xs hidden sm:block">
        Try AI Features
        <div
          className="absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0
                        border-l-8 border-t-8 border-b-8 border-transparent border-l-gray-800"
        />
      </div>

      {/* Bot Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-[#2C3E50] text-white
                   px-3 py-3 rounded-full shadow-md hover:bg-[#1F2A36]"
      >
        <Bot size={18} />
      </button>

      {isOpen && (
        // Wrapper untuk centering di mobile, override di sm ke kanan-atas
        <div
          className="
            fixed inset-0 flex items-center justify-center p-4
            sm:inset-auto sm:top-36 sm:right-14
            z-50
          "
        >
          {/* Kontainer panel */}
          <div
            className="
              w-full max-w-[450px]
              h-[90vh] max-h-[500px]
              bg-[#ECF0F1] shadow-lg rounded-lg border border-gray-300
              flex flex-col
            "
          >
            {/* Header */}
            <div className="flex justify-between items-center bg-[#2C3E50] text-white p-2 rounded-t-lg">
              <div className="flex space-x-2">
                <button className="p-2 rounded-full hover:bg-gray-700">
                  <History size={18} />
                </button>
              </div>
              <div className="flex space-x-4 bg-gray-100 p-1 rounded-full mx-auto">
                <button
                  onClick={() => setActiveAssistant('budgeting')}
                  className={`
                    px-4 py-2 text-xs font-bold rounded-full
                    ${activeAssistant === 'budgeting' ? 'bg-[#2C3E50] text-white shadow-md' : 'text-gray-500'}
                  `}
                >
                  <Wallet size={16} className="inline-block mr-1" />
                  Smart Budgeting
                </button>
                <button
                  onClick={() => setActiveAssistant('assistant')}
                  className={`
                    px-4 py-2 text-xs font-bold rounded-full
                    ${activeAssistant === 'assistant' ? 'bg-[#2C3E50] text-white shadow-md' : 'text-gray-500'}
                  `}
                >
                  <MessageCircle size={16} className="inline-block mr-1" />
                  Virtual Assistant
                </button>
              </div>
              <div className="flex space-x-2">
                <button onClick={() => setIsOpen(false)} className="p-1 rounded-full hover:bg-gray-700">
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto">{activeAssistant === 'assistant' ? <VirtualAssistant /> : <SmartBudgeting budgetParams={budgetParams} setBudgetParams={setBudgetParams} fullAddress={fullAddress} />}</div>
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

export default AIFeatures;
