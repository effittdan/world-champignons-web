import { readFileSync } from "node:fs";
const source = readFileSync(
  new URL("../WORLD_CHAMPIGNONS_CONTENT_SOURCE.md", import.meta.url),
  "utf8",
).replaceAll("\r", "");
export function section(start, end) {
  return (
    source
      .split(start)[1]
      ?.split(end)[0]
      .replace(/^---\s*$/gm, "")
      .trim() || ""
  );
}
export const originStory = section(
  "# 2. Canonical Origin Story",
  "# 3. About Page Copy",
);
export const manifesto = section(
  "# 5. The World Champignons Manifesto",
  "# 6. The Three Teachings",
);
export const teachings = [
  {
    id: "seek",
    title: "Seek",
    kicker: "The first teaching",
    lead: "The first teaching of the mushroom is attention.",
    body: section("## Seek\n", "## Study"),
    image: "detail",
  },
  {
    id: "study",
    title: "Study",
    kicker: "The second teaching",
    lead: "The second teaching is relationship. Nothing grows alone.",
    body: section("## Study\n", "## Preserve"),
    image: "hero",
  },
  {
    id: "preserve",
    title: "Preserve",
    kicker: "The third teaching",
    lead: "Preserve the part of yourself that still knows the world is enchanted.",
    body: section("## Preserve\n", "# 7. Homepage Hero Copy Options"),
    image: "detail",
  },
];
export const collections = [
  {id: 'cultivation', name: 'Cultivation', line: 'Good things take root.', description: 'Grow-room rituals, first-flush celebrations, and knowing jokes from the workbench. Nine designs for people who find joy in watching something grow.'},
  {id: 'psychedelic-experience', name: 'Psychedelic Experience', line: 'A little room for the extraordinary.', description: 'Cosmic perspective, gentle self-mockery, and the curious work of coming back to yourself. Eight designs for carrying the wonder into everyday life.'},
  {id: 'connection-spirituality', name: 'Connection & Spirituality', line: 'Listen below the noise.', description: 'Forest students, quiet questions, and the threads that connect us. Seven designs for slowing down and finding your place in the living world.'},
  {
    id: "mckenna",
    name: "McKenna Collection",
    line: "Follow your curiosity into the undergrowth.",
    description: "Four illustrated invitations to think freely, worry a little less, and make your own way. Inspired by the words and restless curiosity of Terence McKenna. Every shirt $39, with free standard shipping.",
  },
];
