import { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import PropTypes from 'prop-types';
import { facilityGroups } from './data/facilityGroups';
import { AnimatePresence, motion } from 'framer-motion';

function FacilitiesSelector({ selectedFacilities, onFacilityChange, onFacilityPreset }) {
  const [openFacilityGroup, setOpenFacilityGroup] = useState(null);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-gray-700 mb-2 text-sm font-semibold">Fasilitas</label>

        <div className="border rounded-xl p-3 max-h-48 overflow-y-auto bg-white shadow-sm">
          {Object.entries(facilityGroups).map(([groupName, facilities]) => (
            <div key={groupName} className="mb-3">
              <div className="flex items-center justify-between bg-gray-100 hover:bg-gray-200 transition p-2 rounded-lg cursor-pointer" onClick={() => setOpenFacilityGroup(openFacilityGroup === groupName ? null : groupName)}>
                <span className="text-sm font-medium">{groupName}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${openFacilityGroup === groupName ? 'rotate-180' : 'rotate-0'}`} />
              </div>

              <AnimatePresence>
                {openFacilityGroup === groupName && (
                  <motion.div className="pl-3 pt-2 grid grid-cols-2 gap-x-2 gap-y-2" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
                    {facilities.map((facility) => (
                      <label key={facility} className="flex items-center text-sm space-x-2">
                        <input type="checkbox" className="accent-blue-500" checked={selectedFacilities.includes(facility)} onChange={() => onFacilityChange('fasilitas', facility)} />
                        <span>{facility}</span>
                      </label>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      {selectedFacilities.length > 0 && (
        <div>
          <p className="text-sm text-gray-600 mb-1">Fasilitas Terpilih:</p>
          <div className="flex flex-wrap gap-2">
            {selectedFacilities.map((facility) => (
              <div key={facility} className="flex items-center bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                {facility}
                <X size={14} className="ml-1 cursor-pointer hover:text-red-500 transition" onClick={() => onFacilityChange('fasilitas', facility)} />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <button onClick={() => onFacilityPreset('premium')} className="text-xs font-semibold bg-purple-100 text-purple-700 hover:bg-purple-200 px-3 py-2 rounded-lg transition">
          Set Premium
        </button>
        <button onClick={() => onFacilityPreset('basic')} className="text-xs font-semibold bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-2 rounded-lg transition">
          Set Basic
        </button>
        <button onClick={() => onFacilityPreset('clear')} className="text-xs font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-2 rounded-lg transition">
          Clear All
        </button>
      </div>
    </div>
  );
}

FacilitiesSelector.propTypes = {
  selectedFacilities: PropTypes.arrayOf(PropTypes.string).isRequired,
  onFacilityChange: PropTypes.func.isRequired,
  onFacilityPreset: PropTypes.func.isRequired,
};

export default FacilitiesSelector;
