import React from "react";

export const Footer = (): JSX.Element => {
  return (
    <footer style={{ height: "5vh", color: "#cccccc" }}>
      <p>Copyright © 2020 Diamond Light Source Ltd.</p>
      <p>
        <a style={{ color: "#cccccc" }} href="https://www.diamond.ac.uk">
          www.diamond.ac.uk
        </a>
      </p>
    </footer>
  );
};
