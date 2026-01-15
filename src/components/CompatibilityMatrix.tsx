import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, Warning, Play } from '@phosphor-icons/react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface CompatibilityResult {
  feature: string
  anthropic: 'full' | 'partial' | 'none'
  openai: 'full' | 'partial' | 'none'
  google: 'full' | 'partial' | 'none'
}

export function CompatibilityMatrix() {
  const [isRunning, setIsRunning] = useState(false)
  const [results, setResults] = useState<CompatibilityResult[]>([])

  const runCompatibilityTest = async () => {
    setIsRunning(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setResults([
      { feature: 'Medical Terminology', anthropic: 'full', openai: 'full', google: 'full' },
      { feature: 'ICD-10 Coding', anthropic: 'full', openai: 'partial', google: 'full' },
      { feature: 'SNOMED Support', anthropic: 'partial', openai: 'partial', google: 'full' },
      { feature: 'Clinical Notes', anthropic: 'full', openai: 'full', google: 'full' },
      { feature: 'Medical Imaging', anthropic: 'partial', openai: 'none', google: 'full' },
      { feature: 'Drug Interactions', anthropic: 'full', openai: 'full', google: 'full' },
      { feature: 'HIPAA Compliance', anthropic: 'full', openai: 'full', google: 'full' },
      { feature: 'Context Window', anthropic: 'full', openai: 'full', google: 'partial' },
    ])
    
    setIsRunning(false)
  }

  const renderStatusIcon = (status: 'full' | 'partial' | 'none') => {
    if (status === 'full') return <CheckCircle size={20} className="status-healthy" weight="fill" />
    if (status === 'partial') return <Warning size={20} className="status-warning" weight="fill" />
    return <XCircle size={20} className="status-critical" weight="fill" />
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>API Compatibility Testing</CardTitle>
            <Button onClick={runCompatibilityTest} disabled={isRunning}>
              <Play size={18} className="mr-2" />
              {isRunning ? 'Testing APIs...' : 'Run Compatibility Test'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {results.length > 0 && (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Medical Feature</TableHead>
                    <TableHead className="text-center">Anthropic Claude</TableHead>
                    <TableHead className="text-center">OpenAI GPT</TableHead>
                    <TableHead className="text-center">Google Med-PaLM</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((result, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{result.feature}</TableCell>
                      <TableCell className="text-center">{renderStatusIcon(result.anthropic)}</TableCell>
                      <TableCell className="text-center">{renderStatusIcon(result.openai)}</TableCell>
                      <TableCell className="text-center">{renderStatusIcon(result.google)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          {results.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Run compatibility test to see API parity across platforms
            </div>
          )}
        </CardContent>
      </Card>

      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Compatibility Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold">
                  {results.filter(r => r.anthropic === 'full').length}/{results.length}
                </div>
                <div className="text-sm text-muted-foreground mt-1">Anthropic Claude</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold">
                  {results.filter(r => r.openai === 'full').length}/{results.length}
                </div>
                <div className="text-sm text-muted-foreground mt-1">OpenAI GPT</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold">
                  {results.filter(r => r.google === 'full').length}/{results.length}
                </div>
                <div className="text-sm text-muted-foreground mt-1">Google Med-PaLM</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
