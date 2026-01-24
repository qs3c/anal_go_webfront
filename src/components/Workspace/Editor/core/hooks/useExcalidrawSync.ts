import { useState, useCallback, useMemo, useRef } from 'react';
import type { ExcalidrawElement, AppState, ExcalidrawImperativeAPI } from '@excalidraw/excalidraw';
import type { StructBoxElement, StructBoxMetadata, CalculatedPosition } from '../types';
import { calculateElementPosition } from '../utils/position';

interface SyncState {
  elements: readonly ExcalidrawElement[];
  appState: AppState | null;
}

// 导入数据结构（来自 go-struct-analyzer）
interface ImportStructData {
  id: string;
  x: number;
  y: number;
  metadata: StructBoxMetadata;
}

interface ImportData {
  structs: ImportStructData[];
  connections: { fromId: string; toId: string }[];
}

interface UseExcalidrawSyncReturn {
  syncState: SyncState;
  structBoxes: StructBoxElement[];
  positions: Map<string, CalculatedPosition>;
  selectedIds: string[];
  handleChange: (elements: readonly ExcalidrawElement[], appState: AppState, files: unknown) => void;
  updateStructBoxMetadata: (elementId: string, metadata: Partial<StructBoxMetadata>) => void;
  addStructBox: (x: number, y: number, metadata: StructBoxMetadata) => void;
  importFromAnalyzer: (data: ImportData) => { fromId: string; toId: string }[];
  clearAll: () => void;
}

export function useExcalidrawSync(
  excalidrawAPI: ExcalidrawImperativeAPI | null
): UseExcalidrawSyncReturn {
  // 使用 ref 存储最新状态
  const stateRef = useRef<SyncState>({
    elements: [],
    appState: null,
  });

  // 用于触发重渲染
  const [, setRenderKey] = useState(0);

  // 节流控制
  const rafRef = useRef<number | null>(null);

  // 处理 Excalidraw 变化
  const handleChange = useCallback(
    (elements: readonly ExcalidrawElement[], appState: AppState, _files: unknown) => {
      // 始终更新 ref
      stateRef.current = { elements, appState };

      // 使用 RAF 节流渲染
      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(() => {
          rafRef.current = null;
          setRenderKey(k => k + 1);
        });
      }
    },
    []
  );

  // 获取当前状态
  const syncState = stateRef.current;

  // 筛选出结构体容器元素
  const structBoxes = useMemo(() => {
    return syncState.elements.filter(
      (el): el is StructBoxElement =>
        el.type === 'rectangle' &&
        (el as StructBoxElement).customData?.type === 'struct-box'
    );
  }, [syncState.elements]);

  // 计算所有结构体容器的位置
  const positions = useMemo(() => {
    const posMap = new Map<string, CalculatedPosition>();
    if (!syncState.appState) return posMap;

    structBoxes.forEach((box) => {
      posMap.set(box.id, calculateElementPosition(box, syncState.appState!));
    });

    return posMap;
  }, [structBoxes, syncState.appState]);

  // 获取选中的元素 ID
  const selectedIds = useMemo(() => {
    if (!syncState.appState) return [];
    return Object.keys(syncState.appState.selectedElementIds || {});
  }, [syncState.appState]);

  // 更新结构体元数据
  const updateStructBoxMetadata = useCallback(
    (elementId: string, metadata: Partial<StructBoxMetadata>) => {
      if (!excalidrawAPI) return;

      const elements = excalidrawAPI.getSceneElements();
      const updatedElements = elements.map((el) => {
        if (el.id === elementId && (el as StructBoxElement).customData?.type === 'struct-box') {
          return {
            ...el,
            customData: {
              ...(el as StructBoxElement).customData!,
              ...metadata,
            },
          };
        }
        return el;
      });

      excalidrawAPI.updateScene({ elements: updatedElements });
    },
    [excalidrawAPI]
  );

  // 添加新的结构体容器
  const addStructBox = useCallback(
    (x: number, y: number, metadata: StructBoxMetadata) => {
      if (!excalidrawAPI) return;

      const newElement: StructBoxElement = {
        id: `struct-${Date.now()}`,
        type: 'rectangle',
        x,
        y,
        width: 280,
        height: 200,
        angle: 0,
        strokeColor: 'transparent',
        backgroundColor: 'transparent',
        fillStyle: 'solid',
        strokeWidth: 0,
        strokeStyle: 'solid',
        roughness: 0,
        opacity: 100,
        seed: Math.floor(Math.random() * 100000),
        version: 1,
        versionNonce: Math.floor(Math.random() * 100000),
        isDeleted: false,
        boundElements: null,
        updated: Date.now(),
        link: null,
        locked: false,
        groupIds: [],
        frameId: null,
        roundness: null,
        customData: metadata,
      };

      const elements = excalidrawAPI.getSceneElements();
      excalidrawAPI.updateScene({
        elements: [...elements, newElement],
      });
    },
    [excalidrawAPI]
  );

  // 从分析器导入数据
  const importFromAnalyzer = useCallback(
    (data: ImportData): { fromId: string; toId: string }[] => {
      if (!excalidrawAPI) return [];

      // 创建所有结构体元素
      const newElements: StructBoxElement[] = data.structs.map((item) => ({
        id: item.id,
        type: 'rectangle' as const,
        x: item.x,
        y: item.y,
        width: 250,
        height: 220,
        angle: 0,
        strokeColor: '#3b82f6',
        backgroundColor: '#eff6ff',
        fillStyle: 'solid' as const,
        strokeWidth: 2,
        strokeStyle: 'solid' as const,
        roughness: 0,
        opacity: 100,
        seed: Math.floor(Math.random() * 100000),
        version: 1,
        versionNonce: Math.floor(Math.random() * 100000),
        isDeleted: false,
        boundElements: null,
        updated: Date.now(),
        link: null,
        locked: false,
        groupIds: [],
        frameId: null,
        roundness: null,
        customData: item.metadata,
      }));

      // 获取现有元素并添加新元素
      const existingElements = excalidrawAPI.getSceneElements();
      excalidrawAPI.updateScene({
        elements: [...existingElements, ...newElements],
      });

      // 返回连接关系供调用者设置
      return data.connections;
    },
    [excalidrawAPI]
  );

  // 清空所有结构体
  const clearAll = useCallback(() => {
    if (!excalidrawAPI) return;

    const elements = excalidrawAPI.getSceneElements();
    const nonStructElements = elements.filter(
      (el) => !((el as StructBoxElement).customData?.type === 'struct-box')
    );

    excalidrawAPI.updateScene({
      elements: nonStructElements,
    });
  }, [excalidrawAPI]);

  return {
    syncState,
    structBoxes,
    positions,
    selectedIds,
    handleChange,
    updateStructBoxMetadata,
    addStructBox,
    importFromAnalyzer,
    clearAll,
  };
}
