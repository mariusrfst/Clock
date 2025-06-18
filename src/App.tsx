import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Clock from './components/Clock/Clock';
import SettingsMenu from './components/SettingsMenu/SettingsMenu';
import FlipClock from './components/FlipClock/FlipClock';

function App() {
  const [showSettingsButton, setShowSettingsButton] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const settingsButtonTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // State for customization
  const [clockTextColor, setClockTextColor] = useState<string>('#333333');
  const [appBackgroundColor, setAppBackgroundColor] = useState<string>('#f0f0f0');
  const [clockFontFamily, setClockFontFamily] = useState<string>("-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif");
  const [clockTextSize, setClockTextSize] = useState<string>('18vw');
  const [isKlockMode, setIsKlockMode] = useState<boolean>(false);
  const [clockPosition, setClockPosition] = useState<{ top: string; left: string }>({ top: '50%', left: '50%' });
  const [settingsMenuPosition, setSettingsMenuPosition] = useState<{ top: string; right: string }>({ top: '20px', right: '20px' });
  const [secondsProgress, setSecondsProgress] = useState(0);
  const [isFocusModeActive, setIsFocusModeActive] = useState<boolean>(false);
  const [focusElapsedTimeInSeconds, setFocusElapsedTimeInSeconds] = useState<number>(0);
  const [isClockMovementModeActive, setIsClockMovementModeActive] = useState<boolean>(false);
  const [theme, setTheme] = useState<string>('default');

  const handleAppClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const targetElement = event.target as HTMLElement;

    if (isMenuOpen) return; // Do nothing if menu is open

    if (targetElement.closest('button')) return; // Do nothing if a button was clicked (they handle their own logic)

    // If click is on the clock container itself
    if (targetElement.closest('.clock-container')) {
      // Just show buttons and start their hide timer
      setShowSettingsButton(true);
      if (settingsButtonTimeoutRef.current) {
        clearTimeout(settingsButtonTimeoutRef.current);
      }
      settingsButtonTimeoutRef.current = setTimeout(() => {
        setShowSettingsButton(false);
      }, 3000);
      return; // Exit without toggling focus mode
    }

    // If click is on the general app background (not menu, not button, not clock)
    // Show buttons and start their hide timer
    setShowSettingsButton(true);
    if (settingsButtonTimeoutRef.current) {
      clearTimeout(settingsButtonTimeoutRef.current);
    }
    settingsButtonTimeoutRef.current = setTimeout(() => {
      setShowSettingsButton(false);
    }, 3000);

    // Focus mode is now only toggled by its dedicated button.
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (!isMenuOpen) {
      setShowSettingsButton(true);
      if (settingsButtonTimeoutRef.current) {
        clearTimeout(settingsButtonTimeoutRef.current);
      }
    } else { // Menu is closing
      // Show buttons and start their hide timer
      setShowSettingsButton(true);
      if (settingsButtonTimeoutRef.current) {
        clearTimeout(settingsButtonTimeoutRef.current);
      }
      settingsButtonTimeoutRef.current = setTimeout(() => {
        setShowSettingsButton(false);
      }, 3000);
    }
  };

  const toggleFocusMode = () => {
    setIsFocusModeActive(prev => {
      if (!prev) { // If activating focus mode
        setFocusElapsedTimeInSeconds(0);
      }
      return !prev;
    });
  };

  useEffect(() => {
    return () => {
      if (settingsButtonTimeoutRef.current) {
        clearTimeout(settingsButtonTimeoutRef.current);
      }
    };
  }, []);

  // Effect for Klock Mode progress bar
  useEffect(() => {
    let progressTimerId: ReturnType<typeof setInterval>;
    if (isKlockMode) {
      const updateProgress = () => {
        const now = new Date();
        const currentSeconds = now.getSeconds(); // Seconds (0-59)
        const currentMilliseconds = now.getMilliseconds(); // Milliseconds (0-999)
        const totalMillisecondsInMinute = currentSeconds * 1000 + currentMilliseconds;
        // Progress based on milliseconds elapsed in the current minute (out of 60000 ms for a full cycle)
        setSecondsProgress((totalMillisecondsInMinute / 60000) * 100);
      };
      updateProgress(); // Call once immediately to set initial progress
      progressTimerId = setInterval(updateProgress, 200); // Update frequently for smoothness
    } else {
      setSecondsProgress(0); // Reset progress if KlockMode is off
    }
    return () => {
      clearInterval(progressTimerId); // Clear interval on cleanup or when isKlockMode changes
    };
  }, [isKlockMode]);

  // Effect for Focus Mode stopwatch
  useEffect(() => {
    let focusTimerId: ReturnType<typeof setInterval>;
    if (isFocusModeActive) {
      focusTimerId = setInterval(() => {
        setFocusElapsedTimeInSeconds(prevTime => prevTime + 1);
      }, 1000);
    } else {
      // Optional: if you want the timer to reset to 0 when explicitly stopped, 
      // but toggleFocusMode already handles resetting to 0 on start.
      // setFocusElapsedTimeInSeconds(0); 
    }
    return () => {
      clearInterval(focusTimerId);
    };
  }, [isFocusModeActive]);

  return (
    <div 
      className="App"
      onClick={(e) => handleAppClick(e)} 
      style={{
        '--clock-text-color': clockTextColor,
        '--clock-font-family': clockFontFamily,
        '--clock-text-size': clockTextSize,
      } as React.CSSProperties}
    >
            {theme.startsWith('default') ? (
        <Clock 
          textColor={clockTextColor} 
          fontFamily={clockFontFamily} 
          textSize={clockTextSize} 
          isKlockMode={isKlockMode} 
          position={clockPosition} 
          setPosition={setClockPosition}
          isDraggable={isClockMovementModeActive} 
          isFocusModeActive={isFocusModeActive} 
          focusElapsedTimeInSeconds={focusElapsedTimeInSeconds} 
        />
      ) : (
        <FlipClock textColor={clockTextColor} theme={theme} size={clockTextSize} isFocusModeActive={isFocusModeActive} focusElapsedTimeInSeconds={focusElapsedTimeInSeconds} />
      )}
      {(showSettingsButton || isMenuOpen) && (
        <button 
          className={`settings-button visible`}
          onClick={(e) => { 
            e.stopPropagation(); 
            toggleMenu(); 
          }}
          title="Settings"
        >
          ⚙️
        </button>
      )}
      {/* Focus button is visible if settings button is, if menu is open, or if focus mode is active */}
      {(showSettingsButton || isMenuOpen || isFocusModeActive) && (
        <button 
          className={`focus-mode-button visible`}
          onClick={toggleFocusMode} // Will primarily be used to stop focus mode now
          title={isFocusModeActive ? "Stop Focus Session" : "Click screen to start Focus / Focus session inactive"} // Updated title
        >
          ⏱️
        </button>
      )}
      <SettingsMenu 
        isOpen={isMenuOpen} 
        onClose={toggleMenu}
        clockTextColor={clockTextColor}
        onClockTextColorChange={setClockTextColor}
        appBackgroundColor={appBackgroundColor}
        onAppBackgroundColorChange={setAppBackgroundColor}
        clockFontFamily={clockFontFamily}
        onClockFontFamilyChange={setClockFontFamily}
        clockTextSize={clockTextSize}
        onClockTextSizeChange={setClockTextSize}
        isKlockMode={isKlockMode}
        onKlockModeChange={setIsKlockMode}
        menuPosition={settingsMenuPosition} // Pass position
        setMenuPosition={setSettingsMenuPosition} // Pass setter
        isClockMovementModeActive={isClockMovementModeActive}
        setIsClockMovementModeActive={setIsClockMovementModeActive}
        theme={theme}
        onThemeChange={setTheme}
      />
      {isKlockMode && (
        <div className="app-klock-progress-bar-container">
          <div 
            className="app-klock-progress-bar"
            style={{ width: `${secondsProgress}%`, backgroundColor: clockTextColor }}
          ></div>
        </div>
      )}
    </div>
  );
}

export default App;
