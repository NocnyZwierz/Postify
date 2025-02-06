import style from "./Footer.module.scss";

const Footer = () => {
  return (
    <footer className={style.footer}>
      <p className={style.footerText}>
        © {new Date().getFullYear()} Wszystkie prawa zastrzeżone.
      </p>
    </footer>
  );
};

export default Footer;
