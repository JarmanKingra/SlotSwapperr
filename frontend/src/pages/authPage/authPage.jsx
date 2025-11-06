import { useState, useContext } from "react";
import { AuthContext } from "../../context/authContext.jsx";
import styles from "./authPage.module.css";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { handleLogin, handleSignUp } = useContext(AuthContext);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await handleLogin(email, password);
      } else {
        await handleSignUp(name, email, password);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>
          {isLogin ? "Welcome Back 👋" : "Create an Account 🚀"}
        </h2>

        <form onSubmit={onSubmit} className={styles.form}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              className={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}

          <input
            type="email"
            placeholder="Email"
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className={styles.button}
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <p className={styles.toggleText}>
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span
            className={styles.toggleLink}
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Sign Up" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
