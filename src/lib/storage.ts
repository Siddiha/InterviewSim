// Placeholder for storage utility functions

type StorageType = "local" | "session";

function getStorage(type: StorageType): Storage | undefined {
  if (typeof window === "undefined") {
    return undefined; // Return undefined in server-side environments
  }
  return type === "local" ? localStorage : sessionStorage;
}

export function setItem(
  key: string,
  value: any,
  type: StorageType = "local"
): void {
  const storage = getStorage(type);
  if (storage) {
    try {
      storage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving item to ${type} storage:`, error);
    }
  }
}

export function getItem<T>(key: string, type: StorageType = "local"): T | null {
  const storage = getStorage(type);
  if (storage) {
    try {
      const item = storage.getItem(key);
      return item ? (JSON.parse(item) as T) : null;
    } catch (error) {
      console.error(`Error retrieving item from ${type} storage:`, error);
      return null;
    }
  }
  return null;
}

export function removeItem(key: string, type: StorageType = "local"): void {
  const storage = getStorage(type);
  if (storage) {
    try {
      storage.removeItem(key);
    } catch (error) {
      console.error(`Error removing item from ${type} storage:`, error);
    }
  }
}

export function clearStorage(type: StorageType = "local"): void {
  const storage = getStorage(type);
  if (storage) {
    try {
      storage.clear();
    } catch (error) {
      console.error(`Error clearing ${type} storage:`, error);
    }
  }
}
