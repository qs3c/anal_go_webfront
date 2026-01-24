import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { useAutoSave, loadAutoSave } from '../../../../hooks/useAutoSave';
import { Excalidraw } from '@excalidraw/excalidraw';
import type { ExcalidrawImperativeAPI } from '@excalidraw/excalidraw';
import { StructBoxContainer } from './StructBox';
import { FlowingLines } from './Animation';
import PropertiesPanel from './PropertiesPanel';
import { useExcalidrawSync } from '../hooks/useExcalidrawSync';
import { createDefaultStructBox, type StructBoxMetadata, type LineStyleType } from '../types';

interface Connection {
  fromId: string;
  toId: string;
}

// 连接模式状态
interface ConnectModeState {
  active: boolean;
  fromId?: string;
}

const ExcalidrawWrapper: React.FC<{ storageKey?: string }> = ({ storageKey }) => {
  const [excalidrawAPI, setExcalidrawAPI] = useState<ExcalidrawImperativeAPI | null>(null);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [connectMode, setConnectMode] = useState<ConnectModeState>({ active: false });
  const [lineStyle, setLineStyle] = useState<LineStyleType>('straight');

  const {
    syncState,
    structBoxes,
    positions,
    selectedIds,
    handleChange,
    updateStructBoxMetadata,
    addStructBox,
    importFromAnalyzer,
    clearAll,
  } = useExcalidrawSync(excalidrawAPI);

  // 文件输入 ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddStructBox = useCallback(() => {
    const canvasX = syncState.appState
      ? (400 - syncState.appState.scrollX) / syncState.appState.zoom.value
      : 200;
    const canvasY = syncState.appState
      ? (300 - syncState.appState.scrollY) / syncState.appState.zoom.value
      : 200;

    const count = structBoxes.length + 1;
    const metadata = createDefaultStructBox(`Struct${count}`);
    addStructBox(canvasX, canvasY, metadata);
  }, [addStructBox, structBoxes.length, syncState.appState]);

  // 切换连接模式
  const handleToggleConnectMode = useCallback(() => {
    setConnectMode((prev) => {
      if (prev.active) {
        // 退出连接模式
        return { active: false };
      } else {
        // 进入连接模式
        return { active: true };
      }
    });
  }, []);

  // 在连接模式下点击结构体
  const handleConnectClick = useCallback(
    (elementId: string) => {
      if (!connectMode.active) return;

      if (!connectMode.fromId) {
        // 选择第一个元素
        setConnectMode({ active: true, fromId: elementId });
      } else if (connectMode.fromId !== elementId) {
        // 选择第二个元素，建立连接
        setConnections((prev) => [
          ...prev,
          { fromId: connectMode.fromId!, toId: elementId },
        ]);
        // 建立连接后自动退出连线模式
        setConnectMode({ active: false });
      }
    },
    [connectMode]
  );

  const handleClearConnections = useCallback(() => {
    setConnections([]);
  }, []);

  // 处理文件导入
  const handleImportClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const data = JSON.parse(content);

          // 验证数据格式
          if (!data.structs || !Array.isArray(data.structs)) {
            alert('无效的文件格式：缺少 structs 数组');
            return;
          }

          // 清空现有内容
          clearAll();
          setConnections([]);

          // 导入新数据
          const newConnections = importFromAnalyzer(data);
          setConnections(newConnections);

          console.log(`导入成功: ${data.structs.length} 个结构体, ${newConnections.length} 条连线`);
        } catch (error) {
          console.error('导入失败:', error);
          alert('导入失败：JSON 解析错误');
        }
      };
      reader.readAsText(file);

      // 重置文件输入，允许重复选择同一文件
      event.target.value = '';
    },
    [importFromAnalyzer, clearAll]
  );

  // 清空所有内容
  const handleClearAll = useCallback(() => {
    if (structBoxes.length === 0 && connections.length === 0) return;
    if (confirm('确定要清空所有结构体和连线吗？')) {
      clearAll();
      setConnections([]);
    }
  }, [clearAll, structBoxes.length, connections.length]);

  // 键盘快捷键：C 键进入/退出连线模式，Escape 退出连线模式
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 如果正在输入文字，不处理快捷键
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      if (e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        setConnectMode((prev) => ({
          active: !prev.active,
          fromId: undefined,
        }));
      } else if (e.key === 'Escape' && connectMode.active) {
        e.preventDefault();
        setConnectMode({ active: false });
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [connectMode.active]);

  // 获取连接模式的按钮文字
  const getConnectButtonText = () => {
    if (!connectMode.active) return 'Connect';
    if (!connectMode.fromId) return 'Select first...';
    return 'Select second...';
  };

  const renderTopRightUI = useCallback(() => {
    return (
      <div className="custom-toolbar">
        {/* 导入按钮 */}
        <button onClick={handleImportClick} title="导入分析结果 JSON">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Import
        </button>
        <button onClick={handleAddStructBox}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <line x1="12" y1="8" x2="12" y2="16" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
          Add Struct
        </button>
        <button
          onClick={handleToggleConnectMode}
          title="快捷键: C"
          style={{
            background: connectMode.active ? '#3b82f6' : undefined,
            color: connectMode.active ? 'white' : undefined,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14" />
            <path d="M12 5l7 7-7 7" />
          </svg>
          {getConnectButtonText()}
          <span style={{
            marginLeft: 4,
            opacity: 0.7,
            fontSize: 10,
            padding: '1px 4px',
            background: connectMode.active ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
            borderRadius: 3,
          }}>C</span>
        </button>
        {connections.length > 0 && (
          <button onClick={handleClearConnections}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            Clear Lines
          </button>
        )}
        {(structBoxes.length > 0 || connections.length > 0) && (
          <button onClick={handleClearAll} title="清空所有内容">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
            Clear All
          </button>
        )}
      </div>
    );
  }, [handleImportClick, handleAddStructBox, handleToggleConnectMode, handleClearConnections, handleClearAll, connectMode, connections.length, structBoxes.length]);

  const handleStructBoxUpdate = useCallback(
    (elementId: string) => (metadata: Partial<StructBoxMetadata>) => {
      updateStructBoxMetadata(elementId, metadata);
    },
    [updateStructBoxMetadata]
  );

  // 选中结构体元素
  const handleStructBoxSelect = useCallback(
    (elementId: string) => () => {
      // 如果在连接模式下，处理连接逻辑
      if (connectMode.active) {
        handleConnectClick(elementId);
        return;
      }

      // 正常选中逻辑
      if (!excalidrawAPI) return;
      excalidrawAPI.updateScene({
        appState: {
          selectedElementIds: { [elementId]: true },
        },
      });
    },
    [excalidrawAPI, connectMode.active, handleConnectClick]
  );

  // 拖拽结构体元素
  const handleStructBoxDrag = useCallback(
    (elementId: string) => (deltaX: number, deltaY: number) => {
      if (!excalidrawAPI) return;

      const elements = excalidrawAPI.getSceneElements();
      const updatedElements = elements.map((el) => {
        if (el.id === elementId) {
          return {
            ...el,
            x: el.x + deltaX,
            y: el.y + deltaY,
          };
        }
        return el;
      });

      excalidrawAPI.updateScene({ elements: updatedElements });
    },
    [excalidrawAPI]
  );

  // 获取选中的结构体
  const selectedStructBox = useMemo(() => {
    if (selectedIds.length !== 1) return null;
    return structBoxes.find((box) => selectedIds.includes(box.id)) || null;
  }, [selectedIds, structBoxes]);

  // 判断是否选中了结构体
  const isStructBoxSelected = selectedStructBox !== null;

  return (
    <div className={`excalidraw-wrapper ${isStructBoxSelected ? 'struct-selected' : ''}`}>
      {/* 隐藏的文件输入 */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json"
        style={{ display: 'none' }}
      />

      <Excalidraw
        excalidrawAPI={(api) => setExcalidrawAPI(api)}
        onChange={handleChange}
        renderTopRightUI={renderTopRightUI}
      />

      {/* 连线动画层 */}
      <FlowingLines
        structBoxes={structBoxes}
        connections={connections}
        appState={syncState.appState}
        enabled={connections.length > 0}
        lineStyle={lineStyle}
      />

      {/* 结构体容器叠加层 */}
      <div className="struct-box-overlay">
        {structBoxes.map((box) => {
          const position = positions.get(box.id);
          if (!position || !box.customData) return null;

          return (
            <StructBoxContainer
              key={box.id}
              element={box}
              position={position}
              onUpdate={handleStructBoxUpdate(box.id)}
              onSelect={handleStructBoxSelect(box.id)}
              onDrag={handleStructBoxDrag(box.id)}
              isSelected={selectedIds.includes(box.id)}
              isConnectSource={connectMode.fromId === box.id}
              isConnectMode={connectMode.active}
              zoom={syncState.appState?.zoom?.value || 1}
            />
          );
        })}
      </div>

      {/* 左侧属性面板 */}
      {selectedStructBox && selectedStructBox.customData && (
        <PropertiesPanel
          metadata={selectedStructBox.customData}
          onUpdate={handleStructBoxUpdate(selectedStructBox.id)}
          lineStyle={lineStyle}
          onLineStyleChange={setLineStyle}
          hasConnections={connections.length > 0}
        />
      )}
    </div>
  );
};

export default ExcalidrawWrapper;
