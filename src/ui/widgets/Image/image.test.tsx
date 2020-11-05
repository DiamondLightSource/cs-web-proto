import React from "react";
import { ImageComponent } from "./image";
import { DEFAULT_BASE_URL } from "../../../baseUrl";
import { render, screen } from "@testing-library/react";

describe("<ImageComponent />", (): void => {
  describe("Visible tests", (): void => {
    test("it contains an image element", (): void => {
      render(<ImageComponent src="test" />);
      expect(screen.getByRole("img")).toBeInTheDocument();

      expect(screen.getByRole("img")).toHaveProperty(
        "src",
        `${DEFAULT_BASE_URL}/img/test`
      );
    });

    test("it passes alternative text through", (): void => {
      render(<ImageComponent src="test" alt="test text" />);

      expect(screen.getByAltText("test text")).toBeInTheDocument();
    });
  });

  describe("prop testing", (): void => {
    test("its source is passed through properly", (): void => {
      render(<ImageComponent src="test" />);
      expect(screen.getByRole("img")).toHaveProperty(
        "src",
        `${DEFAULT_BASE_URL}/img/test`
      );
    });

    test("flips and rotations are applied", (): void => {
      const imageProps = {
        src: "test",
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
