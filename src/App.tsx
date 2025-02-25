/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prefer-const */
import React, { useEffect, useState } from "react";
import axios from "axios";
import QuranReader from "./design/quran-reader";
import "@fontsource/amiri/400.css";
import "@fontsource/dm-sans/400.css";
import "@fontsource/dm-sans/700.css";

export default function App() {
  const [surahs, setSurahs] = useState<any>(null);
  const [data, setData] = useState(null);
  const [currentSurah, setCurrentSurah] = useState<{
    id: number;
    verses_count: number;
  }>({
    id: 1,
    verses_count: 7,
  });

  const fetchSurah = async () => {
    try {
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: "https://api.quran.com/api/v4/chapters",
        headers: {
          Accept: "application/json",
        },
      };

      const response = await axios(config);
      console.log(response);
      setSurahs(response.data.chapters);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchData = async () => {
    try {
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `https://api.quran.com/api/v4/verses/by_chapter/${currentSurah?.id}:${currentSurah?.verses_count}?translations=84&tafsirs=166&fields=text_uthmani,text_uthmani_simple,text_imlaei,text_indopak,text_uthmani_tajweed&words=true&word_fields=textUthmaniHafs,textUthmani,textImlaeiSimple,text_indopak
`,
        headers: {
          Accept: "application/json",
        },
      };
      const response = await axios(config);
      console.log(response);
      setData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSurah();
  }, []);

  useEffect(() => {
    fetchData();
  }, [currentSurah]);

  return (
    <div className="bg-black">
      {surahs?.length && (
        <QuranReader
          surahData={data}
          surahs={surahs}
          setCurrentSurah={setCurrentSurah}
          currentSurah={surahs[currentSurah?.id - 1]}
          translator="Dr. Mustafa Khattab, The Clear Quran"
        />
      )}
    </div>
  );
}
