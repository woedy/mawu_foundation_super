import { Body, Heading, Section } from "../design-system";
import { TestimonialsSection } from "../sections/TestimonialsSection";

export const VoicesPage = () => (
  <>
    <Section background="default">
      <div className="space-y-4 text-center">
        <Heading level={1}>Voices of the movement</Heading>
        <Body className="mx-auto max-w-2xl" variant="muted">
          Hear directly from donors, volunteers, and community members about the trust, transparency, and transformation they
          experience with the Mawu Foundation.
        </Body>
      </div>
    </Section>
    <TestimonialsSection />
  </>
);
