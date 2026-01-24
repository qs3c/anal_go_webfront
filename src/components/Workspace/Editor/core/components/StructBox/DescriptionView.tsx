import React, { memo, useState, useCallback } from 'react';
import type { ViewProps } from '../../types';

type EditingField = 'title' | 'content' | null;

const DescriptionView: React.FC<ViewProps> = ({ metadata, onUpdate }) => {
  const [editing, setEditing] = useState<EditingField>(null);
  const [editValue, setEditValue] = useState('');

  const handleStartEdit = useCallback((field: 'title' | 'content') => {
    setEditing(field);
    if (field === 'title') {
      setEditValue(metadata.descriptionTitle || 'Description');
    } else {
      setEditValue(metadata.description || '');
    }
  }, [metadata.descriptionTitle, metadata.description]);

  const handleSaveEdit = useCallback(() => {
    if (!editing) return;

    if (editing === 'title') {
      onUpdate({ descriptionTitle: editValue.trim() || 'Description' });
    } else {
      onUpdate({ description: editValue.trim() });
    }
    setEditing(null);
  }, [editing, editValue, onUpdate]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setEditing(null);
    }
  }, []);

  return (
    <div className="description-view">
      {editing === 'title' ? (
        <input
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSaveEdit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSaveEdit();
            } else if (e.key === 'Escape') {
              setEditing(null);
            }
          }}
          autoFocus
          className="edit-input description-title-input"
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <div
          className="description-view-title"
          onDoubleClick={() => handleStartEdit('title')}
          title="Double-click to edit"
        >
          {metadata.descriptionTitle || 'Description'}
        </div>
      )}

      {editing === 'content' ? (
        <textarea
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSaveEdit}
          onKeyDown={handleKeyDown}
          autoFocus
          className="edit-textarea description-content-input"
          onClick={(e) => e.stopPropagation()}
          placeholder="Enter description..."
        />
      ) : (
        <p
          className="description-view-content"
          onDoubleClick={() => handleStartEdit('content')}
          title="Double-click to edit"
        >
          {metadata.description || 'No description available'}
        </p>
      )}
    </div>
  );
};

export default memo(DescriptionView);
