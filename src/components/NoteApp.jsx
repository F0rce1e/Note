import React, { useState, useEffect } from 'react';
import '../styles/NoteApp.css';

const NoteApp = () => {
  const [text, setText] = useState("");
  const [opacity, setOpacity] = useState(0.9);
  const [fontSize, setFontSize] = useState(16);
  const [showSettings, setShowSettings] = useState(false);
  const [alwaysOnTop, setAlwaysOnTop] = useState(false);

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
  }, []);

  const saveNote = () => {
    localStorage.setItem('note', text);
    // Visual feedback could be added here
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
        </div>
      )}

      <textarea 
        className="note-textarea"
        value={text} 
        onChange={(e) => setText(e.target.value)} 
        spellCheck="false"
      />
      
      <div className="footer-bar">
        <button className="save-btn" onClick={saveNote}>Save</button>
      </div>
    </div>
  );
};

export default NoteApp;
