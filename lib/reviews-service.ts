// import { Review } from "@/utils/api";
// import axios from "axios";

// // Assuming you have a token in localStorage or from context
// const token = localStorage.getItem("authToken");

// export async function fetchReviews(articleNumber: number): Promise<Review[]> {
//   const token = localStorage.getItem("authToken");
//   try {
//     const response = await axios.get(
//       `http://localhost:5000/reviews/${articleNumber}`,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );
//     return response.data;
//   } catch (error) {
//     console.error("Помилка при завантаженні відгуків:", error);
//     throw new Error("Не вдалося завантажити відгуки");
//   }
// }

// export const addReview = async (review: Review): Promise<void> => {
//   try {
//     await axios.post("http://localhost:5000/reviews", review, {
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`, // Include token here
//       },
//     });
//   } catch (error) {
//     console.error("Помилка при додаванні відгуку:", error);
//     throw new Error("Не вдалося додати відгук");
//   }
// };
