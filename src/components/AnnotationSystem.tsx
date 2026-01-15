import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Avatar } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { 
  ChatCircle, 
  PushPin,
  Trash,
  Check,
  X,
  Flag,
  Star,
  Warning,
  Info,
  CheckCircle,
  Tag,
  Clock,
  Eye,
  MapPin
} from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'
import { useCollaboration } from '@/hooks/use-collaboration'
import { toast } from 'sonner'

interface Annotation {
  id: string
  authorId: string
  authorName: string
  authorAvatar: string
  timestamp: number
  targetType: 'session' | 'metric' | 'test' | 'analysis' | 'general'
  targetId: string
  targetLabel: string
  category: 'comment' | 'flag' | 'star' | 'warning' | 'info'
  content: string
  tags: string[]
  resolved: boolean
  resolvedBy?: string
  resolvedAt?: number
}

const categoryConfig = {
  comment: {
    label: 'Comment',
    icon: ChatCircle,
    color: 'oklch(0.75 0.15 195)'
  },
  flag: {
    label: 'Flag',
    icon: Flag,
    color: 'oklch(0.60 0.25 25)'
  },
  star: {
    label: 'Star',
    icon: Star,
    color: 'oklch(0.75 0.20 60)'
  },
  warning: {
    label: 'Warning',
    icon: Warning,
    color: 'oklch(0.75 0.20 60)'
  },
  info: {
    label: 'Info',
    icon: Info,
    color: 'oklch(0.80 0.20 140)'
  }
}

const targetTypes = [
  { value: 'session', label: 'Session Event' },
  { value: 'metric', label: 'Metric Data' },
  { value: 'test', label: 'Test Result' },
  { value: 'analysis', label: 'Analysis Result' },
  { value: 'general', label: 'General Note' }
]

export function AnnotationSystem() {
  const [annotations, setAnnotations] = useKV<Annotation[]>('annotations', [])
  const [isCreating, setIsCreating] = useState(false)
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [filterResolved, setFilterResolved] = useState<boolean | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'category'>('newest')
  
  const [newAnnotation, setNewAnnotation] = useState({
    targetType: 'general' as Annotation['targetType'],
    targetId: '',
    targetLabel: '',
    category: 'comment' as Annotation['category'],
    content: '',
    tags: [] as string[]
  })
  const [currentTag, setCurrentTag] = useState('')

  const collaboration = useCollaboration({
    roomId: 'annotations-room',
    onSyncState: (clientId, state) => {
      if (state?.newAnnotation) {
        setAnnotations(current => {
          const currentAnnotations = current || []
          const exists = currentAnnotations.some(a => a.id === state.newAnnotation.id)
          if (!exists) {
            toast.info('New annotation added', { 
              description: `${state.newAnnotation.authorName} added an annotation` 
            })
            return [...currentAnnotations, state.newAnnotation]
          }
          return currentAnnotations
        })
      }
    },
    onActivity: (clientId, activity) => {
      if (activity?.type === 'resolve' && activity.annotationId) {
        setAnnotations(current =>
          (current || []).map(a =>
            a.id === activity.annotationId
              ? { ...a, resolved: true, resolvedBy: activity.resolvedBy, resolvedAt: Date.now() }
              : a
          )
        )
        toast.success('Annotation resolved', { description: 'An annotation was marked as resolved' })
      } else if (activity?.type === 'delete' && activity.annotationId) {
        setAnnotations(current => (current || []).filter(a => a.id !== activity.annotationId))
        toast.info('Annotation removed', { description: 'An annotation was deleted' })
      }
    }
  })

  const handleCreate = async () => {
    if (!newAnnotation.content.trim()) {
      toast.error('Content required', { description: 'Please enter annotation content' })
      return
    }

    const user = await window.spark.user()
    
    const annotation: Annotation = {
      id: `annotation-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      authorId: collaboration.clientId,
      authorName: user?.login || `User-${collaboration.clientId.slice(-4)}`,
      authorAvatar: user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${collaboration.clientId}`,
      timestamp: Date.now(),
      targetType: newAnnotation.targetType,
      targetId: newAnnotation.targetId || `target-${Date.now()}`,
      targetLabel: newAnnotation.targetLabel || 'Unlabeled',
      category: newAnnotation.category,
      content: newAnnotation.content,
      tags: newAnnotation.tags,
      resolved: false
    }

    setAnnotations(current => [...(current || []), annotation])
    collaboration.broadcast('SYNC_STATE', { newAnnotation: annotation })

    setNewAnnotation({
      targetType: 'general',
      targetId: '',
      targetLabel: '',
      category: 'comment',
      content: '',
      tags: []
    })
    setCurrentTag('')
    setIsCreating(false)

    toast.success('Annotation created', { description: 'Your annotation has been added' })
  }

  const handleResolve = (annotationId: string) => {
    setAnnotations(current =>
      (current || []).map(a =>
        a.id === annotationId
          ? { ...a, resolved: true, resolvedBy: collaboration.clientId, resolvedAt: Date.now() }
          : a
      )
    )
    collaboration.broadcast('ACTIVITY', { type: 'resolve', annotationId, resolvedBy: collaboration.clientId })
    toast.success('Annotation resolved')
  }

  const handleDelete = (annotationId: string) => {
    setAnnotations(current => (current || []).filter(a => a.id !== annotationId))
    collaboration.broadcast('ACTIVITY', { type: 'delete', annotationId })
    toast.info('Annotation deleted')
  }

  const addTag = () => {
    if (currentTag.trim() && !newAnnotation.tags.includes(currentTag.trim())) {
      setNewAnnotation(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }))
      setCurrentTag('')
    }
  }

  const removeTag = (tag: string) => {
    setNewAnnotation(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }))
  }

  const formatTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000)
    if (seconds < 60) return 'just now'
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    return `${Math.floor(seconds / 86400)}d ago`
  }

  const filteredAnnotations = (annotations || [])
    .filter(a => {
      if (filterCategory !== 'all' && a.category !== filterCategory) return false
      if (filterResolved !== null && a.resolved !== filterResolved) return false
      if (searchQuery && !a.content.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !a.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))) return false
      return true
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return b.timestamp - a.timestamp
      if (sortBy === 'oldest') return a.timestamp - b.timestamp
      return a.category.localeCompare(b.category)
    })

  const annotationsList = annotations || []
  const stats = {
    total: annotationsList.length,
    unresolved: annotationsList.filter(a => !a.resolved).length,
    resolved: annotationsList.filter(a => a.resolved).length,
    byCategory: Object.keys(categoryConfig).map(cat => ({
      category: cat,
      count: annotationsList.filter(a => a.category === cat).length
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-secondary/10">
            <PushPin size={32} className="text-secondary" weight="duotone" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-1">Collaborative Annotations</h3>
            <p className="text-sm text-muted-foreground">
              Mark important moments, add context, and collaborate with notes on metrics and events. 
              All annotations sync in real-time across sessions.
            </p>
          </div>
        </div>
        <Button 
          onClick={() => setIsCreating(!isCreating)}
          className="gap-2"
        >
          {isCreating ? (
            <>
              <X size={18} />
              Cancel
            </>
          ) : (
            <>
              <PushPin size={18} weight="fill" />
              New Annotation
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Total</span>
            <PushPin size={18} className="text-primary" />
          </div>
          <div className="text-2xl font-bold font-mono">{stats.total}</div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Unresolved</span>
            <Eye size={18} className="text-accent" />
          </div>
          <div className="text-2xl font-bold font-mono">{stats.unresolved}</div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Resolved</span>
            <CheckCircle size={18} className="text-secondary" weight="fill" />
          </div>
          <div className="text-2xl font-bold font-mono">{stats.resolved}</div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Categories</span>
            <Tag size={18} className="text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold font-mono">{Object.keys(categoryConfig).length}</div>
        </Card>
      </div>

      <AnimatePresence>
        {isCreating && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="p-6">
              <h4 className="font-semibold mb-4">Create New Annotation</h4>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Target Type</label>
                    <select
                      value={newAnnotation.targetType}
                      onChange={(e) => setNewAnnotation(prev => ({ 
                        ...prev, 
                        targetType: e.target.value as Annotation['targetType'] 
                      }))}
                      className="w-full px-3 py-2 rounded-md bg-muted border border-input text-sm"
                    >
                      {targetTypes.map(t => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <select
                      value={newAnnotation.category}
                      onChange={(e) => setNewAnnotation(prev => ({ 
                        ...prev, 
                        category: e.target.value as Annotation['category'] 
                      }))}
                      className="w-full px-3 py-2 rounded-md bg-muted border border-input text-sm"
                    >
                      {Object.entries(categoryConfig).map(([key, config]) => (
                        <option key={key} value={key}>{config.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Target Label (Optional)</label>
                  <Input
                    value={newAnnotation.targetLabel}
                    onChange={(e) => setNewAnnotation(prev => ({ 
                      ...prev, 
                      targetLabel: e.target.value 
                    }))}
                    placeholder="e.g., Session #123, Metric: Response Time"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Content</label>
                  <Textarea
                    value={newAnnotation.content}
                    onChange={(e) => setNewAnnotation(prev => ({ 
                      ...prev, 
                      content: e.target.value 
                    }))}
                    placeholder="Add your annotation content..."
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Tags</label>
                  <div className="flex gap-2">
                    <Input
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          addTag()
                        }
                      }}
                      placeholder="Add tag..."
                    />
                    <Button onClick={addTag} variant="outline" size="sm">
                      <Check size={16} />
                    </Button>
                  </div>
                  {newAnnotation.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {newAnnotation.tags.map((tag) => (
                        <Badge 
                          key={tag} 
                          variant="secondary" 
                          className="gap-1 cursor-pointer"
                          onClick={() => removeTag(tag)}
                        >
                          <Tag size={12} />
                          {tag}
                          <X size={12} />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setIsCreating(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreate} className="gap-2">
                    <Check size={18} />
                    Create Annotation
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Card className="p-4">
        <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
          <div className="flex items-center gap-2">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search annotations..."
              className="w-64"
            />
          </div>
          
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-1.5 rounded-md bg-muted border border-input text-sm"
            >
              <option value="all">All Categories</option>
              {Object.entries(categoryConfig).map(([key, config]) => (
                <option key={key} value={key}>{config.label}</option>
              ))}
            </select>

            <select
              value={filterResolved === null ? 'all' : filterResolved ? 'resolved' : 'unresolved'}
              onChange={(e) => setFilterResolved(
                e.target.value === 'all' ? null : e.target.value === 'resolved'
              )}
              className="px-3 py-1.5 rounded-md bg-muted border border-input text-sm"
            >
              <option value="all">All Status</option>
              <option value="unresolved">Unresolved</option>
              <option value="resolved">Resolved</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="px-3 py-1.5 rounded-md bg-muted border border-input text-sm"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="category">By Category</option>
            </select>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="space-y-3 max-h-[600px] overflow-y-auto">
          {filteredAnnotations.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <PushPin size={48} className="mx-auto mb-3 opacity-20" />
              <p>No annotations found</p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredAnnotations.map((annotation) => {
                const config = categoryConfig[annotation.category]
                const Icon = config.icon
                
                return (
                  <motion.div
                    key={annotation.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    layout
                  >
                    <Card 
                      className={`p-4 relative overflow-hidden transition-opacity ${
                        annotation.resolved ? 'opacity-60' : ''
                      }`}
                    >
                      <div 
                        className="absolute inset-0 opacity-5"
                        style={{ backgroundColor: config.color }}
                      />
                      
                      <div className="relative z-10">
                        <div className="flex items-start gap-3">
                          <Avatar className="h-10 w-10">
                            <img src={annotation.authorAvatar} alt={annotation.authorName} />
                          </Avatar>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-medium">{annotation.authorName}</span>
                                <Badge 
                                  variant="outline" 
                                  className="gap-1 text-xs"
                                  style={{ borderColor: config.color }}
                                >
                                  <Icon size={12} style={{ color: config.color }} />
                                  {config.label}
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                  {targetTypes.find(t => t.value === annotation.targetType)?.label}
                                </Badge>
                                {annotation.resolved && (
                                  <Badge className="text-xs gap-1 bg-secondary">
                                    <CheckCircle size={12} weight="fill" />
                                    Resolved
                                  </Badge>
                                )}
                              </div>
                              
                              <div className="flex items-center gap-1">
                                {!annotation.resolved && (
                                  <Button
                                    onClick={() => handleResolve(annotation.id)}
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                  >
                                    <Check size={16} />
                                  </Button>
                                )}
                                <Button
                                  onClick={() => handleDelete(annotation.id)}
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                >
                                  <Trash size={16} />
                                </Button>
                              </div>
                            </div>

                            {annotation.targetLabel && (
                              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
                                <MapPin size={14} />
                                <span>{annotation.targetLabel}</span>
                              </div>
                            )}

                            <p className="text-sm mb-3">{annotation.content}</p>

                            {annotation.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mb-3">
                                {annotation.tags.map((tag) => (
                                  <Badge key={tag} variant="outline" className="text-xs gap-1">
                                    <Tag size={10} />
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}

                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock size={12} />
                                {formatTimeAgo(annotation.timestamp)}
                              </span>
                              {annotation.resolved && annotation.resolvedAt && (
                                <span className="flex items-center gap-1">
                                  <CheckCircle size={12} />
                                  Resolved {formatTimeAgo(annotation.resolvedAt)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          )}
        </div>
      </Card>
    </div>
  )
}
