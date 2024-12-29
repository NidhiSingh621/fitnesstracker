import React, { useState } from "react";
import styled from "styled-components";
import LogoImg from "../utils/Images/Logo.png";
import { Link as LinkR, NavLink } from "react-router-dom";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { Avatar } from "@mui/material";
import {useDispatch} from "react-redux";
import { logout } from "../redux/reducers/userSlice";

const Nav = styled.div`
  background-color: ${({ theme }) => theme.bg || "#fff"};
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: sticky;
  top: 0;
  z-index: 10;
  border-bottom: 1px solid ${({ theme }) => theme.text_secondary + 20 || "#ddd"};
`;

const NavContainer = styled.div`
  width: 100%;
  max-width: 1400px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const NavLogo = styled(LinkR)`
  display: flex;
  align-items: center;
  gap: 16px;
  font-weight: 600;
  font-size: 18px;
  text-decoration: none;
  color: ${({ theme }) => theme.black || "#000"};
`;

const Logo = styled.img`
  height: 42px;
`;

const MobileIcon = styled.div`
  display: none;
  align-items: center;
  color: ${({ theme }) => theme.text_primary || "#000"};
  font-size: 28px;
  cursor: pointer;

  @media screen and (max-width: 768px) {
    display: flex;
  }
`;

const MobileMenu = styled.div`
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.bg || "#fff"};
  z-index: 1000;
  padding: 40px;
  gap: 24px;
  transform: ${({ isOpen }) => (isOpen ? "translateX(0)" : "translateX(-100%)")};
  transition: all 0.3s ease-in-out;

  @media screen and (min-width: 769px) {
    display: none;
  }
`;

const MobileMenuClose = styled.div`
  align-self: flex-end;
  font-size: 28px;
  cursor: pointer;
`;

const MobileNavLink = styled(NavLink)`
  text-decoration: none;
  font-size: 20px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_primary || "#000"};
  transition: color 0.3s ease;

  &:hover {
    color: ${({ theme }) => theme.primary};
  }

  &.active {
    color: ${({ theme }) => theme.primary};
  }
`;

const NavItems = styled.ul`
  display: flex;
  align-items: center;
  gap: 32px;
  list-style: none;

  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const Navlink = styled(NavLink)`
  text-decoration: none;
  color: ${({ theme }) => theme.text_primary};
  font-weight: 500;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.primary};
  }

  &.active {
    color: ${({ theme }) => theme.primary};
    border-bottom: 2px solid ${({ theme }) => theme.primary};
  }
`;

const UserContainer = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  color: ${({ theme }) => theme.primary};
`;

const TextButton = styled.div`
  color: ${({ theme }) => theme.secondary};
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;

  &:hover {
    color: ${({ theme }) => theme.primary};
  }
`;

const Navbar = ({currentUser}) => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <Nav>
      <NavContainer>
        <MobileIcon onClick={toggleMenu}>
          <MenuRoundedIcon />
        </MobileIcon>
        <NavLogo to="/">
          <Logo src={LogoImg} />
          Fittrack
        </NavLogo>
        <MobileMenu isOpen={isOpen}>
          <MobileMenuClose onClick={closeMenu}>
            <CloseRoundedIcon />
          </MobileMenuClose>
          <MobileNavLink to="/" onClick={closeMenu}>
            Dashboard
          </MobileNavLink>
          <MobileNavLink to="/workouts" onClick={closeMenu}>
            Workouts
          </MobileNavLink>
          <MobileNavLink to="/tutorials" onClick={closeMenu}>
            Tutorials
          </MobileNavLink>
          <MobileNavLink to="/blogs" onClick={closeMenu}>
            Blogs
          </MobileNavLink>
          <MobileNavLink to="/contact" onClick={closeMenu}>
            Contact
          </MobileNavLink>
        </MobileMenu>
        <NavItems>
          <Navlink to="/">Dashboard</Navlink>
          <Navlink to="/workouts">Workouts</Navlink>
          <Navlink to="/tutorials">Tutorials</Navlink>
          <Navlink to="/blogs">Blogs</Navlink>
          <Navlink to="/contact">Contact</Navlink>
        </NavItems>
        <UserContainer>
        <Avatar src={currentUser?.img}>{currentUser?.name[0]}</Avatar>
          <TextButton onClick={() => dispatch(logout())}>Logout</TextButton>
        </UserContainer>
      </NavContainer>
    </Nav>
  );
};

export default Navbar;
