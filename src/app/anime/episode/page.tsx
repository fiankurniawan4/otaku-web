"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type EpisodeData = {
  linkvid: string;
  animname: string;
};

export default function AnimeEpisodePage() {
  const [episodeData, setEpisodeData] = useState<EpisodeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const animeLink = searchParams.get("link");

  useEffect(() => {
    const fetchEpisode = async () => {
      if (!animeLink) return;

      try {
        const res = await fetch(`/api/otakudesuWatch?link=${encodeURIComponent(animeLink)}`);
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await res.json();
        setEpisodeData(data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchEpisode();
  }, [animeLink]);

  if (loading) {
    return <div className="text-center text-lg">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-lg text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-6">
      {episodeData.length > 0 ? (
        <>
          <h1 className="text-3xl font-bold text-center mb-6">{episodeData[0].animname}</h1>
          <div className="flex justify-center items-center">
            <div className="relative aspect-w-16 aspect-h-9 w-full max-w-4xl">
              <iframe
                src={episodeData[0].linkvid}
                width="640"
                height="360"
                allowFullScreen
                className="mb-4"
                sandbox="allow-same-origin allow-scripts"
              />
            </div>
          </div>
        </>
      ) : (
        <div className="text-center text-lg">No episode found</div>
      )}
      <div className="mt-8 text-center">
        <a href="/" className="text-blue-500 hover:underline">
          Back to Home
        </a>
      </div>
    </div>
  );
}
