"use client";

import { ChangeEvent } from "react";

interface SortSelectProps {
  sortOrder: string;
  setSortOrder: React.Dispatch<React.SetStateAction<string>>;
}

const SortSelect: React.FC<SortSelectProps> = ({ sortOrder, setSortOrder }) => {
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value);
  };

  return (
    <div className="absolute right-0 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2 sm:gap-4">
      <label className="font-medium text-gray-800">Сортувати за:</label>
      <select
        value={sortOrder}
        onChange={handleChange}
        className="border p-1 rounded"
      >
        <option value="default">За замовчуванням</option>
        <option value="priceAsc">За зростанням ціни</option>
        <option value="priceDesc">За спаданням ціни</option>
        <option value="alphabetAsc">За алфавітом (A-Z)</option>
        <option value="alphabetDesc">За алфавітом (Z-A)</option>
      </select>
    </div>
  );
};

export default SortSelect;
