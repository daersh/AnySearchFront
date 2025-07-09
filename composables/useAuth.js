import { useCookie } from '#app';
import { jwtDecode } from 'jwt-decode';

export const useAuth = () => {
  const token = useCookie('token');

  const getUser = () => {
    if (token.value) {
      try {
        const decoded = jwtDecode(token.value);
        console.log("Decoded token:", decoded);
        return decoded;
      } catch (e) {
        console.error("Error decoding token:", e);
        return null;
      }
    }
    return null;
  };

  const isAdmin = () => {
    const user = getUser();
    console.log("Checking if user is admin:", user);
    return user && user.user_role === 'ROLE_ADMIN';
  };

  return {
    getUser,
    isAdmin,
    token,
  };
};
