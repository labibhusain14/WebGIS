// SmartBudgeting/RoomDimensionsInput.jsx
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

function RoomDimensionsInput({ panjang, lebar, onChange }) {
  return (
    <div className="grid grid-cols-2 gap-4 mb-5">
      <div className="flex flex-col">
        <label className="text-gray-700 text-sm font-medium mb-1">Panjang (m)</label>
        <motion.input
          type="number"
          className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg p-2 text-sm transition-all duration-300"
          value={panjang}
          onChange={(e) => onChange('panjang', e.target.value)}
          whileFocus={{ scale: 1.02 }}
        />
      </div>
      <div className="flex flex-col">
        <label className="text-gray-700 text-sm font-medium mb-1">Lebar (m)</label>
        <motion.input
          type="number"
          className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg p-2 text-sm transition-all duration-300"
          value={lebar}
          onChange={(e) => onChange('lebar', e.target.value)}
          whileFocus={{ scale: 1.02 }}
        />
      </div>
    </div>
  );
}

RoomDimensionsInput.propTypes = {
  panjang: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  lebar: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default RoomDimensionsInput;
