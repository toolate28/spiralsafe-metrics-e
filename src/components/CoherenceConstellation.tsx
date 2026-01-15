import { useEffect, useRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  Planet,
  Lightning,
  Users,
  GitBranch,
  Play,
  Pause,
  ArrowsClockwise,
  Sparkle,
  Graph
} from '@phosphor-icons/react'
import * as THREE from 'three'

interface Node {
  id: string
  type: 'user' | 'ai' | 'repo'
  name: string
  position: THREE.Vector3
  velocity: THREE.Vector3
  connections: string[]
  activity: number
  coherenceScore: number
}

interface Connection {
  from: string
  to: string
  strength: number
  type: 'collaboration' | 'dependency' | 'communication'
}

const nodeColors = {
  user: new THREE.Color('oklch(0.80 0.20 140)'),
  ai: new THREE.Color('oklch(0.75 0.15 195)'),
  repo: new THREE.Color('oklch(0.646 0.222 41.116)')
}

const connectionColors = {
  collaboration: new THREE.Color('oklch(0.80 0.20 140)'),
  dependency: new THREE.Color('oklch(0.646 0.222 41.116)'),
  communication: new THREE.Color('oklch(0.75 0.15 195)')
}

export function CoherenceConstellation() {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const nodesRef = useRef<Map<string, { mesh: THREE.Mesh; node: Node }>>(new Map())
  const connectionsRef = useRef<THREE.Line[]>([])
  const animationFrameRef = useRef<number | null>(null)

  const [nodes, setNodes] = useState<Node[]>([])
  const [connections, setConnections] = useState<Connection[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [showLabels, setShowLabels] = useState(true)
  const [nodeCount, setNodeCount] = useState(12)
  const [rotationSpeed, setRotationSpeed] = useState(0.3)
  const [connectionDensity, setConnectionDensity] = useState(50)
  const [physicsEnabled, setPhysicsEnabled] = useState(true)
  const [globalCoherence, setGlobalCoherence] = useState(0)

  const initScene = useCallback(() => {
    if (!containerRef.current) return

    const scene = new THREE.Scene()
    scene.background = new THREE.Color('oklch(0.12 0.02 270)')
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    )
    camera.position.z = 25
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)

    const pointLight = new THREE.PointLight(0x75beda, 1.5, 100)
    pointLight.position.set(10, 10, 10)
    scene.add(pointLight)

    const starGeometry = new THREE.BufferGeometry()
    const starMaterial = new THREE.PointsMaterial({
      color: 0x75beda,
      size: 0.1,
      transparent: true,
      opacity: 0.6
    })

    const starVertices: number[] = []
    for (let i = 0; i < 1000; i++) {
      const x = (Math.random() - 0.5) * 100
      const y = (Math.random() - 0.5) * 100
      const z = (Math.random() - 0.5) * 100
      starVertices.push(x, y, z)
    }
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3))
    const stars = new THREE.Points(starGeometry, starMaterial)
    scene.add(stars)

    const handleResize = () => {
      if (!containerRef.current || !camera || !renderer) return
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [])

  const generateNodes = useCallback(() => {
    const newNodes: Node[] = []
    const types: ('user' | 'ai' | 'repo')[] = ['user', 'ai', 'repo']

    for (let i = 0; i < nodeCount; i++) {
      const type = types[Math.floor(Math.random() * types.length)]
      const theta = (i / nodeCount) * Math.PI * 2
      const radius = 10 + Math.random() * 5
      const y = (Math.random() - 0.5) * 8

      newNodes.push({
        id: `node-${i}`,
        type,
        name: `${type.charAt(0).toUpperCase()}${type.slice(1)} ${i + 1}`,
        position: new THREE.Vector3(
          Math.cos(theta) * radius,
          y,
          Math.sin(theta) * radius
        ),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02
        ),
        connections: [],
        activity: Math.random() * 100,
        coherenceScore: 50 + Math.random() * 50
      })
    }

    const newConnections: Connection[] = []
    const connectionTypes: ('collaboration' | 'dependency' | 'communication')[] = [
      'collaboration',
      'dependency',
      'communication'
    ]

    for (let i = 0; i < newNodes.length; i++) {
      const numConnections = Math.floor((connectionDensity / 100) * (newNodes.length - 1) / 2)
      for (let j = 0; j < numConnections; j++) {
        const targetIndex = Math.floor(Math.random() * newNodes.length)
        if (targetIndex !== i && !newNodes[i].connections.includes(newNodes[targetIndex].id)) {
          newNodes[i].connections.push(newNodes[targetIndex].id)
          newConnections.push({
            from: newNodes[i].id,
            to: newNodes[targetIndex].id,
            strength: Math.random() * 0.5 + 0.5,
            type: connectionTypes[Math.floor(Math.random() * connectionTypes.length)]
          })
        }
      }
    }

    setNodes(newNodes)
    setConnections(newConnections)
  }, [nodeCount, connectionDensity])

  const createNodeMeshes = useCallback(() => {
    if (!sceneRef.current) return

    nodesRef.current.forEach(({ mesh }) => {
      sceneRef.current?.remove(mesh)
    })
    nodesRef.current.clear()

    nodes.forEach((node) => {
      const geometry = new THREE.SphereGeometry(0.5, 32, 32)
      const material = new THREE.MeshPhongMaterial({
        color: nodeColors[node.type],
        emissive: nodeColors[node.type],
        emissiveIntensity: 0.4,
        shininess: 100
      })
      const mesh = new THREE.Mesh(geometry, material)
      mesh.position.copy(node.position)

      const glowGeometry = new THREE.SphereGeometry(0.7, 32, 32)
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: nodeColors[node.type],
        transparent: true,
        opacity: 0.2
      })
      const glow = new THREE.Mesh(glowGeometry, glowMaterial)
      mesh.add(glow)

      sceneRef.current?.add(mesh)
      nodesRef.current.set(node.id, { mesh, node })
    })
  }, [nodes])

  const createConnectionLines = useCallback(() => {
    if (!sceneRef.current) return

    connectionsRef.current.forEach((line) => {
      sceneRef.current?.remove(line)
    })
    connectionsRef.current = []

    connections.forEach((connection) => {
      const fromNode = nodesRef.current.get(connection.from)
      const toNode = nodesRef.current.get(connection.to)

      if (fromNode && toNode) {
        const points = [fromNode.mesh.position, toNode.mesh.position]
        const geometry = new THREE.BufferGeometry().setFromPoints(points)
        const material = new THREE.LineBasicMaterial({
          color: connectionColors[connection.type],
          transparent: true,
          opacity: connection.strength * 0.6
        })
        const line = new THREE.Line(geometry, material)
        sceneRef.current?.add(line)
        connectionsRef.current.push(line)
      }
    })
  }, [connections])

  const updatePhysics = useCallback(() => {
    if (!physicsEnabled) return

    const attractionStrength = 0.0001
    const repulsionStrength = 0.5
    const damping = 0.95

    nodes.forEach((node, i) => {
      const nodeMesh = nodesRef.current.get(node.id)
      if (!nodeMesh) return

      const force = new THREE.Vector3()

      nodes.forEach((otherNode, j) => {
        if (i === j) return
        const otherMesh = nodesRef.current.get(otherNode.id)
        if (!otherMesh) return

        const direction = new THREE.Vector3()
          .subVectors(otherMesh.mesh.position, nodeMesh.mesh.position)
        const distance = direction.length()

        if (distance < 0.1) return

        direction.normalize()

        if (node.connections.includes(otherNode.id)) {
          force.add(direction.multiplyScalar(attractionStrength * distance))
        } else if (distance < 5) {
          force.add(direction.multiplyScalar(-repulsionStrength / (distance * distance)))
        }
      })

      const centerPull = new THREE.Vector3().sub(nodeMesh.mesh.position).multiplyScalar(0.001)
      force.add(centerPull)

      node.velocity.add(force)
      node.velocity.multiplyScalar(damping)

      nodeMesh.mesh.position.add(node.velocity)
      node.position.copy(nodeMesh.mesh.position)
    })
  }, [nodes, physicsEnabled])

  const updateConnections = useCallback(() => {
    connectionsRef.current.forEach((line, index) => {
      const connection = connections[index]
      if (!connection) return

      const fromNode = nodesRef.current.get(connection.from)
      const toNode = nodesRef.current.get(connection.to)

      if (fromNode && toNode) {
        const positions = line.geometry.attributes.position.array as Float32Array
        positions[0] = fromNode.mesh.position.x
        positions[1] = fromNode.mesh.position.y
        positions[2] = fromNode.mesh.position.z
        positions[3] = toNode.mesh.position.x
        positions[4] = toNode.mesh.position.y
        positions[5] = toNode.mesh.position.z
        line.geometry.attributes.position.needsUpdate = true
      }
    })
  }, [connections])

  const animate = useCallback(() => {
    if (!sceneRef.current || !cameraRef.current || !rendererRef.current || !isRunning) return

    if (physicsEnabled) {
      updatePhysics()
      updateConnections()
    } else {
      const time = Date.now() * 0.001 * rotationSpeed
      cameraRef.current.position.x = Math.cos(time) * 25
      cameraRef.current.position.z = Math.sin(time) * 25
      cameraRef.current.lookAt(0, 0, 0)
    }

    nodesRef.current.forEach(({ mesh, node }) => {
      const scale = 1 + Math.sin(Date.now() * 0.003 + node.activity) * 0.1
      mesh.scale.set(scale, scale, scale)
    })

    const totalCoherence = nodes.reduce((sum, node) => sum + node.coherenceScore, 0)
    setGlobalCoherence(Math.round(totalCoherence / Math.max(nodes.length, 1)))

    rendererRef.current.render(sceneRef.current, cameraRef.current)
    animationFrameRef.current = requestAnimationFrame(animate)
  }, [isRunning, nodes, rotationSpeed, physicsEnabled, updatePhysics, updateConnections])

  useEffect(() => {
    const cleanup = initScene()
    generateNodes()
    return cleanup
  }, [initScene, generateNodes])

  useEffect(() => {
    createNodeMeshes()
  }, [createNodeMeshes])

  useEffect(() => {
    createConnectionLines()
  }, [createConnectionLines])

  useEffect(() => {
    if (isRunning) {
      animate()
    } else if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isRunning, animate])

  const handleStart = () => setIsRunning(true)
  const handlePause = () => setIsRunning(false)
  const handleReset = () => {
    setIsRunning(false)
    generateNodes()
  }

  const getCoherenceColor = (score: number) => {
    if (score >= 80) return 'oklch(0.80 0.20 140)'
    if (score >= 60) return 'oklch(0.75 0.15 195)'
    return 'oklch(0.646 0.222 41.116)'
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card className="relative overflow-hidden">
            <div
              ref={containerRef}
              className="w-full h-[600px] bg-gradient-to-b from-background to-card"
            />
            {!isRunning && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm"
              >
                <div className="text-center space-y-4">
                  <div className="p-6 rounded-full bg-primary/10 inline-block">
                    <Planet size={64} className="text-primary" weight="duotone" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Coherence Constellation</h3>
                    <p className="text-sm text-muted-foreground max-w-md">
                      3D network visualization of collaborative relationships
                    </p>
                  </div>
                  <Button onClick={handleStart} size="lg" className="gap-2">
                    <Play size={20} weight="fill" />
                    Start Visualization
                  </Button>
                </div>
              </motion.div>
            )}
            {isRunning && (
              <div className="absolute top-4 right-4 space-y-2">
                <Card className="p-3 bg-card/90 backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <Sparkle size={20} className="text-accent" weight="fill" />
                    <div>
                      <div className="text-xs text-muted-foreground">Global Coherence</div>
                      <div
                        className="text-2xl font-bold font-mono"
                        style={{ color: getCoherenceColor(globalCoherence) }}
                      >
                        {globalCoherence}%
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Graph size={20} className="text-primary" />
              Controls
            </h3>
            <div className="space-y-4">
              {isRunning ? (
                <Button onClick={handlePause} variant="secondary" className="w-full gap-2">
                  <Pause size={18} weight="fill" />
                  Pause
                </Button>
              ) : (
                <Button onClick={handleStart} className="w-full gap-2">
                  <Play size={18} weight="fill" />
                  Start
                </Button>
              )}
              <Button onClick={handleReset} variant="outline" className="w-full gap-2">
                <ArrowsClockwise size={18} />
                Reset
              </Button>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-semibold mb-4">Parameters</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Node Count</Label>
                  <Badge variant="secondary" className="font-mono text-xs">
                    {nodeCount}
                  </Badge>
                </div>
                <Slider
                  value={[nodeCount]}
                  onValueChange={([value]) => setNodeCount(value)}
                  min={5}
                  max={30}
                  step={1}
                  disabled={isRunning}
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Connection Density</Label>
                  <Badge variant="secondary" className="font-mono text-xs">
                    {connectionDensity}%
                  </Badge>
                </div>
                <Slider
                  value={[connectionDensity]}
                  onValueChange={([value]) => setConnectionDensity(value)}
                  min={10}
                  max={90}
                  step={10}
                  disabled={isRunning}
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Rotation Speed</Label>
                  <Badge variant="secondary" className="font-mono text-xs">
                    {rotationSpeed.toFixed(1)}x
                  </Badge>
                </div>
                <Slider
                  value={[rotationSpeed]}
                  onValueChange={([value]) => setRotationSpeed(value)}
                  min={0.1}
                  max={2}
                  step={0.1}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <Label htmlFor="physics" className="text-xs">
                  Physics Simulation
                </Label>
                <Switch
                  id="physics"
                  checked={physicsEnabled}
                  onCheckedChange={setPhysicsEnabled}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="labels" className="text-xs">
                  Show Labels
                </Label>
                <Switch id="labels" checked={showLabels} onCheckedChange={setShowLabels} />
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-semibold mb-3 text-sm">Legend</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'oklch(0.80 0.20 140)' }} />
                <Users size={14} />
                <span className="text-muted-foreground">User Nodes</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'oklch(0.75 0.15 195)' }} />
                <Lightning size={14} />
                <span className="text-muted-foreground">AI Nodes</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'oklch(0.646 0.222 41.116)' }} />
                <GitBranch size={14} />
                <span className="text-muted-foreground">Repo Nodes</span>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-semibold mb-2 text-sm">Network Stats</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Nodes</span>
                <span className="font-mono font-semibold">{nodes.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Connections</span>
                <span className="font-mono font-semibold">{connections.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Avg. Coherence</span>
                <span
                  className="font-mono font-semibold"
                  style={{ color: getCoherenceColor(globalCoherence) }}
                >
                  {globalCoherence}%
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
