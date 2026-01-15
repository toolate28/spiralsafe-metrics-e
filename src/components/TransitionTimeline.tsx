import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus, CheckCircle } from '@phosphor-icons/react'

interface TimelinePhase {
  id: string
  name: string
  status: 'pending' | 'in-progress' | 'complete'
  duration: string
  dependencies: string[]
}

export function TransitionTimeline() {
  const [phases, setPhases] = useKV<TimelinePhase[]>('timeline-phases', [
    {
      id: '1',
      name: 'Infrastructure Assessment',
      status: 'complete',
      duration: '1 week',
      dependencies: []
    },
    {
      id: '2',
      name: 'API Compatibility Testing',
      status: 'complete',
      duration: '2 weeks',
      dependencies: ['1']
    },
    {
      id: '3',
      name: 'Data Migration Planning',
      status: 'in-progress',
      duration: '1 week',
      dependencies: ['2']
    },
    {
      id: '4',
      name: 'Pilot Deployment',
      status: 'pending',
      duration: '2 weeks',
      dependencies: ['3']
    },
    {
      id: '5',
      name: 'Production Cutover',
      status: 'pending',
      duration: '1 week',
      dependencies: ['4']
    }
  ])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Transition Timeline</CardTitle>
            <Button variant="outline" size="sm">
              <Plus size={18} className="mr-2" />
              Add Phase
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {phases?.map((phase, idx) => (
              <div key={phase.id} className="relative">
                {idx < (phases?.length || 0) - 1 && (
                  <div className="absolute left-5 top-12 bottom-0 w-0.5 bg-border" />
                )}
                <div className="flex gap-4">
                  <div className="relative flex-shrink-0">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center border-2
                      ${phase.status === 'complete' ? 'bg-secondary border-secondary' :
                        phase.status === 'in-progress' ? 'bg-primary border-primary' :
                        'bg-muted border-border'}
                    `}>
                      {phase.status === 'complete' && (
                        <CheckCircle size={20} className="text-secondary-foreground" weight="fill" />
                      )}
                      {phase.status === 'in-progress' && (
                        <div className="w-3 h-3 rounded-full bg-primary-foreground pulse-animation" />
                      )}
                      {phase.status === 'pending' && (
                        <div className="w-3 h-3 rounded-full bg-muted-foreground" />
                      )}
                    </div>
                  </div>
                  <div className="flex-1 pb-8">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{phase.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        {phase.duration}
                      </Badge>
                      <Badge variant={
                        phase.status === 'complete' ? 'default' :
                        phase.status === 'in-progress' ? 'secondary' :
                        'outline'
                      }>
                        {phase.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {phase.dependencies.length > 0 && (
                        <>Depends on: Phase {phase.dependencies.join(', ')}</>
                      )}
                      {phase.dependencies.length === 0 && <>No dependencies</>}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
