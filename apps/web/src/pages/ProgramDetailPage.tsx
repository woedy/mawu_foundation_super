import { useParams, Navigate, Link } from "react-router-dom";
import { useProgramsData } from "../hooks/useProgramsData";
import { ProgramDetailSection } from "../components/ProgramDetailSection";
import { Section, Heading, Body, Button } from "../design-system";

export const ProgramDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { payload, loading, error } = useProgramsData();

  if (loading) {
    return (
      <Section background="default">
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent mx-auto"></div>
            <p className="mt-4 text-ink-600">Loading program details...</p>
          </div>
        </div>
      </Section>
    );
  }

  if (error) {
    return (
      <Section background="default">
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="text-center space-y-4">
            <Heading level={2}>Unable to Load Program</Heading>
            <Body variant="muted">Error loading program: {error}</Body>
            <Button as={Link} to="/programs">
              Back to Programs
            </Button>
          </div>
        </div>
      </Section>
    );
  }

  const program = payload?.programs.find((p) => p.slug === slug);

  if (!program) {
    return (
      <Section background="default">
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="text-center space-y-4">
            <Heading level={2}>Program Not Found</Heading>
            <Body variant="muted">The program you're looking for doesn't exist or may have been moved.</Body>
            <Button as={Link} to="/programs">
              Explore All Programs
            </Button>
          </div>
        </div>
      </Section>
    );
  }

  return <ProgramDetailSection program={program} />;
};