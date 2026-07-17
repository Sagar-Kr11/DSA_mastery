import { useState } from "react";
import type { YouTubeRef } from "@/data/topics";
import { CHANNEL_LABELS } from "@/data/topics";
import { Play } from "lucide-react";

export function YouTubeEmbed({ yt }: { yt: YouTubeRef }) {
  const [loaded, setLoaded] = useState(false);

  const embedUrl =
    yt.kind === "video"
      ? `https://www.youtube-nocookie.com/embed/${yt.id}?rel=0&modestbranding=1&autoplay=1`
      : `https://www.youtube-nocookie.com/embed/videoseries?list=${yt.id}&rel=0&modestbranding=1&autoplay=1`;

  const posterUrl =
    yt.kind === "video"
      ? `https://i.ytimg.com/vi/${yt.id}/hqdefault.jpg`
      : undefined;

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-white/10 bg-black/40">
      {loaded ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={embedUrl}
          title={yt.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      ) : (
        <button
          type="button"
          onClick={() => setLoaded(true)}
          className="group absolute inset-0 flex items-center justify-center"
          aria-label={`Play: ${yt.title}`}
        >
          {posterUrl ? (
            <img src={posterUrl} alt="" className="absolute inset-0 h-full w-full object-cover opacity-70 transition group-hover:opacity-90" loading="lazy" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.25_0.05_265)] to-[oklch(0.2_0.08_300)]" />
          )}
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/25 transition" />
          <div className="relative flex flex-col items-center gap-2 text-white">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/40 transition group-hover:scale-105">
              <Play className="h-7 w-7 fill-current" />
            </span>
            <span className="text-sm font-medium">{yt.title}</span>
            <span className="text-xs text-white/70">{CHANNEL_LABELS[yt.channel]}</span>
          </div>
        </button>
      )}
    </div>
  );
}
