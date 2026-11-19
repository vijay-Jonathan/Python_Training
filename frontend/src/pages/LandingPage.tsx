import { ArrowRight, BarChart3, LayoutDashboard, ShieldCheck, Zap } from "lucide-react";
import { Band, Button, Card, CtaPanel, Feature, Landing, RemoteImage, Stat, photo } from "../ui";

/**
 * The screen the application opens on, and the pattern every generated
 * landing page should follow:
 *
 * - one <Landing>, given the `image` topic that matches the subject — this
 *   single prop is most of what makes the page look considered rather than
 *   generic,
 * - a headline with one word in `.gradient-text`, a sentence under it, and
 *   exactly one primary action,
 * - a `.landing-proof` strip of figures that make the claim concrete,
 * - and then SECTIONS, not a single grid. Each one is a full-bleed <Band>
 *   holding a `.container`, opened by a `.section-head`; the band's `tone`
 *   picks its treatment. This rhythm is most of the difference between a
 *   page that reads as a product and one that reads as a template,
 * - a <CtaPanel> as the close: the page ends by repeating the one action,
 * - no new CSS, no inline style objects, no imported image files.
 *
 * Match the shape to the app type: portfolio -> visual/editorial,
 * marketplace -> banner + product cards, booking -> split + round,
 * management -> minimal/dashboard, learning -> calm/spacious. Use imagery
 * only where it improves the experience: the hero, and at most one
 * band-image — never a stock photo on every band.
 *
 * Replace the words and the topic; keep the shape.
 */
export function LandingPage({ onEnter }: { onEnter: () => void }) {
  return (
    <Landing
      brand="Generated Application"
      icon={LayoutDashboard}
      // The one decision that matters most here. Name the topic the
      // application is actually about — "restaurant", "realestate",
      // "health" — and the banner is a photograph of that subject.
      image="workspace"
      eyebrow="React · TypeScript · FastAPI"
      title={
        <>
          Everything your team needs, <span className="gradient-text">in one place</span>
        </>
      }
      subtitle="A starting point that already looks finished: a design system, both themes, eight accents and imagery that matches the subject. Replace the words with the real thing."
      actions={
        <>
          <Button tone="primary" size="lg" onClick={onEnter}>
            Open the dashboard
          </Button>
          <Button tone="outline" size="lg" iconRight={Zap}>
            See what is inside
          </Button>
        </>
      }
    >
      {/* A row of proof under the pitch: three numbers that make the claim
          concrete. `.landing-proof` styles the figures; the words stay plain. */}
      <div className="landing-proof">
        <span>
          <strong>24</strong>
          components, pre-styled
        </span>
        <span>
          <strong>8</strong>
          accents, both themes
        </span>
        <span>
          <strong>42</strong>
          imagery topics
        </span>
      </div>

      {/* Band one, plain. Every band opens with a `.section-head`, which is
          what gives a long page rhythm. */}
      <Band>
        <div className="container stack-lg">
          <div className="section-head">
            <div>
              <p className="eyebrow">What you get</p>
              <h2 className="section-title">Built to be composed, not restyled</h2>
            </div>
            <Button tone="outline" iconRight={Zap} onClick={onEnter}>
              Open the dashboard
            </Button>
          </div>

          <div className="grid stagger">
            <Feature icon={Zap} title="Fast by default">
              Screens are composed from pre-written components, so there is no CSS to wait for and
              nothing to restyle.
            </Feature>
            <Feature icon={BarChart3} title="Honest about state">
              Every view that loads data handles all three cases — loading, failed and empty — so a
              screen is never blank.
            </Feature>
            <Feature icon={ShieldCheck} title="Themed, not painted">
              Light and dark on eight accents, all from semantic tokens. No component knows a
              colour.
            </Feature>
          </div>
        </div>
      </Band>

      {/* Band two, tinted so the page reads as alternating stripes: what the
          thing actually looks like. Cards that lead with a photograph of the
          subject, each seeded off its own id so the picture is stable. */}
      <Band tone="tint">
        <div className="container stack-lg">
          <div className="section-head">
            <div>
              <p className="eyebrow">A look inside</p>
              <h2 className="section-title">Screens that arrive finished</h2>
            </div>
          </div>

          <div className="grid stagger">
            {[
              { id: "overview", title: "Overview", body: "Metrics, a hero and the day's work." },
              { id: "records", title: "Records", body: "A table that sorts, filters and pages." },
              { id: "detail", title: "Detail", body: "A subject beside the facts about it." },
            ].map((screen) => (
              <Card key={screen.id} title={screen.title} tight interactive>
                <RemoteImage
                  src={photo(screen.id, { topic: "workspace", width: 640, height: 360 })}
                  alt=""
                  className="card-media"
                />
                <p className="muted">{screen.body}</p>
              </Card>
            ))}
          </div>
        </div>
      </Band>

      {/* Band three: a generated texture behind a row of metrics. `.stat-grid`
          lays the tiles out; `tone` leans each one toward a meaning. */}
      <Band tone="grid">
        <div className="container stack-lg">
          <div className="section-head">
            <div>
              <p className="eyebrow">In numbers</p>
              <h2 className="section-title">The difference, measured</h2>
            </div>
          </div>

          <div className="stat-grid stagger">
            <Stat label="Components" value="24" delta="pre-styled" icon={LayoutDashboard} />
            <Stat
              label="Builds passing"
              value="98%"
              delta="up from 71%"
              direction="up"
              tone="success"
              icon={ShieldCheck}
            />
            <Stat
              label="Repair cycles"
              value="-40%"
              delta="fewer build failures"
              direction="up"
              tone="warning"
              icon={Zap}
            />
            <Stat label="Setup time" value="0 min" delta="already running" icon={BarChart3} />
          </div>
        </div>
      </Band>

      {/* Band four: a photograph under the theme's scrim — the one band-image
          the page is allowed, for a claim that earns the picture. */}
      <Band tone="image" image="workspace">
        <div className="container stack">
          <p className="eyebrow">Why it looks finished</p>
          <h2 className="section-title">
            Imagery of the subject, <span className="gradient-text">not of a template</span>
          </h2>
          <p className="muted">
            The scrim is mixed from the theme's own ground, so the band stays readable in both
            themes — use it once, for the claim that earns the picture.
          </p>
        </div>
      </Band>

      {/* The close: the page ends by repeating the one action. CtaPanel is
          centred and lit; put it in a glowing band. */}
      <Band tone="glow">
        <div className="container">
          <CtaPanel
            icon={ArrowRight}
            title="Start with the dashboard"
            actions={
              <Button tone="primary" size="lg" onClick={onEnter}>
                Open the dashboard
              </Button>
            }
          >
            Everything above is composition. Replace the words, the topic and the accent.
          </CtaPanel>
        </div>
      </Band>
    </Landing>
  );
}
