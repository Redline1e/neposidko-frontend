// DownloadReport.tsx
"use client";

import React from "react";
import { toast } from "sonner";
import { downloadReport } from "@/lib/api/excel-service";

const DownloadReport: React.FC = () => {
  const handleDownload = async () => {
    try {
      const blob = await downloadReport();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "orders_report.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error("Помилка завантаження звіту:", error);
      alert(`Помилка: ${error.message}`);
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
