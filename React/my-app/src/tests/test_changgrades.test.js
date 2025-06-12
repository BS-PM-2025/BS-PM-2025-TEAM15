import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProfessorGrades from "./ProfessorGrades";

// Mock axios
jest.mock("axios");

beforeEach(() => {
  localStorage.setItem("user_id", "10");
});

afterEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
});

//  1. Renders course loading state when no courses yet
test("shows loading message when no courses are found", async () => {
  axios.get.mockResolvedValueOnce({ data: [] });

  render(<ProfessorGrades />);

  expect(screen.getByText(/no courses found/i)).toBeInTheDocument();
});

//  2. Renders courses as buttons when fetched
test("displays courses as clickable buttons", async () => {
  axios.get.mockResolvedValueOnce({
    data: [
      { _id: "1", name: "Math" },
      { _id: "2", name: "Physics" }
    ]
  });

  render(<ProfessorGrades />);

  await waitFor(() => {
    expect(screen.getByText("Math")).toBeInTheDocument();
    expect(screen.getByText("Physics")).toBeInTheDocument();
  });
});

//  3. Clicking course button fetches students
test("loads students when a course is clicked", async () => {
  axios.get
    .mockResolvedValueOnce({ data: [{ _id: "1", name: "Math" }] }) // courses
    .mockResolvedValueOnce({
      data: [
        { user_id: 100, name: "Alice", grade: 90 },
        { user_id: 101, name: "Bob", grade: 80 }
      ]
    }); // students

  render(<ProfessorGrades />);

  // Wait for courses
  await waitFor(() => {
    expect(screen.getByText("Math")).toBeInTheDocument();
  });

  userEvent.click(screen.getByText("Math"));

  // Wait for students table
  await waitFor(() => {
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
  });
});

//  4. Allows grade input change
test("can change grade input for a student", async () => {
  axios.get
    .mockResolvedValueOnce({ data: [{ _id: "1", name: "Math" }] }) // courses
    .mockResolvedValueOnce({
      data: [{ user_id: 100, name: "Alice", grade: 90 }]
    }); // students

  render(<ProfessorGrades />);

  await waitFor(() => userEvent.click(screen.getByText("Math")));

  const input = await screen.findByDisplayValue("90");
  userEvent.clear(input);
  userEvent.type(input, "95");

  expect(input.value).toBe("95");
});

//  5. Clicking Save calls POST with correct data
test("saving grade sends POST request", async () => {
  axios.get
    .mockResolvedValueOnce({ data: [{ _id: "1", name: "Math" }] }) // courses
    .mockResolvedValueOnce({
      data: [{ user_id: 100, name: "Alice", grade: 90 }]
    }); // students
  axios.post.mockResolvedValueOnce({}); // grade save

  window.alert = jest.fn(); // mock alert

  render(<ProfessorGrades />);
  await waitFor(() => userEvent.click(screen.getByText("Math")));

  userEvent.click(await screen.findByText("Save"));

  await waitFor(() => {
    expect(axios.post).toHaveBeenCalledWith(
      "http://127.0.0.1:8000/api/update_grade/",
      { user_id: 100, course_id: "1", grade: 90 }
    );
    expect(window.alert).toHaveBeenCalledWith(" Grade saved!");
  });
});

//  6. Clicking Close resets selected course
test("close table button resets course and students", async () => {
  axios.get
    .mockResolvedValueOnce({ data: [{ _id: "1", name: "Math" }] }) // courses
    .mockResolvedValueOnce({
      data: [{ user_id: 100, name: "Alice", grade: 90 }]
    }); // students

  render(<ProfessorGrades />);
  await waitFor(() => userEvent.click(screen.getByText("Math")));

  expect(await screen.findByText("Close Table")).toBeInTheDocument();

  userEvent.click(screen.getByText("Close Table"));

  await waitFor(() => {
    expect(screen.queryByText("Alice")).not.toBeInTheDocument();
  });
});
