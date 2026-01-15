import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PaperPlaneTilt, User } from '@phosphor-icons/react'

interface Message {
  id: string
  author: string
  role: string
  content: string
  priority: 'normal' | 'high' | 'critical'
  timestamp: string
}

export function StakeholderHub() {
  const [messages, setMessages] = useKV<Message[]>('stakeholder-messages', [
    {
      id: '1',
      author: 'Dr. Sarah Chen',
      role: 'Clinical Lead',
      content: 'Reviewed the migration timeline. Can we expedite the pilot phase by one week?',
      priority: 'normal',
      timestamp: '2 hours ago'
    },
    {
      id: '2',
      author: 'Mike Rodriguez',
      role: 'IT Director',
      content: 'Infrastructure assessment complete. All systems green for transition.',
      priority: 'high',
      timestamp: '4 hours ago'
    }
  ])

  const [newMessage, setNewMessage] = useState('')
  const [priority, setPriority] = useState<'normal' | 'high' | 'critical'>('normal')

  const postMessage = () => {
    if (!newMessage.trim()) return

    const message: Message = {
      id: Date.now().toString(),
      author: 'You',
      role: 'Transition Manager',
      content: newMessage,
      priority,
      timestamp: 'Just now'
    }

    setMessages((current) => [message, ...(current || [])])
    setNewMessage('')
    setPriority('normal')
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/10">
              <User size={32} className="text-primary" weight="duotone" />
            </div>
            <div>
              <CardTitle className="text-2xl">Stakeholder Communication Hub</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Coordinate with clinical and technical teams
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Textarea 
                placeholder="Post update, milestone, or alert..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                rows={3}
              />
              <div className="flex items-center gap-2">
                <Select value={priority} onValueChange={(v: any) => setPriority(v)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal Priority</SelectItem>
                    <SelectItem value="high">High Priority</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={postMessage} className="ml-auto">
                  <PaperPlaneTilt size={18} className="mr-2" />
                  Post Message
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Communications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {messages?.map((message) => (
              <Card key={message.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <div className="font-semibold">{message.author}</div>
                      <div className="text-xs text-muted-foreground">{message.role}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={
                          message.priority === 'critical' ? 'destructive' :
                          message.priority === 'high' ? 'default' :
                          'outline'
                        }
                        className="text-xs"
                      >
                        {message.priority}
                      </Badge>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {message.timestamp}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm">{message.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
