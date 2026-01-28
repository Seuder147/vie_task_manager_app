import { ref, watch } from 'vue';

export function useLocalStorage<T>(key: string, defaultValue: T) {
  const data = ref<T>(getStoredValue());

  function getStoredValue(): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue;
    }
  }

  function setStoredValue(value: T) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  watch(
    data,
    (newValue) => {
      setStoredValue(newValue);
    },
    { deep: true }
  );

  return data;
}
