type MessageType = 
  | 'JOIN'
  | 'LEAVE'
  | 'UPDATE_STATUS'
  | 'ACTIVITY'
  | 'SYNC_STATE'
  | 'HEARTBEAT'
  | 'PRESENCE'

interface CollaborationMessage {
  type: MessageType
  clientId: string
  timestamp: number
  data?: any
}

type MessageHandler = (message: CollaborationMessage) => void

export class CollaborationService {
  private channel: BroadcastChannel | null = null
  private clientId: string
  private handlers: Map<MessageType, MessageHandler[]> = new Map()
  private heartbeatInterval: number | null = null
  private presenceMap: Map<string, number> = new Map()
  private isConnected = false

  constructor(roomId: string) {
    this.clientId = `client-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    try {
      this.channel = new BroadcastChannel(`spiralsafe-collab-${roomId}`)
      this.setupChannel()
      this.isConnected = true
      console.log(`[CollabService] Connected to room: ${roomId}, clientId: ${this.clientId}`)
    } catch (error) {
      console.error('[CollabService] Failed to initialize BroadcastChannel:', error)
    }
  }

  private setupChannel() {
    if (!this.channel) return

    this.channel.onmessage = (event) => {
      const message: CollaborationMessage = event.data
      
      if (message.clientId === this.clientId) return

      if (message.type === 'HEARTBEAT' || message.type === 'PRESENCE') {
        this.presenceMap.set(message.clientId, Date.now())
      }

      const handlers = this.handlers.get(message.type)
      if (handlers) {
        handlers.forEach(handler => handler(message))
      }
    }

    this.startHeartbeat()
  }

  private startHeartbeat() {
    if (this.heartbeatInterval) return

    this.broadcast('HEARTBEAT')

    this.heartbeatInterval = window.setInterval(() => {
      this.broadcast('HEARTBEAT')
      this.cleanupStalePresences()
    }, 3000)
  }

  private cleanupStalePresences() {
    const now = Date.now()
    const staleThreshold = 10000

    for (const [clientId, lastSeen] of this.presenceMap.entries()) {
      if (now - lastSeen > staleThreshold) {
        this.presenceMap.delete(clientId)
        
        const handlers = this.handlers.get('LEAVE')
        if (handlers) {
          handlers.forEach(handler => handler({
            type: 'LEAVE',
            clientId,
            timestamp: now
          }))
        }
      }
    }
  }

  on(type: MessageType, handler: MessageHandler) {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, [])
    }
    this.handlers.get(type)!.push(handler)
  }

  off(type: MessageType, handler: MessageHandler) {
    const handlers = this.handlers.get(type)
    if (handlers) {
      const index = handlers.indexOf(handler)
      if (index > -1) {
        handlers.splice(index, 1)
      }
    }
  }

  broadcast(type: MessageType, data?: any) {
    if (!this.channel || !this.isConnected) return

    const message: CollaborationMessage = {
      type,
      clientId: this.clientId,
      timestamp: Date.now(),
      data
    }

    try {
      this.channel.postMessage(message)
    } catch (error) {
      console.error('[CollabService] Failed to broadcast message:', error)
    }
  }

  getClientId() {
    return this.clientId
  }

  getConnectedClients() {
    return Array.from(this.presenceMap.keys())
  }

  getConnectionStatus() {
    return this.isConnected
  }

  disconnect() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
      this.heartbeatInterval = null
    }

    if (this.channel) {
      this.broadcast('LEAVE')
      this.channel.close()
      this.channel = null
      this.isConnected = false
      console.log(`[CollabService] Disconnected clientId: ${this.clientId}`)
    }
  }
}
