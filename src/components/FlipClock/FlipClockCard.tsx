import React, { useState, useEffect } from 'react';
import './FlipClock.css';

interface FlipClockCardProps {
  digit: string;
}

const AnimatedCard: React.FC<{ animation: string; digit: string }> = ({ animation, digit }) => {
  return (
    <div className={`flip-card ${animation}`}>
      <span>{digit}</span>
    </div>
  );
};

const StaticCard: React.FC<{ position: string; digit: string }> = ({ position, digit }) => {
  return (
    <div className={position}>
      <span>{digit}</span>
    </div>
  );
};

const FlipClockCard: React.FC<FlipClockCardProps> = ({ digit }) => {
  const [previousDigit, setPreviousDigit] = useState(digit);
  const [isFlipping, setIsFlipping] = useState(false);

  const currentDigit = digit;

  useEffect(() => {
    if (currentDigit !== previousDigit) {
      setIsFlipping(true);
      const timeout = setTimeout(() => {
        setIsFlipping(false);
        setPreviousDigit(currentDigit);
      }, 600); // Animation duration
      return () => clearTimeout(timeout);
    }
  }, [currentDigit, previousDigit]);

  return (
    <div className="flip-unit-container">
        <StaticCard position="upper-card" digit={currentDigit} />
        <StaticCard position="lower-card" digit={previousDigit} />
        {isFlipping && (
            <>
                <AnimatedCard animation="fold" digit={previousDigit} />
                <AnimatedCard animation="unfold" digit={currentDigit} />
            </>
        )}
    </div>
  );
};

export default FlipClockCard;
