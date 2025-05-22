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

    useEffect(() => {
    const fetchGuideStatus = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        const user = JSON.parse(storedUser);
        const id_user = user?.id_user;

        if (!id_user || isLoading) return;

        const res = await fetch(`https://ggnt.mapid.co.id/api/users/${id_user}`);
        const json = await res.json();

        const hasSeenGuide = json?.has_seen_guide;

        if (!hasSeenGuide) {
          setRun(true);
          setSteps(initialSteps);
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

      // Update status has_seen_guide ke true
      try {
        const storedUser = localStorage.getItem("user");
        const user = JSON.parse(storedUser);
        const id_user = user?.id_user;

        if (!id_user) return;

        await fetch(`https://ggnt.mapid.co.id/api/users/${id_user}/guide-status`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ has_seen_guide: true }),
        });
      } catch (error) {
        console.error("Gagal menyimpan status panduan:", error);
      }
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
