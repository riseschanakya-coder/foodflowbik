import React, { createContext, useContext, useState } from 'react';
import { MenuItem } from '../data/restaurants';

type CartItem = MenuItem & { quantity: number };
type Store = {
  cart: CartItem[];
  favorites: string[];
  isLoggedIn: boolean;
  userName: string;
  authToken: string | null;
  isDark: boolean;
  addToCart: (item: MenuItem) => void;
  removeFromCart: (id: string) => void;
  toggleFavorite: (id: string) => void;
  login: (name: string, token?: string) => void;
  logout: () => void;
  toggleTheme: () => void;
};
const Context = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('Arjun Mehta');
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(false);
  const addToCart = (item: MenuItem) => setCart(prev => prev.find(x => x.id === item.id) ? prev.map(x => x.id === item.id ? {...x, quantity:x.quantity+1} : x) : [...prev, {...item, quantity:1}]);
  const removeFromCart = (id: string) => setCart(prev => prev.flatMap(x => x.id !== id ? [x] : x.quantity > 1 ? [{...x, quantity:x.quantity-1}] : []));
  const toggleFavorite = (id: string) => setFavorites(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const login = (name: string, token?: string) => {
    setUserName(name.trim() || 'Food Lover');
    setAuthToken(token || null);
    setIsLoggedIn(true);
  };
  const logout = () => {
    setAuthToken(null);
    setIsLoggedIn(false);
  };
  const toggleTheme = () => setIsDark(value => !value);
  return <Context.Provider value={{cart, favorites, isLoggedIn, userName, authToken, isDark, toggleTheme, addToCart, removeFromCart, toggleFavorite, login, logout}}>{children}</Context.Provider>;
}
export const useStore = () => { const value = useContext(Context); if (!value) throw new Error('Store provider missing'); return value; };
