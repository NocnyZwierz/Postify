import NavBar from "../NavBar/NavBar";
import { Form, FormControl, Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import style from "./Header.module.scss";

const Header = () => {
  const navigate = useNavigate();
  const [searchPhrase, setSearchPhrase] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchPhrase.trim()) {
      navigate(`/search/${searchPhrase}`);
    }
  };

  return (
    <>
      <NavBar />
      <Container className={style.headerContainer}>
        <Form className={style.searchForm} onSubmit={handleSearch}>
          <FormControl
            type="search"
            placeholder="Szukaj..."
            className={style.searchInput}
            value={searchPhrase}
            onChange={(e) => setSearchPhrase(e.target.value)}
          />
          <Button
            variant="outline-success"
            type="submit"
            className={style.searchButton}
          >
            Szukaj
          </Button>
        </Form>
      </Container>
    </>
  );
};

export default Header;
