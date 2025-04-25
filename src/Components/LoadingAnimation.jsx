import { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import PropTypes from 'prop-types';
const LoadingAnimation = ({ duration = 4000 }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <div className="flex flex-col items-center">
        <div className="relative flex justify-center mb-6">
          {/* Map pin with pulsing effect */}
          <MapPin size={64} className="text-blue-600 animate-bounce" />

          {/* Ripple effects */}
          <div className="absolute w-16 h-16 rounded-full bg-blue-500/10 animate-ping" />
          <div className="absolute w-24 h-24 rounded-full bg-blue-500/5 animate-pulse" />
        </div>

        {/* Loading text */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Loading Map</h2>
        <p className="text-gray-600 mb-4">Finding the perfect kost for you...</p>

        {/* Progress bar */}
        <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-blue-600 rounded-full animate-progressBar" />
        </div>

        {/* Loading dots */}
        <div className="flex mt-6 space-x-2">
          <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
          <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
        </div>
      </div>
    </div>
  );
};
LoadingAnimation.propTypes = {
  duration: PropTypes.number.isRequired,
};
export default LoadingAnimation;
