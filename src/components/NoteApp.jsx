import React, { useState, useEffect } from 'react';
import '../styles/NoteApp.css';

const NoteApp = () => {
  const [text, setText] = useState("");
  const [opacity, setOpacity] = useState(0.9);
  const [fontSize, setFontSize] = useState(16);
  const [showSettings, setShowSettings] = useState(false);
  const [alwaysOnTop, setAlwaysOnTop] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [enableShortcuts, setEnableShortcuts] = useState(true);
  const [showWordCount, setShowWordCount] = useState(true);

  const setWindowAlwaysOnTop = (flag) => {
    try {
      if (window && window.require) {
        const { ipcRenderer } = window.require('electron');
        if (ipcRenderer) {
          ipcRenderer.invoke('set-always-on-top', flag);
        }
      }
    } catch (e) {}
  };

  useEffect(() => {
    const savedNote = localStorage.getItem('note');
    if (savedNote) {
      setText(savedNote);
    }
    
    const savedOpacity = localStorage.getItem('opacity');
    if (savedOpacity) setOpacity(parseFloat(savedOpacity));

    const savedFontSize = localStorage.getItem('fontSize');
    if (savedFontSize) setFontSize(parseInt(savedFontSize));

    const savedAlwaysOnTop = localStorage.getItem('alwaysOnTop');
    const initialAlwaysOnTop = savedAlwaysOnTop === 'true';
    setAlwaysOnTop(initialAlwaysOnTop);
    setWindowAlwaysOnTop(initialAlwaysOnTop);

    const savedAutoSave = localStorage.getItem('autoSave');
    if (savedAutoSave !== null) {
      setAutoSave(savedAutoSave === 'true');
    }

    const savedEnableShortcuts = localStorage.getItem('enableShortcuts');
    if (savedEnableShortcuts !== null) {
      setEnableShortcuts(savedEnableShortcuts === 'true');
    }

    const savedShowWordCount = localStorage.getItem('showWordCount');
    if (savedShowWordCount !== null) {
      setShowWordCount(savedShowWordCount === 'true');
    }
  }, []);

  useEffect(() => {
    if (!enableShortcuts) {
      return;
    }
    const handleKeyDown = (e) => {
      if (e.ctrlKey && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        localStorage.setItem('note', text);
      }
      if (e.ctrlKey && (e.key === 'n' || e.key === 'N')) {
        e.preventDefault();
        setText("");
        localStorage.setItem('note', "");
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [enableShortcuts, text]);

  const saveNote = () => {
    localStorage.setItem('note', text);
  };

  const handleTextChange = (e) => {
    const value = e.target.value;
    setText(value);
    if (autoSave) {
      localStorage.setItem('note', value);
    }
  };

  const handleOpacityChange = (e) => {
    const val = e.target.value;
    setOpacity(val);
    localStorage.setItem('opacity', val);
  };

  const handleFontSizeChange = (e) => {
    const val = e.target.value;
    setFontSize(val);
    localStorage.setItem('fontSize', val);
  };

  const handleAlwaysOnTopChange = (e) => {
    const val = e.target.checked;
    setAlwaysOnTop(val);
    localStorage.setItem('alwaysOnTop', val ? 'true' : 'false');
    setWindowAlwaysOnTop(val);
  };

  const handleAutoSaveChange = (e) => {
    const val = e.target.checked;
    setAutoSave(val);
    localStorage.setItem('autoSave', val ? 'true' : 'false');
    if (val) {
      localStorage.setItem('note', text);
    }
  };

  const handleEnableShortcutsChange = (e) => {
    const val = e.target.checked;
    setEnableShortcuts(val);
    localStorage.setItem('enableShortcuts', val ? 'true' : 'false');
  };

  const handleShowWordCountChange = (e) => {
    const val = e.target.checked;
    setShowWordCount(val);
    localStorage.setItem('showWordCount', val ? 'true' : 'false');
  };

  const wordCount = text.length;

  const handleResizeMouseDown = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (!window || !window.require) {
        return;
      }
      const { ipcRenderer } = window.require('electron');
      if (!ipcRenderer) {
        return;
      }
      const startX = e.screenX;
      const startY = e.screenY;
      const initialBounds = await ipcRenderer.invoke('get-window-bounds');
      if (!initialBounds) {
        return;
      }
      const handleMouseMove = (moveEvent) => {
        const deltaX = moveEvent.screenX - startX;
        const deltaY = moveEvent.screenY - startY;
        const nextWidth = initialBounds.width + deltaX;
        const nextHeight = initialBounds.height + deltaY;
        ipcRenderer.invoke('resize-window', {
          width: nextWidth,
          height: nextHeight,
        });
      };
      const handleMouseUp = () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } catch (e) {}
  };

  return (
    <div 
      className="note-container" 
      style={{ 
        opacity: opacity,
        fontSize: `${fontSize}px`
      }}
    >
      <div className="title-bar">
        <span className="drag-handle"></span>
        <div className="window-controls">
          <button onClick={() => setShowSettings(!showSettings)} title="Settings">⚙️</button>
          {/* Close button logic would require IPC */}
        </div>
      </div>

      {showSettings && (
        <div className="settings-panel">
          <div className="setting-item">
            <label>透明度</label>
            <input 
              type="range" 
              min="0.2" 
              max="1" 
              step="0.05" 
              value={opacity} 
              onChange={handleOpacityChange} 
            />
          </div>
          <div className="setting-item">
            <label>字体大小</label>
            <input 
              type="range" 
              min="12" 
              max="32" 
              value={fontSize} 
              onChange={handleFontSizeChange} 
            />
          </div>
          <div className="setting-item">
            <label>始终置顶</label>
            <input 
              type="checkbox"
              checked={alwaysOnTop}
              onChange={handleAlwaysOnTopChange}
            />
          </div>
          <div className="setting-item">
            <label>自动保存</label>
            <input
              type="checkbox"
              checked={autoSave}
              onChange={handleAutoSaveChange}
            />
          </div>
          <div className="setting-item">
            <label>快捷键</label>
            <input
              type="checkbox"
              checked={enableShortcuts}
              onChange={handleEnableShortcutsChange}
            />
          </div>
          <div className="setting-item">
            <label>显示字数</label>
            <input
              type="checkbox"
              checked={showWordCount}
              onChange={handleShowWordCountChange}
            />
          </div>
        </div>
      )}

      <textarea 
        className="note-textarea"
        value={text} 
        onChange={handleTextChange} 
        spellCheck="false"
      />
      
      <div className="footer-bar">
        {showWordCount && (
          <div className="word-count">
            字数：{wordCount}
          </div>
        )}
        <button className="save-btn" onClick={saveNote}>Save</button>
      </div>
      <div
        className="resize-handle-bottom-right"
        onMouseDown={handleResizeMouseDown}
      />
    </div>
  );
};

export default NoteApp;
