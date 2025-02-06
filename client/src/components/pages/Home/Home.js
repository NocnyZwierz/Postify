import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAds } from "../../../redux/postsRedux";
import { Card, Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { IMGS_URL } from "../../../config";
import style from "./Home.module.scss";

const Home = () => {
  const dispatch = useDispatch();
  const ads = useSelector((state) => state.ads);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchAds());
  }, [dispatch]);

  return (
    <Container className={style.homeContainer}>
      <h1 className={style.heading}>Najlepsze ogłoszenia w sieci!</h1>

      <div className={style.adsGrid}>
        {ads.map((ad) => (
          <Card className={style.adCard} key={ad._id}>
            <Card.Img
              variant="top"
              src={IMGS_URL + ad.image}
              className={style.adImage}
            />
            <Card.Body className={style.cardBody}>
              <Card.Title className={style.adTitle}>{ad.title}</Card.Title>
              <Card.Text className={style.adLocation}>{ad.location}</Card.Text>
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

export default Home;
