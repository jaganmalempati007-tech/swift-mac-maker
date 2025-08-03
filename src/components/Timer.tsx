import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Play, Pause, Square, RotateCcw } from 'lucide-react';

const Timer = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<'stopwatch' | 'countdown'>('stopwatch');
  const [countdownTime, setCountdownTime] = useState(300); // 5 minutes default
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime(prevTime => {
          if (mode === 'countdown') {
            if (prevTime <= 1) {
              setIsRunning(false);
              // Simple notification
              if ('Notification' in window && Notification.permission === 'granted') {
                new Notification('Timer finished!');
              }
              return 0;
            }
            return prevTime - 1;
          } else {
            return prevTime + 1;
          }
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, mode]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startStop = () => {
    if (!isRunning && mode === 'countdown' && time === 0) {
      setTime(countdownTime);
    }
    setIsRunning(!isRunning);
  };

  const reset = () => {
    setIsRunning(false);
    setTime(mode === 'countdown' ? countdownTime : 0);
  };

  const switchMode = (newMode: 'stopwatch' | 'countdown') => {
    setIsRunning(false);
    setMode(newMode);
    setTime(newMode === 'countdown' ? countdownTime : 0);
  };

  const setCountdownMinutes = (minutes: number) => {
    const seconds = minutes * 60;
    setCountdownTime(seconds);
    if (!isRunning) {
      setTime(seconds);
    }
  };

  return (
    <Card className="p-4">
      <div className="w-full max-w-sm mx-auto space-y-4">
        <div className="flex gap-2">
          <Button
            variant={mode === 'stopwatch' ? 'default' : 'outline'}
            onClick={() => switchMode('stopwatch')}
            className="flex-1"
          >
            Stopwatch
          </Button>
          <Button
            variant={mode === 'countdown' ? 'default' : 'outline'}
            onClick={() => switchMode('countdown')}
            className="flex-1"
          >
            Timer
          </Button>
        </div>

        {mode === 'countdown' && !isRunning && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Set minutes:</label>
            <div className="flex gap-1">
              {[1, 5, 10, 15, 25].map(minutes => (
                <Button
                  key={minutes}
                  variant="outline"
                  size="sm"
                  onClick={() => setCountdownMinutes(minutes)}
                  className="flex-1"
                >
                  {minutes}m
                </Button>
              ))}
            </div>
          </div>
        )}

        <div className="text-center">
          <div className="text-6xl font-mono font-bold mb-4">
            {formatTime(time)}
          </div>
          
          <div className="flex gap-2 justify-center">
            <Button onClick={startStop} variant="default">
              {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button onClick={reset} variant="outline">
              {mode === 'stopwatch' ? <RotateCcw className="h-4 w-4" /> : <Square className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Timer;