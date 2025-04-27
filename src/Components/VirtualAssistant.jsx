import { useState, useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';

function VirtualAssistant() {
  const chatContainerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Create script element for Botpress inject
    const injectScript = document.createElement('script');
    injectScript.src = 'https://cdn.botpress.cloud/webchat/v2.4/inject.js';
    injectScript.async = true;
    document.head.appendChild(injectScript);

    // Initialize Botpress after script is loaded
    injectScript.onload = () => {
      // Set timeout to ensure DOM is ready
      setTimeout(() => {
        // Create initialization script
        const initScript = document.createElement('script');
        initScript.innerHTML = `
          window.botpress.on("webchat:ready", () => {
            window.botpress.open();
            window.botpress.sendEvent({ type: 'conversation_reset' });
          });
          
          window.botpress.init({
            "botId": "21034e04-827f-48f2-a2b5-9a71f7525056",
            "configuration": {
              "website": {},
              "email": {},
              "phone": {},
              "termsOfService": {},
              "privacyPolicy": {},
              "variant": "soft",
              "themeMode": "light",
              "fontFamily": "inter",
              "closeButton": false,
              "showConversationId": false
            },
            "clientId": "ffc63521-3996-4edd-90fa-1eff6ac44d76",
            "selector": "#botpress-webchat"
          });
        `;
        document.body.appendChild(initScript);

        // Add event listener to detect when chat is fully loaded
        window.botpress.on('webchat:opened', () => {
          setIsLoading(false);
        });
      }, 100);
    };

    // Add styles to head
    const styleElement = document.createElement('style');
    styleElement.innerHTML = `
      #botpress-webchat .bpWebchat {
        position: unset;
        width: 100%;
        height: 100%;
        max-height: 100%;
        max-width: 100%;
      }
      #botpress-webchat .bpFab {
        display: none;
      }
      #botpress-webchat .bpw-header-icon {
        display: none !important;
      }
      #botpress-webchat .bpw-header-container {
        padding-right: 12px !important;
      }
    `;
    document.head.appendChild(styleElement);

    // Clean up on component unmount
    return () => {
      document.head.removeChild(injectScript);
      if (styleElement.parentNode) {
        document.head.removeChild(styleElement);
      }

      // Remove the initialization script if it exists
      const scripts = document.body.getElementsByTagName('script');
      for (let i = 0; i < scripts.length; i++) {
        if (scripts[i].innerHTML.includes('window.botpress.init')) {
          document.body.removeChild(scripts[i]);
          break;
        }
      }

      // Reset Botpress if initialized
      if (window.botpress) {
        window.botpress.destroyAll();
      }
    };
  }, []);

  return (
    <div className="w-full h-full flex flex-col bg-blue-100 rounded-lg overflow-hidden shadow-xl relative">
      <div id="botpress-webchat" ref={chatContainerRef} className="w-full h-full" />

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-blue-100 bg-opacity-90 z-10">
          <div className="flex flex-col items-center">
            <Loader2 size={40} className="text-blue-600 animate-spin mb-4" />
            <p className="text-gray-800 font-medium">Loading your assistant...</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default VirtualAssistant;
