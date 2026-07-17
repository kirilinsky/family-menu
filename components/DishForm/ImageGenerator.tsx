"use client";

import { useState } from "react";
import { ImageIcon, Sparkles, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [finalPrompt, setFinalPrompt] = useState("");

  const improvePrompt = () => {
    // TODO: call LLM to enhance the prompt; plain copy for now
    setFinalPrompt(prompt.trim());
  };

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
      <Button type="button" variant="secondary" disabled={!prompt.trim()} onClick={improvePrompt}>
        <Wand2 /> Improve prompt
      </Button>

      {/* Step 2: final prompt + generate */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="image-final-prompt">Final prompt</Label>
        <Textarea
          id="image-final-prompt"
          placeholder="Improved prompt appears here — editable before generation"
          value={finalPrompt}
          onChange={(e) => setFinalPrompt(e.target.value)}
        />
      </div>
      <Button type="button" disabled={!finalPrompt.trim()}>
        <Sparkles /> Generate image
      </Button>

      <div className="flex aspect-square flex-col items-center justify-center gap-2 rounded-md border border-dashed bg-muted text-muted-foreground">
        <ImageIcon className="size-8" />
        <span className="text-sm">Generated image will appear here</span>
      </div>
    </section>
  );
};

export default ImageGenerator;
