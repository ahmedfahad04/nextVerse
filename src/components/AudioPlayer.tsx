"use client";

import { useState, useRef, useEffect } from "react";
import { getVerseRecitationByKey } from "@/lib/quran-api";

interface MinimalAudioPlayerProps {
  audioUrl?: string;
  verseKey: string;
  reciterId?: number;
  onLoadingChange?: (loading: boolean) => void;
  autoplay?: boolean;
  textLoaded?: boolean;
}

export default function MinimalAudioPlayer({
  audioUrl: initialAudioUrl,
  verseKey,
  reciterId = 4,
  onLoadingChange,
  autoplay = false,
  textLoaded = true,
}: MinimalAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(initialAudioUrl || null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [isLoading, setIsLoading] = useState(!initialAudioUrl);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setAudioUrl(initialAudioUrl || null);
    setError(null);
    setCurrentTime(0);
    setTotalTime(0);
    setIsPlaying(false);
  }, [initialAudioUrl, verseKey]);

  useEffect(() => {
    if (audioUrl) return;

    if (!verseKey) {
      setError("Verse key is required to fetch audio");
      setIsLoading(false);
      return;
    }

    const cacheKey = `audio-url:${verseKey}:${reciterId}`;
    const cachedUrl = typeof window !== "undefined" ? localStorage.getItem(cacheKey) : null;
    if (cachedUrl) {
      setAudioUrl(cachedUrl);
      setIsLoading(false);
      return;
    }

    const fetchAudio = async () => {
      try {
        setIsLoading(true);
        const recitation = await getVerseRecitationByKey(verseKey, reciterId);
        if (recitation?.url) {
          setAudioUrl(recitation.url);
          if (typeof window !== "undefined") {
            localStorage.setItem(cacheKey, recitation.url);
          }
          setError(null);
        } else {
          setError("Failed to fetch audio URL");
        }
      } catch (err) {
        console.error("Error fetching audio:", err);
        setError("Failed to load audio");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAudio();
  }, [verseKey, reciterId, audioUrl]);

  useEffect(() => {
    if (onLoadingChange) {
      onLoadingChange(isLoading);
    }
  }, [isLoading, onLoadingChange]);

  const handlePlayPause = async () => {
    if (!audioRef.current || error) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (err) {
        console.error("Error playing audio:", err);
        setError("Unable to play audio");
        setIsPlaying(false);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setTotalTime(audioRef.current.duration);
      setIsLoading(false);
    }
  };

  const handleCanPlay = () => {
    setIsLoading(false);
    if (autoplay && textLoaded && !isPlaying) {
      audioRef.current?.play().then(() => setIsPlaying(true)).catch((err) => console.error("Autoplay failed:", err));
    }
  };

  useEffect(() => {
    if (autoplay && audioUrl && textLoaded && !isPlaying && audioRef.current && audioRef.current.readyState >= 3) {
      audioRef.current.play().then(() => setIsPlaying(true)).catch((err) => console.error("Autoplay failed:", err));
    }
  }, [autoplay, audioUrl, textLoaded, isPlaying]);

  const handleLoadStart = () => {
    setIsLoading(true);
    setError(null);
  };

  const handleEnded = () => {
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
    }
  };

  const handleError = () => {
    setIsPlaying(false);
    setIsLoading(false);
    if (audioUrl?.includes("/128/")) {
      setAudioUrl(audioUrl.replace("/128/", "/64/"));
      return;
    }
    setError("Audio unavailable");
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !totalTime || isLoading) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * totalTime;

    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const progressPercent = totalTime ? (currentTime / totalTime) * 100 : 0;

  return (
    <div className="relative w-full">
      <audio
        ref={audioRef}
        src={audioUrl || undefined}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onCanPlay={handleCanPlay}
        onLoadStart={handleLoadStart}
        onEnded={handleEnded}
        onError={handleError}
        preload="metadata"
        autoPlay={autoplay && textLoaded}
      />

      <div className="flex items-center justify-center gap-2 pt-3 pb-2">
        <button
          onClick={handlePlayPause}
          disabled={isLoading || !!error}
          className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white transition-all active:scale-90 disabled:opacity-40 disabled:cursor-not-allowed ${
            isPlaying
              ? "bg-emerald-600 hover:bg-emerald-700"
              : "bg-emerald-500 hover:bg-emerald-600"
          }`}
          title={isPlaying ? "Pause" : "Play"}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            {isLoading ? (
              <>
                <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3" />
                <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="15.7 47.1" strokeLinecap="round" style={{ animation: "spin 1s linear infinite" }} />
              </>
            ) : isPlaying ? (
              <>
                <rect x="6" y="4" width="4" height="16" fill="currentColor" />
                <rect x="14" y="4" width="4" height="16" fill="currentColor" />
              </>
            ) : (
              <polygon points="5 3 19 12 5 21" fill="currentColor" />
            )}
          </svg>
        </button>

        {/* <div className="text-xs font-bold text-emerald-700 w-8 text-right">
          {Math.floor(currentTime)}
          <span className="text-emerald-500/60">/</span>
          {Math.floor(totalTime)}s
        </div> */}

        {error && <span className="text-xs text-red-600 font-medium">{error}</span>}
      </div>

      <div
        onClick={handleProgressClick}
        className="h-1 md:h-1.5 bg-emerald-100/40 cursor-pointer group hover:bg-emerald-100/70 transition-colors rounded-b-2xl overflow-hidden"
      >
        <div
          className="h-full bg-linear-to-r from-emerald-500 to-emerald-600 transition-all rounded-b-2xl"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}
