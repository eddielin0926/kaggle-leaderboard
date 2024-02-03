import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import React from "react";

type LeaderboardProps = {
  scores: number[][]; // [score, count]
};

const Leaderboard: React.FC<LeaderboardProps> = ({ scores }) => {
  const total = scores.reduce((acc, [_, count]) => acc + count, 0); // Calculate total count

  const sortedScores = scores.sort((a, b) => a[0] - b[0]); // Sort scores

  const calculateCumulative = () => {
    let cumulativeCount = 0;
    const cumulative = [];
    for (const [score, count] of sortedScores) {
      cumulativeCount += count;
      cumulative.push([score, cumulativeCount]);
    }
    return cumulative;
  };

  const cumulative = calculateCumulative();

  const calculateRankPercentage = () => {
    // Calculate rank percentage for each data point
    const rankPercentages = cumulative.map(
      ([_, count]) => ((total - count) / total) * 100
    );

    return rankPercentages;
  };

  const rankPercentages = calculateRankPercentage();

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={{
        chart: { zoomType: "x" },
        title: { text: null },
        legend: { enabled: false },
        xAxis: [{ title: { text: "Score" }, crosshair: true }],
        yAxis: [{ title: { text: "Entries" } }],
        // dispaly rank percentage and score on hover
        tooltip: {
          formatter: function (
            this: Highcharts.TooltipFormatterContextObject
          ): string {
            const index = this.point.index;
            const xValue =
              typeof this.x === "number" ? this.x.toFixed(4) : this.x;
            const rankValue = rankPercentages[index].toFixed(2);
            return `Top ${rankValue}%<br>Score: ${xValue}`;
          },
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
            type: "column",
            data: sortedScores,
          },
          {
            name: "rank",
            type: "spline",
            data: cumulative,
            color: "red",
            // hide
            visible: false,
          },
        ],
      }}
    />
  );
};

export default Leaderboard;
