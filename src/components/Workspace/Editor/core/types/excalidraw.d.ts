// 声明 Excalidraw 类型模块
declare module '@excalidraw/excalidraw' {
  import type { FC, MemoExoticComponent } from 'react';

  // ExcalidrawElement 基础类型
  export interface ExcalidrawElement {
    id: string;
    type: string;
    x: number;
    y: number;
    width: number;
    height: number;
    angle: number;
    strokeColor: string;
    backgroundColor: string;
    fillStyle: string;
    strokeWidth: number;
    strokeStyle: string;
    roughness: number;
    opacity: number;
    seed: number;
    version: number;
    versionNonce: number;
    isDeleted: boolean;
    boundElements: unknown;
    updated: number;
    link: string | null;
    locked: boolean;
    groupIds: string[];
    frameId: string | null;
    roundness: unknown;
    customData?: Record<string, unknown>;
  }

  // AppState 类型
  export interface AppState {
    zoom: { value: number };
    scrollX: number;
    scrollY: number;
    width: number;
    height: number;
    selectedElementIds: Record<string, boolean>;
    viewModeEnabled: boolean;
    theme: string;
    [key: string]: unknown;
  }

  // ExcalidrawImperativeAPI 类型
  export interface ExcalidrawImperativeAPI {
    updateScene: (sceneData: {
      elements?: readonly ExcalidrawElement[];
      appState?: Partial<AppState>;
      collaborators?: Map<string, unknown>;
      commitToStore?: boolean;
    }) => void;
    getSceneElements: () => readonly ExcalidrawElement[];
    getAppState: () => AppState;
    getFiles: () => Record<string, unknown>;
    scrollToContent: (
      target?: ExcalidrawElement | readonly ExcalidrawElement[],
      opts?: {
        fitToContent?: boolean;
        animate?: boolean;
        duration?: number;
      }
    ) => void;
    refresh: () => void;
    setToast: (toast: { message: string; closable?: boolean; duration?: number } | null) => void;
    id: string;
    setActiveTool: (tool: { type: string; customType?: string }) => void;
    setCursor: (cursor: string) => void;
    resetCursor: () => void;
    toggleSidebar: (opts: { name: string; tab?: string; force?: boolean }) => boolean;
  }

  // ExcalidrawProps 类型
  export interface ExcalidrawProps {
    excalidrawAPI?: (api: ExcalidrawImperativeAPI) => void;
    onChange?: (elements: readonly ExcalidrawElement[], appState: AppState, files: Record<string, unknown>) => void;
    initialData?: {
      elements?: readonly ExcalidrawElement[];
      appState?: Partial<AppState>;
      files?: Record<string, unknown>;
    };
    renderTopRightUI?: () => React.JSX.Element;
    UIOptions?: {
      canvasActions?: {
        saveAsImage?: boolean;
        loadScene?: boolean;
        export?: { saveFileToDisk?: boolean };
        [key: string]: unknown;
      };
      [key: string]: unknown;
    };
    [key: string]: unknown;
  }

  // Excalidraw 组件
  export const Excalidraw: MemoExoticComponent<FC<ExcalidrawProps>>;
}
