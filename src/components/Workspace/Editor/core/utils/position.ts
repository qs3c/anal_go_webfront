import type { AppState } from '@excalidraw/excalidraw';
import type { CalculatedPosition, StructBoxElement } from '../types';

/**
 * 根据 Excalidraw 元素和视口状态计算屏幕位置
 * 考虑缩放和滚动偏移
 */
export function calculateElementPosition(
  element: StructBoxElement,
  appState: AppState
): CalculatedPosition {
  const { zoom, scrollX, scrollY } = appState;
  const zoomValue = zoom.value;

  return {
    x: element.x * zoomValue + scrollX,
    y: element.y * zoomValue + scrollY,
    width: element.width * zoomValue,
    height: element.height * zoomValue,
  };
}

/**
 * 计算两个元素之间连线的起点和终点
 */
export function calculateLinePoints(
  fromElement: StructBoxElement,
  toElement: StructBoxElement,
  appState: AppState
): { from: { x: number; y: number }; to: { x: number; y: number } } {
  const fromPos = calculateElementPosition(fromElement, appState);
  const toPos = calculateElementPosition(toElement, appState);

  // 计算元素中心点
  const fromCenter = {
    x: fromPos.x + fromPos.width / 2,
    y: fromPos.y + fromPos.height / 2,
  };
  const toCenter = {
    x: toPos.x + toPos.width / 2,
    y: toPos.y + toPos.height / 2,
  };

  // 计算方向
  const dx = toCenter.x - fromCenter.x;
  const dy = toCenter.y - fromCenter.y;
  const angle = Math.atan2(dy, dx);

  // 计算从边缘出发的点
  const fromPoint = getEdgePoint(fromPos, angle);
  const toPoint = getEdgePoint(toPos, angle + Math.PI);

  return { from: fromPoint, to: toPoint };
}

/**
 * 计算从矩形边缘出发的点
 */
function getEdgePoint(
  rect: CalculatedPosition,
  angle: number
): { x: number; y: number } {
  const centerX = rect.x + rect.width / 2;
  const centerY = rect.y + rect.height / 2;
  const halfWidth = rect.width / 2;
  const halfHeight = rect.height / 2;

  // 计算射线与矩形边的交点
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  let t: number;
  if (Math.abs(cos) * halfHeight > Math.abs(sin) * halfWidth) {
    // 与左右边相交
    t = halfWidth / Math.abs(cos);
  } else {
    // 与上下边相交
    t = halfHeight / Math.abs(sin);
  }

  return {
    x: centerX + cos * t,
    y: centerY + sin * t,
  };
}

/**
 * 检查点是否在元素内
 */
export function isPointInElement(
  point: { x: number; y: number },
  element: StructBoxElement,
  appState: AppState
): boolean {
  const pos = calculateElementPosition(element, appState);
  return (
    point.x >= pos.x &&
    point.x <= pos.x + pos.width &&
    point.y >= pos.y &&
    point.y <= pos.y + pos.height
  );
}
