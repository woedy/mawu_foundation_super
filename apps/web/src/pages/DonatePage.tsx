import { Body, Button, Card, CardContent, CardFooter, CardHeader, Eyebrow, Heading, Section } from "../design-system";
import { ChecklistItem } from "../components/ChecklistItem";

export const DonatePage = () => (
  <>
    <Section background="default">
      <div className="space-y-4 text-center">
        <Heading level={1}>Donate to the mission</Heading>
        <Body className="mx-auto max-w-2xl" variant="muted">
          Select a focus area, choose a one-time or recurring cadence, and receive transparent reporting in your inbox. Stripe
          handles secure payments today while we prepare to launch crypto, PayPal, bank transfer, and MoMo options soon.
        </Body>
      </div>
    </Section>
    <Section background="tinted">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
        <div className="space-y-6">
          <Eyebrow>Donate</Eyebrow>
          <Heading level={2}>Stripe-secured giving for immediate impact</Heading>
          <Body>
            Whether you are fueling a specific program or supporting the overall mission, your gift activates resilient
            infrastructure designed with community leaders.
          </Body>
          <div className="flex flex-wrap gap-3">
            <Button size="lg">Donate with Stripe</Button>
            <Button size="lg" variant="ghost">
              Coming soon: Crypto / PayPal / Bank / MoMo
            </Button>
          </div>
        </div>
        <Card className="bg-white/80 backdrop-blur">
          <CardHeader>
            <Heading level={3}>Ways to amplify change</Heading>
            <Body variant="muted">
              Whether you are an individual donor or corporate ally, we tailor partnership tracks aligned to your goals.
            </Body>
          </CardHeader>
          <CardContent className="space-y-4">
            <ChecklistItem>
              Recurring donor circles with quarterly immersion briefings.
            </ChecklistItem>
            <ChecklistItem>
              Corporate collaborations for infrastructure and innovation pilots.
            </ChecklistItem>
            <ChecklistItem>
              Angel alliances underwriting rapid-response relief.
            </ChecklistItem>
          </CardContent>
          <CardFooter>
            <Button as="a" href="mailto:partnerships@mawufoundation.org" size="sm" variant="secondary">
              Start a conversation
            </Button>
            <Button as="a" href="mailto:hello@mawufoundation.org" size="sm" variant="ghost">
              Request reports
            </Button>
          </CardFooter>
        </Card>
      </div>
    </Section>
  </>
);
