import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        accessories: resolve(__dirname, 'accessories.html'),
        bestSellers: resolve(__dirname, 'best-sellers.html'),
        cart: resolve(__dirname, 'cart.html'),
        mens: resolve(__dirname, 'mens.html'),
        newArrivals: resolve(__dirname, 'new-arrivals.html'),
        offers: resolve(__dirname, 'offers.html'),
        profile: resolve(__dirname, 'profile.html'),
        wishlist: resolve(__dirname, 'wishlist.html'),
        womens: resolve(__dirname, 'womens.html')
      }
    }
  }
});
