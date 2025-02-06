import { Routes, Route, Navigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import Header from "./components/views/Header/Header";
import Footer from "./components/views/Footer/Footer";
import Home from "./components/pages/Home/Home";
import Ad from "./components/pages/Ad/Ad";
import AdAdd from "./components/pages/AdAdd/AdAdd";
import AdEdit from "./components/pages/AdEdit/AdEdit";
import Search from "./components/pages/Search/Search";
import Login from "./components/pages/Login/Login";
import Register from "./components/pages/Register/Register";
import NotFound from "./components/pages/NotFound/NotFound";
import Logout from "./components/pages/Logout/Logout";
import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { checkUser } from "./redux/userRedux";

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(checkUser());
  }, [dispatch]);

  return (
    <main>
      <Container>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ad/:id" element={<Ad />} />
          {user ? (
            <>
              <Route path="/ad/add" element={<AdAdd />} />
              <Route path="/ad/edit/:id" element={<AdEdit />} />
              <Route path="/logout" element={<Logout />} />
            </>
          ) : (
            <>
              <Route path="/ad/add" element={<Navigate to="/login" />} />
              <Route path="/ad/edit/:id" element={<Navigate to="/login" />} />
              <Route path="/logout" element={<Navigate to="/login" />} />
            </>
          )}
          <Route path="/search/:searchPhrase" element={<Search />} />
          {!user ? (
            <>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </>
          ) : (
            <>
              <Route path="/login" element={<Navigate to="/" />} />
              <Route path="/register" element={<Navigate to="/" />} />
            </>
          )}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </Container>
    </main>
  );
}

export default App;
