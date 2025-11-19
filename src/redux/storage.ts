/**
 * Custom storage adapter for redux-persist that works with Next.js
 * Only runs on the client side
 */

const createAsyncStorage = () => {
  // Server-side: no-op storage that returns null
  if (typeof window === "undefined") {
    return {
      getItem: async () => null,
      setItem: async () => {},
      removeItem: async () => {},
    };
  }

  // Client-side: use localStorage safely
  return {
    getItem: async (key: string) => {
      try {
        const item = window.localStorage.getItem(key);
        return Promise.resolve(item);
      } catch (error) {
        console.warn("Failed to read from localStorage:", error);
        return Promise.resolve(null);
      }
    },

    setItem: async (key: string, value: string) => {
      try {
        window.localStorage.setItem(key, value);
        return Promise.resolve();
      } catch (error) {
        console.warn("Failed to write to localStorage:", error);
        return Promise.resolve();
      }
    },

    removeItem: async (key: string) => {
      try {
        window.localStorage.removeItem(key);
        return Promise.resolve();
      } catch (error) {
        console.warn("Failed to remove from localStorage:", error);
        return Promise.resolve();
      }
    },
  };
};

// Export the async storage created immediately (will return no-op on server, real storage on client)
const storage = createAsyncStorage();
export default storage;
