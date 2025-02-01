import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import style from "./Register.module.scss";
import { useState } from "react";
import { API_URL } from "../../../config";

const Register = () => {

    const [login, setLogin] = useState('');
    const [password, setPassword] = useState ('');
    const [phone, setPhone] = useState ('');
    const [avatar, setAvatar] =useState (null);

    const onHandler = e =>{
        e.preventDefault();

        const fd = new FormData();
        fd.append('login', login);
        fd.append('password', password);
        fd.append('phone', phone);
        fd.append('avatar', avatar);

        const option = {
            method: 'POST',
            body: fd,
        }
        fetch(`${API_URL}auth/register`, option )
    }
  return (
    <div className={style["form-container"]}>
      <Form onSubmit={onHandler}>
        <h1>Sign up</h1>
        <Form.Group controlId="formLogin" className={style.formGroup}>
          <Form.Label>LogIn</Form.Label>
          <Form.Control type="text" value={login} onChange={e => setLogin(e.target.value)} placeholder="Enter login" />
        </Form.Group>

        <Form.Group controlId="formPassword" className={style.formGroup}>
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
        </Form.Group>

        <Form.Group controlId="formPhone" className={style.formGroup}>
          <Form.Label>Phone number</Form.Label>
          <Form.Control type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone number" />
        </Form.Group>

        <Form.Group controlId="formAvatar" className={style.formGroup}>
          <Form.Label>Avatar</Form.Label>
          <Form.Control type="file" onChange={e => setAvatar(e.target.files[0])} />
        </Form.Group>

        <Button type="submit" className={style.button}>
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default Register;
