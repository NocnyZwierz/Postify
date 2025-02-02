import { Button, Form, Alert, Spinner } from "react-bootstrap";
import style from "./Login.module.scss";
import { useState } from "react";
import { API_URL } from "../../../config";
import { useDispatch } from "react-redux";
import { logIn } from "../../../redux/userRedux";

const Login = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState(null);
  const dispach = useDispatch();

  const onHandler = async (e) => {
    e.preventDefault();

    const option = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ login, password }),
    };

    setStatus("loading");
    try {
      const res = await fetch(`${API_URL}auth/login`, option);
      const data = await res.json();

      if (res.status === 200) {
        setStatus("success");
        dispach(logIn({login}))
        console.error("Login error:", data.message);
      } else if (res.status === 400) {
        setStatus("clientError");
      } else {
        setStatus("serverError");
      }
    } catch (error) {
      setStatus("serverError");
    }
  };
  return (
    <div className={style["form-container"]}>
      <Form onSubmit={onHandler}>
        <h1>Sign in</h1>

        {status === "success" && (
          <Alert variant="success">
            <Alert.Heading>Success!</Alert.Heading>
            <p>You have been successfully logged in!</p>
          </Alert>
        )}

        {status === "serverError" && (
          <Alert variant="danger">
            <Alert.Heading>Somthing went wrong..</Alert.Heading>
            <p>Unexpected error... Try again!</p>
          </Alert>
        )}

        {status === "clientError" && (
          <Alert variant="danger">
            <Alert.Heading>Incorrect data</Alert.Heading>
            <p>Login or password are incorrect</p>
          </Alert>
        )}

        {status === "loading" && (
          <div className="text-center">
            <Spinner animation="border" role="status" />
          </div>
        )}

        <Form.Group controlId="formLogin" className={style.formGroup}>
          <Form.Label>LogIn</Form.Label>
          <Form.Control
            type="text"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            placeholder="Enter login"
          />
        </Form.Group>

        <Form.Group controlId="formPassword" className={style.formGroup}>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
        </Form.Group>

        <Button type="submit" className={style.button}>
          LogIn
        </Button>
      </Form>
    </div>
  );
};

export default Login;
