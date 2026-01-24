import React, { memo, useState, useCallback } from 'react';
import type { ViewProps, MethodInfo } from '../../types';

interface EditingState {
  index: number;
  field: 'name' | 'params' | 'returnType' | 'description';
}

const MethodsView: React.FC<ViewProps> = ({ metadata, onUpdate }) => {
  const [editing, setEditing] = useState<EditingState | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleStartEdit = useCallback((index: number, field: 'name' | 'params' | 'returnType' | 'description') => {
    setEditing({ index, field });
    setEditValue(metadata.methods[index][field] || '');
  }, [metadata.methods]);

  const handleSaveEdit = useCallback(() => {
    if (!editing) return;

    const newMethods = [...metadata.methods];
    newMethods[editing.index] = {
      ...newMethods[editing.index],
      [editing.field]: editValue.trim(),
    };
    onUpdate({ methods: newMethods });
    setEditing(null);
  }, [editing, editValue, metadata.methods, onUpdate]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      setEditing(null);
    }
  }, [handleSaveEdit]);

  const handleToggleExpand = useCallback((index: number) => {
    const newMethods = metadata.methods.map((method, i) => {
      if (i === index) {
        return { ...method, expanded: !method.expanded };
      }
      return method;
    });
    onUpdate({ methods: newMethods });
  }, [metadata.methods, onUpdate]);

  const handleAddMethod = useCallback(() => {
    const newMethod: MethodInfo = {
      name: 'newMethod',
      params: '',
      returnType: 'void',
      expanded: false,
    };
    onUpdate({ methods: [...metadata.methods, newMethod] });
  }, [metadata.methods, onUpdate]);

  const handleDeleteMethod = useCallback((index: number) => {
    const newMethods = metadata.methods.filter((_, i) => i !== index);
    onUpdate({ methods: newMethods });
  }, [metadata.methods, onUpdate]);

  return (
    <div className="methods-view">
      <div className="item-list">
        {metadata.methods.map((method, index) => (
          <div key={index} className="item-row">
            <div className="item-header">
              <svg
                className={`item-expand-icon ${method.expanded ? 'expanded' : ''}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                onClick={() => handleToggleExpand(index)}
                style={{ cursor: 'pointer', flexShrink: 0 }}
              >
                <path d="M9 18l6-6-6-6" />
              </svg>

              <div className="item-signature">
                {editing?.index === index && editing.field === 'name' ? (
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={handleSaveEdit}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    className="edit-input"
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <span
                    className="item-name"
                    onDoubleClick={() => handleStartEdit(index, 'name')}
                    title="Double-click to edit"
                  >
                    {method.name}
                  </span>
                )}

                <span className="method-parens">(</span>
                {editing?.index === index && editing.field === 'params' ? (
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={handleSaveEdit}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    className="edit-input params-input"
                    onClick={(e) => e.stopPropagation()}
                    placeholder="params"
                  />
                ) : (
                  <span
                    className={`item-params ${!method.params ? 'item-params-empty' : ''}`}
                    onDoubleClick={() => handleStartEdit(index, 'params')}
                    title="Double-click to edit"
                  >
                    {method.params || ''}
                  </span>
                )}
                <span className="method-parens">)</span>

                {method.returnType && (
                  <>
                    <span className="item-separator">:</span>
                    {editing?.index === index && editing.field === 'returnType' ? (
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={handleSaveEdit}
                        onKeyDown={handleKeyDown}
                        autoFocus
                        className="edit-input type-input"
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <span
                        className="item-return"
                        onDoubleClick={() => handleStartEdit(index, 'returnType')}
                        title="Double-click to edit"
                      >
                        {method.returnType}
                      </span>
                    )}
                  </>
                )}
              </div>

              <button
                className="item-delete-btn"
                onClick={() => handleDeleteMethod(index)}
                title="Delete method"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {method.expanded && (
              <div className="item-details">
                {editing?.index === index && editing.field === 'description' ? (
                  <textarea
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={handleSaveEdit}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') {
                        setEditing(null);
                      }
                    }}
                    autoFocus
                    className="edit-textarea"
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Enter description..."
                  />
                ) : (
                  <span
                    className="item-description-text"
                    onDoubleClick={() => handleStartEdit(index, 'description')}
                    title="Double-click to edit"
                  >
                    {method.description || 'No description'}
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <button className="add-item-btn" onClick={handleAddMethod}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Add Method
      </button>
    </div>
  );
};

export default memo(MethodsView);
