export function getToken(): string | null {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1])); 
    const expiry = payload.exp * 1000;
    if (Date.now() >= expiry) {
      localStorage.removeItem("token");
      return null;
    }
    return token;
  } catch (error) {
    console.error("Invalid token format:", error);
    localStorage.removeItem("token");
    return null;
  }
}
