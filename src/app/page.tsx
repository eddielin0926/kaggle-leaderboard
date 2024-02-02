"use client";

import Leaderboard from "@/components/Leaderboard";
import Papa, { ParseResult } from "papaparse";
import React, { useState } from "react";

type Record = {
  Rank: number;
  TeamId: number;
  TeamName: string;
  LastSubmissionDate: string;
  Score: number;
  SubmissionCount: number;
  TeamMemberUserNames: string;
};

export default function Home() {
  const [data, setData] = useState<number[]>([]);

  const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    Papa.parse(event.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: (result: ParseResult<Record>) => {
        const csvValues: number[] = [];

        result.data.map((d) => {
          csvValues.push(Number(d.Score));
        });

        setData(csvValues);
      },
    });
  };

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center p-36">
        <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight md:text-5xl lg:text-6xl">
          Kaggle Scoreboard
        </h1>
        <br />
        <div className="w-full">
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
