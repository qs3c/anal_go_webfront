import React, { memo, useState, useCallback } from 'react';
import type { FontSizeLevel, StructBoxMetadata, LineStyleType, StructPresetColor } from '../types';

interface PropertiesPanelProps {
  metadata: StructBoxMetadata;
  onUpdate: (updates: Partial<StructBoxMetadata>) => void;
  lineStyle: LineStyleType;
  onLineStyleChange: (style: LineStyleType) => void;
  hasConnections: boolean;
}

const FONT_SIZES: FontSizeLevel[] = ['s', 'm', 'l'];
const FONT_SIZE_LABELS: Record<FontSizeLevel, string> = {
  s: 'Small',
  m: 'Medium',
  l: 'Large',
};

const LINE_STYLES: LineStyleType[] = ['straight', 'curve', 'orthogonal'];
const LINE_STYLE_LABELS: Record<LineStyleType, string> = {
  straight: 'Straight',
  curve: 'Curve',
  orthogonal: 'Right Angle',
};

const PRESET_COLORS: StructPresetColor[] = ['blue', 'green', 'black', 'orange', 'red', 'gray'];
const PRESET_COLOR_VALUES: Record<StructPresetColor, string> = {
  blue: '#3b82f6',
  green: '#10b981',
  black: '#1e293b',
  orange: '#f97316',
  red: '#ef4444',
  gray: '#6b7280',
};

// 获取颜色的实际值
const getColorValue = (color: string): string => {
  if (color in PRESET_COLOR_VALUES) {
    return PRESET_COLOR_VALUES[color as StructPresetColor];
  }
  return color; // 自定义颜色直接返回
};

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  metadata,
  onUpdate,
  lineStyle,
  onLineStyleChange,
  hasConnections,
}) => {
  const currentSize = metadata.fontSize || 'm';
  const currentColor = metadata.color || 'blue';
  const currentColorValue = getColorValue(currentColor);
  const [customColorInput, setCustomColorInput] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  // 判断当前颜色是否为自定义颜色
  const isCustomColor = !(currentColor in PRESET_COLOR_VALUES);

  // 标准化颜色格式
  const normalizeColor = useCallback((input: string): string | null => {
    let color = input.trim();
    // 如果没有#前缀，添加它
    if (!color.startsWith('#')) {
      color = '#' + color;
    }
    // 验证是否为有效的十六进制颜色
    if (/^#[0-9A-Fa-f]{6}$/.test(color) || /^#[0-9A-Fa-f]{3}$/.test(color)) {
      return color;
    }
    return null;
  }, []);

  const handleCustomColorSubmit = useCallback(() => {
    const color = normalizeColor(customColorInput);
    if (color) {
      onUpdate({ color });
      setShowCustomInput(false);
      setCustomColorInput('');
    }
  }, [customColorInput, normalizeColor, onUpdate]);

  const handleCustomColorKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCustomColorSubmit();
    } else if (e.key === 'Escape') {
      setShowCustomInput(false);
      setCustomColorInput('');
    }
  }, [handleCustomColorSubmit]);

  return (
    <div className="properties-panel">
      <div className="properties-title">
        <span className="properties-title-icon" style={{ color: currentColorValue }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <line x1="9" y1="9" x2="15" y2="9" />
            <line x1="9" y1="13" x2="15" y2="13" />
            <line x1="9" y1="17" x2="12" y2="17" />
          </svg>
        </span>
        {metadata.name}
      </div>

      {/* 颜色选择 */}
      <div className="properties-section">
        <div className="properties-label">Color</div>
        <div className="properties-colors">
          {PRESET_COLORS.map((color) => (
            <button
              key={color}
              className={`properties-color-btn ${currentColor === color ? 'active' : ''}`}
              style={{ backgroundColor: PRESET_COLOR_VALUES[color] }}
              onClick={() => onUpdate({ color })}
              title={color.charAt(0).toUpperCase() + color.slice(1)}
            />
          ))}
          {/* 自定义颜色按钮 */}
          <button
            className={`properties-color-btn custom ${isCustomColor ? 'active' : ''}`}
            style={{ backgroundColor: isCustomColor ? currentColorValue : undefined }}
            onClick={() => setShowCustomInput(!showCustomInput)}
            title="自定义颜色"
          >
            {!isCustomColor && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="16" />
                <line x1="8" y1="12" x2="16" y2="12" />
              </svg>
            )}
          </button>
        </div>
        {/* 自定义颜色输入框 */}
        {showCustomInput && (
          <div className="properties-custom-color">
            <div className="properties-custom-color-row">
              <input
                type="text"
                placeholder="ff5500"
                value={customColorInput}
                onChange={(e) => setCustomColorInput(e.target.value)}
                onKeyDown={handleCustomColorKeyDown}
                autoFocus
                className="properties-custom-color-input"
              />
              <div
                className="properties-custom-color-preview"
                style={{
                  backgroundColor: normalizeColor(customColorInput) || '#ccc',
                }}
                onClick={handleCustomColorSubmit}
                title="点击应用颜色"
              />
            </div>
            <button
              className="properties-custom-color-apply"
              onClick={handleCustomColorSubmit}
              disabled={!normalizeColor(customColorInput)}
            >
              应用
            </button>
          </div>
        )}
      </div>

      <div className="properties-section">
        <div className="properties-label">Font Size</div>
        <div className="properties-font-sizes">
          {FONT_SIZES.map((size) => (
            <button
              key={size}
              className={`properties-font-btn ${currentSize === size ? 'active' : ''}`}
              onClick={() => onUpdate({ fontSize: size })}
              title={FONT_SIZE_LABELS[size]}
            >
              {size.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* 连线样式 */}
      <div className="properties-section">
        <div className="properties-label">Line Style</div>
        <div className="properties-line-styles">
          {LINE_STYLES.map((style) => (
            <button
              key={style}
              className={`properties-line-btn ${lineStyle === style ? 'active' : ''}`}
              onClick={() => onLineStyleChange(style)}
              title={LINE_STYLE_LABELS[style]}
            >
              <svg width="24" height="16" viewBox="0 0 24 16">
                {style === 'straight' && (
                  <line x1="2" y1="8" x2="22" y2="8" stroke="currentColor" strokeWidth="2" />
                )}
                {style === 'curve' && (
                  <path d="M2 14 Q12 -6 22 14" fill="none" stroke="currentColor" strokeWidth="2" />
                )}
                {style === 'orthogonal' && (
                  <path d="M2 14 L2 8 L22 8 L22 2" fill="none" stroke="currentColor" strokeWidth="2" />
                )}
              </svg>
            </button>
          ))}
        </div>
        {!hasConnections && (
          <div className="properties-hint">Use "Connect" to add lines</div>
        )}
      </div>

      {/* 结构体信息 */}
      <div className="properties-section">
        <div className="properties-label">Info</div>
        {/* 描述简述 */}
        <div className="properties-description">
          <div className="properties-description-title">
            {metadata.descriptionTitle || 'Description'}
          </div>
          <div className="properties-description-content">
            {metadata.description || 'No description'}
          </div>
        </div>
        {/* 统计信息 */}
        <div className="properties-stats">
          <span className="properties-stat">
            <span className="properties-stat-value">{metadata.fields.length}</span>
            <span className="properties-stat-label">Fields</span>
          </span>
          <span className="properties-stat">
            <span className="properties-stat-value">{metadata.methods.length}</span>
            <span className="properties-stat-label">Methods</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default memo(PropertiesPanel);
