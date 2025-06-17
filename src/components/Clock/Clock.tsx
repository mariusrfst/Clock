import React, { useState, useEffect, useRef } from 'react';
import './Clock.css';

interface ClockProps {
  textColor?: string;
  fontFamily?: string;
  textSize?: string;
  isKlockMode?: boolean;
  position: { top: string; left: string };
  setPosition: (position: { top: string; left: string }) => void;
  isDraggable?: boolean;
  isFocusModeActive: boolean;
  focusElapsedTimeInSeconds: number;
}

const Clock: React.FC<ClockProps> = ({ 
  textColor, 
  fontFamily, 
  textSize,
  isKlockMode,
  position,
  setPosition,
  isDraggable = false, // Default to false if not provided
  isFocusModeActive,
  focusElapsedTimeInSeconds,
}) => {
  const [time, setTime] = useState(new Date());
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ mouseX: number; mouseY: number; initialClockTopPercent: number; initialClockLeftPercent: number } | null>(null);
  const clockRef = useRef<HTMLDivElement>(null);

  // Timer for updating clock time display
  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  // This useEffect for secondsProgress will be removed as progress bar moves to App.tsx
  // const [secondsProgress, setSecondsProgress] = useState(0);
  // useEffect(() => {
  //   if (isKlockMode) {
  //     const progressTimerId = setInterval(() => {
  //       const currentSeconds = new Date().getSeconds();
  //       setSecondsProgress((currentSeconds / 60) * 100);
  //     }, 200); // Update progress more frequently for smoothness
  //     return () => clearInterval(progressTimerId);
  //   } else {
  //     setSecondsProgress(0);
  //   }
  // }, [isKlockMode]);

  const formatTime = (date: Date) => {
    const pad = (n: number) => (n < 10 ? '0' + n : n);

    if (isFocusModeActive) {
      const totalSeconds = focusElapsedTimeInSeconds;
      const focusHours = Math.floor(totalSeconds / 3600);
      const focusMinutes = Math.floor((totalSeconds % 3600) / 60);
      if (isKlockMode) { // Focus mode with Klock Mode enabled: HH:MM
        return `${pad(focusHours)}:${pad(focusMinutes)}`;
      } else { // Focus mode with Klock Mode disabled: HH:MM:SS
        const focusSeconds = totalSeconds % 60;
        return `${pad(focusHours)}:${pad(focusMinutes)}:${pad(focusSeconds)}`;
      }
    }

    // Regular time display
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    // const ampm = hours >= 12 ? 'PM' : 'AM';
    // hours = hours % 12;
    // hours = hours ? hours : 12; // the hour '0' should be '12'

    if (isKlockMode) {
      return `${pad(hours)}:${pad(minutes)}`; // Klock mode for current time still hides seconds
    }
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggable || !clockRef.current) return;
    setIsDragging(true);

    // Parse current percentage positions. Remove '%' and convert to number.
    const currentTopPercent = parseFloat(position.top);
    const currentLeftPercent = parseFloat(position.left);

    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      initialClockTopPercent: currentTopPercent,
      initialClockLeftPercent: currentLeftPercent,
    };
    e.preventDefault(); // Prevent text selection
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !dragStartRef.current || !clockRef.current) return;

      const parentElement = clockRef.current.parentElement;
      if (!parentElement) return;

      const parentWidth = parentElement.clientWidth;
      const parentHeight = parentElement.clientHeight;

      // Calculate mouse movement in pixels
      const dxPx = e.clientX - dragStartRef.current.mouseX;
      const dyPx = e.clientY - dragStartRef.current.mouseY;

      // Convert pixel movement to percentage movement
      const dLeftPercent = (dxPx / parentWidth) * 100;
      const dTopPercent = (dyPx / parentHeight) * 100;

      // Calculate new percentage positions
      let newLeftPercent = dragStartRef.current.initialClockLeftPercent + dLeftPercent;
      let newTopPercent = dragStartRef.current.initialClockTopPercent + dTopPercent;
      
      // Optional: Boundary checks (ensure clock center stays within viewport, can be refined)
      // const clockWidthPercent = (clockRef.current.offsetWidth / parentWidth) * 100;
      // const clockHeightPercent = (clockRef.current.offsetHeight / parentHeight) * 100;
      // newLeftPercent = Math.max(clockWidthPercent / 2, Math.min(newLeftPercent, 100 - clockWidthPercent / 2));
      // newTopPercent = Math.max(clockHeightPercent / 2, Math.min(newTopPercent, 100 - clockHeightPercent / 2));

      setPosition({
        left: `${newLeftPercent}%`,
        top: `${newTopPercent}%`,
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
  }, [isDragging, setPosition]);

  let cursorStyle = 'default';
  if (isDraggable) {
    cursorStyle = isDragging ? 'grabbing' : 'grab';
  }

  const clockStyle = {
    top: position.top,
    left: position.left,
    transform: 'translate(-50%, -50%)', // Center the clock on its top/left point
    cursor: cursorStyle,
  };

  return (
    <div 
      ref={clockRef}
      className={`clock-container ${isDraggable ? 'clock-movement-active' : ''}`}
      style={clockStyle}
      onMouseDown={handleMouseDown}
    >
      <div className="clock-display" style={{ color: textColor, fontFamily: fontFamily, fontSize: textSize }}>
        {formatTime(time)}
      </div>
      {/* Progress bar has been moved to App.tsx */}
    </div>
  );
};

export default Clock;
