import "./Error404.scss";
import { Link } from "react-router-dom";

const Error404 = () => {
  return (
    <div className="error-page">
      <div className="error-noise" />
      <div className="error-overlay" />
      <div className="error-terminal">
        <h1 className="error-heading">
          Error <span className="error-code">404</span>
        </h1>
        <p className="error-output">
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>
        <p className="error-output">
          Please try to{" "}
          <Link to="/" className="error-link">
            go back
          </Link>{" "}
          or
          <Link to="/" className="error-link">
            return to the homepage
          </Link>
          .
        </p>
        <p className="error-output error-message">Good luck.</p>
      </div>
    </div>
  );
};

export default Error404;
