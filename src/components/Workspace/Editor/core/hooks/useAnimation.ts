import { useRef, useEffect, useCallback } from 'react';
import type { LineStyleType } from '../types';

interface LineData {
  from: { x: number; y: number };
  to: { x: number; y: number };
  color?: string;
}

interface UseAnimationOptions {
  enabled?: boolean;
  lineColor?: string;
  lineWidth?: number;
  dashLength?: number;
  gapLength?: number;
  animationSpeed?: number;
  dotRadius?: number;
  dotSpeed?: number;
  lineStyle?: LineStyleType;
}

/**
 * Hook 用于管理连线流动动画
 */
export function useAnimation(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  lines: LineData[],
  options: UseAnimationOptions = {}
) {
  const {
    enabled = true,
    lineColor = '#3b82f6',
    lineWidth = 2,
    dashLength = 10,
    gapLength = 10,
    animationSpeed = 20,
    dotRadius = 4,
    dotSpeed = 2000,
    lineStyle = 'straight',
  } = options;

  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  // 绘制流动连线
  const drawLines = useCallback(
    (timestamp: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // 更新 canvas 尺寸
      const rect = canvas.getBoundingClientRect();
      if (canvas.width !== rect.width || canvas.height !== rect.height) {
        canvas.width = rect.width;
        canvas.height = rect.height;
      }

      // 清除画布
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!enabled || lines.length === 0) return;

      // 计算动画偏移
      const dashOffset = (timestamp / animationSpeed) % (dashLength + gapLength);

      lines.forEach((line) => {
        const color = line.color || lineColor;

        // 根据样式绘制路径
        ctx.save();
        ctx.setLineDash([dashLength, gapLength]);
        ctx.lineDashOffset = -dashOffset;
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.beginPath();
        drawPath(ctx, line.from, line.to, lineStyle);
        ctx.stroke();
        ctx.restore();

        // 绘制移动的圆点
        const progress = ((timestamp / dotSpeed) % 1);
        const dotPos = getPointOnPath(line.from, line.to, progress, lineStyle);

        // 绘制圆点光晕
        const gradient = ctx.createRadialGradient(
          dotPos.x, dotPos.y, 0,
          dotPos.x, dotPos.y, dotRadius * 2
        );
        gradient.addColorStop(0, color);
        gradient.addColorStop(0.5, color + '80');
        gradient.addColorStop(1, color + '00');

        ctx.save();
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(dotPos.x, dotPos.y, dotRadius * 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // 绘制实心圆点
        ctx.save();
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(dotPos.x, dotPos.y, dotRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // 绘制箭头
        const arrowEnd = getPointOnPath(line.from, line.to, 1, lineStyle);
        const arrowStart = getPointOnPath(line.from, line.to, 0.95, lineStyle);
        drawArrow(ctx, arrowStart, arrowEnd, color, lineWidth);
      });
    },
    [canvasRef, lines, enabled, lineColor, lineWidth, dashLength, gapLength, animationSpeed, dotRadius, dotSpeed, lineStyle]
  );

  // 动画循环
  const animate = useCallback(
    (timestamp: number) => {
      if (startTimeRef.current === 0) {
        startTimeRef.current = timestamp;
      }

      drawLines(timestamp - startTimeRef.current);
      animationFrameRef.current = requestAnimationFrame(animate);
    },
    [drawLines]
  );

  // 启动/停止动画
  useEffect(() => {
    if (enabled) {
      animationFrameRef.current = requestAnimationFrame(animate);
    } else {
      // 当禁用时，清除画布
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [enabled, animate]);

  // 返回控制方法
  return {
    redraw: () => drawLines(performance.now()),
  };
}

/**
 * 根据样式绘制路径
 */
function drawPath(
  ctx: CanvasRenderingContext2D,
  from: { x: number; y: number },
  to: { x: number; y: number },
  style: LineStyleType
) {
  ctx.moveTo(from.x, from.y);

  switch (style) {
    case 'straight':
      ctx.lineTo(to.x, to.y);
      break;

    case 'curve': {
      // 二次贝塞尔曲线
      const midX = (from.x + to.x) / 2;
      const midY = (from.y + to.y) / 2;
      const dx = to.x - from.x;
      const dy = to.y - from.y;
      // 控制点垂直于连线方向
      const controlX = midX - dy * 0.3;
      const controlY = midY + dx * 0.3;
      ctx.quadraticCurveTo(controlX, controlY, to.x, to.y);
      break;
    }

    case 'orthogonal': {
      // 直角折线
      const midX = (from.x + to.x) / 2;
      ctx.lineTo(midX, from.y);
      ctx.lineTo(midX, to.y);
      ctx.lineTo(to.x, to.y);
      break;
    }
  }
}

/**
 * 获取路径上的点（用于动画）
 */
function getPointOnPath(
  from: { x: number; y: number },
  to: { x: number; y: number },
  t: number,
  style: LineStyleType
): { x: number; y: number } {
  switch (style) {
    case 'straight':
      return {
        x: from.x + (to.x - from.x) * t,
        y: from.y + (to.y - from.y) * t,
      };

    case 'curve': {
      // 二次贝塞尔曲线上的点
      const midX = (from.x + to.x) / 2;
      const midY = (from.y + to.y) / 2;
      const dx = to.x - from.x;
      const dy = to.y - from.y;
      const controlX = midX - dy * 0.3;
      const controlY = midY + dx * 0.3;
      // B(t) = (1-t)²P0 + 2(1-t)tP1 + t²P2
      const oneMinusT = 1 - t;
      return {
        x: oneMinusT * oneMinusT * from.x + 2 * oneMinusT * t * controlX + t * t * to.x,
        y: oneMinusT * oneMinusT * from.y + 2 * oneMinusT * t * controlY + t * t * to.y,
      };
    }

    case 'orthogonal': {
      // 直角折线上的点（三段）
      const midX = (from.x + to.x) / 2;
      const segment1Length = Math.abs(midX - from.x);
      const segment2Length = Math.abs(to.y - from.y);
      const segment3Length = Math.abs(to.x - midX);
      const totalLength = segment1Length + segment2Length + segment3Length;

      const tLength = t * totalLength;

      if (tLength <= segment1Length) {
        // 第一段：水平线
        const segT = segment1Length > 0 ? tLength / segment1Length : 0;
        return {
          x: from.x + (midX - from.x) * segT,
          y: from.y,
        };
      } else if (tLength <= segment1Length + segment2Length) {
        // 第二段：垂直线
        const segT = segment2Length > 0 ? (tLength - segment1Length) / segment2Length : 0;
        return {
          x: midX,
          y: from.y + (to.y - from.y) * segT,
        };
      } else {
        // 第三段：水平线
        const segT = segment3Length > 0 ? (tLength - segment1Length - segment2Length) / segment3Length : 0;
        return {
          x: midX + (to.x - midX) * segT,
          y: to.y,
        };
      }
    }

    default:
      return {
        x: from.x + (to.x - from.x) * t,
        y: from.y + (to.y - from.y) * t,
      };
  }
}

/**
 * 绘制箭头
 */
function drawArrow(
  ctx: CanvasRenderingContext2D,
  from: { x: number; y: number },
  to: { x: number; y: number },
  color: string,
  _lineWidth: number
) {
  const headLength = 12;
  const angle = Math.atan2(to.y - from.y, to.x - from.x);

  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(to.x, to.y);
  ctx.lineTo(
    to.x - headLength * Math.cos(angle - Math.PI / 6),
    to.y - headLength * Math.sin(angle - Math.PI / 6)
  );
  ctx.lineTo(
    to.x - headLength * Math.cos(angle + Math.PI / 6),
    to.y - headLength * Math.sin(angle + Math.PI / 6)
  );
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}
