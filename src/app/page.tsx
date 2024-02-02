"use client";

import Leaderboard from "@/components/Leaderboard";
import Papa, { ParseResult } from "papaparse";
import React, { useEffect, useState } from "react";

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

  const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    Papa.parse(event.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: (result: ParseResult<Record>) => {
        const csvValues: string[] = [];

        result.data.map((d) => {
          csvValues.push(d.Score);
        });

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

        setData(rst);
      },
    });
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
          type="file"
          name="file"
          accept=".csv"
          onChange={handleFile}
          style={{ display: "block", margin: "10px auto" }}
        />
      </main>
    </>
  );
}
