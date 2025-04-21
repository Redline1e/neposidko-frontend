// UploadExcel.tsx
"use client";

import React, { useState } from "react";
import { uploadExcelFile } from "@/lib/api/excel-service";

const UploadExcel: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert("Виберіть файл!");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    try {
      const data = await uploadExcelFile(formData);
      alert(data.message);
    } catch (error: any) {
      console.error("Помилка завантаження файлу:", error);
      alert("Помилка сервера");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 shadow-md rounded-lg flex flex-col gap-4 w-full max-w-md mx-auto"
    >
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileChange}
        className="border p-2 rounded-md w-full"
      />
      <button
        type="submit"
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md"
      >
        Завантажити
      </button>
    </form>
  );
};

export default UploadExcel;
