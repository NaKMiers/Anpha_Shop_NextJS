import { useEffect, useState } from 'react'
import CounterItem from './item/CounterItem'

interface CountdownProps {
  hours?: number
  minutes?: number
  seconds?: number
  onCompleted?: () => void
  className?: string
}

function Countdown({
  hours = 0,
  minutes = 0,
  seconds = 0,
  onCompleted,
  className = '',
}: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<number[]>([hours, minutes, seconds])

  // count down
  useEffect(() => {
    let interval: NodeJS.Timeout

    // start count down
    interval = setInterval(() => {
      setTimeLeft(prev => {
        const [hours, minutes, seconds] = prev

        if (seconds > 0) {
          return [hours, minutes, seconds - 1]
        } else if (minutes > 0) {
          return [hours, minutes - 1, 59]
        } else if (hours > 0) {
          return [hours - 1, 59, 59]
        }

        return [0, 0, 0]
      })

      // check if time is up
      if (timeLeft[0] === 0 && timeLeft[1] === 0 && timeLeft[2] === 0) {
        clearInterval(interval)
        if (onCompleted) onCompleted()
      }
    }, 1000)

    // clean up
    return () => clearInterval(interval)
  }, [onCompleted, timeLeft])

  return (
    <div className={`flex shrink-0 gap-1 ${className}`}>
      {/* Hours */}
      {hours >= 0 && (
        <>
          <div className="flex items-center rounded-sm pl-[2px] pr-[1px]">
            <CounterItem
              value={Math.floor(timeLeft[0] / 10)}
              max={9}
            />
            <CounterItem
              value={timeLeft[0] % 10}
              max={9}
            />
          </div>
          <span>:</span>
        </>
      )}

      {/* Minutes */}
      <div className="flex items-center rounded-sm pl-[2px] pr-[1px]">
        <CounterItem
          value={Math.floor(timeLeft[1] / 10)}
          max={5}
        />
        <CounterItem
          value={timeLeft[1] % 10}
          max={9}
        />
      </div>
      <span>:</span>

      {/* Seconds */}
      <div className="flex items-center rounded-sm pl-[2px] pr-[1px]">
        <CounterItem
          value={Math.floor(timeLeft[2] / 10)}
          max={5}
        />
        <CounterItem
          value={timeLeft[2] % 10}
          max={9}
        />
      </div>
    </div>
  )
}

export default Countdown
