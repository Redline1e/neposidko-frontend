"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { addBrand } from "@/lib/api/brands-service";
import { toast } from "sonner";

// Схема валідації для бренду
const brandSchema = z.object({
  name: z.string().min(1, "Назва бренду є обов'язковою"),
});

type FormData = z.infer<typeof brandSchema>;

const AddBrand: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(brandSchema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await addBrand({ name: data.name, brandId: 0 });
      toast.success("Бренд успішно додано!");
      reset();
    } catch {
      toast.error("Не вдалося додати бренд");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white p-6 shadow-md rounded-lg flex flex-col gap-4 w-full max-w-md mx-auto"
    >
      <h2 className="text-lg font-semibold text-center">Додати бренд</h2>
      <div>
        <label className="text-sm font-medium text-gray-700">
          Назва бренду:
        </label>
        <input
          {...register("name")}
          type="text"
          className="border p-2 rounded-md w-full"
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
      >
        Додати бренд
      </button>
    </form>
  );
};

export default AddBrand;