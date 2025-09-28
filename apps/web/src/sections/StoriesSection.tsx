import { useMemo, useState } from "react";
import {
  Body,
  Button,
  Card,
  CardContent,
  CardHeader,
  Eyebrow,
  Heading,
  Section,
} from "../design-system";
import { trackEvent } from "../lib/analytics";

interface Story {
  id: string;
  slug: string;
  title: string;
  author: string;
  category: string;
  date: string;
  formattedDate: string;
  excerpt: string;
  image?: string;
  tags: string[];
  content: string;
  readingTimeMinutes: number;
}

const storyModules = import.meta.glob<string>("../stories/*.md", {
  eager: true,
  import: "default",
  query: "?raw",
});

const FRONT_MATTER_REGEX = /^---\s*[\r\n]+([\s\S]*?)---\s*[\r\n]+([\s\S]*)$/;

const parseFrontMatterValue = (value: string): string => {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
};

const toSlug = (path: string) => path.replace(/^.*\//, "").replace(/\.md$/, "");

const parseStories = (): Story[] => {
  const entries = Object.entries(storyModules) as Array<[string, string]>;

  return entries
    .map(([path, rawContent]) => {
      const normalised = rawContent.replace(/\r\n/g, "\n").trim();
      const match = normalised.match(FRONT_MATTER_REGEX);

      let frontMatterBlock = "";
      let contentBlock = normalised;

      if (match) {
        frontMatterBlock = match[1];
        contentBlock = match[2];
      }

      const frontMatterLines = frontMatterBlock
        .split(/\n/)
        .map((line) => line.trim())
        .filter(Boolean);

      const frontMatter: Record<string, string> = {};
      frontMatterLines.forEach((line) => {
        const [key, ...rest] = line.split(":");
        if (!key || rest.length === 0) {
          return;
        }
        frontMatter[key.trim().toLowerCase()] = parseFrontMatterValue(
          rest.join(":"),
        );
      });

      const tagsLine = frontMatter["tags"];
      const tags = tagsLine
        ? tagsLine
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean)
        : [];

      const dateValue = frontMatter["date"] ?? new Date().toISOString();
      const date = new Date(dateValue);
      const formattedDate = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

      const content = contentBlock.trim();
      const wordCount = content.split(/\s+/).filter(Boolean).length;
      const readingTimeMinutes = Math.max(2, Math.round(wordCount / 180));

      const slug = toSlug(path);

      return {
        id: slug,
        slug,
        title: frontMatter["title"] ?? slug,
        author: frontMatter["author"] ?? "Mawu Story Team",
        category: frontMatter["category"] ?? "Impact Update",
        date: date.toISOString(),
        formattedDate,
        excerpt: frontMatter["excerpt"] ?? content.slice(0, 160),
        image: frontMatter["image"],
        tags,
        content,
        readingTimeMinutes,
      } satisfies Story;
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
};

const splitIntoParagraphs = (content: string) =>
  content
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

export const StoriesSection = () => {
  const stories = useMemo(() => parseStories(), []);
  const [activeStoryId, setActiveStoryId] = useState<string>(
    stories[0]?.id ?? "",
  );

  const activeStory = useMemo(
    () =>
      stories.find((story) => story.id === activeStoryId) ?? stories[0] ?? null,
    [activeStoryId, stories],
  );

  const secondaryStories = useMemo(
    () => stories.filter((story) => story.id !== activeStory?.id),
    [stories, activeStory?.id],
  );

  const handleSelectStory = (story: Story) => {
    setActiveStoryId(story.id);
    trackEvent("story_opened", {
      title: story.title,
      category: story.category,
    });
  };

  if (!stories.length) {
    return null;
  }

  return (
    <Section
      aria-labelledby="stories-heading"
      background="default"
      id="stories"
    >
      <div className="flex flex-col gap-10 lg:grid lg:grid-cols-[1.15fr_0.85fr]">
        {activeStory ? (
          <Card className="overflow-hidden border-ink-100/70 bg-white/80 shadow-soft">
            {activeStory.image ? (
              <div className="relative h-72 w-full overflow-hidden">
                <img
                  alt={activeStory.title}
                  className="h-full w-full object-cover"
                  src={activeStory.image}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <Eyebrow className="text-white/80">
                    {activeStory.category}
                  </Eyebrow>
                  <Heading
                    className="text-white"
                    id="stories-heading"
                    level={2}
                  >
                    {activeStory.title}
                  </Heading>
                  <p className="mt-2 text-sm text-white/80">
                    {activeStory.formattedDate} - {activeStory.author} -{" "}
                    {activeStory.readingTimeMinutes} min read
                  </p>
                </div>
              </div>
            ) : null}
            <CardContent className="space-y-6">
              {!activeStory.image ? (
                <div>
                  <Eyebrow>{activeStory.category}</Eyebrow>
                  <Heading id="stories-heading" level={2}>
                    {activeStory.title}
                  </Heading>
                  <p className="mt-2 text-sm text-ink-500">
                    {activeStory.formattedDate} - {activeStory.author} -{" "}
                    {activeStory.readingTimeMinutes} min read
                  </p>
                </div>
              ) : null}
              {splitIntoParagraphs(activeStory.content).map(
                (paragraph, index) => (
                  <Body key={`${activeStory.id}-paragraph-${index}`}>
                    {paragraph}
                  </Body>
                ),
              )}
              {activeStory.tags.length ? (
                <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">
                  {activeStory.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-brand-200/60 bg-brand-50 px-3 py-1"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </CardContent>
          </Card>
        ) : null}
        <div className="space-y-6">
          <div className="space-y-3">
            <Eyebrow>Stories &amp; Dispatches</Eyebrow>
            <Heading level={3}>
              Latest field notes from the Mawu network
            </Heading>
            <Body variant="muted">
              We translate field data and community voices into concise investor
              briefings. Explore the latest progress notes and long-form
              reflections fueling our season of impact in the Volta Region.
            </Body>
          </div>
          <div className="space-y-4">
            {secondaryStories.map((story) => (
              <button
                aria-pressed={story.id === activeStory?.id}
                className="w-full text-left transition focus:outline-none"
                key={story.id}
                onClick={() => handleSelectStory(story)}
                type="button"
              >
                <Card className="w-full border-ink-100/70 bg-white/70 hover:border-brand-200 focus-within:border-brand-300">
                  <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-1">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">
                        {story.category}
                      </p>
                      <Heading className="text-left text-lg" level={4}>
                        {story.title}
                      </Heading>
                      <Body className="text-sm" variant="muted">
                        {story.excerpt}
                      </Body>
                    </div>
                    <div className="shrink-0 text-right text-xs text-ink-400">
                      <p>{story.formattedDate}</p>
                      <p>{story.author}</p>
                    </div>
                  </CardHeader>
                </Card>
              </button>
            ))}
            {secondaryStories.length === 0 ? (
              <Card className="border-ink-100/60 bg-white/70">
                <CardContent>
                  <Body variant="muted">More stories are on the way.</Body>
                </CardContent>
              </Card>
            ) : null}
          </div>
          <Button as="a" href="#newsletter" size="sm" variant="secondary">
            Subscribe for full dispatches
          </Button>
        </div>
      </div>
    </Section>
  );
};
