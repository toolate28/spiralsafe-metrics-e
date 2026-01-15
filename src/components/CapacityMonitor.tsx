import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Pulse } from '@phosphor-icons/react'

interface CapacityMetric {
  platform: string
  metric: string
  current: number
  limit: number
  unit: string
}

export function CapacityMonitor() {
  const [metrics, setMetrics] = useState<CapacityMetric[]>([
    { platform: 'Anthropic', metric: 'API Requests', current: 7420, limit: 10000, unit: 'req/min' },
    { platform: 'Anthropic', metric: 'Token Usage', current: 1200000, limit: 2000000, unit: 'tokens/day' },
    { platform: 'OpenAI', metric: 'API Requests', current: 8950, limit: 10000, unit: 'req/min' },
    { platform: 'OpenAI', metric: 'Token Usage', current: 1800000, limit: 2000000, unit: 'tokens/day' },
    { platform: 'Google', metric: 'API Requests', current: 5230, limit: 10000, unit: 'req/min' },
    { platform: 'Google', metric: 'Token Usage', current: 980000, limit: 2000000, unit: 'tokens/day' },
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => prev.map(m => ({
        ...m,
        current: Math.min(m.limit, m.current + Math.floor(Math.random() * 100))
      })))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (percentage: number) => {
    if (percentage < 70) return 'status-healthy'
    if (percentage < 90) return 'status-warning'
    return 'status-critical'
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Live Capacity Metrics</CardTitle>
            <Badge variant="outline" className="font-mono text-xs">
              <Pulse size={12} className="mr-1 status-healthy pulse-animation" weight="fill" />
              Live
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {metrics.map((metric, idx) => {
              const percentage = (metric.current / metric.limit) * 100
              return (
                <Card key={idx}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="font-semibold">{metric.platform} - {metric.metric}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {metric.current.toLocaleString()} / {metric.limit.toLocaleString()} {metric.unit}
                        </div>
                      </div>
                      <div className={`text-2xl font-mono font-bold ${getStatusColor(percentage)}`}>
                        {percentage.toFixed(1)}%
                      </div>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
