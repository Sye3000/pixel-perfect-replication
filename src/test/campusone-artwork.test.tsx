import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CampusOneArtwork } from "@/components/CampusOneArtwork";

describe("Original CampusOne artwork", () => {
  it("preserves the supplied viewBox, geometry, colors and text placement", () => {
    const { container } = render(<CampusOneArtwork />);
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("viewBox")).toBe("100 30 480 360");
    const polygons = container.querySelectorAll("polygon");
    expect(polygons[0]?.getAttribute("points")).toBe("150,50 150,370 530,370");
    expect(polygons[0]?.getAttribute("fill")).toBe("#12284C");
    expect(polygons[1]?.getAttribute("points")).toBe("164,80 164,356 492,356");
    expect(container.querySelector("line")?.getAttribute("x2")).toBe("570");
    const text = container.querySelectorAll("text");
    expect(text[0]?.getAttribute("transform")).toBe("translate(310 245) rotate(40.1)");
    expect(text[0]?.textContent).toBe("Campus");
    expect(text[1]?.getAttribute("x")).toBe("248");
    expect(text[1]?.getAttribute("y")).toBe("330");
    expect(text[1]?.textContent).toBe("One");
    expect(container.querySelectorAll("path")).toHaveLength(2);
  });
});