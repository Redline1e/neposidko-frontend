
"use client";
import ProtectedRoute from "../../page";

const ProtectedPage = () => {
  return (
    <ProtectedRoute>
      <div>
        <h1>Protected Page</h1>
        <p>Вітаємо! У вас є доступ до цієї сторінки.</p>
      </div>
    </ProtectedRoute>
  );
};

export default ProtectedPage;
