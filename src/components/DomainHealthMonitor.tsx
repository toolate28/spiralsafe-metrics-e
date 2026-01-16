/**
 * Domain Health Monitor Component
 * H&&S:WAVE - Unified domain/subdomain health visualization with SAIF assessment
 */

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { 
  Globe, 
  Pulse, 
  ArrowsClockwise, 
  CheckCircle, 
  XCircle, 
  Warning,
  Lightning,
  ShieldCheck,
  ChartLineUp,
  Gauge
} from '@phosphor-icons/react'
import { 
  UNIFIED_DOMAINS, 
  DomainConfig, 
  getActiveDomains,
  getDomainsByEnvironment
} from '@/lib/domain-config'
import { 
  checkAllDomainsHealth, 
  HealthCheckResult, 
  calculateHealthSummary,
  getHealthStatusBadgeVariant
} from '@/lib/api-health-service'
import { 
  performSAIFAssessment, 
  SAIFAssessment,
  meetsEmergenceThreshold,
  getSAIFStatusColor,
  getVortexHealthColor
} from '@/lib/saif-assessment'

export function DomainHealthMonitor() {
  const [healthResults, setHealthResults] = useState<HealthCheckResult[]>([])
  const [saifAssessment, setSaifAssessment] = useState<SAIFAssessment | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)
  const [selectedEnvironment, setSelectedEnvironment] = useState<'all' | 'production' | 'development'>('all')

  const domains = selectedEnvironment === 'all' 
    ? getActiveDomains()
    : getDomainsByEnvironment(selectedEnvironment);

  const runHealthCheck = useCallback(async () => {
    setIsLoading(true)
    try {
      const results = await checkAllDomainsHealth(domains)
      setHealthResults(results)
      
      // Perform SAIF assessment with health results
      const assessment = performSAIFAssessment(domains, results)
      setSaifAssessment(assessment)
      
      setLastRefresh(new Date())
    } catch (error) {
      console.error('Health check failed:', error)
    } finally {
      setIsLoading(false)
    }
  }, [domains])

  // Initial health check
  useEffect(() => {
    runHealthCheck()
    
    // Set up periodic refresh (every 60 seconds)
    const interval = setInterval(runHealthCheck, 60000)
    return () => clearInterval(interval)
  }, [runHealthCheck])

  const summary = calculateHealthSummary(healthResults)

  const getStatusIcon = (status: HealthCheckResult['status']) => {
    switch (status) {
      case 'healthy': return <CheckCircle size={18} className="text-green-500" weight="fill" />
      case 'degraded': return <Warning size={18} className="text-amber-500" weight="fill" />
      case 'unhealthy': return <XCircle size={18} className="text-red-500" weight="fill" />
      default: return <Pulse size={18} className="text-gray-400" weight="fill" />
    }
  }

  const getProviderBadge = (provider: DomainConfig['provider']) => {
    const colors: Record<DomainConfig['provider'], string> = {
      'vercel': 'bg-black text-white',
      'github-pages': 'bg-gray-800 text-white',
      'cloudflare-pages': 'bg-orange-500 text-white',
      'custom': 'bg-blue-500 text-white'
    }
    return colors[provider]
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Globe size={32} className="text-primary" weight="duotone" />
              </div>
              <div>
                <CardTitle className="text-2xl">Domain Unification Monitor</CardTitle>
                <CardDescription className="mt-2">
                  VortexForge Autonomy - Unified domain/subdomain health monitoring with SAIF risk assessment.
                  Maintains corpus with emergent capability threshold greater than 60%.
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono text-xs hope-wave-badge">
                H&&S:WAVE
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={runHealthCheck}
                disabled={isLoading}
                className="gap-2"
              >
                <ArrowsClockwise 
                  size={16} 
                  className={isLoading ? 'animate-spin' : ''} 
                />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Environment Filter */}
      <div className="flex gap-2">
        {(['all', 'production', 'development'] as const).map((env) => (
          <Button
            key={env}
            variant={selectedEnvironment === env ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedEnvironment(env)}
            className="capitalize"
          >
            {env}
          </Button>
        ))}
      </div>

      {/* SAIF Assessment Summary */}
      {saifAssessment && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className={`border-l-4 ${
            meetsEmergenceThreshold(saifAssessment) 
              ? 'border-l-green-500' 
              : 'border-l-amber-500'
          }`}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Lightning size={20} className="text-primary" weight="fill" />
                <CardTitle className="text-lg">SAIF Risk Assessment</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {/* CQW Score */}
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Gauge size={16} />
                    <span>CQW Score</span>
                  </div>
                  <div className="text-2xl font-bold">{saifAssessment.cqwScore}/100</div>
                  <Progress value={saifAssessment.cqwScore} className="mt-2 h-2" />
                </div>

                {/* Emergence Level */}
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <ChartLineUp size={16} />
                    <span>Emergence</span>
                  </div>
                  <div className="text-2xl font-bold">{saifAssessment.emergenceLevel}%</div>
                  <Progress 
                    value={saifAssessment.emergenceLevel} 
                    className={`mt-2 h-2 ${saifAssessment.emergenceLevel > 60 ? '' : 'bg-amber-200'}`}
                  />
                  {saifAssessment.emergenceLevel <= 60 && (
                    <p className="text-xs text-amber-600 mt-1">Below 60% threshold</p>
                  )}
                </div>

                {/* Risk Level */}
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <ShieldCheck size={16} />
                    <span>Risk Level</span>
                  </div>
                  <div className={`text-2xl font-bold capitalize ${getSAIFStatusColor(saifAssessment.riskLevel)}`}>
                    {saifAssessment.riskLevel}
                  </div>
                </div>

                {/* Vortex Health */}
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Pulse size={16} />
                    <span>Vortex Health</span>
                  </div>
                  <div className={`text-2xl font-bold capitalize ${getVortexHealthColor(saifAssessment.vortexHealth)}`}>
                    {saifAssessment.vortexHealth}
                  </div>
                </div>
              </div>

              {/* Unification Score */}
              <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/30">
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Unification Score</span>
                    <span className="font-mono">{saifAssessment.unificationScore}%</span>
                  </div>
                  <Progress value={saifAssessment.unificationScore} className="h-2" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Fragmentation</span>
                    <span className="font-mono">{saifAssessment.fragmentationScore}%</span>
                  </div>
                  <Progress value={saifAssessment.fragmentationScore} className="h-2 bg-red-100" />
                </div>
              </div>

              {/* Recommendations */}
              {saifAssessment.recommendations.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Recommendations</h4>
                  <ul className="space-y-1">
                    {saifAssessment.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-primary">•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Health Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Total Domains</div>
          <div className="text-2xl font-bold">{summary.totalDomains}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground flex items-center gap-1">
            <CheckCircle size={14} className="text-green-500" />
            Healthy
          </div>
          <div className="text-2xl font-bold text-green-600">{summary.healthyCount}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground flex items-center gap-1">
            <Warning size={14} className="text-amber-500" />
            Degraded
          </div>
          <div className="text-2xl font-bold text-amber-600">{summary.degradedCount}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground flex items-center gap-1">
            <XCircle size={14} className="text-red-500" />
            Unhealthy
          </div>
          <div className="text-2xl font-bold text-red-600">{summary.unhealthyCount}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Avg Response</div>
          <div className="text-2xl font-bold font-mono">{summary.averageResponseTimeMs}ms</div>
        </Card>
      </div>

      {/* Domain List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Unified Domains</CardTitle>
          <CardDescription>
            {lastRefresh && (
              <span>Last updated: {lastRefresh.toLocaleTimeString()}</span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AnimatePresence mode="wait">
            <div className="space-y-3">
              {domains.map((domain, index) => {
                const result = healthResults.find(r => r.domainId === domain.id)
                
                return (
                  <motion.div
                    key={domain.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {result ? getStatusIcon(result.status) : <Pulse size={18} className="text-gray-400 animate-pulse" />}
                      <div>
                        <div className="font-medium">{domain.name}</div>
                        <div className="text-sm text-muted-foreground font-mono">{domain.url}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className={`text-xs ${getProviderBadge(domain.provider)}`}>
                        {domain.provider}
                      </Badge>
                      <Badge variant="outline" className="text-xs capitalize">
                        {domain.environment}
                      </Badge>
                      {result && (
                        <>
                          <Badge variant={getHealthStatusBadgeVariant(result.status)} className="capitalize">
                            {result.status}
                          </Badge>
                          <span className="text-sm text-muted-foreground font-mono w-16 text-right">
                            {result.responseTimeMs}ms
                          </span>
                        </>
                      )}
                      {isLoading && !result && (
                        <ArrowsClockwise size={16} className="animate-spin text-muted-foreground" />
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="flex justify-between items-center text-sm text-muted-foreground">
        <span>VortexForge Autonomy • Domain Unification</span>
        <Badge variant="outline" className="font-mono text-xs hope-wave-badge">
          SAIF Assessment Active
        </Badge>
      </div>
    </div>
  )
}
