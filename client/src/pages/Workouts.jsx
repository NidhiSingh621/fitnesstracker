import React, { useState, useEffect } from "react";
import styled from "styled-components";
import WorkoutCard from "../components/cards/WorkoutCard";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers";
import dayjs from "dayjs"; // Import dayjs
import { getWorkouts } from "../api";

const Container = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  justify-content: center;
  padding: 22px 0px;
  overflow-y: scroll;
`;

const Wrapper = styled.div`
  flex: 1;
  max-width: 1600px;
  display: flex;
  gap: 22px;
  padding: 0px 16px;
  @media (max-width: 600px) {
    gap: 12px;
    flex-direction: column;
  }
`;

const Left = styled.div`
  flex: 0.2;
  height: fit-content;
  padding: 18px;
  border: 1px solid ${({ theme }) => theme.text_primary + 20};
  border-radius: 14px;
  box-shadow: 1px 6px 20px 0px ${({ theme }) => theme.primary + 15};
`;

const Title = styled.div`
  font-weight: 600;
  font-size: 16px;
  color: ${({ theme }) => theme.primary};
  @media (max-width: 600px) {
    font-size: 14px;
  }
`;

const Right = styled.div`
  flex: 1;
`;

const CardWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  margin-bottom: 100px;
  @media (max-width: 600px) {
    gap: 12px;
  }
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0px 16px;
  gap: 22px;
  padding: 0px 16px;
  @media (max-width: 600px) {
    gap: 12px;
  }
`;

const SecTitle = styled.div`
  font-size: 22px;
  color: ${({ theme }) => theme.text_primary};
  font-weight: 500;
`;

const Workouts = () => {
  const [todaysWorkouts, setTodaysWorkouts] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs()); // Use Dayjs for date handling
  const [loading, setLoading] = useState(false);

  const getTodaysWorkout = async (date) => {
    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const res = await getWorkouts(token, date);
      setTodaysWorkouts(res.todaysWorkouts || []);
      console.log("Workouts for", date, ":", res.todaysWorkouts);
    } catch (error) {
      console.error("Error fetching workouts for", date, ":", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const dateString = selectedDate.format("YYYY-MM-DD"); // Format Dayjs object as YYYY-MM-DD
    getTodaysWorkout(dateString);
  }, [selectedDate]);

  return (
    <Container>
      <Wrapper>
        <Left>
          <Title>Select Date</Title>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar
              value={selectedDate}
              onChange={(newValue) => setSelectedDate(newValue)}
            />
          </LocalizationProvider>
        </Left>
        <Right>
          <Section>
            <SecTitle>Todays Workouts</SecTitle>
            <CardWrapper>
              {Array.isArray(todaysWorkouts) &&
                todaysWorkouts.map((workout, index) => (
                  <WorkoutCard key={index} workout={workout} />
                ))}
            </CardWrapper>
          </Section>
        </Right>
      </Wrapper>
    </Container>
  );
};

export default Workouts;
