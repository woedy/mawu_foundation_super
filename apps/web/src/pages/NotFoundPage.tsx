import { Link } from "react-router-dom";

import { Body, Button, Heading, Section } from "../design-system";

export const NotFoundPage = () => (
  <Section background="default">
    <div className="space-y-6 text-center">
      <Heading level={1}>Page not found</Heading>
      <Body className="mx-auto max-w-xl" variant="muted">
        The page you are looking for has moved or no longer exists. Explore the
        latest vision, programs, and stories to continue the journey.
      </Body>
      <div className="flex justify-center gap-3">
        <Button as={Link} to="/">
          Return home
        </Button>
        <Button as={Link} to="/programs" variant="secondary">
          Explore programs
        </Button>
      </div>
    </div>
  </Section>
);
