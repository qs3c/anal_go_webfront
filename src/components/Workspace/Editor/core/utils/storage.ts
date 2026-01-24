import type { ExcalidrawElement } from '@excalidraw/excalidraw';

const STORAGE_KEY = 'code-visualizer-data';

interface StorageData {
  elements: ExcalidrawElement[];
  version: number;
  savedAt: string;
}

/**
 * 保存画布数据到 localStorage
 */
export function saveToStorage(elements: readonly ExcalidrawElement[]): void {
  try {
    const data: StorageData = {
      elements: elements as ExcalidrawElement[],
      version: 1,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save data to storage:', error);
  }
}

/**
 * 从 localStorage 加载画布数据
 */
export function loadFromStorage(): ExcalidrawElement[] | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const data: StorageData = JSON.parse(stored);
    return data.elements;
  } catch (error) {
    console.error('Failed to load data from storage:', error);
    return null;
  }
}

/**
 * 清除存储的数据
 */
export function clearStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear storage:', error);
  }
}

/**
 * 节流保存函数
 */
export function createThrottledSave(delay: number = 1000) {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastElements: readonly ExcalidrawElement[] | null = null;

  return (elements: readonly ExcalidrawElement[]) => {
    lastElements = elements;

    if (timeoutId) return;

    timeoutId = setTimeout(() => {
      if (lastElements) {
        saveToStorage(lastElements);
      }
      timeoutId = null;
    }, delay);
  };
}
