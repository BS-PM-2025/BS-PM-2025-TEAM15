import { render, screen, fireEvent } from "@testing-library/react";
import Requestsubmissions_student from "../pages/Requestsubmissions_student";


window.alert = jest.fn();

describe("📄 Requestsubmissions_student Component", () => {

  test("מציג את כל שדות הטופס הראשיים", () => {
    render(<Requestsubmissions_student />);

    
    expect(screen.getByText("Submit a Request")).toBeInTheDocument();

   // Checks subject field existence
    expect(screen.getByPlaceholderText("Enter the subject of your request")).toBeInTheDocument();

    // Checks for the existence of detail text
    expect(screen.getByPlaceholderText("Your Quote")).toBeInTheDocument();

    // Checks for the existence of a submit button
    expect(screen.getByRole("button", { name: /Submit Request/i })).toBeInTheDocument();
  });

  test("Displays an alert if the user clicks Submit without filling in a subject and detail", () => {
    render(<Requestsubmissions_student />);
    const submitBtn = screen.getByRole("button", { name: /Submit Request/i });
    fireEvent.click(submitBtn);

    expect(window.alert).toHaveBeenCalledWith(
      "Please fill in both the subject and details before submitting."
    );
  });

  test("Allows file selection and displays the name of the selected file", () => {
    render(<Requestsubmissions_student />);
    
    const fileInput = screen.getByLabelText("Upload File:", { selector: "input" });
    const testFile = new File(["dummy content"], "test-file.pdf", { type: "application/pdf" });

    fireEvent.change(fileInput, { target: { files: [testFile] } });

    
    expect(screen.getByText(/Selected File: test-file.pdf/)).toBeInTheDocument();
  });
});
