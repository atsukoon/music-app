import spotify from './lib/spotify';
import SongList from './components/SongList';
import Player from './components/Player';
import { useEffect, useRef, useState } from 'react';

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [poplarSongs, setPoplarSongs] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedSong, setSelectedSong] = useState();
  const audioRef = useRef();

  useEffect(() => {
    fetchPoplarSongs();
  }, []);

  const fetchPoplarSongs = async () => {
    setIsLoading(true);
    const result = await spotify.getPopularSongs();
    const songs = result.items.map((item) => {
      return item.track;
    });
    setPoplarSongs(songs);
    setIsLoading(false);
  };

  const handleSelectedSong = async (song) => {
    setSelectedSong(song);
    if (song.preview_url) {
      audioRef.current.src = song.preview_url;
      playSong();
    }else {
      pauseSong();
    }
  };

  const playSong = () => {
    audioRef.current.play();
    setIsPlaying(true);
  };

  const pauseSong = () => {
    audioRef.current.pause();
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (isPlaying) {
      pauseSong();
    } else {
      playSong();
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <main className="flex-1 p-8 mb-20">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold">Music App</h1>
        </header>
        <section>
          <h2 className="text-2xl font-semibold mb-5">Popular Songs</h2>
          <SongList
            isLoading={isLoading}
            songs={poplarSongs}
            onSelectedSong={handleSelectedSong}
          />
        </section>
      </main>
      {selectedSong != null && (
        <Player song={selectedSong} isPlaying={isPlaying} onButtonClick={togglePlay} />
      )}
      <audio ref={audioRef} />
    </div>
  );
}
