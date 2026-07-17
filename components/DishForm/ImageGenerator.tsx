"use client";

import { useState, useTransition } from "react";
import { ImageIcon, Loader2, Sparkles, Wand2 } from "lucide-react";
import { generateDishImage, improveDishPrompt, type DishMeta } from "@/app/actions/generate";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type ImageGeneratorProps = {
  categories: string[];
  cuisines: string[];
  onAutofill: (meta: Omit<DishMeta, "finalPrompt">) => void;
  onImage: (url: string) => void;
};

const ImageGenerator = ({ categories, cuisines, onAutofill, onImage }: ImageGeneratorProps) => {
  const [prompt, setPrompt] = useState("");
  const [finalPrompt, setFinalPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [improving, startImproving] = useTransition();
  const [generating, startGenerating] = useTransition();

  const improve = () =>
    startImproving(async () => {
      setError(null);
      const result = await improveDishPrompt(prompt, { categories, cuisines });
      if (result.ok) {
        const { finalPrompt: improved, ...meta } = result.data;
        setFinalPrompt(improved);
        onAutofill(meta);
      } else {
        setError(result.error);
      }
    });

  const generate = () =>
    startGenerating(async () => {
      setError(null);
      const result = await generateDishImage(finalPrompt);
      if (result.ok) {
        setImageUrl(result.data);
        onImage(result.data);
      } else {
        setError(result.error);
      }
    });

  return (
    <section className="flex flex-col gap-4 rounded-lg border bg-card p-5">
      <h2 className="text-lg font-semibold tracking-tight">Image</h2>

      {/* Step 1: describe + improve */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="image-prompt">Describe the dish</Label>
        <Textarea
          id="image-prompt"
          placeholder="Homemade lasagna with layers of beef ragù…"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
      </div>
      <Button
        type="button"
        variant="secondary"
        disabled={!prompt.trim() || improving}
        onClick={improve}
      >
        {improving ? <Loader2 className="animate-spin" /> : <Wand2 />}
        Improve prompt
      </Button>

      {/* Step 2: final prompt + generate */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="image-final-prompt">Final prompt</Label>
        <Textarea
          id="image-final-prompt"
          placeholder="Improved prompt appears here — editable before generation"
          value={finalPrompt}
          onChange={(e) => setFinalPrompt(e.target.value)}
          className="min-h-32"
        />
      </div>
      <Button type="button" disabled={!finalPrompt.trim() || generating} onClick={generate}>
        {generating ? <Loader2 className="animate-spin" /> : <Sparkles />}
        Generate image
      </Button>

      {error && (
        <p className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>
      )}

      {imageUrl ? (
        // plain img: replicate.delivery host not whitelisted in next.config yet
        <img
          src={imageUrl}
          alt="Generated dish"
          className="aspect-square w-full rounded-md border object-cover"
        />
      ) : (
        <div className="flex aspect-square flex-col items-center justify-center gap-2 rounded-md border border-dashed bg-muted text-muted-foreground">
          {generating ? (
            <Loader2 className="size-8 animate-spin" />
          ) : (
            <ImageIcon className="size-8" />
          )}
          <span className="text-sm">
            {generating ? "Generating…" : "Generated image will appear here"}
          </span>
        </div>
      )}
    </section>
  );
};

export default ImageGenerator;
