# WebSocket Collaboration System

## Overview

SpiralSafe includes a true multi-user real-time collaboration system for the Session Monitor feature. This system enables multiple users to collaborate synchronously across different browser tabs or windows, with instant state synchronization.

## Architecture

### Technology Stack

The collaboration system uses the **BroadcastChannel API**, a browser-native technology for cross-context communication:

- **No server required**: Communication happens entirely client-side
- **Zero latency**: Instant message delivery between tabs/windows
- **Same-origin only**: Secure by design, only works within the same domain
- **Persistent connection**: No polling, no WebSocket server needed

### Why BroadcastChannel?

For production applications, you would typically use WebSocket with a server backend. However, BroadcastChannel provides:

1. **Perfect for prototyping**: Test multi-user features without infrastructure
2. **Development speed**: No server setup or deployment required
3. **Easy migration path**: The abstraction layer makes it simple to swap in real WebSockets later
4. **True real-time sync**: Works identically to WebSocket for local testing

## System Components

### 1. CollaborationService (`src/lib/collaboration-service.ts`)

Core service that manages the communication layer.

**Key Features:**
- Unique client ID generation
- Message broadcasting with type safety
- Heartbeat mechanism for presence detection
- Automatic stale client cleanup
- Event-based message handling

**Message Types:**
```typescript
- JOIN: Client joined the session
- LEAVE: Client left the session
- UPDATE_STATUS: Status change (active/idle/away)
- ACTIVITY: User performed an action (commit/message/review)
- SYNC_STATE: Full participant state synchronization
- HEARTBEAT: Keep-alive signal (every 3s)
- PRESENCE: Presence confirmation
```

### 2. useCollaboration Hook (`src/hooks/use-collaboration.ts`)

React hook that wraps the CollaborationService with idiomatic React patterns.

**Features:**
- Automatic connection management
- React-friendly state updates
- Lifecycle cleanup
- Memoized broadcast function
- Real-time connected client tracking

**Usage:**
```typescript
const collaboration = useCollaboration({
  roomId: 'session-id',
  onJoin: (clientId) => { /* handle join */ },
  onLeave: (clientId) => { /* handle leave */ },
  onActivity: (clientId, data) => { /* handle activity */ },
  onStatusUpdate: (clientId, status) => { /* handle status */ },
  onSyncState: (clientId, state) => { /* handle state sync */ }
})
```

### 3. SessionMonitor Component (`src/components/SessionMonitor.tsx`)

The UI component that demonstrates the collaboration system.

**Real-time Features:**
- Live participant tracking across tabs
- Instant activity broadcasting
- Status synchronization
- Connection indicator
- Simulated actions (commit, message, review)

## How It Works

### Connection Flow

1. **User starts session**
   - Component generates unique session ID
   - Creates local participant with user info from Spark API
   - Initializes CollaborationService with session ID
   - Broadcasts JOIN message

2. **State synchronization**
   - Every 5s: Broadcast full participant state
   - On activity: Broadcast activity with updated metrics
   - On status change: Broadcast new status

3. **Remote participant handling**
   - SYNC_STATE received → Add/update participant in local Map
   - ACTIVITY received → Update participant metrics + add to activity stream
   - LEAVE received → Remove participant from Map
   - HEARTBEAT received → Update client presence timestamp

4. **Cleanup**
   - Stale clients (no heartbeat > 10s) automatically removed
   - On disconnect: LEAVE message broadcast
   - Channel closed and intervals cleared

## Testing Multi-User Collaboration

### How to Test Locally

1. **Open multiple tabs/windows**
   ```
   Open your app in 2+ browser tabs
   ```

2. **Start sessions in each tab**
   ```
   Click "Start Session" in each tab
   Each gets a unique client ID
   ```

3. **Observe synchronization**
   - Participants appear in all tabs instantly
   - Click activity buttons (Commit/Message/Review)
   - See activities broadcast to all tabs
   - Activity stream updates everywhere
   - Metrics synchronize in real-time

4. **Test leave/rejoin**
   - Close a tab → Others see participant leave
   - Refresh a tab → Rejoin as new client
   - End session in one tab → Only that tab disconnects

### Expected Behavior

✅ **Instant Updates**: Changes appear in < 100ms across tabs  
✅ **Toast Notifications**: Join/leave events show toast messages  
✅ **Activity Stream**: All activities visible to all participants  
✅ **Connection Badge**: Live/Offline indicator shows connection status  
✅ **Participant Count**: Updates dynamically as tabs open/close  

## Migrating to Real WebSocket

The architecture is designed for easy migration to a real WebSocket server:

### Step 1: Replace CollaborationService

```typescript
// Instead of BroadcastChannel
export class CollaborationService {
  private ws: WebSocket
  
  constructor(roomId: string) {
    this.ws = new WebSocket(`wss://your-server.com/rooms/${roomId}`)
    this.setupWebSocket()
  }
  
  private setupWebSocket() {
    this.ws.onmessage = (event) => {
      const message = JSON.parse(event.data)
      // Same message handling logic
    }
  }
  
  broadcast(type: MessageType, data?: any) {
    this.ws.send(JSON.stringify({
      type,
      clientId: this.clientId,
      timestamp: Date.now(),
      data
    }))
  }
}
```

### Step 2: Add Server Backend

Example with Node.js + ws library:

```typescript
import { WebSocketServer } from 'ws'

const wss = new WebSocketServer({ port: 8080 })
const rooms = new Map()

wss.on('connection', (ws, req) => {
  const roomId = extractRoomId(req.url)
  
  if (!rooms.has(roomId)) {
    rooms.set(roomId, new Set())
  }
  
  rooms.get(roomId).add(ws)
  
  ws.on('message', (data) => {
    const message = JSON.parse(data.toString())
    
    // Broadcast to all clients in room except sender
    rooms.get(roomId).forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data)
      }
    })
  })
  
  ws.on('close', () => {
    rooms.get(roomId).delete(ws)
  })
})
```

### Step 3: No Component Changes Needed

The `useCollaboration` hook interface remains identical, so SessionMonitor and other components work without modification.

## Performance Characteristics

### BroadcastChannel (Current)
- **Latency**: < 10ms within same browser
- **Throughput**: Effectively unlimited for realistic use
- **Scalability**: Limited to same browser instance
- **Network**: Zero network usage

### WebSocket (Future)
- **Latency**: 50-200ms depending on server location
- **Throughput**: Depends on server capacity
- **Scalability**: Unlimited users across devices
- **Network**: Minimal (text messages only)

## Security Considerations

### Current Implementation
- **Same-origin policy**: Only same domain can join
- **No authentication**: Anyone on same domain can join any room
- **Client-side only**: No data persistence

### Production Recommendations
1. Add JWT authentication to WebSocket handshake
2. Validate room access permissions on server
3. Rate limit message broadcasting
4. Encrypt sensitive data before broadcasting
5. Add server-side state validation
6. Implement reconnection with session recovery

## Advanced Features

### Presence Detection

The system includes a sophisticated presence mechanism:

- **Heartbeat every 3s**: Keeps connection alive
- **10s timeout**: Clients removed after missed heartbeats
- **Graceful cleanup**: Automatic leave events for stale clients

### State Reconciliation

Periodic full state sync ensures consistency:

- **Every 5s**: Broadcast complete participant state
- **On activity**: Immediate delta updates
- **Conflict resolution**: Last-write-wins strategy

### Connection Resilience

Robust handling of connection issues:

- **Reconnection**: Automatic on BroadcastChannel errors
- **State persistence**: Local state maintained during disconnects
- **Visual feedback**: Connection status badge
- **Degraded mode**: Continues working offline with local state

## API Reference

### CollaborationService

```typescript
class CollaborationService {
  constructor(roomId: string)
  
  // Event handling
  on(type: MessageType, handler: MessageHandler): void
  off(type: MessageType, handler: MessageHandler): void
  
  // Broadcasting
  broadcast(type: MessageType, data?: any): void
  
  // Client info
  getClientId(): string
  getConnectedClients(): string[]
  getConnectionStatus(): boolean
  
  // Lifecycle
  disconnect(): void
}
```

### useCollaboration Hook

```typescript
interface UseCollaborationOptions {
  roomId: string
  onJoin?: (clientId: string) => void
  onLeave?: (clientId: string) => void
  onActivity?: (clientId: string, activity: any) => void
  onStatusUpdate?: (clientId: string, status: any) => void
  onSyncState?: (clientId: string, state: any) => void
}

function useCollaboration(options: UseCollaborationOptions): {
  isConnected: boolean
  connectedClients: string[]
  clientId: string
  broadcast: (type: MessageType, data: any) => void
}
```

## Troubleshooting

### Issue: Participants not appearing in other tabs

**Solution**: Ensure all tabs are on the same origin (protocol + domain + port)

### Issue: Messages not syncing

**Solution**: Check browser console for BroadcastChannel errors. Some browsers in private mode may restrict BroadcastChannel.

### Issue: Stale participants not cleaning up

**Solution**: Verify heartbeat interval is running (check CollaborationService logs in console)

### Issue: Performance degradation with many activities

**Solution**: Activity stream is capped at 20 items. If still slow, reduce broadcast frequency.

## Browser Compatibility

BroadcastChannel is supported in:
- ✅ Chrome/Edge 54+
- ✅ Firefox 38+
- ✅ Safari 15.4+
- ❌ IE (not supported)

For older browsers, the system gracefully degrades to single-user mode.

## Future Enhancements

### Planned Features

1. **Persistent sessions**: Save session history to KV store
2. **Session replay**: Playback recorded collaborative sessions
3. **Analytics dashboard**: Aggregate metrics across sessions
4. **Voice/video integration**: Add WebRTC for richer collaboration
5. **Shared cursors**: Show where others are looking/clicking
6. **Collaborative editing**: Real-time co-editing of configurations
7. **Role-based permissions**: Admin, viewer, participant roles
8. **Session recording**: Export session data for analysis

## Contributing

When extending the collaboration system:

1. Keep message payloads small (< 1KB)
2. Add new message types to the MessageType enum
3. Update message handlers in both service and hook
4. Test with multiple tabs before committing
5. Consider migration path to real WebSocket
6. Document new features in this README

## License

Part of the SpiralSafe Collaborative Metrics Platform.
