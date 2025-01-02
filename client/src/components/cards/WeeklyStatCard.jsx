import React from "react";
import styled from "styled-components";
import { BarChart } from "@mui/x-charts/BarChart";

const Card = styled.div`
  flex: 1;
  min-width: 280px;
  padding: 24px;
  border: 1px solid ${({ theme }) => theme.text_primary + 20};
  border-radius: 14px;
  box-shadow: 1px 6px 20px 0px ${({ theme }) => theme.primary + 15};
  display: flex;
  flex-direction: column;
  gap: 6px;
  @media (max-width: 600px) {
    padding: 16px;
  }
`;
const Title = styled.div`
  font-weight: 600;
  font-size: 16px;
  color: ${({ theme }) => theme.primary};
  @media (max-width: 600px) {
    font-size: 14px;
  }
`;

const WeeklyStatCard = ({ data }) => {
  // Ensure data is available and format it correctly for the chart
  const chartData = data?.weeklyCaloriesBurned || [];

  const days = chartData.map((entry) => entry.day); // Extracting days
  const caloriesBurned = chartData.map((entry) => entry.calories); // Extracting calories burned for each day

  return (
    <Card>
      <Title>Weekly Calories Burned</Title>
      {chartData.length > 0 && (
        <BarChart
          xAxis={[{ scaleType: "band", data: days }]} // Set days as x-axis labels
          series={[{ data: caloriesBurned }]} // Set calories burned for each day in series
          height={300}
        />
      )}
    </Card>
  );
};

export default WeeklyStatCard;
