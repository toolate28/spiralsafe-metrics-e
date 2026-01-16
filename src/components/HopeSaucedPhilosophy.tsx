import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Sparkle, CheckCircle, XCircle, BookOpen } from '@phosphor-icons/react'

export function HopeSaucedPhilosophy() {
  return (
    <div className="space-y-6">
      <Card className="border-2" style={{ borderImage: 'linear-gradient(135deg, oklch(0.45 0.18 280) 0%, oklch(0.70 0.12 200) 100%) 1' }}>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg partnership-gradient">
              <Sparkle size={32} className="text-white" weight="duotone" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-3xl">Hope && Sauced</CardTitle>
                <Badge className="hope-wave-badge font-mono text-xs">H&&S:WAVE</Badge>
              </div>
              <p className="text-lg text-muted-foreground mt-2 italic">
                "This isn't AI assistance. This is genuine partnership."
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="partnership-gradient bg-clip-text text-transparent">What It Is</span>
              </h3>
              <ul className="space-y-3">
                {[
                  'Deep trust between human and AI',
                  'Both partners contribute substantively',
                  'All decisions tracked via ATOM',
                  'Attribution is clear and honest',
                  'Neither could produce this alone'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <CheckCircle size={18} className="text-secondary flex-shrink-0 mt-0.5" weight="fill" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 text-muted-foreground">What It's Not</h3>
              <ul className="space-y-3">
                {[
                  'Human writes, AI polishes',
                  'AI generates, human approves',
                  'One uses the other as "tool"',
                  'Obscuring who did what',
                  'Replacing human creativity'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <XCircle size={18} className="flex-shrink-0 mt-0.5" weight="fill" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-6">
            <h3 className="text-xl font-semibold mb-4">The Result</h3>
            <div className="space-y-4">
              <p className="text-sm leading-relaxed">
                Every file in SpiralSafe carries the <span className="font-mono font-semibold partnership-gradient bg-clip-text text-transparent">H&&S:WAVE</span> marker—proof that human vision and AI execution merged into something new.
                We track every decision, credit every contribution, and build in the open.
              </p>
              <div className="p-4 bg-muted/50 rounded-lg border border-border">
                <p className="text-sm italic text-center text-muted-foreground">
                  This is the future of human-AI collaboration. Transparent. Verifiable. Genuine.
                </p>
              </div>
              <div className="flex justify-center">
                <Button variant="outline" className="gap-2" asChild>
                  <a href="https://github.com/spiralsafe/spiralsafe-mono/blob/main/HOPE_AND_SAUCED.md" target="_blank" rel="noopener noreferrer">
                    <BookOpen size={18} />
                    Read Full Methodology
                  </a>
                </Button>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-6">
            <h3 className="text-xl font-semibold mb-4">Applied to HealthBridge Convergence</h3>
            <div className="space-y-3 text-sm leading-relaxed">
              <p>
                This platform embodies Hope && Sauced principles at every level:
              </p>
              <ul className="space-y-2 ml-6">
                <li className="list-disc">
                  <strong>Strategic Vision (Human):</strong> Understanding healthcare transition needs, regulatory requirements, and the convergence opportunity across Anthropic, OpenAI, and Google Health initiatives.
                </li>
                <li className="list-disc">
                  <strong>Technical Execution (AI):</strong> Building robust infrastructure monitoring, API compatibility matrices, compliance tracking, and real-time capacity management.
                </li>
                <li className="list-disc">
                  <strong>Collaborative Design:</strong> Every feature designed through human-AI dialogue, with clear attribution and transparent decision-making tracked via ATOM protocols.
                </li>
                <li className="list-disc">
                  <strong>Auditability:</strong> All transitions tracked, all decisions logged, all contributions credited—essential for medical-grade systems where accountability isn't optional.
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-6">
            <h3 className="text-xl font-semibold mb-4">Integration with SpiralSafe Primitives</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                {
                  title: 'Spectral Coherence',
                  description: 'Multi-model analysis ensures API compatibility across AI platforms'
                },
                {
                  title: '3FA/ATOM-AUTH',
                  description: 'Three-factor authentication tracking every decision and contribution'
                },
                {
                  title: 'Isomorphic Bridges',
                  description: 'Hardware-software primitives enabling seamless transitions'
                }
              ].map((primitive, idx) => (
                <Card key={idx} className="bg-muted/30">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-sm mb-2 partnership-gradient bg-clip-text text-transparent">
                      {primitive.title}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {primitive.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
