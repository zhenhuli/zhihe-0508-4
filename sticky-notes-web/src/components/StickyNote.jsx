import React, { useState, useRef, useEffect } from 'react';

const colors = [
  'bg-yellow-200',
  'bg-green-200',
  'bg-blue-200',
  'bg-pink-200',
  'bg-purple-200',
  'bg-orange-200'
];

function StickyNote({ note, onUpdate, onDelete, onUpdateColor, onDragStart, onDragMove, onDragEnd, isDragging, dragOffset }) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showReminder, setShowReminder] = useState(false);
  const [reminderDateTime, setReminderDateTime] = useState(
    note.reminder ? new Date(note.reminder).toISOString().slice(0, 16) : ''
  );

  const handleTextChange = (e) => {
    const newText = e.target.value;
    onUpdate(note.id, { content: newText });
  };

  const handleColorChange = (color) => {
    onUpdateColor(note.id, color);
    setShowColorPicker(false);
  };

  const handleReminderChange = (e) => {
    const value = e.target.value;
    setReminderDateTime(value);
    if (value) {
      onUpdate(note.id, { reminder: new Date(value).toISOString() });
    } else {
      onUpdate(note.id, { reminder: null });
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isReminderPast = note.reminder && new Date(note.reminder) < new Date();
  const isReminderSoon = note.reminder && 
    new Date(note.reminder) > new Date() && 
    new Date(note.reminder) - new Date() < 3600000;

  const currentPosition = isDragging && dragOffset
    ? { x: note.position.x + dragOffset.x, y: note.position.y + dragOffset.y }
    : note.position;

  return (
    <div
      style={{
        position: 'absolute',
        left: currentPosition.x,
        top: currentPosition.y,
        zIndex: isDragging ? 1000 : note.zIndex || 1,
        opacity: isDragging ? 0.8 : 1,
      }}
      className={`w-64 min-h-64 p-4 rounded-lg shadow-lg ${note.color} cursor-default`}
      onClick={() => {
        setShowColorPicker(false);
        setShowReminder(false);
      }}
    >
      <div 
        className="absolute top-2 left-2 right-2 h-6 cursor-grab active:cursor-grabbing z-10"
        onMouseDown={(e) => {
          e.preventDefault();
          onDragStart(note.id, e.clientX, e.clientY);
        }}
      />
      
      <div className="flex justify-between items-start mb-2 mt-4">
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowColorPicker(!showColorPicker);
              setShowReminder(false);
            }}
            className="w-6 h-6 rounded-full bg-white border border-gray-300 hover:bg-gray-100 text-xs flex items-center justify-center"
            title="更改颜色"
          >
            🎨
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowReminder(!showReminder);
              setShowColorPicker(false);
            }}
            className={`w-6 h-6 rounded-full border text-xs flex items-center justify-center ${
              isReminderPast 
                ? 'bg-red-100 border-red-300 text-red-600' 
                : isReminderSoon 
                  ? 'bg-orange-100 border-orange-300 text-orange-600'
                  : 'bg-white border-gray-300 hover:bg-gray-100'
            }`}
            title="设置提醒"
          >
            ⏰
          </button>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(note.id);
          }}
          className="w-6 h-6 rounded-full bg-red-100 border border-red-300 hover:bg-red-200 text-red-600 text-xs flex items-center justify-center"
          title="删除"
        >
          ✕
        </button>
      </div>

      {showColorPicker && (
        <div className="absolute top-12 left-2 z-50 bg-white p-2 rounded-lg shadow-lg flex gap-2" onClick={(e) => e.stopPropagation()}>
          {colors.map((color) => (
            <button
              key={color}
              onClick={(e) => {
                e.stopPropagation();
                handleColorChange(color);
              }}
              className={`w-6 h-6 rounded-full ${color} border-2 ${
                note.color === color ? 'border-gray-600' : 'border-gray-300'
              } hover:scale-110 transition-transform`}
            />
          ))}
        </div>
      )}

      {showReminder && (
        <div className="absolute top-12 right-2 z-50 bg-white p-3 rounded-lg shadow-lg w-56" onClick={(e) => e.stopPropagation()}>
          <label className="block text-xs font-medium text-gray-700 mb-2">
            设置提醒时间
          </label>
          <input
            type="datetime-local"
            value={reminderDateTime}
            onChange={handleReminderChange}
            className="w-full text-xs p-2 border border-gray-300 rounded"
          />
          {note.reminder && (
            <div className={`mt-2 text-xs ${
              isReminderPast ? 'text-red-600' : 'text-gray-600'
            }`}>
              {isReminderPast ? '已提醒' : '提醒时间: ' + formatDate(note.reminder)}
            </div>
          )}
        </div>
      )}

      <textarea
        value={note.content}
        onChange={handleTextChange}
        className="w-full h-44 bg-transparent resize-none outline-none text-gray-800 placeholder-gray-400 mt-2"
        placeholder="在此输入内容..."
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      />

      {note.reminder && (
        <div className={`text-xs mt-2 ${
          isReminderPast ? 'text-red-600' : 'text-gray-600'
        }`}>
          ⏰ {formatDate(note.reminder)}
        </div>
      )}
    </div>
  );
}

export default StickyNote;
