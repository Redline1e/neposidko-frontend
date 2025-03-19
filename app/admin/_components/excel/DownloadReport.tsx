"use client";
import React from "react";

const DownloadReport: React.FC = () => {
  const handleDownload = async () => {
    try {
      const response = await fetch("http://localhost:5000/generate-report", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "orders_report.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Помилка завантаження звіту:", error);
      alert(`Помилка: ${(error as Error).message}`);
    }
  };

  return (
    <div className="bg-white p-6 shadow-md rounded-lg w-full max-w-md mx-auto">
      <button
        onClick={handleDownload}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md w-full"
      >
        Завантажити звіт
      </button>
    </div>
  );
};

export default DownloadReport;
