import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { CheckCircle, Warning, XCircle, Play } from '@phosphor-icons/react'

interface ReadinessMetric {
  id: string
  name: string
  score: number
  status: 'healthy' | 'warning' | 'critical'
  details: string
}

export function InfrastructureReadiness() {
  const [isRunning, setIsRunning] = useState(false)
  const [metrics, setMetrics] = useKV<ReadinessMetric[]>('readiness-metrics', [])
  const [overallScore, setOverallScore] = useState(0)

  const runAssessment = async () => {
    setIsRunning(true)
    
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const newMetrics: ReadinessMetric[] = [
      {
        id: '1',
        name: 'Compute Capacity',
        score: 85,
        status: 'healthy',
        details: 'CPU and GPU resources sufficient for AI workload'
      },
      {
        id: '2',
        name: 'Storage Capacity',
        score: 92,
        status: 'healthy',
        details: 'Adequate storage for medical data migration'
      },
      {
        id: '3',
        name: 'Network Bandwidth',
        score: 78,
        status: 'warning',
        details: 'Consider upgrading bandwidth for real-time inference'
      },
      {
        id: '4',
        name: 'API Rate Limits',
        score: 65,
        status: 'warning',
        details: 'Current tier may not handle peak loads'
      },
      {
        id: '5',
        name: 'Security Compliance',
        score: 95,
        status: 'healthy',
        details: 'HIPAA controls fully implemented'
      },
      {
        id: '6',
        name: 'Technical Debt',
        score: 58,
        status: 'critical',
        details: 'Legacy integrations require refactoring'
      }
    ]
    
    setMetrics(newMetrics)
    const avgScore = Math.round(newMetrics.reduce((sum, m) => sum + m.score, 0) / newMetrics.length)
    setOverallScore(avgScore)
    setIsRunning(false)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Assessment Status</CardTitle>
            <Button onClick={runAssessment} disabled={isRunning}>
              <Play size={18} className="mr-2" />
              {isRunning ? 'Running Assessment...' : 'Run Assessment'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {metrics && metrics.length > 0 && (
            <div className="space-y-4">
              <div className="text-center p-6 bg-muted/50 rounded-lg">
                <div className="text-4xl font-bold font-mono">{overallScore}%</div>
                <div className="text-sm text-muted-foreground mt-1">Overall Readiness Score</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {metrics && metrics.length > 0 && (
        <div className="space-y-4">
          {metrics.map((metric) => (
            <Card key={metric.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{metric.name}</h3>
                      <Badge
                        variant="outline"
                        className={
                          metric.status === 'healthy' ? 'status-healthy' :
                          metric.status === 'warning' ? 'status-warning' :
                          'status-critical'
                        }
                      >
                        {metric.status === 'healthy' ? <CheckCircle size={14} className="mr-1" /> :
                         metric.status === 'warning' ? <Warning size={14} className="mr-1" /> :
                         <XCircle size={14} className="mr-1" />}
                        {metric.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{metric.details}</p>
                  </div>
                  <div className="text-2xl font-bold font-mono">{metric.score}%</div>
                </div>
                <Progress value={metric.score} className="h-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
