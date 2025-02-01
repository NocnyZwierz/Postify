import { Navbar, Nav, Container } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import style from "./NavBar.module.scss";

const NavBar = () => {
  return (
    <Navbar expand="lg" className={style.nav}>
      <Container>
        <img src="/Logo.png" alt="Postify Logo" />
        <Navbar.Brand className={style.logo}>
          <button className={style.menuButton}>
            <span className="fa fa-bars"></span>
          </button>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link
              as={NavLink}
              to="/"
              className={({ isActive }) =>
                isActive ? style.linkActive : undefined
              }
            >
              Home
            </Nav.Link>
            <Nav.Link
              as={NavLink}
              className={({ isActive }) =>
                isActive ? style.linkActive : undefined
              }
            >
              LogOut
            </Nav.Link>
            <Nav.Link
              as={NavLink}
              to="/login"
              className={({ isActive }) =>
                isActive ? style.linkActive : undefined
              }
            >
              LogIn
            </Nav.Link>
            <Nav.Link
              as={NavLink}
              to="/register"
              className={({ isActive }) =>
                isActive ? style.linkActive : undefined
              }
            >
              Register
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
