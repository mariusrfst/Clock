import React, { useState, useEffect, useRef } from 'react';
import './SettingsMenu.css';

interface SettingsMenuProps {
  isOpen: boolean;
  onClose: () => void;
  clockTextColor: string;
  onClockTextColorChange: (color: string) => void;
  appBackgroundColor: string;
  onAppBackgroundColorChange: (color: string) => void;
  clockFontFamily: string;
  onClockFontFamilyChange: (font: string) => void;
  clockTextSize: string; // e.g., "18vw"
  onClockTextSizeChange: (size: string) => void;
  isKlockMode: boolean;
  onKlockModeChange: (isKlock: boolean) => void;
  menuPosition: { top: string; right: string };
  setMenuPosition: (position: { top: string; right: string }) => void;
  isClockMovementModeActive: boolean;
  setIsClockMovementModeActive: (isActive: boolean) => void;
  theme: string;
  onThemeChange: (theme: string) => void;
}

const SettingsMenu: React.FC<SettingsMenuProps> = ({
  // ... (keep existing props)
  isOpen,
  onClose,
  clockTextColor,
  onClockTextColorChange,
  appBackgroundColor,
  onAppBackgroundColorChange,
  clockFontFamily,
  onClockFontFamilyChange,
  clockTextSize,
  onClockTextSizeChange,
  isKlockMode,
  onKlockModeChange,
  menuPosition,
  setMenuPosition,
  isClockMovementModeActive,
  setIsClockMovementModeActive,
  theme,
  onThemeChange,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentView, setCurrentView] = useState<'main' | 'themes'>('main');
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number; initialTop: number; initialRight: number } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // useEffect for drag handling must be called unconditionally at the top level
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !dragStartRef.current || !menuRef.current) return;

      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;

      let newTop = dragStartRef.current.initialTop + dy;
      let newRight = dragStartRef.current.initialRight - dx;

      newTop = Math.max(0, Math.min(newTop, window.innerHeight - (menuRef.current?.offsetHeight || 0)));
      newRight = Math.max(0, Math.min(newRight, window.innerWidth - (menuRef.current?.offsetWidth || 0)));

      setMenuPosition({
        top: `${newTop}px`,
        right: `${newRight}px`,
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      dragStartRef.current = null;
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, setMenuPosition, menuRef]); // Added menuRef to dependencies as it's used in effect

  useEffect(() => {
    const checkFullscreenStatus = () => {
      const isCurrentlyFullscreen = !!(document.fullscreenElement || (document as any).webkitFullscreenElement);
      setIsFullscreen(isCurrentlyFullscreen);
    };

    checkFullscreenStatus(); // Initial check

    document.addEventListener('fullscreenchange', checkFullscreenStatus);
    document.addEventListener('webkitfullscreenchange', checkFullscreenStatus); // For Safari

    return () => {
      document.removeEventListener('fullscreenchange', checkFullscreenStatus);
      document.removeEventListener('webkitfullscreenchange', checkFullscreenStatus);
    };
  }, []);

  const handleToggleFullscreen = () => {
    const element = document.documentElement as any; // Use 'any' for webkit prefixes
    if (!isFullscreen) {
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.webkitRequestFullscreen) { // Safari
        element.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) { // Safari
        (document as any).webkitExitFullscreen();
      }
    }
  };

  if (!isOpen) {
    return null;
  }

  const handleMouseDownOnDragHandle = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!menuRef.current) return;
    setIsDragging(true);
    const rect = menuRef.current.getBoundingClientRect();
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      initialTop: rect.top,
      initialRight: window.innerWidth - rect.right, // Calculate initial right offset
    };
    e.preventDefault();
  };

  return (
    <div className="settings-menu-overlay" onClick={isOpen && !isDragging ? onClose : undefined}>
      <div 
        ref={menuRef} 
        className="settings-menu" 
        style={{ top: menuPosition.top, right: menuPosition.right }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="settings-menu-drag-handle" onMouseDown={handleMouseDownOnDragHandle}></div>
        <div className="settings-menu-content">
          {currentView === 'main' ? (
            <div className="settings-menu-content">
              <h2>Settings</h2>
              <div className="setting-item">
                <label htmlFor="clockTextColor">Clock Text Color:</label>
                <input 
                  type="color" 
                  id="clockTextColor" 
                  value={clockTextColor} 
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => onClockTextColorChange(e.target.value)} 
                />
              </div>

              <div className="setting-item">
                <label htmlFor="appBackgroundColor">Background Color:</label>
                <input 
                  type="color" 
                  id="appBackgroundColor" 
                  value={appBackgroundColor} 
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => onAppBackgroundColorChange(e.target.value)} 
                />
              </div>

              {theme === 'default' && (
                <>
                  <div className="setting-item">
                    <label htmlFor="fontFamily">Clock Font:</label>
                    <select 
                      id="fontFamily" 
                      value={clockFontFamily} 
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onClockFontFamilyChange(e.target.value)}
                    >
                      <option value="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif">System Default</option>
                      <option value="Arial, Helvetica, sans-serif">Arial</option>
                      <option value="Verdana, Geneva, sans-serif">Verdana</option>
                      <option value="'Times New Roman', Times, serif">Times New Roman</option>
                      <option value="'Courier New', Courier, monospace">Courier New</option>
                      <option value="Georgia, serif">Georgia</option>
                    </select>
                  </div>
                  <div className="setting-item move-text-mode-toggle">
                    <label htmlFor="moveTextMode">Move Text Mode</label>
                    <label className="switch">
                      <input 
                        id="moveTextMode" 
                        type="checkbox" 
                        checked={isClockMovementModeActive} 
                        onChange={(e) => setIsClockMovementModeActive(e.target.checked)} 
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                </>
              )}
              <div className="setting-item">
                <label htmlFor="clockTextSize">Text Size: ({parseInt(clockTextSize)}vw)</label>
                <input 
                  type="range" 
                  id="clockTextSize" 
                  min="1" 
                  max="30" 
                  step="0.1" 
                  value={parseInt(clockTextSize)} 
                  onChange={(e) => onClockTextSizeChange(`${e.target.value}vw`)} 
                />
              </div>
              <div className="setting-item">
                <button onClick={handleToggleFullscreen} className="fullscreen-button">
                  {isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
                </button>
              </div>
              <button onClick={() => setCurrentView('themes')} className="themes-button">🎨 Themes</button>
            </div>
          ) : (
            <div className="settings-menu-content">
              <h2>Themes</h2>
              <div className="setting-item klock-mode-toggle">
                <label htmlFor="klockMode">Klock Mode (HH:MM + Progress Bar)</label>
                <label className="switch">
                  <input 
                    id="klockMode" 
                    type="checkbox" 
                    checked={isKlockMode} 
                    onChange={(e) => onKlockModeChange(e.target.checked)} 
                  />
                  <span className="slider round"></span>
                </label>
              </div>
              <div className="setting-item">
                <label htmlFor="themeSelector">Theme</label>
                <select id="themeSelector" value={theme} onChange={(e) => onThemeChange(e.target.value)}>
                  <option value="default">Default</option>
                  <option value="flip">Flip</option>
                  <option value="flip-basic">Flip Basic</option>
                </select>
              </div>
              <button onClick={() => setCurrentView('main')} className="back-button">← Back</button>
            </div>
          )}
          {/* Close button is part of the draggable menu content */}
          <button onClick={onClose} className="close-button">Close</button>
          <div className="settings-menu-attribution">
            Made with ❤ by Marius.Rfst
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsMenu;
