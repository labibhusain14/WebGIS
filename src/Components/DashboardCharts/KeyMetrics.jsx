import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { formatPrice } from '../../hooks/useDashboardData';

const CountUp = ({ value, formatter = (val) => val, decimals = 0, suffix = '' }) => {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      key={value} // Re-render when value changes
      transition={{ duration: 0.3 }}
    >
      {formatter(value)}
      {suffix}
    </motion.span>
  );
};

CountUp.propTypes = {
  value: PropTypes.number.isRequired,
  formatter: PropTypes.func,
  decimals: PropTypes.number,
  suffix: PropTypes.string,
};

const KeyMetrics = ({ metrics }) => {
  const cardVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
    hover: { y: -5, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', transition: { duration: 0.2 } },
  };

  const metrics_data = [
    {
      title: 'Total Kost',
      value: metrics.count,
      formatter: (value) => value,
      suffix: '',
      secondaryText: `dari ${metrics.kecCount} kecamatan`,
      borderColor: 'border-blue-500',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
    {
      title: 'Harga Rata-rata',
      value: metrics.avgPrice,
      formatter: formatPrice,
      suffix: '',
      secondaryText: 'per bulan',
      borderColor: 'border-green-500',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      title: 'Luas Rata-rata',
      value: metrics.avgArea,
      formatter: (value) => value.toFixed(1),
      suffix: ' m²',
      secondaryText: 'per kamar',
      borderColor: 'border-purple-500',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
        </svg>
      ),
    },
    {
      title: 'Harga per m²',
      value: Math.round(metrics.avgPrice / metrics.avgArea),
      formatter: formatPrice,
      suffix: '',
      secondaryText: 'per bulan',
      borderColor: 'border-amber-500',
      bgColor: 'bg-amber-100',
      textColor: 'text-amber-600',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
      {metrics_data.map((metric, index) => (
        <motion.div key={index} className={`bg-white rounded-lg shadow-md p-5 border-l-4 ${metric.borderColor} transition-all`} initial="initial" animate="animate" whileHover="hover" variants={cardVariants}>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-500">{metric.title}</h3>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                <CountUp value={metric.value} formatter={metric.formatter} suffix={metric.suffix} />
              </p>
            </div>
            <div className={`p-3 rounded-full ${metric.bgColor} ${metric.textColor} flex-shrink-0`}>{metric.icon}</div>
          </div>
          <div className="mt-2">
            <p className="text-xs text-gray-500">{metric.secondaryText}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

KeyMetrics.propTypes = {
  metrics: PropTypes.shape({
    count: PropTypes.number.isRequired,
    kecCount: PropTypes.number.isRequired,
    avgPrice: PropTypes.number.isRequired,
    avgArea: PropTypes.number.isRequired,
  }).isRequired,
};

export default KeyMetrics;
