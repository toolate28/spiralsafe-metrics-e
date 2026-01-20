import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Play, Pause, ArrowsClockwise } from '@phosphor-icons/react'
import * as d3 from 'd3'

// Local metrics interface for autonomous monitoring
interface LocalMetrics {
  coherenceHistory: number[]
  lastUpdate: number
  avgCoherence: number
}

export function SpectralAnalyzer() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [frequency, setFrequency] = useState([50])
  const [amplitude, setAmplitude] = useState([80])
  const [coherenceScore, setCoherenceScore] = useState(0)
  const [localMetrics, setLocalMetrics] = useState<LocalMetrics>({
    coherenceHistory: [],
    lastUpdate: Date.now(),
    avgCoherence: 0
  })
  const animationRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    let phase = 0

    const animate = () => {
      ctx.fillStyle = 'rgba(18, 18, 30, 0.1)'
      ctx.fillRect(0, 0, width, height)

      ctx.strokeStyle = '#75beDA'
      ctx.lineWidth = 2
      ctx.beginPath()

      const freq = frequency[0] / 50
      const amp = amplitude[0] / 100

      for (let x = 0; x < width; x++) {
        const t = (x / width) * Math.PI * 4
        const y = height / 2 + Math.sin(t * freq + phase) * (height / 3) * amp
        
        if (x === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }

      ctx.stroke()

      ctx.strokeStyle = '#A6FF85'
      ctx.lineWidth = 1.5
      ctx.beginPath()

      for (let x = 0; x < width; x++) {
        const t = (x / width) * Math.PI * 4
        const y = height / 2 + Math.sin(t * freq * 1.5 + phase * 0.7) * (height / 4) * amp * 0.8
        
        if (x === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }

      ctx.stroke()

      const rawCoherence = Math.abs(Math.sin(phase * 0.1)) * amp
      const newScore = Math.round(rawCoherence * 100)
      setCoherenceScore(newScore)
      
      // Update local metrics for autonomous monitoring
      setLocalMetrics(prev => {
        const history =
          prev.coherenceHistory.length >= 100
            ? prev.coherenceHistory.slice(1)
            : prev.coherenceHistory.slice()
        history.push(newScore)
        const avg = history.reduce((a, b) => a + b, 0) / history.length
        return {
          coherenceHistory: history,
          lastUpdate: Date.now(),
          avgCoherence: Math.round(avg)
        }
      })

      if (isRunning) {
        phase += 0.05
        animationRef.current = requestAnimationFrame(animate)
      }
    }

    if (isRunning) {
      animate()
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isRunning, frequency, amplitude])

  const toggleAnalysis = () => {
    setIsRunning(!isRunning)
  }

  const reset = () => {
    setIsRunning(false)
    setFrequency([50])
    setAmplitude([80])
    setCoherenceScore(0)
    setLocalMetrics({
      coherenceHistory: [],
      lastUpdate: Date.now(),
      avgCoherence: 0
    })
    
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d')
      if (ctx) {
        ctx.fillStyle = '#12121e'
        ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height)
      }
    }
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-[#12121e] border-secondary/30">
        <canvas 
          ref={canvasRef} 
          width={800} 
          height={300}
          className="w-full h-auto rounded-lg"
        />
      </Card>

      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-sm font-medium uppercase tracking-wide text-muted-foreground mb-3">
              Coherence Score
            </h3>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold font-mono text-accent">{coherenceScore}</span>
              <span className="text-muted-foreground">/ 100</span>
            </div>
            <Badge 
              variant={coherenceScore > 70 ? 'default' : coherenceScore > 40 ? 'secondary' : 'destructive'}
              className="mt-2"
            >
              {coherenceScore > 70 ? 'Excellent' : coherenceScore > 40 ? 'Moderate' : 'Poor'}
            </Badge>
          </div>

          <div>
            <h3 className="text-sm font-medium uppercase tracking-wide text-muted-foreground mb-3">
              Frequency
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-mono text-sm">{frequency[0]} Hz</span>
              </div>
              <Slider
                value={frequency}
                onValueChange={setFrequency}
                min={10}
                max={100}
                step={1}
                disabled={isRunning}
              />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium uppercase tracking-wide text-muted-foreground mb-3">
              Amplitude
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-mono text-sm">{amplitude[0]}%</span>
              </div>
              <Slider
                value={amplitude}
                onValueChange={setAmplitude}
                min={10}
                max={100}
                step={1}
                disabled={isRunning}
              />
            </div>
          </div>
        </div>
      </Card>

      {localMetrics.coherenceHistory.length > 0 && (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium uppercase tracking-wide text-muted-foreground mb-1">
                Average Coherence
              </h3>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono">{localMetrics.avgCoherence}%</span>
                <Badge variant={localMetrics.avgCoherence > 85 ? 'default' : 'secondary'}>
                  {localMetrics.avgCoherence > 85 ? '> 85% threshold' : 'Below threshold'}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-muted-foreground">Samples: {localMetrics.coherenceHistory.length}</span>
            </div>
          </div>
        </Card>
      )}

      <div className="flex gap-3">
        <Button onClick={toggleAnalysis} className="flex-1">
          {isRunning ? (
            <>
              <Pause size={20} className="mr-2" />
              Pause Analysis
            </>
          ) : (
            <>
              <Play size={20} className="mr-2" />
              Start Analysis
            </>
          )}
        </Button>
        <Button onClick={reset} variant="outline">
          <ArrowsClockwise size={20} />
        </Button>
      </div>
    </div>
  )
}
