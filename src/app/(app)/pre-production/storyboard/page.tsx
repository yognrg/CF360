import { getActiveRequest, getPrompt } from "@/lib/db";
import { StoryboardPrompts } from "@/components/pre-production/storyboard-prompts";

export default function StoryboardPage() {
  const request = getActiveRequest();
  const prompt = getPrompt(request.id) ?? null;
  return <StoryboardPrompts initialPrompt={prompt} />;
}
