import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, Eye, Home, Ruler, MapPin, ArrowLeft } from 'lucide-react';
import { Button } from '../Components/Button';

const DetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [property, setProperty] = useState({});
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetch(`https://ggnt.mapid.co.id/api/kost/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProperty(data.data);
        console.log('Property data:', data.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch kost detail:', err);
        setIsLoading(false);
      });
  }, [id]);

  const defaultImages = [
    {
      id: 1,
      src: '/api/placeholder/800/600',
      alt: 'Kamar kost tampak depan',
    },
    {
      id: 2,
      src: '/api/placeholder/800/600',
      alt: 'Area tempat tidur',
    },
    {
      id: 3,
      src: '/api/placeholder/800/600',
      alt: 'Kamar mandi',
    },
    {
      id: 4,
      src: '/api/placeholder/800/600',
      alt: 'Area belajar',
    },
  ];

  const images =
    property.gambar_kost && property.gambar_kost.length
      ? property.gambar_kost.map((img, index) => ({
          id: img.id_gambar || index,
          src: img.url_gambar,
          alt: `Gambar ${index + 1}`,
        }))
      : defaultImages;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (!property || Object.keys(property).length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <p className="text-gray-600">Property not found or unable to load data.</p>
          <Button onClick={() => navigate(-1)} className="mt-4 flex items-center bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
            <ArrowLeft size={18} className="mr-2" /> Go Back
          </Button>
        </div>
      </div>
    );
  }

  // Format price to IDR
  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID').format(parseInt(price));
  };

  const openModal = (image) => {
    setSelectedImage(image);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  // Functions for contact modal
  const openContactModal = () => {
    setIsContactModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeContactModal = () => {
    setIsContactModalOpen(false);
    document.body.style.overflow = 'auto';
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4 md:p-6">
      {/* Back Button */}
      <div className="container mx-auto max-w-6xl mb-4">
        <Button onClick={goBack} className="flex items-center text-gray-600 hover:text-blue-600 transition duration-200 mb-4 bg-white px-4 py-2 rounded-lg shadow-sm">
          <ArrowLeft size={18} className="mr-2" /> Back to listings
        </Button>
      </div>

      {/* Main Card */}
      <div className="container mx-auto max-w-6xl bg-white rounded-lg overflow-hidden shadow-lg">
        {/* Hero Image Section */}
        <div className="relative">
          <img src={images[0]?.src || property.image} alt={property.nama_kost} className="w-full h-48 sm:h-64 md:h-80 lg:h-96 object-cover" />
          <div className="absolute bottom-4 left-4 bg-black bg-opacity-60 text-white px-4 py-2 rounded-md">
            <h2 className="text-lg sm:text-xl font-bold">{property.nama_kost?.split(' ').slice(0, 3).join(' ')}</h2>
          </div>
          <button className="absolute bottom-4 right-4 bg-black bg-opacity-60 text-white px-3 py-2 rounded-md text-sm hover:bg-opacity-80 transition" onClick={() => openModal(images[0])}>
            <span className="flex items-center">
              <Eye size={16} className="mr-2" /> View all {images.length} photos
            </span>
          </button>
        </div>

        {/* Content Section */}
        <div className="flex flex-col lg:flex-row">
          {/* Left Side - Details */}
          <div className="p-4 sm:p-6 lg:w-2/3">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">{property.nama_kost}</h1>

            <div className="flex flex-wrap items-center mb-4 text-gray-500">
              <div className="flex items-center mr-4 mb-2 sm:mb-0">
                <Eye size={16} className="mr-1" />
                <span>1,100</span>
              </div>
              <div className="flex items-center mb-2 sm:mb-0">
                <MapPin size={16} className="mr-1" />
                <span className="px-2 py-1 bg-gray-200 rounded-full text-xs md:text-sm truncate max-w-xs">{property.alamat}</span>
              </div>
            </div>

            {/* Property details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center">
                <Home size={18} className="mr-2 text-blue-500 flex-shrink-0" />
                <span className="text-gray-700">Tipe: {property.nama_kost.includes('Tipe') ? property.nama_kost.split('Tipe ')[1].charAt(0) : 'Standard'}</span>
              </div>
              <div className="flex items-center">
                <Ruler size={18} className="mr-2 text-blue-500 flex-shrink-0" />
                <span className="text-gray-700">
                  Luas: {property.luas} m² ({property.panjang}x{property.lebar})
                </span>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <p className="text-gray-700">
                Kost ini berlokasi di {property.alamat}, Bandung. Dengan luas kamar {property.luas} m², kost ini menawarkan berbagai fasilitas untuk kenyamanan Anda. Status properti ini adalah {property.status_properti}.
              </p>
            </div>

            {/* Facilities */}
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-3 border-b pb-2">Fasilitas</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-2">
                {Array.isArray(property.fasilitas) &&
                  property.fasilitas.map((facility) => (
                    <div key={facility.id_fasilitas} className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                      <span className="text-gray-700">{facility.nama_fasilitas}</span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Thumbnail Gallery */}
            <div>
              <h3 className="font-semibold text-lg mb-3 border-b pb-2">Gallery</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-2">
                {images.map((image) => (
                  <div key={image.id} className="overflow-hidden rounded-lg shadow-sm hover:shadow-md transition">
                    <img src={image.src} alt={image.alt} className="w-full h-24 object-cover cursor-pointer hover:opacity-90 transition duration-300 rounded-lg" onClick={() => openModal(image)} />
                  </div>
                ))}
              </div>
            </div>

            {selectedImage && (
              <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4" onClick={closeModal}>
                <div className="relative max-w-4xl max-h-full" onClick={(e) => e.stopPropagation()}>
                  <button className="absolute top-4 right-4 text-white text-3xl hover:text-gray-300 focus:outline-none" onClick={closeModal}>
                    &times;
                  </button>
                  <img src={selectedImage.src} alt={selectedImage.alt} className="max-w-full max-h-[85vh] object-contain" />
                </div>
              </div>
            )}
          </div>

          {/* Right Side - Property Info */}
          <div className="bg-gray-50 p-4 sm:p-6 lg:w-1/3 rounded-b-lg lg:rounded-bl-none lg:rounded-r-lg">
            <div className="sticky top-4">
              <div className="mb-4 p-4 bg-white rounded-lg shadow-sm">
                <h3 className="font-semibold text-xl mb-2">Informasi Singkat</h3>
                <p className="mb-2">
                  <span className="font-semibold">Sertifikat:</span> {property.jenis_sertifikat || 'N/A'}
                </p>
              </div>

              <div className="mb-6 p-4 bg-white rounded-lg shadow-sm">
                <h3 className="text-2xl font-bold text-blue-600">
                  Rp {formatPrice(property.harga_sewa)} <span className="text-sm text-gray-500 font-normal">/ bulan</span>
                </h3>
              </div>

              <div className="flex gap-2 mb-6">
                <Button onClick={openContactModal} className="flex-1 bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition duration-200 font-medium">
                  Hubungi Pemilik
                </Button>
                <Button className="w-12 h-12 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100 transition duration-200" onClick={toggleFavorite}>
                  <Heart size={22} className={isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'} />
                </Button>
              </div>

              {/* Map location */}
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="font-semibold text-lg mb-2">Lokasi</h3>
                <div className="rounded-lg overflow-hidden border border-gray-200">
                  <iframe
                    title="Google Maps"
                    width="100%"
                    height="250"
                    className="border-0"
                    style={{ border: 0 }}
                    src={`https://www.google.com/maps?q=${encodeURIComponent(property.alamat || '')}&output=embed`}
                    allowFullScreen
                    loading="lazy"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal untuk Informasi Pemilik */}
      {isContactModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center p-4" onClick={closeContactModal}>
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h3 className="text-xl font-semibold text-blue-600">Informasi Pemilik</h3>
              <button className="text-gray-500 hover:text-gray-700 text-2xl" onClick={closeContactModal}>
                ×
              </button>
            </div>
            <div className="text-gray-700 space-y-3">
              <div className="flex border-b border-gray-100 pb-2">
                <span className="w-28 font-semibold">Nama:</span>
                <span>{property.pemilik?.nama || 'Mas Ihsan'}</span>
              </div>
              <div className="flex border-b border-gray-100 pb-2">
                <span className="w-28 font-semibold">Telepon:</span>
                <span className="text-blue-600">{property.pemilik?.telepon || '0878-1234-5678'}</span>
              </div>
              <div className="flex border-b border-gray-100 pb-2">
                <span className="w-28 font-semibold">Email:</span>
                <span className="text-blue-600">{property.pemilik?.email || 'masisan@gmail.com'}</span>
              </div>
              <div className="flex">
                <span className="w-28 font-semibold">Alamat:</span>
                <span>{property.pemilik?.alamat || 'Jl. Raya No. 123, Bandung'}</span>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <Button className="flex-1 border border-gray-300 py-2 px-4 rounded-lg hover:bg-gray-50" onClick={closeContactModal}>
                Batal
              </Button>
              <Button className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">Hubungi via WA</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailPage;
