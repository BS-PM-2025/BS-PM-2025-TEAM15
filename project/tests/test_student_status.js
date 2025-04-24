import { render, screen, waitFor } from "@testing-library/react";
import StudentStatusRequest from "../pages/StudentStatusRequest";
import axios from "axios";
// Cancel real calls to the server
jest.mock("axios");

describe("📘 StudentStatusRequest Component", () => {
  test("Loads and displays a row in the table according to information from the server", () => {
    render(<StudentStatusRequest />);
    const titleElement = screen.getByText(/My Requests Status/i);
    expect(titleElement).toBeInTheDocument();
  });

  test("Loads and displays a row in the table according to information from the server", async () => {
    axios.get.mockResolvedValueOnce({
      data: [{ id_sending: 101, importance: "urgent", status: "approved" }],
    });

    render(<StudentStatusRequest />);

    await waitFor(() => {
      expect(screen.getByText("101")).toBeInTheDocument();
      expect(screen.getByText("urgent")).toBeInTheDocument();
      expect(screen.getByText("approved")).toBeInTheDocument();
    });
  });

  test("Displays the table columns correctly", () => {
    render(<StudentStatusRequest />);
    expect(screen.getByRole("columnheader", { name: /Request ID/i })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: /Details/i })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: /Status/i })).toBeInTheDocument();
  });
});
