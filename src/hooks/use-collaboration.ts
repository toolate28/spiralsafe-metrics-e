import { useState, useEffect, useCallback, useRef } from 'react'
import { CollaborationService } from '@/lib/collaboration-service'

export interface UseCollaborationOptions {
  roomId: string
  onJoin?: (clientId: string) => void
  onLeave?: (clientId: string) => void
  onActivity?: (clientId: string, activity: any) => void
  onStatusUpdate?: (clientId: string, status: any) => void
  onSyncState?: (clientId: string, state: any) => void
}

export function useCollaboration(options: UseCollaborationOptions) {
  const [isConnected, setIsConnected] = useState(false)
  const [connectedClients, setConnectedClients] = useState<string[]>([])
  const serviceRef = useRef<CollaborationService | null>(null)
  const handlersRef = useRef<{
    onJoin?: (clientId: string) => void
    onLeave?: (clientId: string) => void
    onActivity?: (clientId: string, activity: any) => void
    onStatusUpdate?: (clientId: string, status: any) => void
    onSyncState?: (clientId: string, state: any) => void
  }>({})

  handlersRef.current = {
    onJoin: options.onJoin,
    onLeave: options.onLeave,
    onActivity: options.onActivity,
    onStatusUpdate: options.onStatusUpdate,
    onSyncState: options.onSyncState,
  }

  useEffect(() => {
    const service = new CollaborationService(options.roomId)
    serviceRef.current = service
    setIsConnected(service.getConnectionStatus())

    service.on('JOIN', (message) => {
      handlersRef.current.onJoin?.(message.clientId)
      setConnectedClients(service.getConnectedClients())
    })

    service.on('LEAVE', (message) => {
      handlersRef.current.onLeave?.(message.clientId)
      setConnectedClients(service.getConnectedClients())
    })

    service.on('ACTIVITY', (message) => {
      handlersRef.current.onActivity?.(message.clientId, message.data)
    })

    service.on('UPDATE_STATUS', (message) => {
      handlersRef.current.onStatusUpdate?.(message.clientId, message.data)
    })

    service.on('SYNC_STATE', (message) => {
      handlersRef.current.onSyncState?.(message.clientId, message.data)
    })

    service.on('HEARTBEAT', () => {
      setConnectedClients(service.getConnectedClients())
    })

    service.broadcast('JOIN')

    const syncInterval = setInterval(() => {
      setConnectedClients(service.getConnectedClients())
    }, 1000)

    return () => {
      clearInterval(syncInterval)
      service.disconnect()
      serviceRef.current = null
    }
  }, [options.roomId])

  const broadcast = useCallback((type: 'ACTIVITY' | 'UPDATE_STATUS' | 'SYNC_STATE', data: any) => {
    serviceRef.current?.broadcast(type, data)
  }, [])

  const getClientId = useCallback(() => {
    return serviceRef.current?.getClientId() || ''
  }, [])

  return {
    isConnected,
    connectedClients,
    clientId: getClientId(),
    broadcast,
  }
}
