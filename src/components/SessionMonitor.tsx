import { useState, useEffect } from 'react'
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
  ArrowsClockwise
} from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'

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
  const [participants, setParticipants] = useKV<Participant[]>('session-participants', [])
  const [sessionStartTime, setSessionStartTime] = useKV<number>('session-start-time', Date.now())
  const [isMonitoring, setIsMonitoring] = useState(false)
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

  const startSession = () => {
    const initialParticipants = Array.from({ length: 5 }, (_, i) => 
      generateMockParticipant(`participant-${Date.now()}-${i}`, i)
    )
    setParticipants(initialParticipants)
    setSessionStartTime(Date.now())
    setIsMonitoring(true)
  }

  const endSession = () => {
    setIsMonitoring(false)
  }

  const resetSession = () => {
    setParticipants([])
    setSessionStartTime(Date.now())
    setIsMonitoring(false)
    setRecentActivity([])
  }

  useEffect(() => {
    if (!isMonitoring || !participants || participants.length === 0) return

    const interval = setInterval(() => {
      setParticipants((current) => {
        if (!current) return []
        const updated = current.map(p => {
          const shouldUpdate = Math.random() > 0.7
          if (!shouldUpdate) return p

          const activityType = Math.random()
          let newMetrics = { ...p.metrics }
          let activityText = ''

          if (activityType < 0.33) {
            newMetrics.commits += 1
            activityText = 'pushed a commit'
          } else if (activityType < 0.66) {
            newMetrics.messages += Math.floor(Math.random() * 3) + 1
            activityText = 'sent a message'
          } else {
            newMetrics.codeReviews += 1
            activityText = 'completed a review'
          }

          const newStatus = Math.random() > 0.8 
            ? (['active', 'idle'] as const)[Math.floor(Math.random() * 2)]
            : p.status

          if (activityText) {
            setRecentActivity(prev => [{
              id: Math.random().toString(),
              type: p.role,
              text: `${p.name} ${activityText}`,
              timestamp: Date.now()
            }, ...prev.slice(0, 9)])
          }

          return {
            ...p,
            status: newStatus,
            lastActivity: Date.now(),
            metrics: {
              ...newMetrics,
              activeTime: newMetrics.activeTime + 2
            }
          }
        })

        if (Math.random() > 0.95 && updated.length < 10) {
          const newParticipant = generateMockParticipant(
            `participant-${Date.now()}`,
            updated.length
          )
          setRecentActivity(prev => [{
            id: Math.random().toString(),
            type: 'join',
            text: `${newParticipant.name} joined the session`,
            timestamp: Date.now()
          }, ...prev.slice(0, 9)])
          return [...updated, newParticipant]
        }

        if (Math.random() > 0.97 && updated.length > 3) {
          const removeIndex = Math.floor(Math.random() * updated.length)
          const removed = updated[removeIndex]
          setRecentActivity(prev => [{
            id: Math.random().toString(),
            type: 'leave',
            text: `${removed.name} left the session`,
            timestamp: Date.now()
          }, ...prev.slice(0, 9)])
          return updated.filter((_, i) => i !== removeIndex)
        }

        return updated
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [isMonitoring, participants?.length, setParticipants])

  useEffect(() => {
    if (!isMonitoring) return

    const metricsInterval = setInterval(() => {
      const now = Date.now()
      const duration = Math.floor((now - (sessionStartTime || Date.now())) / 1000)
      const activeCount = (participants || []).filter(p => p.status === 'active').length
      const totalCommits = (participants || []).reduce((sum, p) => sum + p.metrics.commits, 0)
      const totalMessages = (participants || []).reduce((sum, p) => sum + p.metrics.messages, 0)
      
      const activityScore = (activeCount / Math.max((participants || []).length, 1)) * 100
      const activityLevel = activityScore > 70 ? 'high' : activityScore > 40 ? 'medium' : 'low'
      
      const coherence = Math.min(
        100,
        (totalCommits * 5 + totalMessages * 2 + activeCount * 10) / Math.max(duration / 60, 1)
      )

      setSessionMetrics({
        totalParticipants: (participants || []).length,
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
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-primary/10">
            <Users size={32} className="text-primary" weight="duotone" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">Live Session Monitor</h3>
            <p className="text-sm text-muted-foreground">Real-time collaborative metrics</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isMonitoring ? (
            <Button onClick={startSession} className="gap-2">
              <SignIn size={18} />
              Start Session
            </Button>
          ) : (
            <>
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

      {!isMonitoring && (!participants || participants.length === 0) && (
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

      {participants && participants.length > 0 && (
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <Card className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Participants</h3>
                  <Badge variant="secondary">{participants.length} online</Badge>
                </div>
                <div className="space-y-2 max-h-[500px] overflow-y-auto">
                  <AnimatePresence mode="popLayout">
                    {participants.map((participant) => {
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
