import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import React from "react";

// if (typeof Highcharts === "object") {
//   histogram(Highcharts); // Execute the bell curve module
// }

type LeaderboardProps = {
  scores: number[][]; // [score, count]
};

const Leaderboard: React.FC<LeaderboardProps> = ({ scores }) => {
  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={{
        chart: { type: "column", zoomType: "x" },
        title: { text: null },
        legend: { enabled: false },
        xAxis: [{ title: { text: "Score" } }],
        yAxis: [{ title: { text: "Entries" } }],
        tooltip: {
          headerFormat: null,
          pointFormat: "Score: {point.x}",
        },
        plotOptions: {
          column: {
            pointPadding: 0.2,
            borderWidth: 0,
            groupPadding: 0,
            shadow: false,
          },
        },
        series: [
          {
            name: "score",
            data: scores,
          },
        ],
      }}
    />
  );
};

export default Leaderboard;
