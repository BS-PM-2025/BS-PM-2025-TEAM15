import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import StudentLookup from "./StudentLookup";
import userEvent from "@testing-library/user-event";

// Mock child components
jest.mock("../Components/RequestModal", () => () => <div data-testid="modal">RequestModal</div>);
jest.mock("../Components/Course_tree", () => () => <div data-testid="course-tree">Course Tree</div>);

// Mock axios and fetch
jest.mock("axios");

global.fetch = jest.fn(() => Promise.resolve({
  ok: true,
  json: () => Promise.resolve([]),
}));

beforeEach(() => {
  localStorage.setItem("user_id", "1");
});

afterEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
});


//  1. Renders the component with input and buttons
test("renders input and buttons correctly", () => {
  render(<StudentLookup />);
  expect(screen.getByPlaceholderText(/enter student id/i)).toBeInTheDocument();
  expect(screen.getByText("Search")).toBeInTheDocument();
  expect(screen.getByText("Clear")).toBeInTheDocument();
});

//  2. Shows error on invalid student ID
test("alerts on invalid student ID", () => {
  window.alert = jest.fn();
  render(<StudentLookup />);
  const searchBtn = screen.getByText("Search");
  fireEvent.click(searchBtn);
  expect(window.alert).toHaveBeenCalledWith("Please enter a valid numeric student ID.");
});

//  3. Fetches and displays student data
test("fetches student data and renders tabs", async () => {
  global.fetch
    .mockResolvedValueOnce({ ok: true, json: async () => ({ info: { name: "Test", user_id: 2, email: "x", department: "CS", status: "Active", sum_points: 100, average: 90 }, asks: [] }) })
    .mockResolvedValueOnce({ ok: true, json: async () => [] });

  render(<StudentLookup />);
  userEvent.type(screen.getByPlaceholderText(/enter student id/i), "2");
  userEvent.click(screen.getByText("Search"));

  await waitFor(() => {
    expect(screen.getByText(/ Student Details/)).toBeInTheDocument();
    expect(screen.getByText(/Test/)).toBeInTheDocument();
  });
});

//  4. Can switch tabs and render enroll tab
test("switches to enroll tab and shows message", async () => {
  global.fetch
    .mockResolvedValueOnce({ ok: true, json: async () => ({ info: { name: "Test", user_id: 2, email: "x", department: "CS", status: "Active", sum_points: 100, average: 90 }, asks: [] }) })
    .mockResolvedValueOnce({ ok: true, json: async () => [] });

  render(<StudentLookup />);
  userEvent.type(screen.getByPlaceholderText(/enter student id/i), "2");
  userEvent.click(screen.getByText("Search"));

  await screen.findByText("Student Info");
  userEvent.click(screen.getByText("Enroll in Course"));

  await waitFor(() => {
    expect(screen.getByText(/Available Courses for Enrollment/i)).toBeInTheDocument();
  });
});

//  5. Shows loading state
test("shows loading message while fetching student", async () => {
  global.fetch.mockImplementationOnce(() => new Promise(resolve => setTimeout(() => resolve({
    ok: true,
    json: () => Promise.resolve({})
  }), 100)));

  render(<StudentLookup />);
  userEvent.type(screen.getByPlaceholderText(/enter student id/i), "5");
  userEvent.click(screen.getByText("Search"));

  expect(screen.getByText("Loading student data...")).toBeInTheDocument();
});

//  6. Filters asks by importance
test("filters student asks by importance", async () => {
  global.fetch
    .mockResolvedValueOnce({ ok: true, json: async () => ({ info: { name: "Test", user_id: 2, email: "x", department: "CS", status: "Active", sum_points: 100, average: 90 }, asks: [
      { _id: 1, title: "Req A", importance: "high", date_sent: "2024-01-01", id_sending: 2, status: "pending" },
      { _id: 2, title: "Req B", importance: "low", date_sent: "2024-01-02", id_sending: 2, status: "closed" }
    ] }) });

  render(<StudentLookup />);
  userEvent.type(screen.getByPlaceholderText(/enter student id/i), "2");
  userEvent.click(screen.getByText("Search"));

  await waitFor(() => {
    expect(screen.getByText("Requests")).toBeInTheDocument();
  });

  userEvent.click(screen.getByText("Requests"));

  const importanceSelect = screen.getByLabelText(/importance/i);
  userEvent.selectOptions(importanceSelect, ["high"]);

  expect(await screen.findByText(/Req A/)).toBeInTheDocument();
  expect(screen.queryByText(/Req B/)).not.toBeInTheDocument();
});

//  7. Clicking request opens modal
test("opens request modal when ask is clicked", async () => {
  global.fetch
    .mockResolvedValueOnce({ ok: true, json: async () => ({ info: { name: "Test", user_id: 2, email: "x", department: "CS", status: "Active", sum_points: 100, average: 90 }, asks: [
      { _id: 1, title: "Req A", importance: "high", date_sent: "2024-01-01", id_sending: 2, status: "pending", idr: 1 }
    ] }) });

  render(<StudentLookup />);
  userEvent.type(screen.getByPlaceholderText(/enter student id/i), "2");
  userEvent.click(screen.getByText("Search"));

  await waitFor(() => {
    expect(screen.getByText("Req A")).toBeInTheDocument();
  });

  userEvent.click(screen.getByText("Req A"));
  expect(await screen.findByTestId("modal")).toBeInTheDocument();
});
