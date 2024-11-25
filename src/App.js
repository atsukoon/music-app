import spotify from './lib/spotify';
import SongList from './components/SongList';
import Player from './components/Player';
import { useEffect, useRef, useState } from 'react';
import SearchInput from './components/SearchInput';
import Pagination from './components/Pagination';

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [poplarSongs, setPoplarSongs] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedSong, setSelectedSong] = useState();
  const [keyword, setKeyword] = useState('');
  const [searchedSongs, setSearchedSongs] = useState();
  const [page, setPage] = useState(1);
  const [hasPrev, setHasPrev] = useState(false);
  const [hasNext, setHasNext] = useState(false);
  const existSearchedResult = searchedSongs != null;
  const limit = 20;
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

  const searchSongs = async (page) => {
    setIsLoading(true);
    const offset = parseInt(page) ? (parseInt(page) - 1) * limit : 0;
    const result = await spotify.searchSongs(keyword, limit, offset);

    setHasPrev(result.previous != null);
    setHasNext(result.next != null);
    setSearchedSongs(result.items);
    setIsLoading(false);
  };

  const handleInputChange = (e) => {
    setKeyword(e.target.value);
  };

  const handleSelectedSong = async (song) => {
    setSelectedSong(song);
    if (song.preview_url) {
      audioRef.current.src = song.preview_url;
      playSong();
    } else {
      pauseSong();
    }
  };

  const toPrevPage = async () => {
    const prevPage = page - 1;
    await searchSongs(prevPage);
    setPage(prevPage);
  };

  const toNextPage = async () => {
    const nextPage = page + 1;
    await searchSongs(nextPage);
    setPage(nextPage);
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
        <SearchInput onInputChange={handleInputChange} onSubmit={searchSongs} />
        <section>
          <h2 className="text-2xl font-semibold mb-5">
            {existSearchedResult ? 'Search Result' : 'Popular Songs in Japan'}
          </h2>
          <SongList
            isLoading={isLoading}
            songs={existSearchedResult ? searchedSongs : poplarSongs}
            onSelectedSong={handleSelectedSong}
          />
          {existSearchedResult && (
            <Pagination
              toPrev={hasPrev ? toPrevPage : null}
              toNext={hasNext ? toNextPage : null}
            />
          )}
        </section>
      </main>
      {selectedSong != null && (
        <Player
          song={selectedSong}
          isPlaying={isPlaying}
          onButtonClick={togglePlay}
        />
      )}
      <audio ref={audioRef} />
    </div>
  );
}
