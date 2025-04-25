import { useState, useRef, useEffect } from 'react';
import { Mic, Send } from 'lucide-react';

function VirtualAssistant() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (input.trim() !== '') {
      const userMessage = { text: input, sender: 'user' };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setInput('');

      query({ question: input }).then(async (response) => {
        console.log(response);
        if (response) {
          const botReply = {
            text: response.text,
            sender: 'bot',
          };
          setMessages((prevMessages) => [...prevMessages, botReply]);
        }
      });
    }
  };

  function formatMessageText(text) {
    // Tambahkan newline di akhir agar paragraf terakhir tetap diproses
    text = text.trim() + '\n\n';

    // Bold (**text**)
    let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Bullet list (* text)
    formatted = formatted.replace(/^\* (.*)$/gm, '<li>$1</li>');

    // Bungkus semua <li> jadi satu <ul> (jika ada)
    if (formatted.includes('<li>')) {
      formatted = formatted.replace(/(<li>.*?<\/li>)/gs, '<ul>$1</ul>');
    }

    // Pisah paragraf dan beri jarak (mb-3)
    formatted = formatted
      .split(/\n{2,}/)
      .map((p) => `<p class="mb-3">${p.trim().replace(/\n/g, '<br/>')}</p>`)
      .join('');

    return formatted;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 p-4 overflow-auto text-sm text-gray-700 flex flex-col space-y-2">
        <div className="flex flex-col space-y-3">
          {messages.map((msg, index) => (
            <div key={index} className={`p-3 rounded-lg max-w-sm whitespace-pre-line ${msg.sender === 'bot' ? 'bg-gray-200 self-start text-gray-900' : 'bg-[#2C3E50] text-white self-end'}`}>
              <div
                dangerouslySetInnerHTML={{
                  __html: formatMessageText(msg.text),
                }}
              />
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Input Field */}
      <div className="flex items-center p-3 border-t bg-gray-800 rounded-b-lg">
        <input
          type="text"
          className="flex-1 p-2 border rounded-full text-sm focus:outline-none bg-gray-700 text-white placeholder-gray-400"
          placeholder="Ask anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button className="ml-2 p-2 bg-white text-gray-800 rounded-full hover:bg-gray-300">
          <Mic size={18} />
        </button>
        <button onClick={sendMessage} className="ml-2 p-2 bg-white text-gray-800 rounded-full hover:bg-gray-300">
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}

// Query function to interact with the server
async function query(data) {
  const response = await fetch('http://localhost:3000/api/v1/prediction/c5ed765f-cd94-4587-850c-4a5719c0506a', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  const result = await response.json();
  return result;
}

export default VirtualAssistant;
