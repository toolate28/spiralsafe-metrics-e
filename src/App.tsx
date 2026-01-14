import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { SortingHat } from '@/components/SortingHat'
import { SpectralAnalyzer } from '@/components/SpectralAnalyzer'
import { AuthTester } from '@/components/AuthTester'
import { HardwareBridge } from '@/components/HardwareBridge'
import { PrimitivesLibrary } from '@/components/PrimitivesLibrary'
import { 
  Waveform, 
  ShieldCheck, 
  Plugs, 
  Cube, 
  SortAscending 
} from '@phosphor-icons/react'

function App() {
  const [activeTab, setActiveTab] = useState('sorting')

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div 
        className="fixed inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              oklch(0.35 0.15 290 / 0.1) 2px,
              oklch(0.35 0.15 290 / 0.1) 4px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 2px,
              oklch(0.35 0.15 290 / 0.1) 2px,
              oklch(0.35 0.15 290 / 0.1) 4px
            )
          `,
          backgroundSize: '50px 50px'
        }}
      />

      <div className="relative">
        <header className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-glow" style={{ letterSpacing: '-0.02em' }}>
                  SpiralSafe
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Collaborative Metrics Evaluation Platform
                </p>
              </div>
              <Badge variant="outline" className="font-mono text-xs">
                v1.0.0
              </Badge>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 gap-2 bg-transparent">
              <TabsTrigger 
                value="sorting" 
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <SortAscending size={18} />
                <span className="hidden sm:inline">Sorting Hat</span>
                <span className="sm:hidden">Sort</span>
              </TabsTrigger>
              <TabsTrigger 
                value="spectral"
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Waveform size={18} />
                <span className="hidden sm:inline">Spectral</span>
                <span className="sm:hidden">Wave</span>
              </TabsTrigger>
              <TabsTrigger 
                value="auth"
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <ShieldCheck size={18} />
                <span className="hidden sm:inline">3FA/ATOM</span>
                <span className="sm:hidden">Auth</span>
              </TabsTrigger>
              <TabsTrigger 
                value="hardware"
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Plugs size={18} />
                <span className="hidden sm:inline">Hardware</span>
                <span className="sm:hidden">HW</span>
              </TabsTrigger>
              <TabsTrigger 
                value="primitives"
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Cube size={18} />
                <span className="hidden sm:inline">Primitives</span>
                <span className="sm:hidden">Prim</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="sorting" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-6 mb-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <SortAscending size={32} className="text-primary" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold mb-2">Collaboration Sorting Hat</h2>
                      <p className="text-muted-foreground">
                        Discover your collaborative archetype through our spectral analysis questionnaire. 
                        This tool evaluates your workflow patterns across repository management, AI integration, and manual craftsmanship.
                      </p>
                    </div>
                  </div>
                </Card>
                <SortingHat />
              </motion.div>
            </TabsContent>

            <TabsContent value="spectral" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-6 mb-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-secondary/10">
                      <Waveform size={32} className="text-secondary" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold mb-2">Spectral Coherence Analyzer</h2>
                      <p className="text-muted-foreground">
                        Visualize frequency-domain patterns in collaborative signals. Adjust parameters and observe 
                        real-time waveform analysis to measure synchronization quality.
                      </p>
                    </div>
                  </div>
                </Card>
                <SpectralAnalyzer />
              </motion.div>
            </TabsContent>

            <TabsContent value="auth" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-6 mb-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-accent/10">
                      <ShieldCheck size={32} className="text-accent" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold mb-2">3FA/ATOM-AUTH Protocol Tester</h2>
                      <p className="text-muted-foreground">
                        Test three-factor authentication flows with atomic primitives. Validate security 
                        protocols and receive detailed compatibility reports with optimization recommendations.
                      </p>
                    </div>
                  </div>
                </Card>
                <AuthTester />
              </motion.div>
            </TabsContent>

            <TabsContent value="hardware" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-6 mb-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <Plugs size={32} className="text-primary" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold mb-2">Isomorphic Hardware Bridge Diagnostic</h2>
                      <p className="text-muted-foreground">
                        Test hardware bridge implementations for devices like Tartarus Pro with AI and game integration. 
                        Measure latency, throughput, and compatibility in real-time.
                      </p>
                    </div>
                  </div>
                </Card>
                <HardwareBridge />
              </motion.div>
            </TabsContent>

            <TabsContent value="primitives" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-6 mb-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-secondary/10">
                      <Cube size={32} className="text-secondary" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold mb-2">Primitive Protocol Library</h2>
                      <p className="text-muted-foreground">
                        Explore and test individual SpiralSafe primitives. Each primitive includes documentation, 
                        test cases, and interactive examples to validate correctness.
                      </p>
                    </div>
                  </div>
                </Card>
                <PrimitivesLibrary />
              </motion.div>
            </TabsContent>
          </Tabs>
        </main>

        <footer className="border-t border-border/50 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <p className="text-center text-sm text-muted-foreground">
              SpiralSafe Collaborative Metrics Platform • Advanced Protocol Testing & Analysis
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default App
