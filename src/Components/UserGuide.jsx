import React, { useEffect, useState } from "react";
import Joyride, { EVENTS, STATUS } from "react-joyride";
import { motion } from "framer-motion";

function UserGuide({ isLoading, onGuideChange }) {
  const initialSteps = [
    {
      target: "#search",
      content:
        "Selamat datang di KostHub! Ikuti tur singkat ini untuk memahami fitur-fitur utama aplikasi kami.",
      placement: "center",
      title: "KostHub",
      disableBeacon: true,
    },
    {
      target: "#search",
      content:
        "Gunakan kolom ini untuk mencari kost berdasarkan nama atau lokasi.",
      placement: "auto",
      title: "Kolom Pencarian",
      disableBeacon: true,
    },
    {
      target: "#filter",
      content:
        "Gunakan filter untuk menyaring hasil berdasarkan harga, fasilitas, dan urutkan berdasarkan harga.",
      placement: "auto",
      title: "Filter Kost",
      disableBeacon: true,
    },
    {
      target: "#kost",
      content:
        "Berikut adalah daftar kost yang tersedia. Kamu juga bisa menyimpan kost favoritmu.",
      placement: "top",
      title: "Daftar Kost",
      disableBeacon: true,
    },
    {
      target: "#sidebar",
      content: "Klik tombol ini untuk menutup atau membuka menu sidebar.",
      placement: "auto",
      title: "Menu Sidebar",
      disableBeacon: true,
    },
    {
      target: "#cariAlamat",
      content:
        "Cari kost berdasarkan alamat tertentu melalui fitur pencarian ini.",
      placement: "auto",
      title: "Pencarian Berdasarkan Alamat",
      disableBeacon: true,
    },
    {
      target: "#fiturAI",
      content:
        "Dapatkan rekomendasi kost sesuai kriteria kamu, dan ajukan pertanyaan seputar kost melalui asisten AI kami.",
      placement: "auto",
      title: "Fitur AI",
      disableBeacon: true,
    },
    {
      target: "#layer",
      content:
        "Lihat fasilitas umum terdekat seperti masjid, tempat makan, rumah sakit, toserba, terminal, stasiun, dan kampus.",
      placement: "auto",
      title: "Peta Fasilitas Umum",
      disableBeacon: true,
    },
  ];

  const [run, setRun] = useState(false);
  const [steps, setSteps] = useState([]);
  const [shouldLockScroll, setShouldLockScroll] = useState(false);

  const CustomTooltip = ({
    step,
    index,
    size,
    backProps,
    closeProps,
    primaryProps,
    skipProps,
    tooltipProps,
  }) => {
    return (
      <motion.div
        {...tooltipProps}
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative bg-white rounded-xl shadow-2xl p-5 max-w-sm text-sm border border-gray-200"
      >
        {/* Title & Content */}
        <h2 className="text-base font-semibold mb-2 text-gray-800">
          {step.title}
        </h2>
        <p className="text-gray-600 mb-4 leading-relaxed">{step.content}</p>

        {/* Progress dots */}
        <div className="flex justify-center mb-4">
          {Array.from({ length: size }).map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 mx-1 rounded-full transition-all duration-300 ${
                i === index ? "bg-blue-600 scale-110" : "bg-gray-300"
              }`}
            />
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center gap-2">
          <button
            {...skipProps}
            className="text-blue-600 text-sm hover:underline transition duration-200"
          >
            Lewati
          </button>

          <div className="flex gap-2 ml-auto">
            {index > 0 && (
              <button
                {...backProps}
                className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm flex items-center gap-1 hover:bg-gray-300 transition"
              >
                Kembali
              </button>
            )}
            <button
              {...primaryProps}
              className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm flex items-center gap-1 hover:bg-blue-700 transition"
            >
              {index === size - 1 ? <>Selesai</> : <>Selanjutnya</>}
            </button>
          </div>
        </div>
      </motion.div>
    );
  };
  useEffect(() => {
    const unlockScroll = () => {
      document.body.style.overflow = "auto";
      document.documentElement.style.overflow = "auto";

      // Jaga-jaga: pastikan sidebar juga bisa scroll
      const sidebar = document.getElementById("sidebar-scroll");
      if (sidebar) {
        sidebar.style.overflowY = "auto";
      }
    };

    const lockScroll = () => {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";

      // Jaga-jaga: sidebar juga dikunci scroll-nya
      const sidebar = document.getElementById("sidebar-scroll");
      if (sidebar) {
        sidebar.style.overflowY = "hidden";
      }
    };

    if (shouldLockScroll) {
      lockScroll();
    } else {
      unlockScroll();
    }

    return () => {
      unlockScroll();
    };
  }, [shouldLockScroll]);

  // // Cek dari localStorage
  // useEffect(() => {
  //   if (!isLoading && localStorage.getItem("tour_seen") !== "true") {
  //     setShouldLockScroll(true);
  //     setRun(true);
  //     setSteps(initialSteps);
  //     onGuideChange?.(true); // 🔴 Mulai kunci scroll
  //   }
  // }, [isLoading]);

  // Cek dari backend
  useEffect(() => {
    const fetchGuideStatus = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        const user = JSON.parse(storedUser);
        const id_user = user?.id_user;

        if (!id_user || isLoading) return;

        const res = await fetch(
          `https://ggnt.mapid.co.id/api/users/${id_user}`
        );
        const json = await res.json();

        const hasSeenGuide = json?.has_seen_guide;
        // localStorage.setItem("tour_seen", hasSeenGuide);

        if (!hasSeenGuide) {
          setShouldLockScroll(true); // juga kunci scroll di sini
          setRun(true);
          setSteps(initialSteps);
          onGuideChange?.(true); //  Mulai kunci scroll
        }
      } catch (error) {
        console.error("Gagal memuat status panduan:", error);
      }
    };

    fetchGuideStatus();
  }, [isLoading]);

  const handleJoyrideCallback = async (data) => {
    const { status, type } = data;
    const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status) || type === EVENTS.TOUR_END) {
      setRun(false);
      setSteps([]);
      setShouldLockScroll(false);

      try {
        const storedUser = localStorage.getItem("user");
        const user = JSON.parse(storedUser);
        const id_user = user?.id_user;

        if (!id_user) return;

        await fetch(
          `https://ggnt.mapid.co.id/api/users/${id_user}/guide-status`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ has_seen_guide: true }),
          }
        );
      } catch (error) {
        console.error("Gagal menyimpan status panduan:", error);
      }

      // Optional reload
      // window.location.reload();
    }
  };

  if (isLoading || steps.length === 0) return null;

  return (
    <Joyride
      steps={steps}
      run={run}
      //   run={true}
      locale={{
        last: "Selesai",
      }}
      continuous
      showSkipButton
      showProgress
      disableOverlayClose
      scrollToFirstStep={true}
      scrollOffset={100}
      tooltipComponent={CustomTooltip}
      disableScrollParentFix={true}
      callback={handleJoyrideCallback}
      styles={{
        options: {
          zIndex: 1000,
          transition: "all 1s ease-in-out",
        },
      }}
    />
  );
}

export default UserGuide;
