import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FileText, ArrowRight } from '@phosphor-icons/react'

interface Playbook {
  id: string
  title: string
  description: string
  scenario: string
  steps: number
  estimatedTime: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

export function PlaybookLibrary() {
  const playbooks: Playbook[] = [
    {
      id: '1',
      title: 'EHR Integration Switch',
      description: 'Complete guide for switching AI providers in electronic health record systems',
      scenario: 'Legacy System Migration',
      steps: 12,
      estimatedTime: '3-4 weeks',
      difficulty: 'advanced'
    },
    {
      id: '2',
      title: 'Diagnostic AI Transition',
      description: 'Step-by-step process for migrating medical imaging diagnostic systems',
      scenario: 'Imaging & Diagnostics',
      steps: 8,
      estimatedTime: '2 weeks',
      difficulty: 'intermediate'
    },
    {
      id: '3',
      title: 'Clinical Documentation Assistant Swap',
      description: 'Guide for transitioning clinical documentation AI without disrupting workflows',
      scenario: 'Documentation & Charting',
      steps: 6,
      estimatedTime: '1 week',
      difficulty: 'beginner'
    },
    {
      id: '4',
      title: 'Patient Communication Bot Update',
      description: 'Best practices for updating patient-facing AI chat systems',
      scenario: 'Patient Engagement',
      steps: 7,
      estimatedTime: '1-2 weeks',
      difficulty: 'beginner'
    },
    {
      id: '5',
      title: 'Multi-Platform Hybrid Setup',
      description: 'Advanced configuration for running multiple AI platforms simultaneously',
      scenario: 'Complex Integration',
      steps: 15,
      estimatedTime: '4-6 weeks',
      difficulty: 'advanced'
    }
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/10">
              <FileText size={32} className="text-primary" weight="duotone" />
            </div>
            <div>
              <CardTitle className="text-2xl">Transition Playbook Library</CardTitle>
              <CardDescription className="mt-1">
                Battle-tested guides for common healthcare AI transition scenarios
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {playbooks.map((playbook) => (
              <Card key={playbook.id} className="hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {playbook.scenario}
                        </Badge>
                        <Badge 
                          variant={
                            playbook.difficulty === 'beginner' ? 'secondary' :
                            playbook.difficulty === 'intermediate' ? 'default' :
                            'destructive'
                          }
                          className="text-xs"
                        >
                          {playbook.difficulty}
                        </Badge>
                      </div>
                      <h3 className="text-lg font-semibold mb-1">{playbook.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{playbook.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="font-mono">{playbook.steps} steps</span>
                        <span>•</span>
                        <span className="font-mono">{playbook.estimatedTime}</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View
                      <ArrowRight size={16} className="ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
