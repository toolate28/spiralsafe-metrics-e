import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plugs, Lightning, Check, X } from '@phosphor-icons/react'

interface BridgeTest {
  device: string
  app: string
  timestamp: number
  latency: number
  status: 'connected' | 'disconnected' | 'error'
  compatibility: number
}

// API status for autonomous monitoring
interface ApiStatus {
  lastCheck: number
  isAvailable: boolean
  responseTime: number
}

export function HardwareBridge() {
  const [selectedDevice, setSelectedDevice] = useState('')
  const [selectedApp, setSelectedApp] = useState('')
  const [isTesting, setIsTesting] = useState(false)
  const [testResult, setTestResult] = useState<BridgeTest | null>(null)
  const [inputBuffer, setInputBuffer] = useState<string[]>([])
  const [apiStatus, setApiStatus] = useState<ApiStatus>({
    lastCheck: 0,
    isAvailable: true,
    responseTime: 0
  })

  // API status check hook for autonomous monitoring
  const checkApiStatus = useCallback(() => {
    // Simulate API health check
    const responseTime = Math.random() * 50 + 10
    const isAvailable = Math.random() > 0.1 // 90% availability
    
    setApiStatus({
      lastCheck: Date.now(),
      isAvailable,
      responseTime: Math.round(responseTime)
    })
  }, [])

  // Autonomous API health monitoring
  useEffect(() => {
    checkApiStatus()
    const interval = setInterval(checkApiStatus, 30000) // Check every 30 seconds
    return () => clearInterval(interval)
  }, [checkApiStatus])

  const devices = [
    { id: 'tartarus-pro', name: 'Razer Tartarus Pro', type: 'Gaming Keypad' },
    { id: 'stream-deck', name: 'Elgato Stream Deck', type: 'Macro Pad' },
    { id: 'midi-fighter', name: 'MIDI Fighter', type: 'MIDI Controller' },
  ]

  const applications = [
    { id: 'minecraft', name: 'Minecraft', category: 'Game' },
    { id: 'ai-assistant', name: 'AI Assistant', category: 'Tool' },
    { id: 'code-editor', name: 'Code Editor', category: 'Development' },
  ]

  const runDiagnostic = async () => {
    if (!selectedDevice || !selectedApp) return

    setIsTesting(true)
    setInputBuffer([])
    setTestResult(null)

    await new Promise(resolve => setTimeout(resolve, 500))
    setInputBuffer(['KEY_1'])
    
    await new Promise(resolve => setTimeout(resolve, 300))
    setInputBuffer(prev => [...prev, 'KEY_2'])
    
    await new Promise(resolve => setTimeout(resolve, 400))
    setInputBuffer(prev => [...prev, 'MACRO_A'])
    
    await new Promise(resolve => setTimeout(resolve, 600))

    const latency = Math.floor(Math.random() * 30) + 10
    const compatibility = Math.floor(Math.random() * 30) + 70
    const status: 'connected' | 'error' = compatibility > 75 ? 'connected' : 'error'

    setTestResult({
      device: selectedDevice,
      app: selectedApp,
      timestamp: Date.now(),
      latency,
      status,
      compatibility,
    })

    setIsTesting(false)
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Bridge Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Hardware Device</label>
            <Select value={selectedDevice} onValueChange={setSelectedDevice}>
              <SelectTrigger>
                <SelectValue placeholder="Select device..." />
              </SelectTrigger>
              <SelectContent>
                {devices.map(device => (
                  <SelectItem key={device.id} value={device.id}>
                    <div className="flex flex-col">
                      <span>{device.name}</span>
                      <span className="text-xs text-muted-foreground">{device.type}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Target Application</label>
            <Select value={selectedApp} onValueChange={setSelectedApp}>
              <SelectTrigger>
                <SelectValue placeholder="Select application..." />
              </SelectTrigger>
              <SelectContent>
                {applications.map(app => (
                  <SelectItem key={app.id} value={app.id}>
                    <div className="flex flex-col">
                      <span>{app.name}</span>
                      <span className="text-xs text-muted-foreground">{app.category}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Button disabled when: no device/app selected, test in progress, or API unavailable */}
        <Button 
          onClick={runDiagnostic} 
          disabled={!selectedDevice || !selectedApp || isTesting || !apiStatus.isAvailable}
          className="w-full mt-6"
        >
          {isTesting ? (
            <>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="mr-2"
              >
                <Lightning size={20} />
              </motion.div>
              Running Diagnostic...
            </>
          ) : (
            <>
              <Plugs size={20} className="mr-2" />
              Test Bridge Connection
            </>
          )}
        </Button>

        {/* API Status Display */}
        <div className="mt-4 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${apiStatus.isAvailable ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-muted-foreground">
              API {apiStatus.isAvailable ? 'Available' : 'Unavailable'}
            </span>
          </div>
          {apiStatus.lastCheck > 0 && (
            <span className="text-muted-foreground font-mono">
              {apiStatus.responseTime}ms
            </span>
          )}
        </div>
      </Card>

      {inputBuffer.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Card className="p-6">
            <h3 className="text-sm font-medium uppercase tracking-wide text-muted-foreground mb-4">
              Input Buffer
            </h3>
            <div className="flex flex-wrap gap-2">
              {inputBuffer.map((input, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Badge className="font-mono bg-secondary text-secondary-foreground">
                    {input}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {testResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Diagnostic Results</h3>
              <Badge 
                variant={testResult.status === 'connected' ? 'default' : 'destructive'}
                className="flex items-center gap-2"
              >
                {testResult.status === 'connected' ? (
                  <>
                    <Check size={16} weight="bold" />
                    Connected
                  </>
                ) : (
                  <>
                    <X size={16} weight="bold" />
                    Error
                  </>
                )}
              </Badge>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Latency</div>
                <div className="text-2xl font-bold font-mono text-accent">{testResult.latency}ms</div>
              </div>
              
              <div>
                <div className="text-sm text-muted-foreground mb-1">Compatibility</div>
                <div className="text-2xl font-bold font-mono">{testResult.compatibility}%</div>
              </div>
              
              <div>
                <div className="text-sm text-muted-foreground mb-1">Inputs Processed</div>
                <div className="text-2xl font-bold font-mono">{inputBuffer.length}</div>
              </div>
              
              <div>
                <div className="text-sm text-muted-foreground mb-1">Throughput</div>
                <div className="text-2xl font-bold font-mono">
                  {Math.round(1000 / testResult.latency)}
                  <span className="text-sm text-muted-foreground ml-1">Hz</span>
                </div>
              </div>
            </div>
          </Card>

          {testResult.compatibility > 85 && (
            <Card className="p-4 bg-accent/10 border-accent/30">
              <div className="flex gap-3">
                <Check size={24} className="text-accent flex-shrink-0" />
                <div>
                  <h4 className="font-semibold mb-1">Excellent Compatibility</h4>
                  <p className="text-sm text-muted-foreground">
                    The hardware bridge is functioning optimally with {selectedApp}. All inputs are being processed correctly.
                  </p>
                </div>
              </div>
            </Card>
          )}
        </motion.div>
      )}
    </div>
  )
}
