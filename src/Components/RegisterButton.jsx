import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RegisterButton = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/register');
  };

  // Animation variants for the button
  const buttonAnimation = {
    hover: {
      scale: 1.1,
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
      transition: { duration: 0.3 },
    },
    tap: {
      scale: 0.95,
      transition: { duration: 0.2 },
    },
  };

  return (
    <motion.div
      className="flex flex-col items-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut', delay: 0.4 }}
    >
      <motion.button
        onClick={handleNavigate}
        variants={buttonAnimation}
        whileHover="hover"
        whileTap="tap"
        className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors text-lg font-semibold"
      >
        Daftar Sekarang
        <ChevronRight className="ml-2 w-5 h-5" />
      </motion.button>
    </motion.div>
  );
};

export default RegisterButton;