import React from "react";

export const Footer = (): JSX.Element => {
  return (
    <footer
      style={{ height: "5vh", color: "var(--light-text)", fontSize: "1.3rem" }}
    >
      <p>
        cs-web-proto version {process.env.REACT_APP_VERSION}{" "}
        {process.env.REACT_APP_BUILD_TIME}
      </p>
      <p>Copyright © Diamond Light Source Ltd.</p>
      <p>
        <a href="https://www.diamond.ac.uk">www.diamond.ac.uk</a>
      </p>
    </footer>
  );
};
