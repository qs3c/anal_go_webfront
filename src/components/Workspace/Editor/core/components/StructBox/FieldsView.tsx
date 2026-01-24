import React, { memo, useState, useCallback } from 'react';
import type { ViewProps, FieldInfo } from '../../types';

interface EditingState {
  index: number;
  field: 'name' | 'type' | 'description';
}

const FieldsView: React.FC<ViewProps> = ({ metadata, onUpdate }) => {
  const [editing, setEditing] = useState<EditingState | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleStartEdit = useCallback((index: number, field: 'name' | 'type' | 'description') => {
    setEditing({ index, field });
    setEditValue(metadata.fields[index][field] || '');
  }, [metadata.fields]);

  const handleSaveEdit = useCallback(() => {
    if (!editing) return;

    const newFields = [...metadata.fields];
    newFields[editing.index] = {
      ...newFields[editing.index],
      [editing.field]: editValue.trim() || newFields[editing.index][editing.field],
    };
    onUpdate({ fields: newFields });
    setEditing(null);
  }, [editing, editValue, metadata.fields, onUpdate]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      setEditing(null);
    }
  }, [handleSaveEdit]);

  const handleToggleExpand = useCallback((index: number) => {
    const newFields = metadata.fields.map((field, i) => {
      if (i === index) {
        return { ...field, expanded: !field.expanded };
      }
      return field;
    });
    onUpdate({ fields: newFields });
  }, [metadata.fields, onUpdate]);

  const handleAddField = useCallback(() => {
    const newField: FieldInfo = {
      name: 'newField',
      type: 'string',
      expanded: false,
    };
    onUpdate({ fields: [...metadata.fields, newField] });
  }, [metadata.fields, onUpdate]);

  const handleDeleteField = useCallback((index: number) => {
    const newFields = metadata.fields.filter((_, i) => i !== index);
    onUpdate({ fields: newFields });
  }, [metadata.fields, onUpdate]);

  return (
    <div className="fields-view">
      <div className="item-list">
        {metadata.fields.map((field, index) => (
          <div key={index} className="item-row">
            <div className="item-header">
              <svg
                className={`item-expand-icon ${field.expanded ? 'expanded' : ''}`}
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
                    {field.name}
                  </span>
                )}

                <span className="item-separator">:</span>

                {editing?.index === index && editing.field === 'type' ? (
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
                    className="item-type"
                    onDoubleClick={() => handleStartEdit(index, 'type')}
                    title="Double-click to edit"
                  >
                    {field.type}
                  </span>
                )}
              </div>

              <button
                className="item-delete-btn"
                onClick={() => handleDeleteField(index)}
                title="Delete field"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {field.expanded && (
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
                    {field.description || 'No description'}
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <button className="add-item-btn" onClick={handleAddField}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Add Field
      </button>
    </div>
  );
};

export default memo(FieldsView);
