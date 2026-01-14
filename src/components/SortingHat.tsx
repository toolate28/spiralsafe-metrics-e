import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { GitBranch, Robot, User } from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'

interface Question {
  text: string
  options: { text: string; repo: number; ai: number; user: number }[]
}

const questions: Question[] = [
  {
    text: "When starting a new project, you first...",
    options: [
      { text: "Create a detailed repo structure and documentation", repo: 3, ai: 1, user: 0 },
      { text: "Ask AI to generate initial boilerplate code", repo: 1, ai: 3, user: 0 },
      { text: "Sketch ideas and prototype manually", repo: 0, ai: 0, user: 3 },
    ]
  },
  {
    text: "Your ideal workflow involves...",
    options: [
      { text: "Organized branches with strict merge protocols", repo: 3, ai: 0, user: 1 },
      { text: "Continuous AI pair programming sessions", repo: 0, ai: 3, user: 1 },
      { text: "Deep focus sessions with minimal tools", repo: 1, ai: 0, user: 3 },
    ]
  },
  {
    text: "When debugging, you prefer to...",
    options: [
      { text: "Review commit history and diffs", repo: 3, ai: 1, user: 0 },
      { text: "Ask AI to analyze the error logs", repo: 0, ai: 3, user: 1 },
      { text: "Step through code manually with print statements", repo: 0, ai: 0, user: 3 },
    ]
  },
  {
    text: "Collaboration means...",
    options: [
      { text: "Pull requests and code reviews", repo: 3, ai: 1, user: 1 },
      { text: "AI-assisted code generation and refactoring", repo: 1, ai: 3, user: 0 },
      { text: "Direct communication and pair programming", repo: 1, ai: 0, user: 3 },
    ]
  },
  {
    text: "You feel most productive when...",
    options: [
      { text: "Everything is version controlled and tracked", repo: 3, ai: 0, user: 1 },
      { text: "AI handles boilerplate so you focus on logic", repo: 1, ai: 3, user: 0 },
      { text: "You have complete creative control", repo: 0, ai: 1, user: 3 },
    ]
  }
]

type Classification = 'REPO_ARCHITECT' | 'AI_SYNTHESIST' | 'USER_CRAFTSPERSON' | 'BALANCED_HYBRID'

export function SortingHat() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [scores, setScores] = useState({ repo: 0, ai: 0, user: 0 })
  const [classification, setClassification] = useKV<Classification | null>('sorting-classification', null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleAnswer = (option: { repo: number; ai: number; user: number }) => {
    const newScores = {
      repo: scores.repo + option.repo,
      ai: scores.ai + option.ai,
      user: scores.user + option.user,
    }
    setScores(newScores)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      analyzeResults(newScores)
    }
  }

  const analyzeResults = (finalScores: typeof scores) => {
    setIsAnalyzing(true)
    
    setTimeout(() => {
      const max = Math.max(finalScores.repo, finalScores.ai, finalScores.user)
      const diff = Math.abs(finalScores.repo - finalScores.ai) + Math.abs(finalScores.ai - finalScores.user)
      
      let result: Classification
      if (diff < 5) {
        result = 'BALANCED_HYBRID'
      } else if (finalScores.repo === max) {
        result = 'REPO_ARCHITECT'
      } else if (finalScores.ai === max) {
        result = 'AI_SYNTHESIST'
      } else {
        result = 'USER_CRAFTSPERSON'
      }
      
      setClassification(result)
      setIsAnalyzing(false)
    }, 2000)
  }

  const reset = () => {
    setCurrentQuestion(0)
    setScores({ repo: 0, ai: 0, user: 0 })
    setClassification(null)
    setIsAnalyzing(false)
  }

  const getClassificationDetails = (type: Classification) => {
    const details = {
      REPO_ARCHITECT: {
        title: 'Repository Architect',
        icon: <GitBranch size={48} weight="duotone" className="text-secondary" />,
        description: 'You thrive in structured environments with clear version control and organizational systems. Your strength lies in building maintainable, well-documented codebases.',
        traits: ['Version Control Mastery', 'Documentation Excellence', 'System Organization', 'Change Tracking']
      },
      AI_SYNTHESIST: {
        title: 'AI Synthesist',
        icon: <Robot size={48} weight="duotone" className="text-accent" />,
        description: 'You leverage AI as a collaborative partner, maximizing productivity through intelligent automation while maintaining creative oversight.',
        traits: ['AI Integration', 'Rapid Prototyping', 'Pattern Recognition', 'Automation Expertise']
      },
      USER_CRAFTSPERSON: {
        title: 'User Craftsperson',
        icon: <User size={48} weight="duotone" className="text-primary" />,
        description: 'You value direct control and deep understanding, preferring hands-on development with minimal intermediary tools.',
        traits: ['Deep Focus', 'Manual Mastery', 'Creative Control', 'First Principles']
      },
      BALANCED_HYBRID: {
        title: 'Balanced Hybrid',
        icon: <div className="flex gap-2">
          <GitBranch size={32} weight="duotone" className="text-secondary" />
          <Robot size={32} weight="duotone" className="text-accent" />
          <User size={32} weight="duotone" className="text-primary" />
        </div>,
        description: 'You seamlessly integrate repository management, AI assistance, and personal craftsmanship. Your adaptability is your strength.',
        traits: ['Versatile Approach', 'Tool Agnostic', 'Context Adaptive', 'Multi-Modal Thinking']
      }
    }
    return details[type]
  }

  if (classification && !isAnalyzing) {
    const details = getClassificationDetails(classification)
    const total = scores.repo + scores.ai + scores.user
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-6"
      >
        <Card className="p-8 glow-border-accent">
          <div className="flex flex-col items-center space-y-6 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
            >
              {details.icon}
            </motion.div>
            
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-glow">{details.title}</h2>
              <p className="text-muted-foreground max-w-2xl">{details.description}</p>
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
              {details.traits.map((trait, i) => (
                <motion.div
                  key={trait}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                >
                  <Badge variant="secondary" className="text-sm">{trait}</Badge>
                </motion.div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Spectral Signature</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="flex items-center gap-2">
                  <GitBranch size={16} className="text-secondary" />
                  Repository Orientation
                </span>
                <span className="font-mono">{Math.round((scores.repo / total) * 100)}%</span>
              </div>
              <Progress value={(scores.repo / total) * 100} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="flex items-center gap-2">
                  <Robot size={16} className="text-accent" />
                  AI Collaboration
                </span>
                <span className="font-mono">{Math.round((scores.ai / total) * 100)}%</span>
              </div>
              <Progress value={(scores.ai / total) * 100} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="flex items-center gap-2">
                  <User size={16} className="text-primary" />
                  Manual Craftsmanship
                </span>
                <span className="font-mono">{Math.round((scores.user / total) * 100)}%</span>
              </div>
              <Progress value={(scores.user / total) * 100} className="h-2" />
            </div>
          </div>
        </Card>

        <Button onClick={reset} className="w-full" variant="outline">
          Retake Assessment
        </Button>
      </motion.div>
    )
  }

  if (isAnalyzing) {
    return (
      <Card className="p-12 flex flex-col items-center justify-center space-y-6 glow-border">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <div className="w-16 h-16 border-4 border-secondary border-t-transparent rounded-full" />
        </motion.div>
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold">Analyzing Collaboration Signature</h3>
          <p className="text-muted-foreground">Processing spectral coherence patterns...</p>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              Question {currentQuestion + 1} of {questions.length}
            </h3>
            <span className="text-sm font-mono text-secondary">{Math.round(((currentQuestion) / questions.length) * 100)}%</span>
          </div>
          <Progress value={((currentQuestion) / questions.length) * 100} className="h-2" />
        </div>
      </Card>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6">{questions[currentQuestion].text}</h2>
            <div className="space-y-3">
              {questions[currentQuestion].options.map((option, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={() => handleAnswer(option)}
                    variant="outline"
                    className="w-full justify-start text-left h-auto py-4 px-6"
                  >
                    {option.text}
                  </Button>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
