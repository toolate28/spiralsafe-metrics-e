# Planning Guide

A collaborative metrics evaluation platform that analyzes user-AI-repository interactions through SpiralSafe's advanced primitives and protocols, providing spectral coherence analysis, multi-factor authentication testing, and hardware bridge diagnostics in an intuitive, visually striking interface.

**Experience Qualities**:
1. **Enigmatic** - The interface should feel like discovering an arcane system, with layers of depth that reveal themselves progressively as users interact with different evaluation tools.
2. **Precise** - Every metric, visualization, and test result must communicate exact values and states with scientific clarity, building trust in the evaluation process.
3. **Kinetic** - Interactions should feel responsive and alive, with real-time feedback that makes complex protocol testing feel immediate and tangible.

**Complexity Level**: Complex Application (advanced functionality, likely with multiple views)
This platform combines multiple sophisticated evaluation systems - spectral analysis visualization, authentication protocol testing, hardware bridge diagnostics, and AI sorting - each requiring distinct interfaces and real-time data processing capabilities.

## Essential Features

**Sorting Hat Classification**
- Functionality: Analyzes user/AI/repository collaboration patterns and assigns classification based on interaction signatures
- Purpose: Provides immediate insight into collaboration style and optimal workflow patterns
- Trigger: User initiates evaluation from main dashboard
- Progression: Welcome prompt → Answer interactive questions → Real-time analysis visualization → Classification reveal with spectral signature → Detailed breakdown
- Success criteria: Classification feels personalized, visualization is captivating, results are actionable

**Spectral Coherence Analyzer**
- Functionality: Visualizes frequency-domain analysis of collaborative signals with real-time waveform display
- Purpose: Reveals hidden patterns in collaboration data that indicate synchronization quality
- Trigger: User selects spectral analysis from toolkit menu
- Progression: Select data source → Configure analysis parameters → Live waveform visualization → Coherence score calculation → Export/save results
- Success criteria: Waveforms are smooth and responsive, coherence metrics are clearly explained, visual design is scientifically aesthetic

**3FA/ATOM-AUTH Protocol Tester**
- Functionality: Tests three-factor authentication flows with atomic authentication primitives
- Purpose: Validates authentication protocol implementations and identifies weaknesses
- Trigger: User uploads or configures authentication protocol
- Progression: Protocol configuration → Factor selection → Authentication simulation → Result matrix → Security score and recommendations
- Success criteria: All authentication factors are tested accurately, results show clear pass/fail states, recommendations are specific

**Isomorphic Hardware Bridge Diagnostic**
- Functionality: Tests hardware bridge implementations (e.g., Tartarus Pro remapping for Minecraft/AI interaction)
- Purpose: Validates hardware-software bridges work correctly across different contexts
- Trigger: User selects hardware device and target application
- Progression: Device selection → Bridge configuration → Input/output testing → Latency measurement → Compatibility report
- Success criteria: Real-time input/output feedback, latency displayed in milliseconds, clear compatibility status

**Primitive Protocol Library**
- Functionality: Browse and test individual SpiralSafe primitives with interactive examples
- Purpose: Educational tool and testing ground for protocol components
- Trigger: User clicks on primitives library
- Progression: Browse primitives → Select primitive → View documentation → Run test cases → See results
- Success criteria: All primitives documented clearly, tests are interactive, results validate correctness

**Real-Time Session Monitor with WebSocket Collaboration**
- Functionality: Monitors live collaborative sessions with true multi-user synchronization via WebSocket (BroadcastChannel), tracking participant metrics, activity, and engagement in real-time
- Purpose: Provides visibility into team dynamics and collaboration effectiveness through live metrics with instant cross-tab/window synchronization
- Trigger: User starts a monitoring session from the Session tab
- Progression: Start session → Auto-broadcast presence → Other participants join from different tabs/windows → Real-time metric sync → Activity stream visualization → Simulated actions broadcast to all clients → End session with summary
- Success criteria: Metrics sync instantly (< 100ms), participant join/leave events broadcast to all clients, activity updates appear in real-time across all sessions, WebSocket connection status clearly indicated, supports multiple simultaneous sessions across browser tabs

## Edge Case Handling

- **No Data Available**: Display elegant empty states with sample data generation options
- **Analysis Timeout**: Show progress indicators and allow cancellation with partial results
- **Invalid Protocol Configuration**: Highlight specific errors with inline corrections
- **Hardware Not Connected**: Graceful fallback to simulation mode with visual indicator
- **Extremely Poor Coherence**: Display encouraging messaging with specific improvement suggestions
- **Browser Compatibility**: Feature detection with graceful degradation for unsupported features
- **Network Interruption**: Maintain local state and display connection status with auto-reconnect via heartbeat mechanism
- **Rapid Activity Bursts**: Throttle activity stream updates to prevent UI overwhelming (max 20 activities shown)
- **Stale Client Detection**: Remove clients that haven't sent heartbeat in 10s with graceful leave notification
- **Multiple Browser Tabs**: Full support for same user in multiple tabs with unique client IDs
- **Session Isolation**: Different session IDs ensure no cross-contamination between independent collaborative sessions

## Design Direction

The design should evoke the feeling of working with advanced scientific instrumentation in a cyberpunk research lab - sophisticated technical aesthetics with neon accents, geometric precision, and data visualization that feels both analytical and beautiful. Think oscilloscopes, spectrum analyzers, and holographic interfaces with a dark, focused atmosphere punctuated by vibrant data streams.

## Color Selection

A dark, technical color scheme with electric accents that emphasize data and active states.

- **Primary Color**: Deep Purple (`oklch(0.35 0.15 290)`) - Represents the core SpiralSafe brand, used for primary actions and key interface elements. Conveys sophistication and technical depth.
- **Secondary Colors**: 
  - Electric Cyan (`oklch(0.75 0.15 195)`) - Used for spectral visualization, active states, and data streams. Represents data flow and analysis.
  - Deep Navy (`oklch(0.20 0.08 250)`) - Card backgrounds and secondary surfaces. Provides depth without being pure black.
- **Accent Color**: Neon Green (`oklch(0.80 0.20 140)`) - Success states, active connections, real-time indicators. Commands attention for critical information.
- **Foreground/Background Pairings**:
  - Background Dark (`oklch(0.12 0.02 270)`): Light Gray text (`oklch(0.95 0.01 270)`) - Ratio 14.2:1 ✓
  - Deep Navy (`oklch(0.20 0.08 250)`): White text (`oklch(0.98 0 0)`) - Ratio 11.8:1 ✓
  - Deep Purple (`oklch(0.35 0.15 290)`): White text (`oklch(0.98 0 0)`) - Ratio 6.2:1 ✓
  - Electric Cyan (`oklch(0.75 0.15 195)`): Dark text (`oklch(0.15 0.02 270)`) - Ratio 9.4:1 ✓
  - Neon Green (`oklch(0.80 0.20 140)`): Dark text (`oklch(0.15 0.02 270)`) - Ratio 10.8:1 ✓

## Font Selection

Fonts should bridge technical precision with futuristic aesthetics - monospace for data and metrics, a technical sans-serif for interface elements.

- **Typographic Hierarchy**:
  - H1 (Page Titles): Space Grotesk Bold/36px/tight letter-spacing (-0.02em)
  - H2 (Section Headers): Space Grotesk Bold/24px/tight letter-spacing (-0.01em)
  - H3 (Card Titles): Space Grotesk SemiBold/18px/normal letter-spacing
  - Body Text: Space Grotesk Regular/16px/relaxed line-height (1.6)
  - Data/Metrics: JetBrains Mono Medium/14px/tabular numbers
  - Labels: Space Grotesk Medium/14px/uppercase/wide letter-spacing (0.05em)

## Animations

Animations should emphasize data flow and state transitions with precision. Use subtle particle effects for analysis processes, smooth easing for navigation, and snappy feedback for interactions. Key moments like classification reveals or test completions deserve celebratory micro-interactions with elastic easing. Keep loading states animated to suggest active processing rather than static waiting.

## Component Selection

- **Components**:
  - Cards: Primary container for each tool/metric, with subtle glow borders on hover
  - Tabs: Navigate between different analysis views within tools
  - Dialog: Modal overlays for detailed test configurations
  - Progress: Linear and circular variants for analysis processes
  - Badge: Display status indicators (passing/failing, connected/disconnected)
  - Slider: Adjust analysis parameters like frequency ranges
  - Switch: Toggle between simulation and live modes
  - Tooltip: Explain technical terms and metrics
  - Accordion: Expandable sections for primitive documentation
  - Separator: Visual breaks between tool sections
  
- **Customizations**:
  - Waveform Visualizer: Custom canvas-based component for spectral analysis using D3
  - Classification Wheel: Custom SVG component for Sorting Hat interface
  - Protocol Matrix: Custom grid component showing 3FA test results
  - Hardware Monitor: Custom component with real-time input/output display
  - Coherence Meter: Custom radial gauge component
  
- **States**:
  - Buttons: Default with purple gradient, hover lifts with glow, active scales down, disabled reduces opacity to 40%
  - Inputs: Default with subtle cyan border, focus expands border and adds glow, error state with red border and shake animation
  - Cards: Default with dark navy background, hover adds cyan border glow, active state for selected tools
  
- **Icon Selection**:
  - Waveform/SineWave: Spectral analysis
  - ShieldCheck: Authentication testing
  - GitBranch: Repository classification
  - Plugs: Hardware bridges
  - Cube: Primitives library
  - UsersThree: Real-time session monitoring
  - Lightning: Active/real-time indicators
  - Check/X: Pass/fail states
  - Clock: Time-based metrics
  - ChatCircle/GitCommit: Activity types
  
- **Spacing**:
  - Page padding: p-8 (32px)
  - Card padding: p-6 (24px)
  - Section gaps: gap-6 (24px)
  - Element gaps: gap-4 (16px)
  - Tight spacing: gap-2 (8px)
  
- **Mobile**:
  - Stack cards vertically instead of grid layout
  - Tabs convert to select dropdown on small screens
  - Reduce padding to p-4 (16px) for page and cards
  - Waveform visualizations scale to full width with reduced height
  - Bottom navigation for main tool selection on mobile
