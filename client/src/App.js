import React, { useState,useEffect } from "react";
import { ThemeProvider } from "styled-components";
import { lightTheme } from "./utils/Theme";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import styled from "styled-components";
import Authentication from "./pages/Authentication";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Workouts from "./pages/Workouts";


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
  const [ currentUser,setcurrentuser ] = useState(null);

  // Dependency on currentUser to trigger effect

  return (
    <ThemeProvider theme={lightTheme}>
      <BrowserRouter>
        {currentUser ? (
          <Container>
            <Navbar currentUser={currentUser} setcurrentuser={setcurrentuser}/>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/workouts" element={<Workouts />} />
            </Routes>
          </Container>
        ) : (
          <Container>
            <Authentication setcurrentuser={setcurrentuser}/>
          </Container>
        )}
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
