import { Button, Form, Alert, Spinner } from "react-bootstrap";
import style from "./Register.module.scss";
import { useState } from "react";
import { API_URL } from "../../../config";

const Register = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [status, setStatus] = useState(null);

  const onHandler = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("login", login);
    fd.append("password", password);
    fd.append("phoneNumber", phone);
    fd.append("avatar", avatar);

    const option = {
      method: "POST",
      body: fd,
    };
    setStatus("loading");
    try {
      const res = await fetch(`${API_URL}auth/register`, option);

      if (res.status === 201) {
        setStatus("success");
      } else if (res.status === 400) {
        setStatus("clientError");
      } else if (res.status === 409) {
        setStatus("loginError");
      } else {
        setStatus("serverError");
      }
    } catch (error) {
      setStatus("serverError");
    }
  };

  return (
    <div className={style.form_container}>
      <Form onSubmit={onHandler}>
        <h1>Sign up</h1>

        {status === "success" && (
          <Alert variant="success">
            <Alert.Heading>Success!</Alert.Heading>
            <p>You have been successfully registered!</p>
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
            <Alert.Heading>No enough data</Alert.Heading>
            <p>You have to fill all the fields.</p>
          </Alert>
        )}

        {status === "loginError" && (
          <Alert variant="warning">
            <Alert.Heading>Login already in use</Alert.Heading>
            <p>You have to use other login</p>
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

        <Form.Group controlId="formPhone" className={style.formGroup}>
          <Form.Label>Phone number</Form.Label>
          <Form.Control
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone number"
          />
        </Form.Group>

        <Form.Group controlId="formAvatar" className={style.formGroup}>
          <Form.Label>Avatar</Form.Label>
          <Form.Control
            type="file"
            onChange={(e) => setAvatar(e.target.files[0])}
          />
        </Form.Group>

        <Button type="submit" className={style.button}>
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default Register;
