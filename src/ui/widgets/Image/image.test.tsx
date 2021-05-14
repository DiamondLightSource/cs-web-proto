import React from "react";
import { ImageComponent } from "./image";
import { render, screen } from "@testing-library/react";

describe("<ImageComponent />", (): void => {
  describe("Visible tests", (): void => {
    test("it contains an image element", (): void => {
      render(<ImageComponent imageFile="test.png" />);
      expect(screen.getByRole("img")).toBeInTheDocument();

      expect(screen.getByRole("img")).toHaveAttribute("src", "test.png");
    });

    test("it passes alternative text through", (): void => {
      render(<ImageComponent imageFile="test.png" alt="test text" />);

      expect(screen.getByAltText("test text")).toBeInTheDocument();
    });
  });

  describe("prop testing", (): void => {
    test("its source is passed through properly", (): void => {
      render(<ImageComponent imageFile="test.jpg" />);
      expect(screen.getByRole("img")).toHaveAttribute("src", "test.jpg");
    });

    test("flips and rotations are applied", (): void => {
      const imageProps = {
        imageFile: "test.svg",
        flipHorizontal: true,
        flipVertical: true,
        rotation: 45
      };

      render(<ImageComponent {...imageProps} />);
      const img = screen.getByRole("img");

      if ("style" in img) {
        expect(img.style).toHaveProperty(
          "transform",
          "rotate(45deg) scaleX(-1) scaleY(-1)"
        );
      }
      expect.assertions(1);
    });
  });
});
