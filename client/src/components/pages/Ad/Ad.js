import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSingleAd, removeAd } from "../../../redux/postsRedux";
import { useParams } from "react-router-dom";
import { Card, Button } from "react-bootstrap";
import { IMGS_URL } from "../../../config";
import { useNavigate } from "react-router-dom";
import style from "./Ad.module.scss";

const Ad = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const ad = useSelector((state) => state.ads.find((a) => a._id === id));
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    if (!ad) {
      dispatch(fetchSingleAd(id));
    }
  }, [dispatch, id, ad]);

  const handleDelete = async () => {
    if (window.confirm("Czy na pewno chcesz usunąć to ogłoszenie?")) {
      await dispatch(removeAd(id));
      navigate("/");
    }
  };

  if (!ad) return <p className={style.loading}>Ładowanie...</p>;

  return (
    <Card className={style.adCard}>
      <Card.Img
        variant="top"
        src={IMGS_URL + ad.image}
        className={style.adImage}
      />
      <Card.Body>
        <Card.Title className={style.adTitle}>{ad.title}</Card.Title>
        <Card.Text className={style.adText}>
          <strong>Lokalizacja:</strong> {ad.location}
        </Card.Text>
        <Card.Text className={style.adText}>
          <strong>Cena:</strong> {ad.price} zł
        </Card.Text>
        <Card.Text className={style.adDescription}>{ad.content}</Card.Text>
        <Card.Text className={style.adText}>
          <strong>Data publikacji:</strong> {ad.publishDate}
        </Card.Text>

        <Card className={style.sellerCard}>
          <Card.Title className={style.sellerTitle}>Sprzedający:</Card.Title>
          <div className={style.sellerInfo}>
            <img
              src={IMGS_URL + ad.seller.avatar}
              alt="User Avatar"
              className={style.sellerAvatar}
            />
            <div>
              <p className={style.sellerDetail}>
                <strong>Nick:</strong> {ad.seller.login}
              </p>
              <p className={style.sellerDetail}>
                <strong>Telefon:</strong> {ad.seller.phoneNumber}
              </p>
            </div>
          </div>
        </Card>
        {user && ad.seller && user.id === ad.seller?._id && (
          <>
            <Button
              variant="primary"
              className={style.editButton}
              onClick={() => navigate(`/ad/edit/${ad._id}`)}
            >
              Edit
            </Button>
            <Button
              variant="danger"
              className={`${style.deleteButton} ms-2`}
              onClick={handleDelete}
            >
              Delete
            </Button>
          </>
        )}
      </Card.Body>
    </Card>
  );
};

export default Ad;
