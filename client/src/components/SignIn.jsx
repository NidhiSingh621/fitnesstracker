import React, { useState } from "react";
import styled from "styled-components";
import TextInput from "./TextInput";
import Button from "./Button";
import { UserSignIn } from "../api";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/reducers/userSlice";

const Container = styled.div`
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 36px;
`;

const Title = styled.div`
  font-size: 30px;
  font-weight: 800;
  color: ${({ theme }) => theme.text_primary};
`;

const Span = styled.div`
  font-size: 16px;
  font-weight: 400;
  color: ${({ theme }) => theme.text_secondary + 90};
`;

const SignIn = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Function to validate user input
  const validateInputs = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !password) {
      alert("Please fill in all fields");
      return false;
    }
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address");
      return false;
    }
    return true;
  };

  const handelSignIn = async () => {
    if (!validateInputs()) return;
  
    setLoading(true);
    setButtonDisabled(true);
  
    try {
      const res = await UserSignIn({ email, password });
  
     // Log full response for debugging
  
      // Check if the response contains both token and user data
      if (res && res.token && res.user) {
        const { token, user } = res;
  
        // Save token to localStorage for future use (if necessary)
        localStorage.setItem('token', token); // Store token in localStorage
        console.log("Token saved to localStorage");
  alert("login success");
        // Dispatch user data to Redux store
        dispatch(loginSuccess(user));
     
      } else {
        alert("No token or user data in response");
      }
    } catch (err) {
      console.log("Error:", err);  // Log error for debugging
      const errorMessage =
        err.response?.data?.message || err.message || "An unexpected error occurred";
      alert(errorMessage); // Show error message to the user
    } finally {
      setLoading(false);
      setButtonDisabled(false);
    }
  };
  


  return (
    <Container>
      <div>
        <Title>Welcome to Fittrack 👋</Title>
        <Span>Please login with your details here</Span>
      </div>
      <div
        style={{
          display: "flex",
          gap: "20px",
          flexDirection: "column",
        }}
      >
        <TextInput
          label="Email Address"
          placeholder="Enter your email address"
          value={email}
          handelChange={(e) => setEmail(e.target.value)}
        />
        <TextInput
          label="Password"
          placeholder="Enter your password"
          password
          value={password}
          handelChange={(e) => setPassword(e.target.value)}
        />
        <Button
          text="SignIn"
          onClick={handelSignIn}
          isLoading={loading}
          isDisabled={buttonDisabled}
        />
      </div>
    </Container>
  );
};

export default SignIn;
