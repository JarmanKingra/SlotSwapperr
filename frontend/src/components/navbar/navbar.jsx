import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./navbar.module.css";
import { AuthContext } from "../../context/authContext";

const Navbar = () => {
  const { isLoggedIn, handleLogout } = useContext(AuthContext);
  const navigate = useNavigate();

  const logoutUser = () => {
    handleLogout();
    navigate("/auth");
  };

  return (
    
    <nav className={styles.navbar}>
      <div className={styles.logo} onClick={() => navigate("/")}>
        SlotSwapper
      </div>

      <div className={styles.links}>
        {!isLoggedIn ? (
          <>
            <Link to="/auth" className={styles.link}>Login</Link>
            <Link to="/auth" className={`${styles.link} ${styles.signupBtn}`}>
              Sign Up
            </Link>
          </>
        ) : (
          <>
            <Link to="/dashboard" className={styles.link}>Dashboard</Link>
            <Link to="/marketplace" className={styles.link}>MarketPlace</Link>
             <Link to="/activity" className={styles.link}>Activity</Link>
            <button className={styles.logoutBtn} onClick={logoutUser}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
    
  );
};

export default Navbar;
