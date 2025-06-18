import React, { useState, useEffect } from 'react';
import FlipClockCard from './FlipClockCard';
import './FlipClock.css';

interface FlipClockProps {
  textColor: string;
  theme: string;
  size: string;
  isFocusModeActive: boolean;
  focusElapsedTimeInSeconds: number;
}

const FlipClock: React.FC<FlipClockProps> = ({ textColor, theme, size, isFocusModeActive, focusElapsedTimeInSeconds }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timerId);
  }, []);

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
    const seconds = time.getSeconds().toString().padStart(2, '0');

  const formatFocusTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const secondsFormatted = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${secondsFormatted}`;
  };

  if (isFocusModeActive) {
    return (
      <div className="focus-mode-timer" style={{ color: textColor, fontSize: size }}>
        {formatFocusTime(focusElapsedTimeInSeconds)}
      </div>
    );
  }

  return (
    <div className="flip-clock" style={{ color: textColor, fontSize: size }}>
      <div className="flip-clock-group">
        <FlipClockCard digit={hours[0]} />
        <FlipClockCard digit={hours[1]} />
      </div>
      <div className="flip-clock-separator">:</div>
      <div className="flip-clock-group">
        <FlipClockCard digit={minutes[0]} />
        <FlipClockCard digit={minutes[1]} />
      </div>
      {theme === 'flip' && (
        <>
          <div className="flip-clock-separator">:</div>
          <div className="flip-clock-group">
            <FlipClockCard digit={seconds[0]} />
            <FlipClockCard digit={seconds[1]} />
          </div>
        </>
      )}
    </div>
  );
};

export default FlipClock;
