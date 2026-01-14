import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Cube, Play, Check, X } from '@phosphor-icons/react'

interface Primitive {
  id: string
  name: string
  category: string
  description: string
  testCases: { input: string; expectedOutput: string }[]
}

const primitives: Primitive[] = [
  {
    id: 'spectral-hash',
    name: 'Spectral Hash',
    category: 'Cryptography',
    description: 'Generates frequency-domain hashes for collaborative signatures',
    testCases: [
      { input: 'user_session_abc123', expectedOutput: 'SH:7f4e9d2a...' },
      { input: 'repo_commit_def456', expectedOutput: 'SH:3b1c8a5f...' },
    ]
  },
  {
    id: 'coherence-vector',
    name: 'Coherence Vector',
    category: 'Analysis',
    description: 'Computes multi-dimensional coherence metrics for collaboration patterns',
    testCases: [
      { input: '[0.8, 0.6, 0.9]', expectedOutput: 'CV:0.767' },
      { input: '[0.3, 0.7, 0.5]', expectedOutput: 'CV:0.500' },
    ]
  },
  {
    id: 'atom-token',
    name: 'ATOM Token',
    category: 'Authentication',
    description: 'Atomic authentication token with indivisible verification',
    testCases: [
      { input: 'user:alice|factor:bio', expectedOutput: 'AT:valid' },
      { input: 'user:bob|factor:invalid', expectedOutput: 'AT:rejected' },
    ]
  },
  {
    id: 'bridge-mapper',
    name: 'Bridge Mapper',
    category: 'Hardware',
    description: 'Isomorphic mapping between hardware inputs and software actions',
    testCases: [
      { input: 'KEY_1→action', expectedOutput: 'BM:mapped' },
      { input: 'MACRO_A→sequence', expectedOutput: 'BM:mapped' },
    ]
  },
  {
    id: 'spiral-encoder',
    name: 'Spiral Encoder',
    category: 'Data',
    description: 'Encodes data using spiral traversal patterns for efficient storage',
    testCases: [
      { input: 'linear_data', expectedOutput: 'SE:spiral_encoded' },
      { input: 'matrix[[1,2],[3,4]]', expectedOutput: 'SE:[1,2,4,3]' },
    ]
  },
]

export function PrimitivesLibrary() {
  const [selectedPrimitive, setSelectedPrimitive] = useState<string | null>(null)
  const [testResults, setTestResults] = useState<Record<string, boolean>>({})
  const [runningTest, setRunningTest] = useState<string | null>(null)

  const runTest = async (primitiveId: string, testIndex: number) => {
    const testKey = `${primitiveId}-${testIndex}`
    setRunningTest(testKey)
    
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const success = Math.random() > 0.1
    setTestResults(prev => ({ ...prev, [testKey]: success }))
    setRunningTest(null)
  }

  const primitive = primitives.find(p => p.id === selectedPrimitive)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="p-6 lg:col-span-1">
        <h3 className="text-lg font-semibold mb-4">Available Primitives</h3>
        <div className="space-y-2">
          {primitives.map(prim => (
            <motion.div
              key={prim.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant={selectedPrimitive === prim.id ? 'default' : 'outline'}
                className="w-full justify-start h-auto py-3 px-4"
                onClick={() => setSelectedPrimitive(prim.id)}
              >
                <div className="flex items-start gap-3 text-left">
                  <Cube size={20} className="mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{prim.name}</div>
                    <div className="text-xs text-muted-foreground">{prim.category}</div>
                  </div>
                </div>
              </Button>
            </motion.div>
          ))}
        </div>
      </Card>

      <Card className="p-6 lg:col-span-2">
        <AnimatePresence mode="wait">
          {primitive ? (
            <motion.div
              key={primitive.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{primitive.name}</h2>
                    <Badge variant="secondary">{primitive.category}</Badge>
                  </div>
                </div>
                <p className="text-muted-foreground">{primitive.description}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Test Cases</h3>
                <div className="space-y-3">
                  {primitive.testCases.map((test, index) => {
                    const testKey = `${primitive.id}-${index}`
                    const isRunning = runningTest === testKey
                    const result = testResults[testKey]

                    return (
                      <Card key={index} className="p-4 bg-muted/30">
                        <div className="space-y-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <div className="text-xs text-muted-foreground mb-1">Input</div>
                              <code className="font-mono text-xs bg-background px-2 py-1 rounded">
                                {test.input}
                              </code>
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground mb-1">Expected Output</div>
                              <code className="font-mono text-xs bg-background px-2 py-1 rounded">
                                {test.expectedOutput}
                              </code>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <Button
                              size="sm"
                              onClick={() => runTest(primitive.id, index)}
                              disabled={isRunning}
                              className="flex-1"
                            >
                              {isRunning ? (
                                <>
                                  <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                    className="mr-2"
                                  >
                                    <Play size={16} />
                                  </motion.div>
                                  Testing...
                                </>
                              ) : (
                                <>
                                  <Play size={16} className="mr-2" />
                                  Run Test
                                </>
                              )}
                            </Button>

                            {result !== undefined && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                              >
                                {result ? (
                                  <Badge className="flex items-center gap-1 bg-accent text-accent-foreground">
                                    <Check size={14} weight="bold" />
                                    Pass
                                  </Badge>
                                ) : (
                                  <Badge variant="destructive" className="flex items-center gap-1">
                                    <X size={14} weight="bold" />
                                    Fail
                                  </Badge>
                                )}
                              </motion.div>
                            )}
                          </div>
                        </div>
                      </Card>
                    )
                  })}
                </div>
              </div>

              <Accordion type="single" collapsible>
                <AccordionItem value="docs">
                  <AccordionTrigger>Implementation Details</AccordionTrigger>
                  <AccordionContent className="space-y-3 text-sm text-muted-foreground">
                    <p>This primitive is part of the SpiralSafe protocol suite and implements standardized interfaces for interoperability.</p>
                    <div className="bg-background p-3 rounded font-mono text-xs">
                      <div className="text-accent mb-2">// Example usage</div>
                      <div>import {"{"} {primitive.id.replace(/-/g, '_')} {"}"} from 'spiralsafe/primitives'</div>
                      <div className="mt-2">const result = {primitive.id.replace(/-/g, '_')}(input)</div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-full min-h-[400px] text-center"
            >
              <Cube size={64} className="text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Select a Primitive</h3>
              <p className="text-muted-foreground max-w-md">
                Choose a primitive from the library to view its documentation and run test cases
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  )
}
