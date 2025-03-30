import { useState } from "react";
import { Heart, Eye, MessageCircle, Lightbulb } from "lucide-react";
import Image1 from "../assets/image-1.jpg";
import Preview1 from "../assets/preview-1.jpg";
import Preview2 from "../assets/preview-2.jpg";
import Preview3 from "../assets/preview-3.jpg";
import Preview4 from "../assets/preview-4.png";
import { Button } from "../Components/Button";

const DetailPage = () => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const images = [
    {
      id: 1,
      src: Preview1,
      alt: "Study desk area with yellow chair",
    },
    {
      id: 2,
      src: Preview2,
      alt: "Yellow chair in living space",
    },
    {
      id: 3,
      src: Preview3,
      alt: "Bedroom with blue pillows",
    },
    {
      id: 4,
      src: Preview4,
      alt: "Modern living room with sofa",
    },
  ];

  const openModal = (image) => {
    setSelectedImage(image);
    document.body.style.overflow = "hidden"; // Prevent scrolling when modal is open
  };

  const closeModal = () => {
    setSelectedImage(null);
    document.body.style.overflow = "auto"; // Restore scrolling when modal is closed
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      {/* Main Card */}
      <div className="w-full mx-auto bg-white rounded-lg overflow-hidden shadow-md">
        {/* Hero Image Section */}
        <div className="relative">
          <img
            src={Image1}
            alt="Living room"
            className="w-full h-48 md:h-80 object-cover opacity-85"
          />
          <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-4 py-1 rounded">
            <h2 className="text-xl font-bold">Living room</h2>
          </div>
          <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded text-sm">
            <span>View all 6 photos</span>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-col md:flex-row">
          {/* Left Side - Details */}
          <div className="p-4 md:p-6 md:w-2/3">
            <h1 className="text-2xl font-bold mb-2">Kost Mas Isan Sukasari</h1>

            <div className="flex items-center mb-4 text-gray-500">
              <div className="flex items-center mr-4">
                <Eye size={16} className="mr-1" />
                <span>1,100</span>
              </div>
              <div className="flex items-center">
                <span className="px-2 py-1 bg-gray-200 rounded-full text-xs">
                  Sukasari
                </span>
              </div>
            </div>

            <p className="text-gray-700 mb-4">
              Kost ini terdiri dari 3 lantai. Tipe kamar C berada di setiap
              lantainya dengan beberapa kamar memiliki ventilasi. Kost ini
              terletak di daerah dengan jalan dan akses yang dapat dilalui oleh
              mobil, berlokasi 6 menit dari Institut Teknologi Bandung, 14 menit
              dari Universitas Pendidikan Indonesia, 12 menit dari Paris Van
              Java, dan 15 menit dari Cihampelas Walk.
            </p>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-2 mt-6">
              {images.map((image) => (
                <div key={image.id} className="overflow-hidden rounded-lg">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-24 object-cover cursor-pointer hover:opacity-90 transition duration-300 rounded-lg"
                    onClick={() => openModal(image)}
                  />
                </div>
              ))}
            </div>

            {selectedImage && (
              <div
                className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
                onClick={closeModal}
              >
                <div
                  className="relative max-w-4xl max-h-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className="absolute top-4 right-4 text-white text-3xl hover:text-gray-300 focus:outline-none"
                    onClick={closeModal}
                  >
                    &times;
                  </button>

                  <img
                    src={selectedImage.src}
                    alt={selectedImage.alt}
                    className="max-w-full max-h-[85vh] object-contain"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Right Side - Property Info */}
          <div className="bg-gray-50 p-4 md:p-6 md:w-1/3">
            <div className="mb-4">
              <h3 className="font-semibold text-xl mb-2">Informasi Singkat</h3>
              <p className="mb-2">
                <span className="font-semibold">Pemilik:</span> Mas Ihsan
                Sumedang
              </p>
            </div>

            <div className="flex items-center justify-between mb-4 p-3 bg-white rounded-lg shadow-sm">
              <div className="flex items-center">
                <MessageCircle size={18} className="mr-2 text-gray-500" />
                <span className="text-sm">Kamar mandi dalam</span>
              </div>
              <div className="flex items-center">
                <div className="flex items-center mr-4">
                  <Lightbulb size={18} className="mr-2 text-gray-500" />
                  <span className="text-sm">Termasuk Listrik</span>
                </div>
                <div className="bg-gray-200 px-2 py-1 rounded-full text-xs">
                  +2
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-bold">
                Rp 1.000.000{" "}
                <span className="text-sm text-gray-500 font-normal">
                  / bulan
                </span>
              </h3>
            </div>

            <div className="flex gap-2">
              <Button className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200">
                Hubungi
              </Button>
              <Button
                className="w-12 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100 transition duration-200"
                onClick={toggleFavorite}
              >
                <Heart
                  size={20}
                  className={
                    isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"
                  }
                />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
