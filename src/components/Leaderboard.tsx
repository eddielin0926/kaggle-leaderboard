import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import histogram from "highcharts/modules/histogram-bellcurve";
import React from "react";

if (typeof Highcharts === "object") {
  histogram(Highcharts); // Execute the bell curve module
}

type LeaderboardProps = {
  scores: number[];
};

const Leaderboard: React.FC<LeaderboardProps> = ({ scores }) => {
  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={{
        title: { text: "Score Distribution" },
        legend: { enabled: false },
        xAxis: [
          {
            title: { text: "Score" },
          },
        ],
        yAxis: [
          {
            title: { text: "Entries" },
          },
        ],
        navigator: {
          enabled: true,
        },
        rangeSelector: {
          enabled: true,
        },
        tooltip: {
          headerFormat: "",
          pointFormat: "Score: {point.x}",
        },
        series: [
          {
            name: "score",
            type: "histogram",
            baseSeries: "score",
            zIndex: -1,
          },
          {
            id: "score",
            type: "scatter",
            data: scores,
            visible: false,
            turboThreshold: 0,
          },
        ],
      }}
    />
  );
};

export default Leaderboard;
