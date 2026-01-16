import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Warning, ClockCounterClockwise } from '@phosphor-icons/react'

interface ComplianceItem {
  id: string
  regulation: string
  requirement: string
  status: 'compliant' | 'at-risk'
  lastAudit: string
}

// ATOM provenance log entry for compliance tracking
interface ProvenanceEntry {
  id: string
  timestamp: number
  action: string
  itemId: string
  details: string
}

export function ComplianceTracker() {
  const [items] = useKV<ComplianceItem[]>('compliance-items', [
    {
      id: '1',
      regulation: 'HIPAA',
      requirement: 'Data Encryption at Rest',
      status: 'compliant',
      lastAudit: '2024-01-15'
    },
    {
      id: '2',
      regulation: 'HIPAA',
      requirement: 'Access Control Logs',
      status: 'compliant',
      lastAudit: '2024-01-15'
    },
    {
      id: '3',
      regulation: 'HIPAA',
      requirement: 'Business Associate Agreements',
      status: 'at-risk',
      lastAudit: '2024-01-10'
    },
    {
      id: '4',
      regulation: 'FDA AI/ML',
      requirement: 'Algorithm Transparency',
      status: 'compliant',
      lastAudit: '2024-01-12'
    },
    {
      id: '5',
      regulation: 'FDA AI/ML',
      requirement: 'Continuous Monitoring',
      status: 'compliant',
      lastAudit: '2024-01-18'
    },
    {
      id: '6',
      regulation: 'GDPR',
      requirement: 'Data Subject Rights',
      status: 'compliant',
      lastAudit: '2024-01-14'
    },
    {
      id: '7',
      regulation: 'GDPR',
      requirement: 'Data Processing Records',
      status: 'at-risk',
      lastAudit: '2024-01-08'
    }
  ])

  // ATOM provenance log for tracking compliance state
  const [provenanceLog, setProvenanceLog] = useState<ProvenanceEntry[]>([])

  // Log provenance on initial load
  useEffect(() => {
    if (items && items.length > 0 && provenanceLog.length === 0) {
      const entry: ProvenanceEntry = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        action: 'COMPLIANCE_LOADED',
        itemId: 'all',
        details: `Loaded ${items.length} compliance items`
      }
      setProvenanceLog([entry])
    }
  }, [items, provenanceLog.length])

  const compliantCount = items?.filter(i => i.status === 'compliant').length || 0
  const totalCount = items?.length || 0

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Compliance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-6 bg-muted/50 rounded-lg mb-6">
            <div className="text-4xl font-bold font-mono">
              {compliantCount}/{totalCount}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              Requirements Compliant
            </div>
          </div>

          <div className="space-y-3">
            {items?.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          {item.regulation}
                        </Badge>
                        <Badge
                          variant={item.status === 'compliant' ? 'default' : 'destructive'}
                          className="text-xs"
                        >
                          {item.status === 'compliant' ? (
                            <CheckCircle size={12} className="mr-1" weight="fill" />
                          ) : (
                            <Warning size={12} className="mr-1" weight="fill" />
                          )}
                          {item.status}
                        </Badge>
                      </div>
                      <h4 className="font-semibold">{item.requirement}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        Last audit: {item.lastAudit}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {provenanceLog.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ClockCounterClockwise size={20} className="text-muted-foreground" />
              <CardTitle className="text-sm">ATOM Provenance Log</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {provenanceLog.map((entry) => (
                <div key={entry.id} className="text-xs p-2 bg-muted/50 rounded font-mono">
                  <span className="text-muted-foreground">
                    {new Date(entry.timestamp).toISOString()}
                  </span>
                  {' - '}
                  <span className="text-primary">{entry.action}</span>
                  {': '}
                  <span>{entry.details}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
