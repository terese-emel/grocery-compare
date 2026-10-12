const ErrorMessage = ({ message }) => {
  if (!message) {
    return null;
  }

  const errorMessage = typeof message === "string" ? message : message.message;

  return (
    <p className="error-message" role="alert">
      {errorMessage}
      {typeof message !== "string" && message.requestId && (
        <small>Reference: {message.requestId}</small>
      )}
    </p>
  );
};

export default ErrorMessage;
