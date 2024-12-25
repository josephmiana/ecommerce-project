// src/Components/NavbarStyled.js
import styled from 'styled-components';
import { Link } from 'react-router-dom';

// Styled components for Navbar
export const Nav = styled.nav`
  background-color: #f8f9fa;
  padding: 0.5rem 1rem;
`;

export const Container = styled.div`
  max-width: 1140px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const NavbarBrand = styled(Link)`
  font-size: 1.5rem;
  font-weight: bold;
  text-decoration: none;
  color: #000;
`;

export const NavList = styled.ul`
  list-style: none;
  display: flex;
  margin: 0;
  padding: 0;
`;

export const NavItem = styled.li`
  margin-left: 1rem;
`;

export const NavLink = styled(Link)`
  text-decoration: none;
  color: #000;
  font-size: 1rem;
  padding: 0.5rem;
  &:hover {
    color: #007bff;
  }
`;

export const Dropdown = styled.div`
  position: relative;
`;

export const DropdownButton = styled.button`
  background-color: #6c757d;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 1rem;
  &:hover {
    background-color: #5a6268;
  }
`;

export const DropdownMenu = styled.ul`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: #ffffff;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  list-style: none;
  margin: 0;
  padding: 0.5rem 0;
  display: ${props => (props.isOpen ? 'block' : 'none')};
`;

export const DropdownItem = styled.li`
  padding: 0.5rem 1rem;
  &:hover {
    background-color: #f8f9fa;
  }
`;

export const NavbarToggler = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  display: none;

  @media (max-width: 991px) {
    display: block;
  }
`;
