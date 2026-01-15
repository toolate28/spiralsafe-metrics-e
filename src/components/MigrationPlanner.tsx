import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Play, CheckCircle } from '@phosphor-icons/react'

interface MigrationPlan {
  id: string
  source: string
  target: string
  dataVolume: string
  estimatedTime: string
  status: 'pending' | 'running' | 'complete'
  progress: number
}

export function MigrationPlanner() {
  const [sourcePlatform, setSourcePlatform] = useState('')
  const [targetPlatform, setTargetPlatform] = useState('')
  const [plan, setPlan] = useKV<MigrationPlan | null>('migration-plan', null)

  const createMigrationPlan = async () => {
    if (!sourcePlatform || !targetPlatform) return

    const newPlan: MigrationPlan = {
      id: Date.now().toString(),
      source: sourcePlatform,
      target: targetPlatform,
      dataVolume: '2.4 TB',
      estimatedTime: '4-6 hours',
      status: 'pending',
      progress: 0
    }

    setPlan(newPlan)
  }

  const runMigration = () => {
    if (!plan) return
    
    setPlan((currentPlan) => currentPlan ? { ...currentPlan, status: 'running', progress: 0 } : null)
    
    const interval = setInterval(() => {
      setPlan((currentPlan) => {
        if (!currentPlan) return null
        const newProgress = Math.min(currentPlan.progress + 10, 100)
        return {
          ...currentPlan,
          progress: newProgress,
          status: newProgress === 100 ? 'complete' : 'running'
        }
      })
    }, 800)

    setTimeout(() => clearInterval(interval), 9000)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configure Migration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Source Platform</label>
              <Select value={sourcePlatform} onValueChange={setSourcePlatform}>
                <SelectTrigger>
                  <SelectValue placeholder="Select source..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="anthropic">Anthropic Claude</SelectItem>
                  <SelectItem value="openai">OpenAI GPT</SelectItem>
                  <SelectItem value="google">Google Med-PaLM</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Target Platform</label>
              <Select value={targetPlatform} onValueChange={setTargetPlatform}>
                <SelectTrigger>
                  <SelectValue placeholder="Select target..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="anthropic">Anthropic Claude</SelectItem>
                  <SelectItem value="openai">OpenAI GPT</SelectItem>
                  <SelectItem value="google">Google Med-PaLM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button 
            onClick={createMigrationPlan} 
            disabled={!sourcePlatform || !targetPlatform || sourcePlatform === targetPlatform}
            className="w-full"
          >
            Generate Migration Plan
          </Button>
        </CardContent>
      </Card>

      {plan && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Migration Plan</CardTitle>
              <Badge variant={
                plan.status === 'complete' ? 'default' : 
                plan.status === 'running' ? 'secondary' : 
                'outline'
              }>
                {plan.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Source</div>
                <div className="font-semibold capitalize">{plan.source}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Target</div>
                <div className="font-semibold capitalize">{plan.target}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Data Volume</div>
                <div className="font-mono font-semibold">{plan.dataVolume}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Estimated Time</div>
                <div className="font-mono font-semibold">{plan.estimatedTime}</div>
              </div>
            </div>

            {plan.status !== 'pending' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Migration Progress</span>
                  <span className="font-mono font-bold">{plan.progress}%</span>
                </div>
                <Progress value={plan.progress} className="h-2" />
              </div>
            )}

            {plan.status === 'complete' && (
              <div className="flex items-center gap-2 text-secondary p-3 bg-secondary/10 rounded-lg">
                <CheckCircle size={20} weight="fill" />
                <span className="font-medium">Migration completed successfully</span>
              </div>
            )}

            {plan.status === 'pending' && (
              <Button onClick={runMigration} className="w-full">
                <Play size={18} className="mr-2" />
                Start Migration
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
