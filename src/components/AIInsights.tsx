import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { 
  Sparkle, 
  Lightning, 
  TrendUp,
  Target,
  CheckCircle,
  Warning,
  Info,
  ArrowRight,
  Brain,
  ChartLine,
  Lightbulb,
  Rocket
} from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'

interface Insight {
  id: string
  category: 'performance' | 'collaboration' | 'workflow' | 'security'
  severity: 'critical' | 'important' | 'suggestion'
  title: string
  description: string
  impact: string
  recommendations: string[]
  estimatedImprovement: string
}

interface AnalysisResult {
  timestamp: number
  insights: Insight[]
  overallScore: number
  topPriority: string
}

const categoryColors = {
  performance: 'oklch(0.80 0.20 140)',
  collaboration: 'oklch(0.75 0.15 195)',
  workflow: 'oklch(0.646 0.222 41.116)',
  security: 'oklch(0.60 0.25 25)'
}

const categoryIcons = {
  performance: Rocket,
  collaboration: Lightning,
  workflow: ChartLine,
  security: CheckCircle
}

const severityConfig = {
  critical: {
    color: 'oklch(0.60 0.25 25)',
    label: 'Critical',
    icon: Warning
  },
  important: {
    color: 'oklch(0.75 0.20 60)',
    label: 'Important',
    icon: TrendUp
  },
  suggestion: {
    color: 'oklch(0.75 0.15 195)',
    label: 'Suggestion',
    icon: Lightbulb
  }
}

export function AIInsights() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [analysisResult, setAnalysisResult] = useKV<AnalysisResult | null>('ai-insights-result', null)
  const [selectedInsight, setSelectedInsight] = useState<Insight | null>(null)

  const collectMetricsData = async () => {
    const sessionMetrics = await window.spark.kv.get('session-metrics')
    const sortingResults = await window.spark.kv.get('sorting-hat-results')
    const spectralData = await window.spark.kv.get('spectral-analysis')
    const authTests = await window.spark.kv.get('auth-tests')
    const hardwareDiag = await window.spark.kv.get('hardware-diagnostics')
    
    return {
      sessionMetrics: sessionMetrics || {},
      sortingResults: sortingResults || {},
      spectralData: spectralData || {},
      authTests: authTests || {},
      hardwareDiag: hardwareDiag || {}
    }
  }

  const analyzeWithAI = async () => {
    setIsAnalyzing(true)
    setAnalysisProgress(10)

    try {
      const metricsData = await collectMetricsData()
      setAnalysisProgress(30)

      const promptText = `You are an expert collaborative workflow analyst for SpiralSafe, a platform that evaluates user-AI-repository interactions.

Analyze the following metrics data and provide actionable insights for workflow optimization:

${JSON.stringify(metricsData, null, 2)}

Generate exactly 5 insights covering different aspects (performance, collaboration, workflow, security). For each insight, provide:
1. A clear, specific title
2. A detailed description of what was observed
3. The potential impact on productivity/quality
4. 2-3 specific, actionable recommendations
5. An estimated improvement percentage

Return your response as a JSON object with a single property "insights" that contains an array of insight objects. Each insight must have:
- category: one of "performance", "collaboration", "workflow", "security"
- severity: one of "critical", "important", "suggestion"
- title: string (concise, under 60 chars)
- description: string (2-3 sentences explaining the finding)
- impact: string (1 sentence on business impact)
- recommendations: array of 2-3 strings (specific actions)
- estimatedImprovement: string (percentage like "15-20%" or qualitative like "Moderate")

Format: { "insights": [...] }`

      setAnalysisProgress(60)
      
      const result = await window.spark.llm(promptText, 'gpt-4o', true)
      const parsedResult = JSON.parse(result)

      setAnalysisProgress(90)

      if (!parsedResult.insights || !Array.isArray(parsedResult.insights)) {
        throw new Error('Invalid response format')
      }

      const insights: Insight[] = parsedResult.insights.map((insight: any, index: number) => ({
        id: `insight-${Date.now()}-${index}`,
        category: insight.category || 'workflow',
        severity: insight.severity || 'suggestion',
        title: insight.title || 'Insight',
        description: insight.description || '',
        impact: insight.impact || '',
        recommendations: insight.recommendations || [],
        estimatedImprovement: insight.estimatedImprovement || 'Unknown'
      }))

      const criticalCount = insights.filter(i => i.severity === 'critical').length
      const importantCount = insights.filter(i => i.severity === 'important').length
      const overallScore = Math.max(20, 100 - (criticalCount * 25 + importantCount * 10))

      const topPriority = insights.find(i => i.severity === 'critical')?.category || 
                          insights.find(i => i.severity === 'important')?.category || 
                          'workflow'

      const analysis: AnalysisResult = {
        timestamp: Date.now(),
        insights,
        overallScore,
        topPriority
      }

      setAnalysisResult(analysis)
      setAnalysisProgress(100)

      toast.success('Analysis complete', { 
        description: `Found ${insights.length} insights for optimization` 
      })

      setTimeout(() => {
        setIsAnalyzing(false)
        setAnalysisProgress(0)
      }, 800)

    } catch (error) {
      console.error('AI analysis error:', error)
      toast.error('Analysis failed', { 
        description: 'Unable to generate insights. Please try again.' 
      })
      setIsAnalyzing(false)
      setAnalysisProgress(0)
    }
  }

  const formatTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000)
    if (seconds < 60) return 'just now'
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    return `${Math.floor(seconds / 86400)}d ago`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-primary/10">
            <Sparkle size={32} className="text-primary" weight="duotone" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-1">AI-Powered Workflow Insights</h3>
            <p className="text-sm text-muted-foreground">
              Get intelligent recommendations to optimize your collaborative workflows based on 
              real-time analysis of your metrics, patterns, and team dynamics.
            </p>
          </div>
        </div>
        <Button 
          onClick={analyzeWithAI}
          disabled={isAnalyzing}
          className="gap-2"
          size="lg"
        >
          {isAnalyzing ? (
            <>
              <Brain size={20} className="animate-pulse" weight="fill" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkle size={20} weight="fill" />
              Generate Insights
            </>
          )}
        </Button>
      </div>

      <AnimatePresence>
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Brain size={24} className="text-primary animate-pulse" weight="fill" />
                  <div className="flex-1">
                    <h4 className="font-semibold">AI Analysis in Progress</h4>
                    <p className="text-sm text-muted-foreground">
                      Examining metrics, identifying patterns, and generating recommendations...
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-mono">{analysisProgress}%</span>
                  </div>
                  <Progress value={analysisProgress} className="h-2" />
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {!analysisResult && !isAnalyzing && (
        <Card className="p-12 text-center">
          <div className="flex flex-col items-center gap-4 max-w-md mx-auto">
            <div className="p-4 rounded-full bg-muted">
              <Lightbulb size={48} className="text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">No Insights Yet</h3>
              <p className="text-sm text-muted-foreground">
                Click "Generate Insights" to analyze your workflow data and receive AI-powered 
                recommendations for optimization.
              </p>
            </div>
            <Button onClick={analyzeWithAI} className="gap-2 mt-2">
              <Sparkle size={18} weight="fill" />
              Generate First Analysis
            </Button>
          </div>
        </Card>
      )}

      {analysisResult && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Overall Score</span>
                  <Target size={20} className="text-accent" />
                </div>
                <div className="flex items-baseline gap-2">
                  <div className="text-3xl font-bold font-mono">
                    {analysisResult.overallScore}
                  </div>
                  <div className="text-sm text-muted-foreground">/ 100</div>
                </div>
                <Progress 
                  value={analysisResult.overallScore} 
                  className="mt-3 h-2"
                />
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Insights Found</span>
                  <Lightbulb size={20} className="text-primary" weight="fill" />
                </div>
                <div className="text-3xl font-bold font-mono">
                  {analysisResult.insights.length}
                </div>
                <div className="flex items-center gap-2 mt-3">
                  {analysisResult.insights.filter(i => i.severity === 'critical').length > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      {analysisResult.insights.filter(i => i.severity === 'critical').length} Critical
                    </Badge>
                  )}
                  {analysisResult.insights.filter(i => i.severity === 'important').length > 0 && (
                    <Badge className="text-xs" style={{ backgroundColor: 'oklch(0.75 0.20 60)', color: 'oklch(0.98 0 0)' }}>
                      {analysisResult.insights.filter(i => i.severity === 'important').length} Important
                    </Badge>
                  )}
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Top Priority</span>
                  <TrendUp size={20} className="text-secondary" />
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: categoryColors[analysisResult.topPriority as keyof typeof categoryColors] }}
                  />
                  <span className="font-semibold capitalize">{analysisResult.topPriority}</span>
                </div>
                <div className="text-xs text-muted-foreground mt-3">
                  Last analyzed {formatTimeAgo(analysisResult.timestamp)}
                </div>
              </Card>
            </motion.div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">Recommendations</h4>
              <Button 
                onClick={analyzeWithAI} 
                variant="outline" 
                size="sm"
                className="gap-2"
                disabled={isAnalyzing}
              >
                <ArrowRight size={16} />
                Re-analyze
              </Button>
            </div>

            <div className="space-y-3">
              {analysisResult.insights.map((insight, index) => {
                const CategoryIcon = categoryIcons[insight.category]
                const severityInfo = severityConfig[insight.severity]
                const SeverityIcon = severityInfo.icon
                
                return (
                  <motion.div
                    key={insight.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card 
                      className="p-5 cursor-pointer hover:border-primary/50 transition-colors relative overflow-hidden"
                      onClick={() => setSelectedInsight(selectedInsight?.id === insight.id ? null : insight)}
                    >
                      <div 
                        className="absolute inset-0 opacity-5"
                        style={{ backgroundColor: categoryColors[insight.category] }}
                      />
                      
                      <div className="relative z-10">
                        <div className="flex items-start gap-3 mb-3">
                          <div 
                            className="p-2 rounded-lg"
                            style={{ backgroundColor: `${categoryColors[insight.category]}20` }}
                          >
                            <CategoryIcon 
                              size={24} 
                              style={{ color: categoryColors[insight.category] }}
                              weight="duotone"
                            />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <h5 className="font-semibold text-base leading-tight">
                                {insight.title}
                              </h5>
                              <div className="flex items-center gap-2 flex-shrink-0">
                                <Badge 
                                  className="text-xs gap-1"
                                  style={{ 
                                    backgroundColor: severityInfo.color,
                                    color: 'oklch(0.98 0 0)'
                                  }}
                                >
                                  <SeverityIcon size={12} weight="fill" />
                                  {severityInfo.label}
                                </Badge>
                                <Badge variant="outline" className="text-xs capitalize">
                                  {insight.category}
                                </Badge>
                              </div>
                            </div>
                            
                            <p className="text-sm text-muted-foreground mb-2">
                              {insight.description}
                            </p>

                            <div className="flex items-center gap-4 text-xs">
                              <div className="flex items-center gap-1.5 text-muted-foreground">
                                <TrendUp size={14} />
                                <span>Impact: {insight.impact}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-accent">
                                <Target size={14} />
                                <span>Est. improvement: {insight.estimatedImprovement}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <AnimatePresence>
                          {selectedInsight?.id === insight.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-4 pt-4 border-t border-border"
                            >
                              <div className="flex items-center gap-2 mb-3">
                                <Info size={16} className="text-primary" />
                                <span className="font-semibold text-sm">Action Items</span>
                              </div>
                              <ul className="space-y-2">
                                {insight.recommendations.map((rec, idx) => (
                                  <motion.li
                                    key={idx}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="flex items-start gap-3 text-sm"
                                  >
                                    <CheckCircle 
                                      size={16} 
                                      className="text-accent flex-shrink-0 mt-0.5"
                                      weight="fill"
                                    />
                                    <span>{rec}</span>
                                  </motion.li>
                                ))}
                              </ul>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
