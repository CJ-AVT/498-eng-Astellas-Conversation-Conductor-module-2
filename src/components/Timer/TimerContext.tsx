import {
  createContext,
  useContext,
  useRef,
  useCallback,
  type ReactNode,
} from 'react'

interface TimerContextType {
  getElapsedTime: () => number
  updateElapsedTime: (time: number) => void
}

const TimerContext = createContext<TimerContextType | undefined>(undefined)

export const TimerProvider = ({ children }: { children: ReactNode }) => {
  const elapsedTimeRef = useRef(0)

  const getElapsedTime = useCallback(() => {
    return elapsedTimeRef.current
  }, [])

  const updateElapsedTime = useCallback((time: number) => {
    elapsedTimeRef.current = time
  }, [])

  return (
    <TimerContext.Provider value={{ getElapsedTime, updateElapsedTime }}>
      {children}
    </TimerContext.Provider>
  )
}

export const useTimer = () => {
  const context = useContext(TimerContext)
  if (!context) {
    throw new Error('useTimer must be used within a TimerProvider')
  }
  return context
}
