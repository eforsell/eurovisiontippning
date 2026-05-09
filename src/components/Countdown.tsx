import React, { useState, useEffect } from 'react';

interface CountdownProps {
  targetDateIso: string;
}

export const Countdown: React.FC<CountdownProps> = ({ targetDateIso }) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isClosed: boolean;
  } | null>(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const target = new Date(targetDateIso).getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isClosed: true });
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
        isClosed: false,
      });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDateIso]);

  if (!timeLeft) return <div>Loading timer...</div>;

  if (timeLeft.isClosed) {
    return <div className="text-destructive font-bold">Voting is closed!</div>;
  }

  return (
    <div className="flex gap-2 text-sm font-mono bg-muted text-muted-foreground p-2 rounded">
      <div>{timeLeft.days}d</div>
      <div>{timeLeft.hours.toString().padStart(2, '0')}h</div>
      <div>{timeLeft.minutes.toString().padStart(2, '0')}m</div>
      <div>{timeLeft.seconds.toString().padStart(2, '0')}s</div>
    </div>
  );
};