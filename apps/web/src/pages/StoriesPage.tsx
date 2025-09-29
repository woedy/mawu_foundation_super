import { Body, Heading, Section } from "../design-system";
import { StoriesSection } from "../sections/StoriesSection";

export const StoriesPage = () => (
  <>
    <Section background="default">
      <div className="space-y-4 text-center">
        <Heading level={1}>Stories from the field</Heading>
        <Body className="mx-auto max-w-2xl" variant="muted">
          Follow immersive narratives from the people powering the Mawu Foundation's mission. Dive into multimedia updates and
          long-form reflections curated for investors and community partners.
        </Body>
      </div>
    </Section>
    <StoriesSection />
  </>
);
