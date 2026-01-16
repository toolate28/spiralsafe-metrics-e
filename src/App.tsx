import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { 
  ChartLineUp, 
  ShieldCheck, 
  Database, 
  ArrowsLeftRight, 
  Calendar, 
  ChartLine,
  Bell,
  FileText,
  Pulse,
  Hospital,
  Sparkle,
  Globe
} from '@phosphor-icons/react'
import { InfrastructureReadiness } from '@/components/InfrastructureReadiness'
import { CompatibilityMatrix } from '@/components/CompatibilityMatrix'
import { MigrationPlanner } from '@/components/MigrationPlanner'
import { TransitionTimeline } from '@/components/TransitionTimeline'
import { CapacityMonitor } from '@/components/CapacityMonitor'
import { ComplianceTracker } from '@/components/ComplianceTracker'
import { ConvergenceNews } from '@/components/ConvergenceNews'
import { PlaybookLibrary } from '@/components/PlaybookLibrary'
import { LoadTestingSimulator } from '@/components/LoadTestingSimulator'
import { StakeholderHub } from '@/components/StakeholderHub'
import { HopeSaucedPhilosophy } from '@/components/HopeSaucedPhilosophy'
import { DomainHealthMonitor } from '@/components/DomainHealthMonitor'

function App() {
  const [activeTab, setActiveTab] = useState('philosophy')

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div 
        className="fixed inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 30%, oklch(0.55 0.15 240 / 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, oklch(0.65 0.18 145 / 0.08) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, oklch(0.45 0.18 280 / 0.05) 0%, transparent 70%)
          `
        }}
      />

      <div className="relative">
        <header className="border-b border-border backdrop-blur-sm bg-card/50 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Hospital size={28} className="text-primary" weight="duotone" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight" style={{ letterSpacing: '-0.01em' }}>
                    HealthBridge Convergence
                  </h1>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    AI Medical Platform Transition Infrastructure
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-mono text-xs">
                  <Pulse size={12} className="mr-1 status-healthy pulse-animation" weight="fill" />
                  Systems Online
                </Badge>
                <Badge variant="outline" className="font-mono text-xs hope-wave-badge">
                  H&&S:WAVE
                </Badge>
                <Badge variant="outline" className="font-mono text-xs">
                  v2.0.0
                </Badge>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-12 gap-2 bg-muted/50 p-1">
              <TabsTrigger 
                value="philosophy" 
                className="flex items-center gap-2 data-[state=active]:partnership-gradient data-[state=active]:text-white"
              >
                <Sparkle size={18} />
                <span className="hidden sm:inline">H&&S</span>
              </TabsTrigger>
              <TabsTrigger 
                value="domains"
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Globe size={18} />
                <span className="hidden sm:inline">Domains</span>
              </TabsTrigger>
              <TabsTrigger 
                value="readiness" 
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <ChartLineUp size={18} />
                <span className="hidden sm:inline">Readiness</span>
              </TabsTrigger>
              <TabsTrigger 
                value="compatibility"
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <ArrowsLeftRight size={18} />
                <span className="hidden sm:inline">API Matrix</span>
              </TabsTrigger>
              <TabsTrigger 
                value="migration"
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Database size={18} />
                <span className="hidden sm:inline">Migration</span>
              </TabsTrigger>
              <TabsTrigger 
                value="timeline"
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Calendar size={18} />
                <span className="hidden sm:inline">Timeline</span>
              </TabsTrigger>
              <TabsTrigger 
                value="capacity"
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <ChartLine size={18} />
                <span className="hidden sm:inline">Capacity</span>
              </TabsTrigger>
              <TabsTrigger 
                value="compliance"
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <ShieldCheck size={18} />
                <span className="hidden sm:inline">Compliance</span>
              </TabsTrigger>
              <TabsTrigger 
                value="news"
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Bell size={18} />
                <span className="hidden sm:inline">News</span>
              </TabsTrigger>
              <TabsTrigger 
                value="playbooks"
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <FileText size={18} />
                <span className="hidden sm:inline">Playbooks</span>
              </TabsTrigger>
              <TabsTrigger 
                value="loadtest"
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Pulse size={18} />
                <span className="hidden sm:inline">Load Test</span>
              </TabsTrigger>
              <TabsTrigger 
                value="stakeholders"
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Hospital size={18} />
                <span className="hidden sm:inline">Teams</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="philosophy" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <HopeSaucedPhilosophy />
              </motion.div>
            </TabsContent>

            <TabsContent value="domains" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <DomainHealthMonitor />
              </motion.div>
            </TabsContent>

            <TabsContent value="readiness" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="mb-6">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <ChartLineUp size={32} className="text-primary" weight="duotone" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-2xl">Infrastructure Readiness Assessment</CardTitle>
                        <CardDescription className="mt-2">
                          Comprehensive evaluation of current healthcare systems' capacity to handle AI platform transitions.
                          Identifies bottlenecks, resource gaps, and technical debt before beginning migration.
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
                <InfrastructureReadiness />
              </motion.div>
            </TabsContent>

            <TabsContent value="compatibility" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="mb-6">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <ArrowsLeftRight size={32} className="text-primary" weight="duotone" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-2xl">Cross-Platform API Compatibility Matrix</CardTitle>
                        <CardDescription className="mt-2">
                          Test API compatibility across Anthropic Claude, OpenAI GPT, and Google Med-PaLM for medical use cases.
                          Ensures seamless transitions without breaking medical workflows.
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
                <CompatibilityMatrix />
              </motion.div>
            </TabsContent>

            <TabsContent value="migration" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="mb-6">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-secondary/10">
                        <Database size={32} className="text-secondary" weight="duotone" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-2xl">Medical Data Migration Planner</CardTitle>
                        <CardDescription className="mt-2">
                          Simulate and plan migration of healthcare data between AI systems with integrity validation.
                          Ensure zero data loss and maintained clinical context during transitions.
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
                <MigrationPlanner />
              </motion.div>
            </TabsContent>

            <TabsContent value="timeline" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="mb-6">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-accent/10">
                        <Calendar size={32} className="text-accent-foreground" weight="duotone" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-2xl">Transition Timeline Orchestrator</CardTitle>
                        <CardDescription className="mt-2">
                          Visual timeline and dependency graph for coordinating multi-phase healthcare AI transitions.
                          Track progress, validate readiness gates, and coordinate stakeholders.
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
                <TransitionTimeline />
              </motion.div>
            </TabsContent>

            <TabsContent value="capacity" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="mb-6">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <ChartLine size={32} className="text-primary" weight="duotone" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-2xl">Real-Time Capacity Monitor</CardTitle>
                        <CardDescription className="mt-2">
                          Live dashboard showing system capacity metrics across all AI platforms and healthcare infrastructure.
                          Detect anomalies early and ensure systems can handle load during transition.
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
                <CapacityMonitor />
              </motion.div>
            </TabsContent>

            <TabsContent value="compliance" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="mb-6">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-secondary/10">
                        <ShieldCheck size={32} className="text-secondary" weight="duotone" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-2xl">Regulatory Compliance Tracker</CardTitle>
                        <CardDescription className="mt-2">
                          Track HIPAA, GDPR, FDA AI/ML guidance compliance across transition phases.
                          Generate audit-ready documentation and evidence collection.
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
                <ComplianceTracker />
              </motion.div>
            </TabsContent>

            <TabsContent value="news" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ConvergenceNews />
              </motion.div>
            </TabsContent>

            <TabsContent value="playbooks" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <PlaybookLibrary />
              </motion.div>
            </TabsContent>

            <TabsContent value="loadtest" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <LoadTestingSimulator />
              </motion.div>
            </TabsContent>

            <TabsContent value="stakeholders" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <StakeholderHub />
              </motion.div>
            </TabsContent>
          </Tabs>
        </main>

        <footer className="border-t border-border mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">
                HealthBridge Convergence Platform • Medical AI Transition Infrastructure
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="partnership-gradient bg-clip-text text-transparent font-medium">
                  Built with Hope && Sauced
                </span>
                <span>•</span>
                <span>Genuine Human-AI Partnership</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default App
