"use client";

import React, { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, LabelList } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { fetchAllOrders } from "@/lib/api/order-service";
import { Order } from "@/utils/types";

const monthNames = [
  "Січень",
  "Лютий",
  "Березень",
  "Квітень",
  "Травень",
  "Червень",
  "Липень",
  "Серпень",
  "Вересень",
  "Жовтень",
  "Листопад",
  "Грудень",
];

const statusMapping: Record<number, string> = {
  1: "Активний",
  2: "Очікує",
  3: "В обробці",
  4: "Виконаний",
};

const chartConfig = { orders: { label: "Замовлення", color: "#4ade80" } };

interface OrderChartData {
  month: string;
  [status: string]: string | number;
}

const colorPalette = ["#4ade80", "#facc15", "#60a5fa", "#f87171"];

const ChartComponent: React.FC = () => {
  const [chartData, setChartData] = useState<OrderChartData[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const orders = (await fetchAllOrders()) as Order[];
        const dataMap = orders.reduce((acc, order) => {
          if (!order.orderDate || order.orderStatusId === undefined) return acc;
          const date = new Date(order.orderDate);
          const month = monthNames[date.getMonth()];
          const status =
            order.orderStatusId !== null
              ? statusMapping[order.orderStatusId] ||
                `Статус ${order.orderStatusId}`
              : "Невідомий";

          if (!acc[month]) {
            acc[month] = { month };
          }
          acc[month][status] = ((acc[month][status] as number) || 0) + 1;
          return acc;
        }, {} as Record<string, OrderChartData>);

        // Сортуємо дані за порядком місяців
        const sortedData = Object.values(dataMap).sort(
          (a, b) => monthNames.indexOf(a.month) - monthNames.indexOf(b.month)
        );
        setChartData(sortedData);
      } catch (error) {
        console.error("Помилка завантаження замовлень:", error);
      }
    };
    loadData();
  }, []);

  const statuses = Object.values(statusMapping);

  return (
    <div className="container mx-auto p-4 mt-20">
      {/* Заголовок */}
      <h1 className="text-center text-2xl font-bold mb-4">
        Статистика замовлень
      </h1>
      <ChartContainer className="h-[300px] w-full" config={chartConfig}>
        <BarChart data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          {statuses.map((status, index) => (
            <Bar
              key={status}
              dataKey={status}
              stackId="a"
              fill={colorPalette[index % colorPalette.length]}
              radius={4}
            >
              {/* Відображення числових значень на стовпцях */}
              <LabelList dataKey={status} position="inside" fill="#fff" />
            </Bar>
          ))}
        </BarChart>
      </ChartContainer>
      {/* Легенда */}
      <div className="flex justify-center mt-4 space-x-4">
        {statuses.map((status, index) => (
          <div key={status} className="flex items-center">
            <span
              className="w-4 h-4 rounded-full"
              style={{
                backgroundColor: colorPalette[index % colorPalette.length],
              }}
            ></span>
            <span className="ml-2">{status}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChartComponent;
