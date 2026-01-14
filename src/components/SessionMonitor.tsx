import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { 
  Users, 
  Lightning, 
  ChartLine, 
  Clock,
  SignOut,
  SignIn,
  Eye,
  ChatCircle,
  Code,
  GitCommit,
  ArrowsClockwise,
  WifiHigh,
  WifiSlash
} from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'
import { useCollaboration } from '@/hooks/use-collaboration'
import { toast } from 'sonner'

interface Participant {
  id: string
  name: string
  avatar: string
  role: 'repo' | 'ai' | 'user'
  status: 'active' | 'idle' | 'away'
  joinedAt: number
  lastActivity: number
  metrics: {
    commits: number
    messages: number
    codeReviews: number
    activeTime: number
  }
}

interface SessionMetrics {
  totalParticipants: number
  activeParticipants: number
  sessionDuration: number
  totalCommits: number
  totalMessages: number
  coherenceScore: number
  activityLevel: 'low' | 'medium' | 'high'
}

const roleColors = {
  repo: 'oklch(0.646 0.222 41.116)',
  ai: 'oklch(0.75 0.15 195)',
  user: 'oklch(0.80 0.20 140)'
}

const roleIcons = {
  repo: GitCommit,
  ai: Lightning,
  user: Users
}

const mockNames = [
  'Alex Chen', 'Jordan Smith', 'Taylor Rivera', 'Morgan Lee', 
  'Casey Park', 'Riley Johnson', 'Quinn Davis', 'Avery Martinez'
]

const generateMockParticipant = (id: string, index: number): Participant => {
  const roles: ('repo' | 'ai' | 'user')[] = ['repo', 'ai', 'user']
  const statuses: ('active' | 'idle' | 'away')[] = ['active', 'idle', 'away']
  const now = Date.now()
  
  return {
    id,
    name: mockNames[index % mockNames.length],
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}`,
    role: roles[Math.floor(Math.random() * roles.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    joinedAt: now - Math.random() * 3600000,
    lastActivity: now - Math.random() * 300000,
    metrics: {
      commits: Math.floor(Math.random() * 50),
      messages: Math.floor(Math.random() * 100),
      codeReviews: Math.floor(Math.random() * 20),
      activeTime: Math.floor(Math.random() * 7200)
    }
  }
}

export function SessionMonitor() {
  const [participants, setParticipants] = useState<Map<string, Participant>>(new Map())
  const [sessionStartTime, setSessionStartTime] = useKV<number>('session-start-time', Date.now())
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [sessionId] = useState(() => `session-${Date.now()}`)
  const [localParticipant, setLocalParticipant] = useState<Participant | null>(null)
  const [sessionMetrics, setSessionMetrics] = useState<SessionMetrics>({
    totalParticipants: 0,
    activeParticipants: 0,
    sessionDuration: 0,
    totalCommits: 0,
    totalMessages: 0,
    coherenceScore: 0,
    activityLevel: 'low'
  })
  const [recentActivity, setRecentActivity] = useState<{ id: string; type: string; text: string; timestamp: number }[]>([])

  const collaboration = useCollaboration({
    roomId: sessionId,
    onJoin: useCallback(async (clientId: string) => {
      console.log('[SessionMonitor] Client joined:', clientId)
    }, []),
    onLeave: useCallback((clientId: string) => {
      console.log('[SessionMonitor] Client left:', clientId)
      setParticipants(prev => {
        const participant = prev.get(clientId)
        if (participant) {
          setRecentActivity(prevActivity => [{
            id: Math.random().toString(),
            type: 'leave',
            text: `${participant.name} left the session`,
            timestamp: Date.now()
          }, ...prevActivity.slice(0, 19)])
        }
        const next = new Map(prev)
        next.delete(clientId)
        return next
      })
      toast.info('Participant left', { description: 'A user has disconnected from the session' })
    }, []),
    onSyncState: useCallback((clientId: string, state: any) => {
      if (state && state.participant) {
        setParticipants(prev => {
          const isNewParticipant = !prev.has(clientId)
          const next = new Map(prev)
          next.set(clientId, state.participant)
          
          if (isNewParticipant) {
            setRecentActivity(prevActivity => [{
              id: Math.random().toString(),
              type: 'join',
              text: `${state.participant.name} joined the session`,
              timestamp: Date.now()
            }, ...prevActivity.slice(0, 19)])
            toast.success('New participant', { description: `${state.participant.name} joined the session` })
          }
          
          return next
        })
      }
    }, []),
    onActivity: useCallback((clientId: string, activity: any) => {
      if (activity) {
        setParticipants(prev => {
          const participant = prev.get(clientId)
          if (!participant) return prev

          const next = new Map(prev)
          next.set(clientId, {
            ...participant,
            metrics: {
              ...participant.metrics,
              ...activity.metrics
            },
            lastActivity: Date.now(),
            status: 'active'
          })
          return next
        })

        if (activity.text) {
          setRecentActivity(prevActivity => [{
            id: Math.random().toString(),
            type: activity.role || 'user',
            text: activity.text,
            timestamp: Date.now()
          }, ...prevActivity.slice(0, 19)])
        }
      }
    }, []),
    onStatusUpdate: useCallback((clientId: string, status: any) => {
      setParticipants(prev => {
        const participant = prev.get(clientId)
        if (!participant) return prev

        const next = new Map(prev)
        next.set(clientId, {
          ...participant,
          status: status.status || participant.status,
          lastActivity: Date.now()
        })
        return next
      })
    }, [])
  })

  const startSession = async () => {
    const user = await window.spark.user()
    const now = Date.now()
    
    const newParticipant: Participant = {
      id: collaboration.clientId,
      name: user?.login || `User-${collaboration.clientId.slice(-4)}`,
      avatar: user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${collaboration.clientId}`,
      role: user?.isOwner ? 'repo' : 'user',
      status: 'active',
      joinedAt: now,
      lastActivity: now,
      metrics: {
        commits: 0,
        messages: 0,
        codeReviews: 0,
        activeTime: 0
      }
    }

    setLocalParticipant(newParticipant)
    setParticipants(new Map([[collaboration.clientId, newParticipant]]))
    setSessionStartTime(now)
    setIsMonitoring(true)

    collaboration.broadcast('SYNC_STATE', { participant: newParticipant })

    toast.success('Session started', { description: 'You are now live in the collaborative session' })
  }

  const endSession = () => {
    setIsMonitoring(false)
    toast.info('Session ended', { description: 'You have left the collaborative session' })
  }

  const resetSession = () => {
    setParticipants(new Map())
    setLocalParticipant(null)
    setSessionStartTime(Date.now())
    setIsMonitoring(false)
    setRecentActivity([])
  }

  const simulateActivity = useCallback((activityType: 'commit' | 'message' | 'review') => {
    if (!localParticipant) return

    const newMetrics = { ...localParticipant.metrics }
    let activityText = ''

    if (activityType === 'commit') {
      newMetrics.commits += 1
      activityText = 'pushed a commit'
    } else if (activityType === 'message') {
      newMetrics.messages += 1
      activityText = 'sent a message'
    } else if (activityType === 'review') {
      newMetrics.codeReviews += 1
      activityText = 'completed a review'
    }

    const updatedParticipant = {
      ...localParticipant,
      metrics: newMetrics,
      lastActivity: Date.now()
    }

    setLocalParticipant(updatedParticipant)
    setParticipants(prev => {
      const next = new Map(prev)
      next.set(collaboration.clientId, updatedParticipant)
      return next
    })

    collaboration.broadcast('ACTIVITY', {
      metrics: newMetrics,
      text: `${localParticipant.name} ${activityText}`,
      role: localParticipant.role
    })
  }, [localParticipant, collaboration])

  useEffect(() => {
    if (!isMonitoring || !localParticipant) return

    const syncInterval = setInterval(() => {
      collaboration.broadcast('SYNC_STATE', { participant: localParticipant })
    }, 5000)

    return () => clearInterval(syncInterval)
  }, [isMonitoring, localParticipant, collaboration])

  useEffect(() => {
    if (!isMonitoring || !localParticipant) return

    const statusInterval = setInterval(() => {
      const randomStatus = Math.random()
      const newStatus = randomStatus > 0.7 ? 'active' : randomStatus > 0.4 ? 'idle' : localParticipant.status

      if (newStatus !== localParticipant.status) {
        collaboration.broadcast('UPDATE_STATUS', { status: newStatus })
      }
    }, 8000)

    return () => clearInterval(statusInterval)
  }, [isMonitoring, localParticipant, collaboration])

  useEffect(() => {
    if (!isMonitoring) return

    const metricsInterval = setInterval(() => {
      const now = Date.now()
      const duration = Math.floor((now - (sessionStartTime || Date.now())) / 1000)
      const participantsArray = Array.from(participants.values())
      const activeCount = participantsArray.filter(p => p.status === 'active').length
      const totalCommits = participantsArray.reduce((sum, p) => sum + p.metrics.commits, 0)
      const totalMessages = participantsArray.reduce((sum, p) => sum + p.metrics.messages, 0)
      
      const activityScore = (activeCount / Math.max(participantsArray.length, 1)) * 100
      const activityLevel = activityScore > 70 ? 'high' : activityScore > 40 ? 'medium' : 'low'
      
      const coherence = Math.min(
        100,
        (totalCommits * 5 + totalMessages * 2 + activeCount * 10) / Math.max(duration / 60, 1)
      )

      setSessionMetrics({
        totalParticipants: participantsArray.length,
        activeParticipants: activeCount,
        sessionDuration: duration,
        totalCommits,
        totalMessages,
        coherenceScore: Math.round(coherence),
        activityLevel
      })
    }, 1000)

    return () => clearInterval(metricsInterval)
  }, [isMonitoring, participants, sessionStartTime])

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const formatTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000)
    if (seconds < 60) return `${seconds}s ago`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    return `${Math.floor(seconds / 3600)}h ago`
  }

  const activityLevelColors = {
    low: 'oklch(0.60 0.25 25)',
    medium: 'oklch(0.75 0.20 60)',
    high: 'oklch(0.80 0.20 140)'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-primary/10">
            <Users size={32} className="text-primary" weight="duotone" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">Live Session Monitor</h3>
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground">Real-time collaborative metrics</p>
              {isMonitoring && (
                <Badge variant="outline" className="gap-1.5 font-mono text-xs">
                  {collaboration.isConnected ? (
                    <>
                      <WifiHigh size={14} className="text-accent" weight="fill" />
                      <span className="text-accent">Live</span>
                    </>
                  ) : (
                    <>
                      <WifiSlash size={14} className="text-muted-foreground" />
                      <span>Offline</span>
                    </>
                  )}
                </Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {!isMonitoring ? (
            <Button onClick={startSession} className="gap-2">
              <SignIn size={18} />
              Start Session
            </Button>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <Button onClick={() => simulateActivity('commit')} variant="outline" size="sm" className="gap-1.5">
                  <GitCommit size={16} />
                  Commit
                </Button>
                <Button onClick={() => simulateActivity('message')} variant="outline" size="sm" className="gap-1.5">
                  <ChatCircle size={16} />
                  Message
                </Button>
                <Button onClick={() => simulateActivity('review')} variant="outline" size="sm" className="gap-1.5">
                  <Code size={16} />
                  Review
                </Button>
              </div>
              <Separator orientation="vertical" className="h-8" />
              <Button onClick={resetSession} variant="outline" className="gap-2">
                <ArrowsClockwise size={18} />
                Reset
              </Button>
              <Button onClick={endSession} variant="destructive" className="gap-2">
                <SignOut size={18} />
                End Session
              </Button>
            </>
          )}
        </div>
      </div>

      {!isMonitoring && participants.size === 0 && (
        <Card className="p-12 text-center">
          <div className="flex flex-col items-center gap-4 max-w-md mx-auto">
            <div className="p-4 rounded-full bg-muted">
              <ChartLine size={48} className="text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">No Active Session</h3>
              <p className="text-sm text-muted-foreground">
                Start a monitoring session to track real-time participant metrics, 
                activity streams, and collaboration patterns.
              </p>
            </div>
            <Button onClick={startSession} className="gap-2 mt-2">
              <SignIn size={18} />
              Start Monitoring Session
            </Button>
          </div>
        </Card>
      )}

      {participants.size > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0 }}
            >
              <Card className="p-4 relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Session Duration</span>
                    <Clock size={20} className="text-primary" />
                  </div>
                  <div className="text-2xl font-bold font-mono tracking-tight">
                    {formatDuration(sessionMetrics.sessionDuration)}
                  </div>
                </div>
                {isMonitoring && (
                  <motion.div
                    className="absolute top-0 right-0 w-2 h-full bg-accent"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Active Participants</span>
                  <Users size={20} className="text-secondary" />
                </div>
                <div className="text-2xl font-bold font-mono">
                  {sessionMetrics.activeParticipants} / {sessionMetrics.totalParticipants}
                </div>
                <Progress 
                  value={(sessionMetrics.activeParticipants / Math.max(sessionMetrics.totalParticipants, 1)) * 100} 
                  className="mt-2 h-1"
                />
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Activity Level</span>
                  <ChartLine size={20} className="text-accent" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold capitalize">
                    {sessionMetrics.activityLevel}
                  </div>
                  <Badge 
                    className="ml-auto"
                    style={{ 
                      backgroundColor: activityLevelColors[sessionMetrics.activityLevel],
                      color: 'oklch(0.98 0 0)'
                    }}
                  >
                    {sessionMetrics.coherenceScore}%
                  </Badge>
                </div>
                <Progress 
                  value={sessionMetrics.coherenceScore} 
                  className="mt-2 h-1"
                />
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Total Activity</span>
                  <Lightning size={20} className="text-primary" weight="fill" />
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <GitCommit size={16} className="text-muted-foreground" />
                    <span className="text-lg font-bold font-mono">{sessionMetrics.totalCommits}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ChatCircle size={16} className="text-muted-foreground" />
                    <span className="text-lg font-bold font-mono">{sessionMetrics.totalMessages}</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          {isMonitoring && (
            <Card className="p-4 bg-card/50 border-accent/20">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <WifiHigh size={24} className="text-accent" weight="fill" />
                    {collaboration.isConnected && (
                      <motion.div
                        className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full"
                        animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-sm">WebSocket Connection Active</h4>
                      <Badge variant="secondary" className="text-xs font-mono">
                        BroadcastChannel
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      All changes sync in real-time across browser tabs • Session ID: {sessionId.slice(-8)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                    <span className="text-xs text-muted-foreground">
                      {collaboration.connectedClients.length + 1} connected
                    </span>
                  </div>
                  <Badge variant="outline" className="font-mono text-xs">
                    Client: {collaboration.clientId.slice(-8)}
                  </Badge>
                </div>
              </div>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <Card className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Participants</h3>
                  <Badge variant="secondary">{participants.size} online</Badge>
                </div>
                <div className="space-y-2 max-h-[500px] overflow-y-auto">
                  <AnimatePresence mode="popLayout">
                    {Array.from(participants.values()).map((participant) => {
                      const RoleIcon = roleIcons[participant.role]
                      return (
                        <motion.div
                          key={participant.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          layout
                        >
                          <Card className="p-3 relative overflow-hidden">
                            <div 
                              className="absolute inset-0 opacity-5"
                              style={{ backgroundColor: roleColors[participant.role] }}
                            />
                            <div className="relative z-10 flex items-center gap-3">
                              <div className="relative">
                                <Avatar className="h-10 w-10">
                                  <img src={participant.avatar} alt={participant.name} />
                                </Avatar>
                                <div 
                                  className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card ${
                                    participant.status === 'active' 
                                      ? 'bg-accent' 
                                      : participant.status === 'idle'
                                      ? 'bg-secondary'
                                      : 'bg-muted-foreground'
                                  }`}
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium truncate">{participant.name}</span>
                                  <RoleIcon 
                                    size={14} 
                                    style={{ color: roleColors[participant.role] }}
                                  />
                                  <Badge 
                                    variant="outline" 
                                    className="ml-auto text-xs capitalize"
                                  >
                                    {participant.status}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <GitCommit size={12} />
                                    {participant.metrics.commits}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <ChatCircle size={12} />
                                    {participant.metrics.messages}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Eye size={12} />
                                    {participant.metrics.codeReviews}
                                  </span>
                                  <span className="flex items-center gap-1 ml-auto">
                                    <Clock size={12} />
                                    {Math.floor(participant.metrics.activeTime / 60)}m
                                  </span>
                                </div>
                              </div>
                            </div>
                          </Card>
                        </motion.div>
                      )
                    })}
                  </AnimatePresence>
                </div>
              </Card>
            </div>

            <div className="space-y-4">
              <Card className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Activity Stream</h3>
                  <Lightning size={18} className="text-accent" weight="fill" />
                </div>
                <div className="space-y-2 max-h-[500px] overflow-y-auto">
                  <AnimatePresence mode="popLayout">
                    {recentActivity.length === 0 ? (
                      <div className="text-center py-8 text-sm text-muted-foreground">
                        No recent activity
                      </div>
                    ) : (
                      recentActivity.map((activity) => (
                        <motion.div
                          key={activity.id}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-sm border-l-2 pl-3 py-1.5"
                          style={{ 
                            borderColor: activity.type === 'join' 
                              ? 'oklch(0.80 0.20 140)' 
                              : activity.type === 'leave'
                              ? 'oklch(0.60 0.25 25)'
                              : roleColors[activity.type as keyof typeof roleColors] || 'oklch(0.30 0.08 260)'
                          }}
                        >
                          <div className="text-foreground">{activity.text}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {formatTimeAgo(activity.timestamp)}
                          </div>
                        </motion.div>
                      ))
                    )}
                  </AnimatePresence>
                </div>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
