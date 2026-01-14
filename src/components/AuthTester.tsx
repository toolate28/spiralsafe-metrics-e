import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { ShieldCheck, Check, X, Warning } from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'

type AuthFactor = 'biometric' | 'token' | 'knowledge'

interface TestResult {
  factor: AuthFactor
  status: 'pass' | 'fail' | 'warning'
  latency: number
  message: string
}

export function AuthTester() {
  const [selectedFactors, setSelectedFactors] = useState<AuthFactor[]>(['knowledge'])
  const [isRunning, setIsRunning] = useState(false)
  const [results, setResults] = useKV<TestResult[]>('auth-test-results', [])
  const [atomicMode, setAtomicMode] = useState(true)

  const factors = [
    { id: 'biometric' as AuthFactor, label: 'Biometric', description: 'Fingerprint or facial recognition' },
    { id: 'token' as AuthFactor, label: 'Hardware Token', description: 'Physical security key' },
    { id: 'knowledge' as AuthFactor, label: 'Knowledge', description: 'Password or PIN' },
  ]

  const toggleFactor = (factor: AuthFactor) => {
    setSelectedFactors(prev => 
      prev.includes(factor) 
        ? prev.filter(f => f !== factor)
        : [...prev, factor]
    )
  }

  const runTests = async () => {
    setIsRunning(true)
    setResults((currentResults) => [])

    const testResults: TestResult[] = []

    for (const factor of selectedFactors) {
      await new Promise(resolve => setTimeout(resolve, 800))

      const latency = Math.floor(Math.random() * 150) + 50
      const random = Math.random()
      
      let status: 'pass' | 'fail' | 'warning'
      let message: string

      if (factor === 'biometric') {
        if (random > 0.15) {
          status = 'pass'
          message = 'Biometric authentication successful'
        } else {
          status = 'warning'
          message = 'Low confidence match detected'
        }
      } else if (factor === 'token') {
        if (random > 0.1) {
          status = 'pass'
          message = 'Hardware token verified'
        } else {
          status = 'fail'
          message = 'Token signature mismatch'
        }
      } else {
        if (random > 0.2) {
          status = 'pass'
          message = 'Knowledge factor authenticated'
        } else {
          status = 'fail'
          message = 'Invalid credentials provided'
        }
      }

      const result = { factor, status, latency, message }
      testResults.push(result)
      setResults((currentResults) => [...(currentResults || []), result])
    }

    setIsRunning(false)
  }

  const getSecurityScore = () => {
    if (!results || results.length === 0) return 0
    
    const passCount = results.filter(r => r.status === 'pass').length
    const factorBonus = selectedFactors.length * 15
    const passScore = (passCount / results.length) * 70
    
    return Math.min(Math.round(passScore + factorBonus), 100)
  }

  const getStatusIcon = (status: 'pass' | 'fail' | 'warning') => {
    switch (status) {
      case 'pass':
        return <Check size={20} weight="bold" className="text-accent" />
      case 'fail':
        return <X size={20} weight="bold" className="text-destructive" />
      case 'warning':
        return <Warning size={20} weight="bold" className="text-yellow-500" />
    }
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Authentication Factors</h3>
            <div className="space-y-3">
              {factors.map(factor => (
                <div
                  key={factor.id}
                  className="flex items-start justify-between p-4 rounded-lg border border-border hover:border-secondary/50 transition-colors cursor-pointer"
                  onClick={() => toggleFactor(factor.id)}
                >
                  <div className="flex-1">
                    <div className="font-medium">{factor.label}</div>
                    <div className="text-sm text-muted-foreground">{factor.description}</div>
                  </div>
                  <Switch
                    checked={selectedFactors.includes(factor.id)}
                    onCheckedChange={() => toggleFactor(factor.id)}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
            <div>
              <Label htmlFor="atomic-mode" className="text-sm font-medium">ATOM-AUTH Protocol</Label>
              <p className="text-xs text-muted-foreground mt-1">Enable atomic authentication primitives</p>
            </div>
            <Switch
              id="atomic-mode"
              checked={atomicMode}
              onCheckedChange={setAtomicMode}
            />
          </div>

          <Button 
            onClick={runTests} 
            disabled={isRunning || selectedFactors.length === 0}
            className="w-full"
          >
            {isRunning ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="mr-2"
                >
                  <ShieldCheck size={20} />
                </motion.div>
                Running Tests...
              </>
            ) : (
              <>
                <ShieldCheck size={20} className="mr-2" />
                Run Authentication Tests
              </>
            )}
          </Button>
        </div>
      </Card>

      {results && results.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Test Results</h3>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Security Score</div>
                <div className="text-3xl font-bold font-mono text-accent">{getSecurityScore()}</div>
              </div>
            </div>

            <div className="space-y-3">
              {results.map((result, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 rounded-lg bg-card border border-border"
                >
                  <div className="flex items-center gap-3">
                    {getStatusIcon(result.status)}
                    <div>
                      <div className="font-medium capitalize">{result.factor} Authentication</div>
                      <div className="text-sm text-muted-foreground">{result.message}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="font-mono">
                      {result.latency}ms
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>

          {getSecurityScore() < 70 && (
            <Card className="p-4 bg-destructive/10 border-destructive/30">
              <div className="flex gap-3">
                <Warning size={24} className="text-destructive flex-shrink-0" />
                <div>
                  <h4 className="font-semibold mb-1">Security Recommendations</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    {selectedFactors.length < 3 && (
                      <li>Enable additional authentication factors for stronger security</li>
                    )}
                    {results && results.some(r => r.status === 'fail') && (
                      <li>Review and fix failed authentication factors</li>
                    )}
                    {!atomicMode && (
                      <li>Consider enabling ATOM-AUTH for atomic primitives</li>
                    )}
                  </ul>
                </div>
              </div>
            </Card>
          )}
        </motion.div>
      )}
    </div>
  )
}
