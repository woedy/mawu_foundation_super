import { Body, Heading, Section } from "../design-system";
import { ProgramExplorer } from "../components/ProgramExplorer";
import { useProgramsData } from "../hooks/useProgramsData";

export const ProgramsPage = () => {
  const { payload, loading, error } = useProgramsData();

  const programs = payload?.programs ?? [];
  const categories = payload?.categories ?? [];
  const regions = payload?.regions ?? [];
  const metrics = payload?.impactMetrics ?? [];

  return (
    <>
      <Section background="default">
        <div className="space-y-4 text-center">
          <Heading level={1}>Programs & Impact Explorer</Heading>
          <Body className="mx-auto max-w-2xl" variant="muted">
            Filter by category, preview highlight stories, and explore detailed program information to see how each initiative is
            transforming lives.
          </Body>
        </div>
      </Section>
      <ProgramExplorer
        categories={categories}
        error={error}
        loading={loading}
        metrics={metrics}
        programs={programs}
        regions={regions}
      />
    </>
  );
};
