import React from "react";
import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div className="not-found">
      <h1>Error 404</h1>
      <p>
        Route you're trying to access doesn't exist.{" "}
        <span>
          <Link to="/">Back to Home</Link>
        </span>
      </p>
    </div>
  );
};

export default PageNotFound;
