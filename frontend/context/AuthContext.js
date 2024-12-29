
import { createContext, useState, useContext, useEffect } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginUser, LogoutUser, checkAuthStatus } from "../utils/auth";
import LoaderModal from "../components/Common/Loader";
// Import User and AuthContextType classes
import { AuthContextType, User } from "./User";
import { Alert } from 'react-native';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function checkStatus() {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
          setIsLoggedIn(true);
        } else {
          const data = await checkAuthStatus();
          if (data) {
            const user = new User(data.username, data.email);
            setUser(user);
            setIsLoggedIn(true);
            await AsyncStorage.setItem("user", JSON.stringify(user));
          } else {
            setIsLoggedIn(false);
            await AsyncStorage.removeItem("user");
          }
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
        setIsLoggedIn(false);
        await AsyncStorage.removeItem("user");
        router.replace("/auth/Sign-in");
      } finally {
        setLoading(false);
      }
    }
    checkStatus();
  }, []);

  const login = async (userData) => {
    try {
      setLoading(true);
      const payload = { email: userData.email, password: userData.password };
      const data = await LoginUser(payload);
      if (data) {
        const user = new User(data.username, data.email);
        setUser(user);
        setIsLoggedIn(true);
        await AsyncStorage.setItem("user", JSON.stringify(user));
        return { success: true, message: "Login successful!" };
      } else {
        return { success: false, message: "Invalid login" };
      }
    } catch (error) {
      return { success: false, message: "Login failed" };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await LogoutUser();
      setUser(null);
      setIsLoggedIn(false);
      await AsyncStorage.removeItem("user");
      router.replace("/auth/Sign-in");
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      setLoading(false);
    }
  };

  const value = new AuthContextType(user, isLoggedIn, login, logout);

  return (
    <AuthContext.Provider value={value}>
      {loading && <LoaderModal />}
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};