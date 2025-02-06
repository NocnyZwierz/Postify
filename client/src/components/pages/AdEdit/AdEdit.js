import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSingleAd, updateAd } from "../../../redux/postsRedux";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Button, Spinner, Alert } from "react-bootstrap";
import { IMGS_URL } from "../../../config";
import style from "./AdEdit.module.scss";

const AdEdit = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const ad = useSelector((state) => state.ads.find((a) => a._id === id));
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState(null);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (!ad) {
      dispatch(fetchSingleAd(id));
    } else {
      setTitle(ad.title);
      setContent(ad.content);
      setPrice(ad.price);
      setLocation(ad.location);
    }
  }, [dispatch, id, ad]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("price", price);
    formData.append("location", location);
    if (image) formData.append("image", image);

    try {
      await dispatch(updateAd(id, formData));
      setStatus("success");
      navigate(`/ad/${id}`);
    } catch (error) {
      setStatus("error");
    }
  };

  if (!ad)
    return (
      <Spinner animation="border" role="status" className={style.spinner} />
    );

  return (
    <div className={style.formContainer}>
      <h1 className={style.title}>Edytuj ogłoszenie</h1>

      {status === "error" && (
        <Alert variant="danger" className={style.alert}>
          Wystąpił błąd!
        </Alert>
      )}
      {status === "success" && (
        <Alert variant="success" className={style.alert}>
          Ogłoszenie zaktualizowane!
        </Alert>
      )}

      <Form onSubmit={handleSubmit} className={style.form}>
        <Form.Group className={style.formGroup}>
          <Form.Label>Tytuł</Form.Label>
          <Form.Control
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Form.Group>

        <Form.Group className={style.formGroup}>
          <Form.Label>Opis</Form.Label>
          <Form.Control
            as="textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </Form.Group>

        <Form.Group className={style.formGroup}>
          <Form.Label>Cena</Form.Label>
          <Form.Control
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </Form.Group>

        <Form.Group className={style.formGroup}>
          <Form.Label>Lokalizacja</Form.Label>
          <Form.Control
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </Form.Group>

        <Form.Group className={style.formGroup}>
          <Form.Label>Zdjęcie</Form.Label>
          <Form.Control
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
          />
          {ad.image && (
            <img
              src={IMGS_URL + ad.image}
              alt="Ogłoszenie"
              className={style.imagePreview}
            />
          )}
        </Form.Group>

        <Button type="submit" variant="primary" className={style.submitButton}>
          Zapisz zmiany
        </Button>
      </Form>
    </div>
  );
};

export default AdEdit;
