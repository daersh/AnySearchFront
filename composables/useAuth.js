import { useCookie } from '#app';
import { jwtDecode } from 'jwt-decode';

export const useAuth = () => {
  const token = useCookie('token');

  const getUser = () => {
    if (token.value) {
      try {
        const decoded = jwtDecode(token.value);
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
    return user && user.user_role === 'ROLE_ADMIN';
  };

  return {
    getUser,
    isAdmin,
    token,
  };
};
