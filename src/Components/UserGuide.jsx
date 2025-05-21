import React, { useEffect, useState } from "react";
import Joyride, { EVENTS, STATUS } from "react-joyride";

function UserGuide({ isLoading }) {
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

  // Start tour jika loading selesai dan belum pernah dilihat
  useEffect(() => {
    const seen = localStorage.getItem("tour_seen");
    if (!isLoading && seen !== "true") {
      setRun(true);
      setSteps(initialSteps);
    }
  }, [isLoading]);

  const handleJoyrideCallback = (data) => {
    const { status, type } = data;
    const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status) || type === EVENTS.TOUR_END) {
      setRun(false);
      setSteps([]);
      localStorage.setItem("tour_seen", "true"); // Simpan status supaya beacon tidak muncul lagi
    }
  };

  if (isLoading || steps.length === 0) return null;

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showSkipButton
      showProgress
      disableOverlayClose
      callback={handleJoyrideCallback}
      styles={{
        options: {
          zIndex: 1000,
        },
      }}
    />
  );
}

export default UserGuide;
