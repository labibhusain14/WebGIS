// utils/formatters.js
export const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID').format(price);
};
