import { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import PropTypes from 'prop-types';
import { facilityGroups } from './data/facilityGroups';

function FacilitiesSelector({ selectedFacilities, onFacilityChange, onFacilityPreset }) {
  const [openFacilityGroup, setOpenFacilityGroup] = useState(null);

  return (
    <>
      <div className="mb-3">
        <label className="block text-gray-600 mb-1 text-xs font-semibold">Fasilitas</label>

        <div className="border rounded-md p-2 max-h-40 overflow-y-auto">
          {Object.entries(facilityGroups).map(([groupName, facilities]) => (
            <div key={groupName} className="mb-2">
              <div className="flex items-center justify-between bg-gray-100 p-1 rounded cursor-pointer" onClick={() => setOpenFacilityGroup(openFacilityGroup === groupName ? null : groupName)}>
                <span className="text-xs font-medium">{groupName}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${openFacilityGroup === groupName ? 'rotate-180' : 'rotate-0'}`} />
              </div>

              {openFacilityGroup === groupName && (
                <div className="pl-2 mt-1 grid grid-cols-2 gap-x-2 gap-y-1">
                  {facilities.map((facility) => (
                    <label key={facility} className="flex items-center text-xs">
                      <input type="checkbox" className="mr-1" checked={selectedFacilities.includes(facility)} onChange={() => onFacilityChange('fasilitas', facility)} />
                      {facility}
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-2">
          <p className="text-xs text-gray-500 mb-1">Fasilitas terpilih:</p>
          <div className="flex flex-wrap gap-1">
            {selectedFacilities.map((facility) => (
              <span key={facility} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center">
                {facility}
                <X size={12} className="ml-1 cursor-pointer" onClick={() => onFacilityChange('fasilitas', facility)} />
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-2">
        <button onClick={() => onFacilityPreset('premium')} className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded-lg">
          Set Premium
        </button>
        <button onClick={() => onFacilityPreset('basic')} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-lg">
          Set Basic
        </button>
        <button onClick={() => onFacilityPreset('clear')} className="text-xs bg-gray-50 text-gray-700 px-2 py-1 rounded-lg">
          Clear All
        </button>
      </div>
    </>
  );
}

FacilitiesSelector.propTypes = {
  selectedFacilities: PropTypes.arrayOf(PropTypes.string).isRequired,
  onFacilityChange: PropTypes.func.isRequired,
  onFacilityPreset: PropTypes.func.isRequired,
};

export default FacilitiesSelector;
