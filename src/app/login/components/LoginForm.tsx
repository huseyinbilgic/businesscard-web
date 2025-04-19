import styles from "./login-form.module.css";

export default function LoginForm() {
  return (
    <form className={styles.form}>
      <h2>Giriş Yap</h2>
      <input type="email" placeholder="E-posta" required />
      <input type="password" placeholder="Şifre" required />
      <button type="submit">Giriş Yap</button>
    </form>
  );
}
