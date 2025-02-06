import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchAds } from "../../../redux/postsRedux";
import { useParams } from "react-router-dom";
import { Card, Container, Button } from "react-bootstrap";
import { IMGS_URL } from "../../../config";
import { useNavigate } from "react-router-dom";
import style from "./Shearch.module.scss";

const Shearch = () => {
  const { searchPhrase } = useParams();
  const dispatch = useDispatch();
  const ads = useSelector((state) => state.ads);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(searchAds(searchPhrase));
  }, [dispatch, searchPhrase]);

  return (
    <Container className={style.searchContainer}>
      <h1 className={style.heading}>
        Wyniki wyszukiwania dla: "{searchPhrase}"
      </h1>
      {ads.length === 0 && (
        <p className={style.noResults}>Brak wyników dla podanej frazy.</p>
      )}

      <div className={style.searchResults}>
        {ads.map((ad) => (
          <Card key={ad._id} className={style.card}>
            {ad.image && (
              <Card.Img
                variant="top"
                src={IMGS_URL + ad.image}
                className={style.cardImage}
              />
            )}
            <Card.Body className={style.cardBody}>
              <Card.Title className={style.cardTitle}>{ad.title}</Card.Title>
              <Card.Text className={style.cardText}>{ad.content}</Card.Text>
              <Card.Text className={style.price}>Cena: {ad.price} zł</Card.Text>
              <Button
                variant="primary"
                className={style.moreInfoButton}
                onClick={() => navigate(`/ad/${ad._id}`)}
              >
                More info
              </Button>
            </Card.Body>
          </Card>
        ))}
      </div>
    </Container>
  );
};

export default Shearch;
