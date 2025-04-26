import { useState, useRef, useEffect } from 'react';
import { Mic, Send, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function VirtualAssistant() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [enable] = useState(false); // State to control service availability
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    // Auto-scroll to bottom when messages change
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });

    // Focus input when component mounts
    inputRef.current?.focus();
  }, [messages]);

  const sendMessage = async () => {
    if (input.trim() === '') return;

    const userMessage = { id: Date.now(), text: input, sender: 'user' };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // If service is not enabled, send a default "coming soon" message
      if (!enable) {
        // Simulate realistic typing delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        const botReply = {
          id: Date.now(),
          text: 'Our service is coming soon. Stay tuned!',
          sender: 'bot',
        };
        setMessages((prevMessages) => [...prevMessages, botReply]);
      } else {
        const response = await query({ question: input });
        if (response) {
          const botReply = {
            id: Date.now(),
            text: response.text,
            sender: 'bot',
          };
          setMessages((prevMessages) => [...prevMessages, botReply]);
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: Date.now(),
        text: "Sorry, I couldn't process your request. Please try again.",
        sender: 'bot',
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  function formatMessageText(text) {
    text = text.trim() + '\n\n';
    let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    formatted = formatted.replace(/^\* (.*)$/gm, '<li>$1</li>');
    if (formatted.includes('<li>')) {
      formatted = formatted.replace(/(<li>.*?<\/li>)/gs, '<ul>$1</ul>');
    }
    formatted = formatted
      .split(/\n{2,}/)
      .map((p) => `<p class="mb-3">${p.trim().replace(/\n/g, '<br/>')}</p>`)
      .join('');
    return formatted;
  }

  return (
    <div className="w-xl flex flex-col h-full bg-blue-100 rounded-lg overflow-hidden shadow-xl">
      {/* Header
      <div className="bg-gray-800 p-4 border-b border-gray-700">
        <h2 className="text-lg font-medium text-white">Virtual Assistant</h2>
      </div> */}

      {/* Chat Area */}
      <div className="flex-1 p-4 overflow-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
        <AnimatePresence>
          {messages.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-full text-gray-800 text-center">
              <div className="text-4xl mb-4">👋</div>
              <p className="text-lg mb-2">Hello there!</p>
              <p>Ask me anything to get started.</p>
            </motion.div>
          ) : (
            <div className="flex flex-col space-y-4">
              {messages.map((msg) => (
                <motion.div key={msg.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className={`flex ${msg.sender === 'bot' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`p-4 rounded-2xl max-w-xs md:max-w-md shadow-md ${msg.sender === 'bot' ? 'bg-gray-700 text-white rounded-tl-none' : 'bg-blue-600 text-white rounded-tr-none'}`}>
                    <div
                      className="text-sm whitespace-pre-line"
                      dangerouslySetInnerHTML={{
                        __html: formatMessageText(msg.text),
                      }}
                    />
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
                  <div className="bg-gray-800 p-4 rounded-2xl rounded-tl-none text-white">
                    <div className="flex items-center space-x-2">
                      <Loader2 size={16} className="animate-spin" />
                      <span>Thinking...</span>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={chatEndRef} />
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-gray-800 border-t border-gray-700">
        <div className="flex items-center bg-gray-700 rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-blue-500">
          <textarea
            ref={inputRef}
            rows="1"
            className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none resize-none py-2"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            style={{ maxHeight: '120px' }}
          />
          <div className="flex space-x-2 ml-2">
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="p-2 text-gray-400 hover:text-white rounded-full">
              <Mic size={20} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={sendMessage}
              disabled={isLoading || input.trim() === ''}
              className={`p-2 rounded-full ${input.trim() === '' ? 'text-gray-500' : 'text-blue-500 hover:text-white'}`}
            >
              <Send size={20} />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Query function to interact with the server
async function query(data) {
  try {
    const response = await fetch('http://localhost:3000/api/v1/prediction/c5ed765f-cd94-4587-850c-4a5719c0506a', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API query failed:', error);
    throw error;
  }
}

export default VirtualAssistant;
