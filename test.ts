import axios from "axios";
import JSZip from "jszip";
import Papa, { ParseResult } from "papaparse";

type Record = {
  Rank: string;
  TeamId: string;
  TeamName: string;
  LastSubmissionDate: string;
  Score: string;
  SubmissionCount: string;
  TeamMemberUserNames: string;
};

axios({
  url: "https://www.kaggle.com/competitions/3136/leaderboard/download/public",
  method: "GET",
  responseType: "arraybuffer",
}).then((res) => {
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
          const csvValues: string[] = [];

          result.data.map((d) => {
            csvValues.push(d.Score);
          });

          // csvalues is string array of numbers. ex ["0.1", "0.2", "0.3", ...]
          // count the frequency of each score in bin of 0.0001
          const freq: any = {};
          csvValues.forEach((e) => {
            const key =
              Math.round((Number(e) + Number.EPSILON) * 10000) / 10000;
            freq[key] = (freq[key] || 0) + 1;
          });

          // convert the frequency object to 2d array
          const rst: number[][] = Object.entries(freq).map(([key, value]) => [
            Number(key),
            value as number,
          ]);

          console.log(rst);
        },
      });
    });
});
