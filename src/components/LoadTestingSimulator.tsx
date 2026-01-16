import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Play, CheckCircle } from '@phosphor-icons/react'

// Simulation lifecycle phases for autonomous testing
type SimPhase = 'idle' | 'initializing' | 'running' | 'complete'

interface LoadTestResult {
  platform: string
  requestsPerSecond: number
  p50Latency: number
  p95Latency: number
  p99Latency: number
  errorRate: string
  throughput: string
  timestamp: number
}

export function LoadTestingSimulator() {
  const [platform, setPlatform] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [simPhase, setSimPhase] = useState<SimPhase>('idle')
  const [results, setResults] = useState<LoadTestResult | null>(null)
  const abortRef = useRef<boolean>(false)

  // Lifecycle effect for simulation runs
  useEffect(() => {
    if (!isRunning || !platform) return

    abortRef.current = false
    let mounted = true

    const runSimulation = async () => {
      setSimPhase('initializing')
      
      // Initialization phase
      await new Promise(resolve => setTimeout(resolve, 500))
      if (!mounted || abortRef.current) return
      
      setSimPhase('running')
      
      // Running phase
      await new Promise(resolve => setTimeout(resolve, 2500))
      if (!mounted || abortRef.current) return
      
      setSimPhase('complete')
      setResults({
        platform,
        requestsPerSecond: Math.floor(Math.random() * 1000) + 500,
        p50Latency: Math.floor(Math.random() * 100) + 50,
        p95Latency: Math.floor(Math.random() * 300) + 200,
        p99Latency: Math.floor(Math.random() * 500) + 400,
        errorRate: (Math.random() * 2).toFixed(2),
        throughput: (Math.random() * 50 + 20).toFixed(1),
        timestamp: Date.now()
      })
      
      setIsRunning(false)
    }

    runSimulation()

    return () => {
      mounted = false
      abortRef.current = true
    }
  }, [isRunning, platform])

  const startLoadTest = () => {
    if (!platform) return
    setResults(null)
    setIsRunning(true)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-accent/10">
              <Play size={32} className="text-accent-foreground" weight="duotone" />
            </div>
            <div>
              <CardTitle className="text-2xl">Load Testing Simulator</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Simulate production healthcare loads to validate capacity
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Target Platform</label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger>
                  <SelectValue placeholder="Select platform..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="anthropic">Anthropic Claude</SelectItem>
                  <SelectItem value="openai">OpenAI GPT</SelectItem>
                  <SelectItem value="google">Google Med-PaLM</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={startLoadTest} disabled={!platform || isRunning} className="w-full">
              <Play size={18} className="mr-2" />
              {simPhase === 'initializing' ? 'Initializing...' : 
               simPhase === 'running' ? 'Running Load Test...' : 
               'Start Load Test'}
            </Button>
            {isRunning && (
              <div className="text-xs text-muted-foreground text-center">
                Phase: {simPhase}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {results && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Load Test Results</CardTitle>
              <Badge variant="default">
                <CheckCircle size={14} className="mr-1" weight="fill" />
                Complete
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="text-sm text-muted-foreground">Requests/Second</div>
                <div className="text-2xl font-bold font-mono mt-1">{results.requestsPerSecond}</div>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="text-sm text-muted-foreground">P50 Latency</div>
                <div className="text-2xl font-bold font-mono mt-1">{results.p50Latency}ms</div>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="text-sm text-muted-foreground">P95 Latency</div>
                <div className="text-2xl font-bold font-mono mt-1">{results.p95Latency}ms</div>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="text-sm text-muted-foreground">P99 Latency</div>
                <div className="text-2xl font-bold font-mono mt-1">{results.p99Latency}ms</div>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="text-sm text-muted-foreground">Error Rate</div>
                <div className="text-2xl font-bold font-mono mt-1">{results.errorRate}%</div>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="text-sm text-muted-foreground">Throughput</div>
                <div className="text-2xl font-bold font-mono mt-1">{results.throughput} MB/s</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
