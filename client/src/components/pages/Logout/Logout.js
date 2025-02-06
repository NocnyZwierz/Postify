import { useEffect } from "react";
import { API_URL } from "../../../config";
import { logOut } from "../../../redux/userRedux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const option = {
      method: "DELETE",
      credentials: "include",
    };

    fetch(`${API_URL}auth/logout`, option)
      .then((res) => {
        if (res.ok) {
          dispatch(logOut());
          navigate(`/`);
        } else {
          console.error("Błąd podczas wylogowywania");
        }
      })
      .catch((err) => console.error("Błąd sieci:", err));
  }, [dispatch, navigate]);

  return null;
};

export default Logout;
