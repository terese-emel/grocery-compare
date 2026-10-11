import { useState } from "react";
import { useAuth } from "../context/authContextValue";

const AuthForm = ({ mode, onSuccess }) => {
  const { login, register } = useAuth();
  const isLogin = mode === "login";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      const authenticatedUser = isLogin
        ? await login(email, password)
        : await register(email, password);

      onSuccess?.(authenticatedUser);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>{isLogin ? "Login" : "Create account"}</h2>

      <label htmlFor={`${mode}-email`}>Email</label>
      <input
        id={`${mode}-email`}
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
      />

      <label htmlFor={`${mode}-password`}>Password</label>
      <input
        id={`${mode}-password`}
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        minLength={isLogin ? undefined : 8}
        required
      />

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting
          ? isLogin
            ? "Logging in..."
            : "Creating account..."
          : isLogin
            ? "Login"
            : "Register"}
      </button>

      {error && <p role="alert">{error}</p>}
    </form>
  );
};

export default AuthForm;
