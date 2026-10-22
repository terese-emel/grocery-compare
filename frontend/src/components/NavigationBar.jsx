import styles from "./NavigationBar.module.css";

function NavigationBar({ user, onLogout }) {
  return (
    <nav className={styles.navbar} aria-label="Main navigation">
      <a className={styles.brand} href="/">
        Grocery Compare
      </a>

      <div className={styles.links}>
        <a href="#search">Search</a>
        <a href="#add-product">Add product</a>

        <span className={styles.user}>Signed in as {user.email}</span>

        <button type="button" onClick={onLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default NavigationBar;
