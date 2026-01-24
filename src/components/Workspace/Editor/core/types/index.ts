import type { ExcalidrawElement, AppState } from '@excalidraw/excalidraw';

// 字段定义
export interface FieldInfo {
  name: string;
  type: string;
  expanded: boolean;
  description?: string;
}

// 方法定义
export interface MethodInfo {
  name: string;
  params: string;
  returnType?: string;
  description?: string;
  expanded: boolean;
}

// 视图类型
export type ViewType = 'fields' | 'methods' | 'description';

// 字体大小级别
export type FontSizeLevel = 's' | 'm' | 'l';

// 连线样式
export type LineStyleType = 'straight' | 'curve' | 'orthogonal';

// 结构体预设颜色
export type StructPresetColor = 'blue' | 'green' | 'black' | 'orange' | 'red' | 'gray';

// 结构体颜色（预设或自定义十六进制）
export type StructColorType = StructPresetColor | string;

// 结构体容器元数据
export interface StructBoxMetadata {
  type: 'struct-box';
  name: string;
  fields: FieldInfo[];
  methods: MethodInfo[];
  description: string;
  descriptionTitle?: string;
  currentView: ViewType;
  fontSize?: FontSizeLevel;
  color?: StructColorType;
  [key: string]: unknown; // 索引签名以兼容 Record<string, unknown>
}

// 带有自定义数据的 Excalidraw 元素
export interface StructBoxElement extends ExcalidrawElement {
  customData?: StructBoxMetadata;
}

// 计算后的位置信息
export interface CalculatedPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

// 连线信息
export interface LineInfo {
  id: string;
  fromElementId: string;
  toElementId: string;
  fromPoint: { x: number; y: number };
  toPoint: { x: number; y: number };
}

// App State 扩展
export interface ViewportState {
  zoom: { value: number };
  scrollX: number;
  scrollY: number;
}

// 工具函数类型
export type PositionCalculator = (
  element: ExcalidrawElement,
  appState: AppState
) => CalculatedPosition;

// 结构体容器组件 Props
export interface StructBoxContainerProps {
  element: StructBoxElement;
  position: CalculatedPosition;
  onUpdate: (metadata: Partial<StructBoxMetadata>) => void;
  onSelect: () => void;
  onDrag: (deltaX: number, deltaY: number) => void;
  isSelected: boolean;
  isConnectSource?: boolean;
  isConnectMode?: boolean;
  zoom: number;
}

// 视图组件通用 Props
export interface ViewProps {
  metadata: StructBoxMetadata;
  onUpdate: (metadata: Partial<StructBoxMetadata>) => void;
}

// 创建默认结构体数据
export function createDefaultStructBox(name: string = 'NewStruct'): StructBoxMetadata {
  return {
    type: 'struct-box',
    name,
    fields: [
      { name: 'id', type: 'string', expanded: false },
      { name: 'name', type: 'string', expanded: false },
      { name: 'createdAt', type: 'Date', expanded: false },
    ],
    methods: [
      { name: 'getId', params: '', returnType: 'string', expanded: false },
      { name: 'setName', params: 'name: string', returnType: 'void', expanded: false },
    ],
    description: 'A struct representing...',
    currentView: 'fields',
  };
}
