import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  ShieldCheck, 
  Database, 
  Brain, 
  ArrowsLeftRight, 
  Warning,
  Users,
  Code,
  MagnifyingGlass,
  CheckCircle,
  Bank,
  ChartLineUp
} from '@phosphor-icons/react'

interface RuleSection {
  id: string
  title: string
  icon: typeof ShieldCheck
  category: string
  rules: {
    title: string
    content: string[]
    priority?: 'critical' | 'high' | 'medium' | 'low'
  }[]
}

const ruleSections: RuleSection[] = [
  {
    id: 'governance',
    title: 'Core Governance',
    icon: ShieldCheck,
    category: 'governance',
    rules: [
      {
        title: 'Patient Safety First',
        priority: 'critical',
        content: [
          'All system changes must maintain or improve patient safety outcomes',
          'Zero tolerance for data integrity issues impacting patient care',
          'Systems must fail to a safe state preserving critical patient data'
        ]
      },
      {
        title: 'Data Sovereignty & Privacy',
        priority: 'critical',
        content: [
          'HIPAA compliance mandatory for all PHI handling',
          'GDPR alignment for European patient data',
          'Minimum necessary access principle enforced',
          'AES-256 at rest, TLS 1.3 in transit, 90-day key rotation'
        ]
      },
      {
        title: 'Clinical Continuity',
        priority: 'high',
        content: [
          'No service interruption during AI platform transitions',
          'Complete medical context preservation across migrations',
          'Legacy system data accessible during and after migration'
        ]
      }
    ]
  },
  {
    id: 'infrastructure',
    title: 'Infrastructure Standards',
    icon: Database,
    category: 'technical',
    rules: [
      {
        title: 'System Architecture',
        priority: 'high',
        content: [
          '99.99% uptime SLA for production medical systems',
          'RPO ≤ 15 minutes, RTO ≤ 1 hour',
          'Multi-region deployment with automatic failover',
          'Complete isolation between dev, staging, and production'
        ]
      },
      {
        title: 'Performance Requirements',
        priority: 'high',
        content: [
          'Medical AI queries: 3-second response (95th percentile)',
          'Support 10,000+ concurrent consultations',
          'Auto-scale to 300% surge capacity',
          'Quarterly stress tests at 150% peak load'
        ]
      },
      {
        title: 'Monitoring & Observability',
        priority: 'high',
        content: [
          'Sub-second anomaly detection',
          'Immutable audit logs with 7-year retention',
          'P0 alerts < 2 min response, P1 < 15 min',
          'End-to-end request tracing across microservices'
        ]
      }
    ]
  },
  {
    id: 'ai-platform',
    title: 'AI Platform Compatibility',
    icon: Brain,
    category: 'technical',
    rules: [
      {
        title: 'Model Selection Criteria',
        priority: 'critical',
        content: [
          'All AI models require >90% accuracy on validated medical datasets',
          'Regular audits for demographic and socioeconomic bias',
          'AI decisions must provide auditable clinical reasoning',
          'Model versions locked per deployment with documented performance'
        ]
      },
      {
        title: 'Cross-Platform Testing',
        priority: 'high',
        content: [
          'Medical queries produce clinically equivalent results across platforms',
          'Regression testing with 1000+ medical scenarios',
          'Document API compatibility and migration paths',
          'Secondary AI platform ready for failover'
        ]
      },
      {
        title: 'API Integration Standards',
        priority: 'medium',
        content: [
          'Implement backoff strategies for vendor API limits',
          '30-second timeout with graceful degradation',
          'Distinguish transient failures (retry) from permanent errors',
          'Track API costs with budget threshold alerts'
        ]
      }
    ]
  },
  {
    id: 'migration',
    title: 'Data Migration Protocols',
    icon: ArrowsLeftRight,
    category: 'operations',
    rules: [
      {
        title: 'Pre-Migration Requirements',
        priority: 'critical',
        content: [
          'Full backup with integrity check before migration',
          'Tested 15-minute rollback procedure',
          'Sign-off from Clinical Lead, Security Officer, Compliance Manager',
          '2-week pilot with 5% non-critical data before full migration'
        ]
      },
      {
        title: 'Migration Execution Rules',
        priority: 'high',
        content: [
          'Maximum 10% of data per migration phase',
          'Automated validation after each 1% migrated',
          'Parallel systems maintained 30 days post-migration',
          'Go/No-Go gates at 25%, 50%, 75% completion'
        ]
      },
      {
        title: 'Post-Migration Validation',
        priority: 'high',
        content: [
          '100% verification of critical medical records',
          'Real-world clinical workflow testing before cutover',
          'New performance baseline within 7 days',
          'Document lessons learned within 14 days'
        ]
      }
    ]
  },
  {
    id: 'compliance',
    title: 'Compliance & Regulatory',
    icon: CheckCircle,
    category: 'governance',
    rules: [
      {
        title: 'Required Certifications',
        priority: 'critical',
        content: [
          'HIPAA: Annual assessment and certification',
          'SOC 2 Type II: Continuous compliance monitoring',
          'FDA 21 CFR Part 11: Electronic records (if applicable)',
          'ISO 27001: Information security management'
        ]
      },
      {
        title: 'Audit Requirements',
        priority: 'high',
        content: [
          'Quarterly internal security and compliance reviews',
          'Annual third-party penetration testing',
          'Monthly PHI access pattern review',
          'Annual security review of AI platform vendors'
        ]
      },
      {
        title: 'Documentation Standards',
        priority: 'medium',
        content: [
          'All production changes require documented change request',
          'Security incidents documented within 4 hours',
          'Maintain training records for PHI handlers',
          'All configs and IaC in version control'
        ]
      }
    ]
  },
  {
    id: 'operations',
    title: 'Operational Procedures',
    icon: Warning,
    category: 'operations',
    rules: [
      {
        title: 'Incident Response',
        priority: 'critical',
        content: [
          'P0 Critical: Patient safety/PHI breach (15 min response)',
          'P1 High: Multi-user service disruption (1 hour response)',
          'P2 Medium: Degraded performance (4 hour response)',
          'P3 Low: Non-urgent improvements (1 business day)'
        ]
      },
      {
        title: 'Change Management',
        priority: 'high',
        content: [
          'Emergency changes require two senior engineers',
          'Standard changes: 72-hour review with stakeholder approval',
          'Maintenance during low-utilization periods (2-5 AM)',
          'All changes communicated 7 days in advance'
        ]
      },
      {
        title: 'Access Control',
        priority: 'high',
        content: [
          'Role-based access with least privilege principle',
          'MFA mandatory for all system access',
          'Time-limited elevated permissions with approval',
          'Quarterly access review and recertification'
        ]
      }
    ]
  },
  {
    id: 'development',
    title: 'Development Standards',
    icon: Code,
    category: 'technical',
    rules: [
      {
        title: 'Code Quality',
        priority: 'high',
        content: [
          'Minimum two approvals for production deployments',
          '>80% code coverage, 100% for PHI handling',
          'Automated security scanning in CI/CD',
          'Monthly security updates for dependencies'
        ]
      },
      {
        title: 'Deployment Practices',
        priority: 'high',
        content: [
          'Blue-green deployments with instant rollback',
          'New features deployed behind feature flags',
          'Canary releases: 5% traffic before full deployment',
          'No manual production deployments'
        ]
      },
      {
        title: 'API Design',
        priority: 'medium',
        content: [
          'Semantic versioning with 12-month backward compatibility',
          'OpenAPI/Swagger specs with usage examples',
          'Published rate limits with retry-after headers',
          '6-month deprecation notice with migration guides'
        ]
      }
    ]
  },
  {
    id: 'stakeholders',
    title: 'Stakeholder Coordination',
    icon: Users,
    category: 'operations',
    rules: [
      {
        title: 'Communication Protocols',
        priority: 'medium',
        content: [
          'Weekly progress reports to all stakeholders',
          'Clear escalation chain of command',
          'Documented decision-makers for each domain',
          'Bi-weekly stakeholder feedback sessions'
        ]
      },
      {
        title: 'Training Requirements',
        priority: 'high',
        content: [
          'Technical staff: Platform training before AI work',
          'Clinical staff: Hands-on training before go-live',
          'Administrators: Quarterly security awareness training',
          'Maintain up-to-date runbooks and guides'
        ]
      },
      {
        title: 'Service Level Agreements',
        priority: 'high',
        content: [
          '99.99% availability for production systems',
          '< 15 min critical support, < 4 hours standard',
          'Daily incremental, weekly full backups with offsite replication',
          '99% on-time alerting via multiple channels'
        ]
      }
    ]
  },
  {
    id: 'risk',
    title: 'Risk Management',
    icon: ChartLineUp,
    category: 'governance',
    rules: [
      {
        title: 'Risk Assessment',
        priority: 'high',
        content: [
          'Quarterly risk assessment for all services',
          'Maintain prioritized risk register with mitigations',
          'Annual vendor risk assessments',
          'Monthly security advisory and threat intelligence review'
        ]
      },
      {
        title: 'Business Continuity',
        priority: 'critical',
        content: [
          'Tested disaster recovery plan updated annually',
          'Maintain backup AI platform vendor relationships',
          'Critical data in third-party escrow',
          'Bi-annual disaster recovery simulations'
        ]
      }
    ]
  },
  {
    id: 'cost',
    title: 'Cost Management',
    icon: Bank,
    category: 'operations',
    rules: [
      {
        title: 'Budget Controls',
        priority: 'medium',
        content: [
          'Real-time infrastructure and API cost tracking',
          'Automated alerts at 75%, 90%, 100% budget thresholds',
          'Transparent cost attribution to departments',
          'Monthly cost optimization reviews'
        ]
      },
      {
        title: 'Resource Efficiency',
        priority: 'medium',
        content: [
          'Quarterly resource allocation vs utilization review',
          'Reserved instances for predictable workloads',
          'Automated cleanup of unused resources',
          'ROI evaluation for major platform changes'
        ]
      }
    ]
  }
]

export function RulesEngine() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const filteredSections = ruleSections.filter(section => {
    const matchesCategory = selectedCategory === 'all' || section.category === selectedCategory
    const matchesSearch = searchTerm === '' || 
      section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      section.rules.some(rule => 
        rule.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rule.content.some(c => c.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    return matchesCategory && matchesSearch
  })

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'critical': return 'bg-destructive/10 text-destructive border-destructive/30'
      case 'high': return 'bg-primary/10 text-primary border-primary/30'
      case 'medium': return 'bg-accent/10 text-accent-foreground border-accent/30'
      case 'low': return 'bg-muted text-muted-foreground border-border'
      default: return 'bg-muted text-muted-foreground border-border'
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <ShieldCheck size={32} className="text-primary" weight="duotone" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-2xl">Platform Rules Engine</CardTitle>
              <CardDescription className="mt-2">
                Comprehensive governance, operational, and technical standards for all HealthBridge Convergence services.
                These rules ensure patient safety, regulatory compliance, and operational excellence.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                placeholder="Search rules..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full sm:w-auto">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="governance">Govern</TabsTrigger>
                <TabsTrigger value="technical">Tech</TabsTrigger>
                <TabsTrigger value="operations">Ops</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        {filteredSections.map((section) => {
          const Icon = section.icon
          return (
            <Card key={section.id}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Icon size={24} className="text-primary" weight="duotone" />
                  </div>
                  <CardTitle>{section.title}</CardTitle>
                  <Badge variant="outline" className="ml-auto">
                    {section.rules.length} rule{section.rules.length !== 1 ? 's' : ''}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-auto max-h-[600px] pr-4">
                  <div className="space-y-6">
                    {section.rules.map((rule, idx) => (
                      <div key={idx}>
                        <div className="flex items-start gap-3 mb-3">
                          <div className="font-semibold text-foreground flex-1">{rule.title}</div>
                          {rule.priority && (
                            <Badge className={getPriorityColor(rule.priority)} variant="outline">
                              {rule.priority}
                            </Badge>
                          )}
                        </div>
                        <ul className="space-y-2 ml-6">
                          {rule.content.map((item, itemIdx) => (
                            <li key={itemIdx} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <CheckCircle size={16} className="text-primary mt-0.5 flex-shrink-0" weight="fill" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                        {idx < section.rules.length - 1 && <Separator className="mt-6" />}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredSections.length === 0 && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <MagnifyingGlass size={48} className="mx-auto mb-4 opacity-50" />
              <p>No rules found matching your search criteria.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
