"use client";

import { useEffect, useState } from 'react';

type OtakuData = {
  jdlflm: string;
  img: string;
  link: string;
  genre: string;
};


export default function Home() {
  const [otakuData, setOtakuData] = useState<OtakuData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('/api/otakudesu')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then((data) => {
        setOtakuData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Fetch error:', error);
        setLoading(false);
      });
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/otakudesu?q=${encodeURIComponent(searchQuery)}`);
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await res.json();
      setOtakuData(data);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const ongoingAnime = otakuData.slice(0, 15);
  const completedAnime = otakuData.slice(15);

  return (
    <div className="grid grid-cols-1 gap-8 p-8 mx-auto max-w-6xl">
      <form className="flex items-center justify-center" onSubmit={handleSearch}>
        <input
          type="search"
          name="q"
          placeholder="Search anime..."
          className="p-2 border border-gray-200 rounded-l-md"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded-r-md">Search</button>
      </form>
      
      <h1 className="text-3xl font-bold text-center mb-6">
        {loading
          ? 'Loading...'
          : searchQuery
            ? `Searching Anime for "${searchQuery}"`
            : 'Anime Home'}
      </h1>
      
      {loading ? (
        <></>
      ) : (
        <>
          {!searchQuery && (
            <>
              <div>
                <h2 className="text-2xl font-semibold mb-4">On-going Anime</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {ongoingAnime.map((otaku) => (
                    <div key={otaku.jdlflm} className="flex items-start p-4 border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out">
                      <img src={otaku.img} alt={otaku.jdlflm} className="rounded-lg w-32 h-48 object-cover mr-4" />
                      <div>
                        <h2 className="text-xl font-bold">{otaku.jdlflm}</h2>
                        <a href={otaku.link} className="text-blue-500 hover:underline mt-2 inline-block">Read more</a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {completedAnime.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-2xl font-semibold mb-4">Completed Anime</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {completedAnime.map((otaku) => (
                      <div key={otaku.jdlflm} className="flex items-start p-4 border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out">
                        <img src={otaku.img} alt={otaku.jdlflm} className="rounded-lg w-32 h-48 object-cover mr-4" />
                        <div>
                          <h2 className="text-xl font-bold">{otaku.jdlflm}</h2>
                          <a href={otaku.link} className="text-blue-500 hover:underline mt-2 inline-block">Read more</a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
          
          {searchQuery && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {otakuData.map((otaku) => (
                <div key={otaku.jdlflm} className="flex items-start p-4 border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out">
                  <img src={otaku.img} alt={otaku.jdlflm} className="rounded-lg w-32 h-48 object-cover mr-4" />
                  <div>
                    <h2 className="text-xl font-bold">{otaku.jdlflm}</h2>
                    <p className="text-sm text-gray-500">{otaku.genre}</p>
                    <a href={otaku.link} className="text-blue-500 hover:underline mt-2 inline-block">Read more</a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
