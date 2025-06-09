import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginPage from "./LoginPage";

//npm install --save-dev @testing-library/react @testing-library/jest-dom jest
//need to check with the rest of the group before adding

jest.mock("axios"); //axios mock

beforeEach(() => {
  jest.spyOn(window, "alert").mockImplementation(() => {});
  delete window.location;
  window.location = { href: "" };
  localStorage.clear();
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("LoginPage Component", () => {
  test("renders login and signup forms", () => {
    render(<LoginPage />);
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByText("Let's go!")).toBeInTheDocument();
    expect(screen.getByText("Confirm!")).toBeInTheDocument();
  });

  test("handles login success", async () => {
    axios.post.mockResolvedValue({
      data: {
        user_id: "123",
        message: "Login successful",
      },
    });

    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByText("Let's go!"));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        "http://localhost:8000/api/users/Login",
        {
          email: "test@example.com",
          password: "password123",
        }
      );
      expect(localStorage.getItem("user_id")).toBe("123");
      expect(window.alert).toHaveBeenCalledWith("Login successful");
      expect(window.location.href).toBe("/home");
    });
  });

  test("handles login failure", async () => {
    axios.post.mockRejectedValue({
      response: { data: { error: "Invalid credentials" } },
    });

    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "fail@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "wrongpass" },
    });
    fireEvent.click(screen.getByText("Let's go!"));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Invalid credentials");
    });
  });

  test("handles signup success", async () => {
    axios.post.mockResolvedValue({
      data: { message: "Signup successful" },
    });

    render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText("Name"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getAllByPlaceholderText("Email")[1], {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getAllByPlaceholderText("Password")[1], {
      target: { value: "mypassword" },
    });
    fireEvent.change(screen.getByPlaceholderText("Id Number"), {
      target: { value: "101" },
    });

    fireEvent.click(screen.getByText("Confirm!"));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        "http://localhost:8000/api/users/SignUp",
        {
          _id: 101,
          name: "John Doe",
          email: "john@example.com",
          password: "mypassword",
          type: "Student",
        }
      );
      expect(window.alert).toHaveBeenCalledWith("Signup successful");
    });
  });

  test("handles signup failure", async () => {
    axios.post.mockRejectedValue({
      response: { data: { error: "Email already exists" } },
    });

    render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText("Name"), {
      target: { value: "Jane" },
    });
    fireEvent.change(screen.getAllByPlaceholderText("Email")[1], {
      target: { value: "jane@example.com" },
    });
    fireEvent.change(screen.getAllByPlaceholderText("Password")[1], {
      target: { value: "123456" },
    });
    fireEvent.change(screen.getByPlaceholderText("Id Number"), {
      target: { value: "202" },
    });

    fireEvent.click(screen.getByText("Confirm!"));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Email already exists");
    });
  });
});
