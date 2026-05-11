import React, { useState, useEffect, useCallback, useRef } from 'react';
import StickyNote from './components/StickyNote';
import { useLocalStorage } from './hooks/useLocalStorage';

const colors = [
  'bg-yellow-200',
  'bg-green-200',
  'bg-blue-200',
  'bg-pink-200',
  'bg-purple-200',
  'bg-orange-200'
];

const initialNotes = [
  {
    id: '1',
    content: '欢迎使用网页便利贴！\n\n点击右下角的按钮创建新的便利贴。',
    color: 'bg-yellow-200',
    position: { x: 100, y: 100 },
    zIndex: 1,
    reminder: null
  }
];

function App() {
  const [notes, setNotes] = useLocalStorage('sticky-notes', initialNotes);
  const [maxZIndex, setMaxZIndex] = useState(1);
  const [draggingId, setDraggingId] = useState(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const getRandomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const createNote = useCallback(() => {
    const newZIndex = maxZIndex + 1;
    setMaxZIndex(newZIndex);
    
    const newNote = {
      id: Date.now().toString(),
      content: '',
      color: getRandomColor(),
      position: { 
        x: 150 + Math.random() * 200, 
        y: 150 + Math.random() * 200 
      },
      zIndex: newZIndex,
      reminder: null
    };

    setNotes(prevNotes => [...prevNotes, newNote]);
  }, [maxZIndex, setNotes]);

  const updateNote = useCallback((id, updates) => {
    setNotes(prevNotes => 
      prevNotes.map(note => 
        note.id === id ? { ...note, ...updates } : note
      )
    );
  }, [setNotes]);

  const updateNoteColor = useCallback((id, color) => {
    setNotes(prevNotes => 
      prevNotes.map(note => 
        note.id === id ? { ...note, color } : note
      )
    );
  }, [setNotes]);

  const deleteNote = useCallback((id) => {
    setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
  }, [setNotes]);

  const handleDragStart = useCallback((id, clientX, clientY) => {
    const note = notes.find(n => n.id === id);
    if (!note) return;

    const newZIndex = maxZIndex + 1;
    setMaxZIndex(newZIndex);

    setNotes(prevNotes =>
      prevNotes.map(n =>
        n.id === id ? { ...n, zIndex: newZIndex } : n
      )
    );

    setDraggingId(id);
    setDragStart({ x: clientX, y: clientY });
    setDragOffset({ x: 0, y: 0 });
  }, [notes, maxZIndex, setNotes]);

  const handleMouseMove = useCallback((e) => {
    if (!draggingId) return;

    const offsetX = e.clientX - dragStart.x;
    const offsetY = e.clientY - dragStart.y;
    setDragOffset({ x: offsetX, y: offsetY });
  }, [draggingId, dragStart]);

  const handleMouseUp = useCallback(() => {
    if (!draggingId) return;

    setNotes(prevNotes =>
      prevNotes.map(note => {
        if (note.id === draggingId) {
          return {
            ...note,
            position: {
              x: note.position.x + dragOffset.x,
              y: note.position.y + dragOffset.y,
            },
          };
        }
        return note;
      })
    );

    setDraggingId(null);
    setDragOffset({ x: 0, y: 0 });
  }, [draggingId, dragOffset, setNotes]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      
      notes.forEach(note => {
        if (note.reminder) {
          const reminderTime = new Date(note.reminder);
          const diff = reminderTime - now;
          
          if (diff > 0 && diff < 60000) {
            if (Notification.permission === 'granted') {
              new Notification('便利贴提醒', {
                body: note.content || '提醒时间到了！',
                icon: 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#fde68a" rx="8"/><text x="50" y="55" font-size="40" text-anchor="middle" fill="#333">📝</text></svg>')
              });
            }
          }
        }
      });
    }, 30000);

    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    return () => clearInterval(interval);
  }, [notes]);

  useEffect(() => {
    if (draggingId) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingId, handleMouseMove, handleMouseUp]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden select-none">
      <div className="fixed top-0 left-0 right-0 bg-white shadow-md z-50 p-4">
        <h1 className="text-2xl font-bold text-gray-800">📝 网页便利贴</h1>
        <p className="text-sm text-gray-500 mt-1">
          点击右下角按钮创建新便利贴 • 拖拽顶部移动位置 • 直接输入编辑内容
        </p>
      </div>

      <div className="pt-20 p-4 min-h-screen relative">
        {notes.map(note => (
          <StickyNote
            key={note.id}
            note={note}
            onUpdate={updateNote}
            onUpdateColor={updateNoteColor}
            onDelete={deleteNote}
            onDragStart={handleDragStart}
            isDragging={draggingId === note.id}
            dragOffset={draggingId === note.id ? dragOffset : null}
          />
        ))}
      </div>

      <button
        onClick={createNote}
        className="fixed bottom-8 right-8 w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white text-3xl rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 z-50"
        title="创建新便利贴"
      >
        +
      </button>
    </div>
  );
}

export default App;
