import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Bell, ArrowSquareOut } from '@phosphor-icons/react'

interface NewsItem {
  id: string
  platform: string
  title: string
  impact: 'high' | 'medium' | 'low'
  date: string
  category: string
}

export function ConvergenceNews() {
  const news: NewsItem[] = [
    {
      id: '1',
      platform: 'Anthropic',
      title: 'Claude 3.5 Sonnet now supports medical imaging analysis with enhanced HIPAA controls',
      impact: 'high',
      date: '2 days ago',
      category: 'Feature Release'
    },
    {
      id: '2',
      platform: 'OpenAI',
      title: 'GPT-4 Turbo context window expanded to 128K tokens for healthcare applications',
      impact: 'high',
      date: '3 days ago',
      category: 'Capability Enhancement'
    },
    {
      id: '3',
      platform: 'Google',
      title: 'Med-PaLM 2 achieves 85% accuracy on medical licensing exam benchmarks',
      impact: 'medium',
      date: '1 week ago',
      category: 'Benchmark'
    },
    {
      id: '4',
      platform: 'Anthropic',
      title: 'New API rate limits for enterprise healthcare customers',
      impact: 'medium',
      date: '1 week ago',
      category: 'API Update'
    },
    {
      id: '5',
      platform: 'OpenAI',
      title: 'HIPAA BAA now available for all enterprise tiers',
      impact: 'high',
      date: '2 weeks ago',
      category: 'Compliance'
    },
    {
      id: '6',
      platform: 'Google',
      title: 'Enhanced clinical terminology support for ICD-11 and SNOMED CT',
      impact: 'medium',
      date: '2 weeks ago',
      category: 'Feature Release'
    }
  ]

  const getImpactColor = (impact: string) => {
    if (impact === 'high') return 'status-critical'
    if (impact === 'medium') return 'status-warning'
    return 'status-healthy'
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-accent/10">
              <Bell size={32} className="text-accent-foreground" weight="duotone" />
            </div>
            <div>
              <CardTitle className="text-2xl">AI News Convergence Feed</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Latest medical AI updates from major platforms
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {news.map((item) => (
              <Card key={item.id} className="hover:border-primary/50 transition-colors cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs font-mono">
                          {item.platform}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {item.category}
                        </Badge>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getImpactColor(item.impact)}`}
                        >
                          {item.impact} impact
                        </Badge>
                      </div>
                      <h4 className="font-semibold mb-1 leading-snug">{item.title}</h4>
                      <p className="text-xs text-muted-foreground">{item.date}</p>
                    </div>
                    <ArrowSquareOut size={20} className="text-muted-foreground flex-shrink-0 mt-1" />
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
