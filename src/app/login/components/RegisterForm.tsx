
import styles from './login-form.module.css';

export default function RegisterForm() {
  return (
    <form className={styles.form}>
      <h2>Kayıt Ol</h2>
      <input type="text" placeholder="Ad Soyad" required />
      <input type="email" placeholder="E-posta" required />
      <input type="password" placeholder="Şifre" required />
      <button type="submit">Kayıt Ol</button>
    </form>
  );
}