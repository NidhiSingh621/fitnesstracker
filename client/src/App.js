import React, { useState } from "react";
import { ThemeProvider } from "styled-components";
import { lightTheme } from "./utils/Theme";
import { BrowserRouter , Route, Routes } from "react-router-dom";
import styled from "styled-components";
import Authentication from "./pages/Authentication";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Workouts from "./pages/Workouts";
import { useSelector } from "react-redux";

// Define your styled Container component
const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text_primary};
  overflow-x: hidden;
  transition: all 0.2s ease;
`;

function App() {
  const {currentUser} = useSelector((state) => state.user)
  return (
    <ThemeProvider theme={lightTheme}>
      <BrowserRouter>
      {currentUser ? (
        <container>
          <Navbar currentUser={currentUser}/>
          <Routes>
            <Route path = "/" exact element={<Dashboard/>}/>
            <Route path = "/workouts" exact element={<Workouts/>}/>

          </Routes>
        </container>
      ):(
<Container>
          <Authentication /> {/* Use Authentication with capital A */}
        </Container>

      )}
      
       
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
