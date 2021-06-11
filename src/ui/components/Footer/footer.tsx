import React from "react";

export const Footer = (): JSX.Element => {
  return (
    <footer
      style={{ height: "5vh", color: "var(--light-text)", fontSize: "1.3rem" }}
    >
      <p>Copyright © 2021 Diamond Light Source Ltd.</p>
      <p>
        <a href="https://www.diamond.ac.uk">www.diamond.ac.uk</a>
      </p>
    </footer>
  );
};
