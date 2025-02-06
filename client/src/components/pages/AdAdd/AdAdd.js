import { useState } from "react";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createAd } from "../../../redux/postsRedux";
import style from "./AdAdd.module.scss";

const AdAdd = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState(null);
  const [status, setStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content || !price || !location || !image) {
      setStatus("clientError");
      setErrorMessage("Wszystkie pola muszą być wypełnione!");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("price", price);
    formData.append("location", location);
    formData.append("image", image);

    setStatus("loading");
    dispatch(createAd(formData));
    navigate("/");
  };

  return (
    <div className={style.adAddContainer}>
      <h1 className={style.adAddTitle}>Dodaj ogłoszenie</h1>

      {status === "clientError" && (
        <Alert variant="danger" className={style.alertMessage}>
          <Alert.Heading>Błąd!</Alert.Heading>
          <p>{errorMessage}</p>
        </Alert>
      )}

      {status === "serverError" && (
        <Alert variant="danger" className={style.alertMessage}>
          <Alert.Heading>Błąd serwera!</Alert.Heading>
          <p>{errorMessage}</p>
        </Alert>
      )}

      {status === "loading" && (
        <div className={style.loadingSpinner}>
          <Spinner animation="border" role="status" />
        </div>
      )}

      <Form onSubmit={handleSubmit}>
        <Form.Group className={style.formGroup}>
          <Form.Label>Tytuł</Form.Label>
          <Form.Control
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Wpisz tytuł"
          />
        </Form.Group>

        <Form.Group className={style.formGroup}>
          <Form.Label>Opis</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Dodaj opis"
          />
        </Form.Group>

        <Form.Group className={style.formGroup}>
          <Form.Label>Cena</Form.Label>
          <Form.Control
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Wpisz cenę"
          />
        </Form.Group>

        <Form.Group className={style.formGroup}>
          <Form.Label>Lokalizacja</Form.Label>
          <Form.Control
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Wpisz lokalizację"
          />
        </Form.Group>

        <Form.Group className={style.formGroup}>
          <Form.Label>Zdjęcie</Form.Label>
          <Form.Control
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </Form.Group>

        <Button
          className={style.submitButton}
          variant="primary"
          type="submit"
          disabled={status === "loading"}
        >
          Dodaj ogłoszenie
        </Button>
      </Form>
    </div>
  );
};

export default AdAdd;
