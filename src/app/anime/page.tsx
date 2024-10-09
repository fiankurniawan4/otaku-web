"use client";

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

type AnimeData = {
  jdlflm: string;
  linkvid: string;
};

export default function AnimePage() {
  const [animeData, setAnimeData] = useState<AnimeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const searchParams = useSearchParams();
  const animeLink = searchParams.get('link');
  const router = useRouter();

  useEffect(() => {
    const fetchAnime = async () => {
      if (!animeLink) return;
      try {
        const res = await fetch(`/api/otakudesuAnime?link=${encodeURIComponent(animeLink)}`);
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await res.json();
        setAnimeData(data);
      } catch (err) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchAnime();
  }, [animeLink]);

  const handleEpisodeClick = (linkvid: string) => {
    // Navigate to the episode page and pass the linkvid as a query parameter
    router.push(`/anime/episode?link=${encodeURIComponent(linkvid)}`);
  };

  return (
    <div className="grid grid-cols-1 gap-8 p-8 mx-auto max-w-6xl">
      <h1 className="text-3xl font-bold text-center mb-6">Anime Episodes</h1>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {animeData.map((anime) => (
            <div
              key={anime.jdlflm}
              className="flex flex-col p-4 border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out"
            >
              <h2 className="text-xl font-bold mb-2">{anime.jdlflm}</h2>
              <button
                onClick={() => handleEpisodeClick(anime.linkvid)}
                className="text-blue-500 hover:underline mt-auto"
              >
                Watch Episode
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
