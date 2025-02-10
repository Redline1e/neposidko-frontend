import { Brand,} from "@/utils/api";

interface BrandsItemProps {
  brand: Brand;
}

export const BrandItem: React.FC<BrandsItemProps> = ({ brand }) => {
  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden transform transition duration-300 hover:scale-105">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800 text-center">
          {brand.name}
        </h2>
      </div>
    </div>
  );
};
