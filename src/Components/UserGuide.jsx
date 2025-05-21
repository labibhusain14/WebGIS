// ProductTour.jsx
import React, { useState, useEffect } from "react";
import Joyride from "react-joyride";

function UserGuide({ isLoading }) {
  const steps = [
    {
      target: "body",
      content:
        "Selamat datang di KostHub! Ini adalah panduan penggunaan kosthub",
      placement: "center",
      title: "KostHub",
    },
    {
      target: "#search",
      content:
        "ini button search, kalian bisa mencari kost berdasarkan nama atau lokasi kost",
      placement: "auto",
      title: "Kolom Search",
    },
    {
      target: "#filter",
      content: "Ini adalah bagian fitur utama dari aplikasi kami.",
      placement: "auto",
      title: "Langkah 2: Fitur Utama",
    },
    {
      target: "#fasilitas",
      content: "Ini adalah bagian fitur utama dari aplikasi kami.",
      placement: "right",
      title: "Langkah 2: Fitur Utama",
    },
  ];
  // Jangan render Joyride kalau masih loading
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        setShowTour(true);
      }, 500); // Delay 500ms agar DOM selesai render
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  if (!showTour) return null;

  return (
    <Joyride
      steps={steps}
      continuous
      showSkipButton
      showProgress
      disableOverlayClose
      debug
    />
  );
}

export default UserGuide;
