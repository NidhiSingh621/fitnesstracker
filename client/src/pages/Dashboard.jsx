import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { counts } from "../utils/data";
import CountsCard from "../components/cards/CountsCard";
import WeeklyStatCard from "../components/cards/WeeklyStatCard";
import CategoryChart from "../components/cards/CategoryChart";
import AddWorkout from "../components/AddWorkout";
import WorkoutCard from "../components/cards/WorkoutCard";
import { addWorkout, getDashboardDetails, getWorkouts } from "../api";

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
  max-width: 1400px;
  display: flex;
  flex-direction: column;
  gap: 22px;
  @media (max-width: 600px) {
    gap: 12px;
  }
`;

const Title = styled.div`
  padding: 0px 16px;
  font-size: 22px;
  color: ${({ theme }) => theme.text_primary};
  font-weight: 500;
`;

const FlexWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 22px;
  padding: 0px 16px;
  @media (max-width: 600px) {
    gap: 12px;
  }
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0px 16px;
  gap: 22px;
  @media (max-width: 600px) {
    gap: 12px;
  }
`;
const Heading = styled.div`
  display: flex;
  flex-direction: row;
  justify-content:space-between;
  padding: 0px 16px;
  gap: 22px;
  @media (max-width: 600px) {
    gap: 12px;
  }
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



const RefreshButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [todaysWorkouts, setTodaysWorkouts] = useState([]);
  const [workout, setWorkout] = useState(`#Legs
-Back Squat
-5 setsX15 reps
-30 kg
-10 min`);

 const dashboardData = async () => {
  setLoading(true);
  const token = localStorage.getItem("token");
  try {
    const res = await getDashboardDetails(token);
    // Log the fetched data to console
   // alert(`Total Calories Burnt Today: ${res.totalCaloriesBurnt}\nTotal Workouts: ${res.totalWorkouts}\nAverage Calories Burnt per Workout: ${res.avgCaloriesBurntPerWorkout}`);
    setData(res);
  } catch (error) {
    console.error("Error fetching dashboard details:", error);
    alert("Error fetching dashboard details: " + error.message);  // Alert on error
  } finally {
    setLoading(false);
  }
};


const getTodaysWorkout = async () => {
  setLoading(true);

  // Get the token from localStorage
  const token = localStorage.getItem("token");

  // Get today's date in local time
  const today = new Date();
  
  // Format the date as YYYY-MM-DD
  const dateString = today.toISOString().split('T')[0];  // Ensure it's in the correct date format
  
  // If you need to adjust for timezone (if required by your backend), you can do so here
  const localDateString = today.toLocaleDateString("en-CA");  // This will give YYYY-MM-DD format, adjusted for the local time zone.
  
   // Check if this date is correct based on your local timezone.
  
  try {
    // Pass the token and the formatted date to getWorkouts
    const res = await getWorkouts(token, localDateString);

    // Assuming the response structure includes 'todaysWorkouts'
    setTodaysWorkouts(res.todaysWorkouts || []);
    console.log("Today's Workouts:", res.todaysWorkouts);
  } catch (error) {
    console.error("Error fetching today's workouts:", error);
  } finally {
    setLoading(false);
  }
};


  const addNewWorkout = async () => {
    setButtonLoading(true);
    const token = localStorage.getItem("token");
  
    try {
      await addWorkout(token, { workoutString: workout });
      dashboardData();
      getTodaysWorkout();
    } catch (error) {
      const errorMessage = error.message || "An unknown error occurred"; // Get the error message
      alert(`${errorMessage}`); // Display the error message after the initial text
    } finally {
      setButtonLoading(false);
    }
  };
  

  const refreshTodaysWorkout = () => {
    // Refresh workouts by calling getTodaysWorkout again
    getTodaysWorkout();
  };

  useEffect(() => {
    dashboardData();
    getTodaysWorkout();
  }, []);

  return (
    <Container>
      <Wrapper>
        <Title>Dashboard</Title>
        <FlexWrap>
          {Array.isArray(counts) && counts.map((item, index) => (
            <CountsCard key={index} item={item} data={data} />
          ))}
        </FlexWrap>

        <FlexWrap>
          <WeeklyStatCard data={data} />
          <CategoryChart data={data} />
          <AddWorkout
            workout={workout}
            setWorkout={setWorkout}
            addNewWorkout={addNewWorkout}
            buttonLoading={buttonLoading}
          />
        </FlexWrap>

        <Section>
          <Heading>
          <Title>Todays Workouts</Title>
        
            <RefreshButton onClick={refreshTodaysWorkout} disabled={loading}>
              {loading ? "Refreshing..." : "Refresh Today's Workouts"}
            </RefreshButton>
          
          </Heading>
          <CardWrapper>
            {Array.isArray(todaysWorkouts) && todaysWorkouts.map((workout, index) => (
              <WorkoutCard key={index} workout={workout} />
            ))}
          </CardWrapper>
        </Section>
      </Wrapper>
    </Container>
  );
};

export default Dashboard;
