"use client";

import Leaderboard from "@/components/Leaderboard";
import LoadingIcon from "@/components/LoadingIcon";
import axios from "axios";
import JSZip from "jszip";
import Papa, { ParseResult } from "papaparse";
import { useEffect, useState } from "react";

type Record = {
  Rank: string;
  TeamId: string;
  TeamName: string;
  LastSubmissionDate: string;
  Score: string;
  SubmissionCount: string;
  TeamMemberUserNames: string;
};

export default function Home() {
  const [data, setData] = useState<number[][]>([]);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Generate an 2d array of bell curve data
    const mean = 0.5;
    const stdDev = 0.1;
    const numPoints = 100;
    const step = 1 / numPoints;
    const data: number[][] = [];
    for (let i = 0; i < 1; i += step) {
      data.push([i, 100 * Math.exp(-((i - mean) ** 2) / (2 * stdDev ** 2))]);
    }
    setData(data);
  }, []);

  const onClick = async () => {
    setLoading(true);

    axios
      .get(`https://cors-anywhere.herokuapp.com/${url}`, {
        responseType: "arraybuffer",
      })
      .then((res) => {
        JSZip.loadAsync(res.data)
          .then((zip) => {
            const filename = Object.keys(zip.files)[0];
            return zip.file(filename)?.async("string");
          })
          .then((text) => {
            if (!text) return;

            Papa.parse(text, {
              header: true,
              skipEmptyLines: true,
              complete: (result: ParseResult<Record>) => {
                setData(calcFrequency(result.data));
                setLoading(false);
              },
            });
          });
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const calcFrequency = (data: Record[]) => {
    const csvValues = data.map((d) => d.Score);

    // csvalues is string array of numbers. ex ["0.1", "0.2", "0.3", ...]
    // count the frequency of each score in bin of 0.0001
    const freq: any = {};
    csvValues.forEach((e) => {
      const key = Math.round((Number(e) + Number.EPSILON) * 10000) / 10000;
      freq[key] = (freq[key] || 0) + 1;
    });

    // convert the frequency object to 2d array
    const rst: number[][] = Object.entries(freq).map(([key, value]) => [
      Number(key),
      value as number,
    ]);

    return rst;
  };

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight md:text-5xl lg:text-6xl">
          Kaggle Leaderboard
        </h1>
        <br />
        <div className="container">
          <Leaderboard scores={data} />
        </div>
        <br />
        <input
          type="text"
          name="url"
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Copy and paste Kaggle leaderboard raw data URL"
          className="w-1/2 p-2 m-2 border-2 border-gray-200 rounded-md"
        />
        <div className="flex items-center">
          <button onClick={onClick} className="m-2">
            FETCH
          </button>
          {loading && <LoadingIcon />}
        </div>
      </main>
    </>
  );
}
