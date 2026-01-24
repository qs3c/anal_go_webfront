import React, { useRef, memo, useMemo } from 'react';
import type { AppState } from '@excalidraw/excalidraw';
import type { StructBoxElement, LineStyleType } from '../../types';
import { calculateLinePoints } from '../../utils/position';
import { useAnimation } from '../../hooks/useAnimation';

interface FlowingLinesProps {
  structBoxes: StructBoxElement[];
  connections: Array<{ fromId: string; toId: string }>;
  appState: AppState | null;
  enabled?: boolean;
  lineStyle?: LineStyleType;
}

const FlowingLines: React.FC<FlowingLinesProps> = ({
  structBoxes,
  connections,
  appState,
  enabled = true,
  lineStyle = 'straight',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 计算所有连线的坐标
  const lines = useMemo(() => {
    if (!appState) return [];

    const elementMap = new Map(structBoxes.map((el) => [el.id, el]));
    const result: Array<{ from: { x: number; y: number }; to: { x: number; y: number } }> = [];

    connections.forEach((conn) => {
      const fromElement = elementMap.get(conn.fromId);
      const toElement = elementMap.get(conn.toId);

      if (fromElement && toElement) {
        const points = calculateLinePoints(fromElement, toElement, appState);
        result.push(points);
      }
    });

    return result;
  }, [structBoxes, connections, appState]);

  // 使用动画 Hook
  useAnimation(canvasRef, lines, { enabled, lineStyle });

  return (
    <canvas
      ref={canvasRef}
      className="animation-canvas"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    />
  );
};

export default memo(FlowingLines);
