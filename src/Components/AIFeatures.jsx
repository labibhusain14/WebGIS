import { useState, useEffect } from 'react';
import { Bot, X, History, Wallet, MessageCircle, Settings, Sparkles } from 'lucide-react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import SmartBudgeting from './SmartBudgeting';
import VirtualAssistant from './VirtualAssistant';
import PropTypes from 'prop-types';

function AIFeatures({ budgetParams, setBudgetParams, fullAddress }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeAssistant, setActiveAssistant] = useState('budgeting');
  const [showTooltip, setShowTooltip] = useState(false);
  const controls = useAnimation();

  // Pulse animation for the AI button
  useEffect(() => {
    controls.start({
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: 'reverse',
      },
    });

    // Show the tooltip after 1 second, hide after 5 seconds
    const timer = setTimeout(() => {
      setShowTooltip(true);
      const hideTimer = setTimeout(() => setShowTooltip(false), 40000);
      return () => clearTimeout(hideTimer);
    }, 1000);

    return () => clearTimeout(timer);
  }, [controls]);

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  const glowVariants = {
    glow: {
      boxShadow: ['0 0 5px rgba(147, 197, 253, 0.3)', '0 0 15px rgba(147, 197, 253, 0.7)', '0 0 5px rgba(147, 197, 253, 0.3)'],
      transition: { duration: 2, repeat: Infinity },
    },
  };

  const sparkleVariants = {
    animate: (i) => ({
      scale: [0.3, 1.2, 0.3],
      opacity: [0.4, 1, 0.4],
      transition: {
        duration: 2 + i * 0.3,
        repeat: Infinity,
        delay: i * 0.2,
      },
    }),
  };

  const tabVariants = {
    inactive: { backgroundColor: 'rgba(75, 85, 99, 0.3)', color: '#d1d5db' },
    active: { backgroundColor: '#3b82f6', color: 'white' },
  };

  return (
    <div className="fixed top-[75px] right-14 z-10 flex items-center space-x-2">
      {/* Enhanced tooltip with animation */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white text-xs p-3 rounded-lg max-w-xs hidden sm:block shadow-lg"
          >
            <span className="font-medium">New!</span> Try our AI features
            <div className="absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-8 border-t-8 border-b-8 border-transparent border-l-blue-600" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced AI Bot Button */}
      <div className="relative">
        {/* Sparkle effects with custom animations */}
        {[...Array(5)].map((_, i) => (
          <motion.span
            key={i}
            className="absolute h-2 w-2 rounded-full bg-blue-300 pointer-events-none"
            style={{
              top: `${25 + 35 * Math.sin((i * Math.PI) / 2.5)}%`,
              left: `${25 + 35 * Math.cos((i * Math.PI) / 2.5)}%`,
              backgroundColor: i % 2 ? '#93c5fd' : '#c4b5fd',
            }}
            custom={i}
            variants={sparkleVariants}
            animate="animate"
          />
        ))}

        {/* Glowing border effect */}
        <motion.div className="absolute inset-0 rounded-full pointer-events-none" variants={glowVariants} animate="glow" />

        {/* The actual button with enhanced styling */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="relative z-10 flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-800 text-white
                   p-3 rounded-full shadow-lg transition-all"
          title="AI Features"
          animate={controls}
          whileHover={{ scale: 1.1, boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.5)' }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
              transition: { duration: 5, repeat: Infinity },
            }}
          >
            <Sparkles size={22} />
          </motion.div>
        </motion.button>
      </div>

      {/* Modal with improved animations */}
      <AnimatePresence>
        {isOpen && (
          // Backdrop
          <motion.div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-15 sm:bg-transparent" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsOpen(false)}>
            {/* Modal positioning wrapper */}
            <div
              className="
                fixed inset-0 flex items-center justify-center p-4
                sm:inset-auto top-20 sm:top-32 sm:right-14
                z-15
              "
              onClick={(e) => e.stopPropagation()}
            >
              {/* Panel container with glass effect */}
              <motion.div
                className="
                  w-full max-w-[480px]
                  h-[90vh] max-h-[550px]
                  bg-white/95 backdrop-blur-md shadow-2xl rounded-xl border border-gray-200
                  flex flex-col overflow-hidden
                "
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              >
                {/* Header with gradient background */}
                <div className="flex justify-between items-center bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 rounded-t-xl shadow-md">
                  <div className="flex items-center space-x-2">
                    <motion.div className="p-2 rounded-full bg-white/20" whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }} whileTap={{ scale: 0.95 }}>
                      <Bot size={20} />
                    </motion.div>
                    <h2 className="font-medium">AI Assistant</h2>
                  </div>

                  {/* Improved header controls */}
                  <div className="flex items-center space-x-3">
                    <motion.button className="p-2 rounded-full hover:bg-white/20 transition-colors" title="History" whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.2)' }} whileTap={{ scale: 0.9 }}>
                      <History size={18} />
                    </motion.button>
                    <motion.button className="p-2 rounded-full hover:bg-white/20 transition-colors" title="Settings" whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.2)' }} whileTap={{ scale: 0.9 }}>
                      <Settings size={18} />
                    </motion.button>
                    <motion.button
                      onClick={() => setIsOpen(false)}
                      className="p-2 rounded-full hover:bg-white/20 transition-colors"
                      title="Close"
                      whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X size={18} />
                    </motion.button>
                  </div>
                </div>

                {/* Improved tabs with animations */}
                <div className="flex justify-center p-3 bg-gray-50 border-b border-gray-200">
                  <div className="flex space-x-2 bg-gray-200 p-1 rounded-full shadow-inner">
                    <motion.button
                      onClick={() => setActiveAssistant('budgeting')}
                      className="px-4 py-2 text-sm font-medium rounded-full transition-all flex items-center gap-2"
                      variants={tabVariants}
                      animate={activeAssistant === 'budgeting' ? 'active' : 'inactive'}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Wallet size={16} />
                      <span>Smart Budgeting</span>
                    </motion.button>
                    <motion.button
                      onClick={() => setActiveAssistant('assistant')}
                      className="px-4 py-2 text-sm font-medium rounded-full transition-all flex items-center gap-2"
                      variants={tabVariants}
                      animate={activeAssistant === 'assistant' ? 'active' : 'inactive'}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <MessageCircle size={16} />
                      <span>KostHub Chatbot</span>
                    </motion.button>
                  </div>
                </div>

                {/* Content with smoother transitions */}
                <div className="flex-1 overflow-hidden bg-gray-50">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeAssistant}
                      className="h-full overflow-auto p-2"
                      variants={fadeInUp}
                      initial="hidden"
                      animate="visible"
                      exit={{ opacity: 0, x: activeAssistant === 'budgeting' ? -20 : 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      {activeAssistant === 'assistant' ? <VirtualAssistant /> : <SmartBudgeting budgetParams={budgetParams} setBudgetParams={setBudgetParams} fullAddress={fullAddress} />}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

AIFeatures.propTypes = {
  budgetParams: PropTypes.object.isRequired,
  setBudgetParams: PropTypes.func.isRequired,
  fullAddress: PropTypes.string,
};

export default AIFeatures;
