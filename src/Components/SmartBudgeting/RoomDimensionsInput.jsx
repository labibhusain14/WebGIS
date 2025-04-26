import PropTypes from 'prop-types';

function RoomDimensionsInput({ panjang, lebar, onChange }) {
  return (
    <div className="grid grid-cols-2 gap-3 mb-3">
      <div>
        <label className="block text-gray-600 mb-1 text-xs">Panjang (m)</label>
        <input type="number" className="border rounded-md p-2 w-full text-xs" value={panjang} onChange={(e) => onChange('panjang', e.target.value)} />
      </div>
      <div>
        <label className="block text-gray-600 mb-1 text-xs">Lebar (m)</label>
        <input type="number" className="border rounded-md p-2 w-full text-xs" value={lebar} onChange={(e) => onChange('lebar', e.target.value)} />
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
