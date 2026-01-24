import React, { memo, useCallback, useState, useRef, useEffect } from 'react';
import type { StructBoxContainerProps, ViewType, StructBoxMetadata } from '../../types';
import FieldsView from './FieldsView';
import MethodsView from './MethodsView';
import DescriptionView from './DescriptionView';

const VIEWS: ViewType[] = ['description', 'fields', 'methods'];
const VIEW_LABELS: Record<ViewType, string> = {
  description: 'Info',
  fields: 'Fields',
  methods: 'Methods',
};

// 预设颜色配置
const PRESET_COLOR_CONFIG: Record<string, { primary: string; light: string; gradient: string }> = {
  blue: {
    primary: '#3b82f6',
    light: '#eff6ff',
    gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)',
  },
  green: {
    primary: '#10b981',
    light: '#ecfdf5',
    gradient: 'linear-gradient(135deg, #10b981, #059669)',
  },
  black: {
    primary: '#1e293b',
    light: '#f8fafc',
    gradient: 'linear-gradient(135deg, #1e293b, #0f172a)',
  },
  orange: {
    primary: '#f97316',
    light: '#fff7ed',
    gradient: 'linear-gradient(135deg, #f97316, #ea580c)',
  },
  red: {
    primary: '#ef4444',
    light: '#fef2f2',
    gradient: 'linear-gradient(135deg, #ef4444, #dc2626)',
  },
  gray: {
    primary: '#6b7280',
    light: '#f9fafb',
    gradient: 'linear-gradient(135deg, #6b7280, #4b5563)',
  },
};

// 获取颜色配置（支持预设和自定义颜色）
const getColorConfig = (color: string): { primary: string; light: string; gradient: string } => {
  if (color in PRESET_COLOR_CONFIG) {
    return PRESET_COLOR_CONFIG[color];
  }
  // 自定义颜色：计算浅色和渐变
  const primary = color;
  return {
    primary,
    light: `${primary}15`, // 使用透明度生成浅色
    gradient: `linear-gradient(135deg, ${primary}, ${primary}dd)`,
  };
};

const StructBoxContainer: React.FC<StructBoxContainerProps> = ({
  element,
  position,
  onUpdate,
  onSelect,
  onDrag,
  isSelected,
  isConnectSource,
  isConnectMode,
  zoom,
}) => {
  const metadata = element.customData!;
  const [isEditing, setIsEditing] = useState(false);
  const [editingName, setEditingName] = useState(metadata.name);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);

  const switchToView = useCallback(
    (view: ViewType) => {
      onUpdate({ currentView: view });
    },
    [onUpdate]
  );

  const handlePrevView = useCallback(() => {
    const currentIndex = VIEWS.indexOf(metadata.currentView);
    const newIndex = currentIndex > 0 ? currentIndex - 1 : VIEWS.length - 1;
    switchToView(VIEWS[newIndex]);
  }, [metadata.currentView, switchToView]);

  const handleNextView = useCallback(() => {
    const currentIndex = VIEWS.indexOf(metadata.currentView);
    const newIndex = currentIndex < VIEWS.length - 1 ? currentIndex + 1 : 0;
    switchToView(VIEWS[newIndex]);
  }, [metadata.currentView, switchToView]);

  const handleMetadataUpdate = useCallback(
    (updates: Partial<StructBoxMetadata>) => {
      onUpdate(updates);
    },
    [onUpdate]
  );

  const handleNameDoubleClick = useCallback(() => {
    setIsEditing(true);
    setEditingName(metadata.name);
  }, [metadata.name]);

  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingName(e.target.value);
  }, []);

  const handleNameBlur = useCallback(() => {
    setIsEditing(false);
    if (editingName.trim() && editingName !== metadata.name) {
      onUpdate({ name: editingName.trim() });
    }
  }, [editingName, metadata.name, onUpdate]);

  const handleNameKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameBlur();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditingName(metadata.name);
    }
  }, [handleNameBlur, metadata.name]);

  const renderContent = () => {
    switch (metadata.currentView) {
      case 'fields':
        return <FieldsView metadata={metadata} onUpdate={handleMetadataUpdate} />;
      case 'methods':
        return <MethodsView metadata={metadata} onUpdate={handleMetadataUpdate} />;
      case 'description':
        return <DescriptionView metadata={metadata} onUpdate={handleMetadataUpdate} />;
      default:
        return null;
    }
  };

  const fontSizeClass = `font-size-${metadata.fontSize || 'm'}`;
  const colorConfig = getColorConfig(metadata.color || 'blue');

  // 鼠标按下标题栏 - 选中并开始拖拽
  const handleHeaderMouseDown = useCallback((e: React.MouseEvent) => {
    // 如果正在编辑标题，不处理拖拽
    if (isEditing) return;
    // 如果点击的是输入框，不处理
    if ((e.target as HTMLElement).tagName === 'INPUT') return;

    e.preventDefault();
    e.stopPropagation();

    // 在连线模式下，始终调用 onSelect 来处理连线逻辑
    if (isConnectMode) {
      onSelect();
      return; // 连线模式下不启动拖拽
    }

    // 选中元素
    if (!isSelected) {
      onSelect();
    }

    // 开始拖拽
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
  }, [isSelected, isEditing, isConnectMode, onSelect]);

  // 鼠标移动 - 拖拽中
  useEffect(() => {
    if (!isDragging) return;

    // 拖拽时设置全局光标
    document.body.style.cursor = 'grabbing';
    document.body.style.userSelect = 'none';

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragStartRef.current) return;

      const deltaX = (e.clientX - dragStartRef.current.x) / zoom;
      const deltaY = (e.clientY - dragStartRef.current.y) / zoom;

      onDrag(deltaX, deltaY);
      dragStartRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      dragStartRef.current = null;
      // 恢复光标
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging, zoom, onDrag]);

  // 构建类名
  const containerClasses = [
    'struct-box-container',
    isSelected ? 'selected' : '',
    isConnectSource ? 'connect-source' : '',
    isConnectMode ? 'connect-mode' : '',
    fontSizeClass,
  ].filter(Boolean).join(' ');

  return (
    <div
      className={containerClasses}
      style={{
        left: position.x,
        top: position.y,
        width: position.width,
        height: position.height,
        pointerEvents: 'none',
        borderColor: colorConfig.primary,
        ['--struct-color' as string]: colorConfig.primary,
        ['--struct-color-light' as string]: colorConfig.light,
      }}
    >
      {/* 标题栏 - 点击选中并拖拽，双击编辑标题 */}
      <div
        className={`struct-box-header ${isDragging ? 'dragging' : ''}`}
        style={{
          pointerEvents: 'auto',
          cursor: isConnectMode ? 'pointer' : isEditing ? 'text' : isDragging ? 'grabbing' : 'grab',
          background: colorConfig.gradient,
        }}
        onMouseDown={handleHeaderMouseDown}
      >
        {isEditing ? (
          <input
            type="text"
            value={editingName}
            onChange={handleNameChange}
            onBlur={handleNameBlur}
            onKeyDown={handleNameKeyDown}
            autoFocus
            onClick={(e) => e.stopPropagation()}
            style={{
              flex: 1,
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: 'white',
              fontWeight: 600,
              fontSize: 'inherit',
              padding: '2px 4px',
              borderRadius: '4px',
              outline: 'none',
            }}
          />
        ) : (
          <span
            className="struct-box-header-name"
            onDoubleClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              handleNameDoubleClick();
            }}
            style={{ cursor: 'text', flex: 1 }}
            title="Double-click to edit"
          >
            {metadata.name}
          </span>
        )}
      </div>

      {/* 内容区域 - 选中后才能交互 */}
      <div
        className="struct-box-content"
        style={{ pointerEvents: isSelected ? 'auto' : 'none' }}
      >
        {renderContent()}
      </div>

      {/* 底部导航栏 - 选中后才能交互 */}
      <div className="view-nav" style={{ pointerEvents: isSelected ? 'auto' : 'none' }}>
        <button className="view-nav-arrow" onClick={handlePrevView}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <div className="view-nav-tabs">
          {VIEWS.map((view) => (
            <button
              key={view}
              className={`view-nav-tab ${metadata.currentView === view ? 'active' : ''}`}
              onClick={() => switchToView(view)}
            >
              {VIEW_LABELS[view]}
            </button>
          ))}
        </div>
        <button className="view-nav-arrow" onClick={handleNextView}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default memo(StructBoxContainer);
