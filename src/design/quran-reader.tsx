/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from "react";
import {
  Book,
  ChevronDown,
  Info,
  LucideSettings,
  Menu,
  PauseCircle,
  PlayCircle,
  Settings,
  X,
} from "lucide-react";
import { cn } from "../lib/utils";
import { Button } from "../components/ui/button";
import { ScrollArea } from "../components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/sheet";
import { SettingDrawer } from "./drawer";
import { useAudioPlayer } from "../hooks/useAudioPlayer";
import { Slider } from "../components/ui/slider";
import { Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react";
import axios from "axios";

export default function QuranReader({
  surahs,
  currentSurah,
  translator,
  setCurrentSurah,
  surahData,
}: {
  surahs: any;
  currentSurah: any;
  translator: any;
  setCurrentSurah: any;
  surahData: any;
}) {
  const [showSidebar, setShowSidebar] = React.useState(true);
  const [audio, setAudio] = React.useState<any>(true);
  const [translation, setTranslation] = React.useState(false);
  const [transliteration, setTransliteration] = React.useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [volume, setVolume] = React.useState(1);
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const fetchFormatedAudio = async () => {
    try {
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `https://api.quran.com/api/v4/quran/recitations/2?fields=url,verse_key,duration,format,segments&chapter_number=${currentSurah.id}`,
        headers: {
          Accept: "application/json",
        },
      };

      const response = await axios(config);
      setAudio(response.data.audio_files);
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", () => setIsPlaying(false));

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", () => setIsPlaying(false));
    };
  }, []);

  const togglePlay = (index: number) => {
    setCurrentIndex(index);
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
    }
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const adjustVolume = (newVolume: any) => {
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      setVolume(newVolume);
    }
  };

  React.useEffect(() => {
    if (currentIndex >= 0) {
      if (audioRef.current) {
        audioRef.current.load();
        if (isPlaying) {
          audioRef.current.pause();
        } else {
          audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
      }
    }
  }, [currentIndex]);

  React.useEffect(() => {
    fetchFormatedAudio();
  }, []);

  return (
    <div className="relative flex h-screen bg-gray-950 text-gray-200 overflow-hidden">
      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] bg-gray-900 p-0">
          <SurahList
            setCurrentSurah={setCurrentSurah}
            surahs={surahs}
            currentSurah={currentSurah}
          />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden w-[300px] flex-col border-r border-gray-800 bg-gray-900 lg:flex",
          showSidebar ? "block" : "hidden"
        )}
      >
        <SurahList
          setCurrentSurah={setCurrentSurah}
          surahs={surahs}
          currentSurah={currentSurah}
        />
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto ">
        <header className="flex items-center justify-between border-b border-gray-800 px-4 py-3">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold">
              {currentSurah?.englishName}
            </h1>
            <span className="text-sm text-gray-400">Page 1</span>
          </div>
          <div className="flex items-center gap-2">
            <SettingDrawer
              translation={translation}
              setTranslation={setTranslation}
              transliteration={transliteration}
              setTransliteration={setTransliteration}
            />
            <Button variant="ghost" size="icon">
              <Book className="h-4 w-4" />
            </Button>
          </div>
        </header>
        <div className="p-6">
          <div className="mb-8 text-center">
            <h2 className="font-amiri mb-4 text-4xl font-bold">
              {currentSurah?.name_arabic}
            </h2>
            <div className="text-sm text-gray-400">
              Translation by {translator}
              <Button variant="link" className="px-1 text-sm text-gray-400">
                (Change)
              </Button>
            </div>
          </div>

          <div className="space-y-12">
            {surahData?.verses?.map((verse: any, index: number) => (
              <div
                key={index}
                className="group relative flex flex-col space-y-4 py-10"
              >
                <div className="absolute top-0 flex-col hidden gap-2 group-hover:flex">
                  <Button
                    onClick={() => togglePlay(index)}
                    variant="ghost"
                    size="icon"
                  >
                    {isPlaying && currentIndex === index ? (
                      <PauseCircle className="h-4 w-4" />
                    ) : (
                      <PlayCircle className="h-4 w-4" />
                    )}
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Info className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex flex-col justify-end items-end gap-4 px-32">
                  <div className="flex flex-row-reverse gap-4 leading-14 flex-wrap">
                    {verse.words.map((word: any) => (
                      <React.Fragment
                        key={`${verse.verse_key}:${word.position}`}
                      >
                        {word.char_type_name === "word" ? (
                          <div
                            id={`${verse.verse_key}:${word.position}`}
                            className="relative has-tooltip cursor-pointer"
                          >
                            {/* Word */}
                            <div className="flex flex-col gap-4">
                              <div
                                className={cn("font-amiri text-4xl text-white")}
                              >
                                {word.text_uthmani}{" "}
                              </div>
                              {translation && (
                                <div className="text-sm leading-relaxed text-gray-300">
                                  {word.translation?.text}
                                </div>
                              )}
                              {transliteration && (
                                <div className="text-sm leading-relaxed text-gray-300">
                                  {word.transliteration?.text}
                                </div>
                              )}
                            </div>

                            {/* Tooltip */}
                            <div className="tooltip flex flex-col w-30 rounded text-center shadow-lg p-1 bg-gray-100 text-black -mt-24">
                              <div className="text-sm leading-relaxed">
                                {word.translation.text}
                              </div>
                              <div>
                                {transliteration && (
                                  <div className="text-sm leading-relaxed">
                                    {word.transliteration?.text}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div
                            id={`${verse.verse_key}:${word.position}`}
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-800 text-sm text-white mt-1"
                          >
                            {word.text}
                          </div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <div className="text-lg leading-relaxed text-gray-300">
                      {verse.translations[0]?.text}
                    </div>
                  </div>
                </div>

                <div className="border-b border-b-gray-800"></div>
              </div>
            ))}
          </div>
        </div>
        <div className="fixed bottom-0 left-0 right-0 bg-gray-950 border-t border-border p-4 shadow-lg">
          <audio
            ref={audioRef}
            src={`https://verses.quran.com/${audio[currentIndex]?.url}`}
          />
          <div className=" mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => console.log("Previous track")}
              >
                <SkipBack className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => togglePlay(currentIndex)}
              >
                {isPlaying ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => console.log("Next track")}
              >
                <SkipForward className="h-6 w-6" />
              </Button>
            </div>
            <div className="flex-grow mx-4">
              <Slider
                value={[currentTime]}
                max={duration}
                step={1}
                onValueChange={(value) => seek(value[0])}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Volume2 className="h-5 w-5" />
              <Slider
                value={[volume]}
                max={1}
                step={0.01}
                onValueChange={(value) => adjustVolume(value[0])}
                className="w-24"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function SurahList({
  surahs,
  currentSurah,
  setCurrentSurah,
}: {
  surahs: any;
  currentSurah: any;
  setCurrentSurah: any;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-gray-800 p-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            Surah
          </Button>
          <Button variant="ghost" size="sm">
            Juz
          </Button>
          <Button variant="ghost" size="sm">
            Page
          </Button>
        </div>
        <Button variant="ghost" size="icon">
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex items-center gap-2 border-b border-gray-800 p-2">
        <div className="flex items-center gap-1 text-sm text-gray-400">
          <span>Tip: try navigating with</span>
          <kbd className="rounded bg-gray-800 px-1">ctrl</kbd>
          <kbd className="rounded bg-gray-800 px-1">K</kbd>
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-1 p-2">
          {surahs?.map((surah: any) => (
            <Button
              key={surah.id}
              variant="ghost"
              onClick={() => setCurrentSurah(surah)}
              className={cn(
                "w-full justify-start",
                currentSurah?.id === surah?.id && "bg-gray-800"
              )}
            >
              <div className="flex flex-row gap-2">
                {" "}
                <span className="mr-2 w-8 text-right">{surah?.id}</span>
                <span>{surah?.name_simple}</span>
              </div>

              <span>{surah?.englishName}</span>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
