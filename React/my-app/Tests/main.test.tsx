// import { describe, it, expect, vi } from 'vitest';
// import { render, screen } from '@testing-library/react';
// import Request_view from '../src/Components/Request_view';

// import React from 'react';describe('group', () => {
//     it('should', () => {
//         expect(1).toBeTruthy
//     })
// })


// // import Stopwatch from '../src/Components/Stopwatch';

// // // fake timers to control time in test
// // vi.useFakeTimers();

// // describe('Stopwatch', () => {
// //   it('increments seconds after 1 second', () => {
// //     render(<Stopwatch />);
    
// //     expect(screen.getByText(/Time Starts Now!/)).toBeInTheDocument();
// //     expect(screen.getByText(/0seconds/)).toBeInTheDocument();

// //     // advance time by 1 second
// //     vi.advanceTimersByTime(1000);

// //     // re-query after time advance
// //     expect(screen.getByText(/1seconds/)).toBeInTheDocument();
// //   });
// // });

// import userEvent from '@testing-library/user-event';
// import Sidebar from '../src/Components/sidebar';
// import Home from '../src/Pages/Home';
// import StudentDashboard from '../src/Pages/Student_Dashboard';
// import { MemoryRouter, Routes, Route } from 'react-router-dom';
// import axios from 'axios';
// import { vi } from 'vitest';

// vi.mock('axios');
// // describe('Sidebar navigation', () => {
// //   it('navigates to Home when Home link is clicked', async () => {
// //     render(
// //       <MemoryRouter initialEntries={['/']}>
// //         <Routes>
// //           <Route path="/" element={<Sidebar />} />
// //           <Route path="/Home" element={<Home />} />
// //         </Routes>
// //       </MemoryRouter>
// //     );

// //     const homeLink = screen.getByText('Home');
// //     await userEvent.click(homeLink);

// //     expect(await screen.findByText(/Home/i)).toBeInTheDocument(); // Adjust to actual Home content
// //   });

// //   it('navigates to Student Dashboard when Dashboard link is clicked', async () => {
// //     render(
// //       <MemoryRouter initialEntries={['/']}>
// //         <Routes>
// //           <Route path="/" element={<Sidebar />} />
// //           <Route path="/Student_Dashboard" element={<StudentDashboard />} />
// //         </Routes>
// //       </MemoryRouter>
// //     );

// //     const dashboardLink = screen.getByText('Dashboard');
// //     await userEvent.click(dashboardLink);

// //     expect(await screen.findByText(/Student Dashboard/i)).toBeInTheDocument(); // Adjust to actual Dashboard content
// //   });
// // });
// import { beforeEach, describe, it, expect, vi } from 'vitest';
// import { render, screen } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';
// import { MemoryRouter, Routes, Route } from 'react-router-dom';
// import Sidebar from '../src/Components/sidebar';
// import Home from '../src/Pages/Home';
// import StudentDashboard from '../src/Pages/Student_Dashboard';
// import axios from 'axios';
// import React from 'react';
// import Student_Dashboard from '../src/Pages/Student_Dashboard';

// vi.mock('axios');

// beforeEach(() => {
//   localStorage.setItem('user_id', 'mock-user-id');

//   axios.post.mockImplementation((url) => {
//     if (url.includes('/isadmin')) {
//       return Promise.resolve({ data: { is_admin: false } });
//     }
//     if (url.includes('/isprof')) {
//       return Promise.resolve({ data: { is_prof: false } });
//     }
//     return Promise.resolve({ data: {} });
//   });
// });

// describe('Sidebar navigation', () => {
//   it('navigates to Home when Home link is clicked', async () => {
//     render(
//       <MemoryRouter initialEntries={['/']}>
//         <Routes>
//           <Route path="/" element={<Sidebar />} />
//           <Route path="/Home" element={<Home />} />
//         </Routes>
//       </MemoryRouter>
//     );

//     const homeLink = await screen.findByText('Home');
//     await userEvent.click(homeLink);

//     expect(await screen.findByText(/Home/i)).toBeInTheDocument();
//   });

//   it('navigates to Student Dashboard when Dashboard link is clicked', async () => {
//     render(
//       <MemoryRouter initialEntries={['/']}>
//         <Routes>
//           <Route path="/" element={<Sidebar />} />
//           <Route path="/Student_Dashboard" element={<Student_Dashboard />} />
//         </Routes>
//       </MemoryRouter>
//     );

//     const dashboardLink = await screen.findByText('Dashboard');
//     await userEvent.click(dashboardLink);
//     expect(await screen.findByText(/Dashboard/)).toBeInTheDocument();
//   });
// });

import { beforeEach, describe, it, expect, vi } from 'vitest';

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Student_Dashboard from '../src/Pages/Student_Dashboard';
import sidebar from '../src/Components/sidebar';
import axios from 'axios';
import Sidebar from '../src/Components/sidebar';

// ✅ Mock axios
vi.mock('axios');
const mockAxios = axios as jest.Mocked<typeof axios>;

describe('Student_Dashboard Component', () => {
  beforeEach(() => {
    localStorage.setItem('user_id', '123');
  });

  it('renders loading ', async () => {
    
    render(<Student_Dashboard />);
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
    expect(screen.getByText(/Loading your courses/i)).toBeInTheDocument();

  });

  

  it('shows error if fetch fails', async () => {
    mockAxios.get.mockRejectedValueOnce(new Error('Server Error'));
    render(<Student_Dashboard />);
    expect(await screen.findByText(/Failed to fetch course information/i)).toBeInTheDocument();
  });
});

//Sidebar Tests.


import { MemoryRouter } from 'react-router-dom';
//import { FrontHand, Home } from '@mui/icons-material';

vi.mock('axios'); // make sure this is at the top

describe('Sidebar_Tests', () => {
  beforeEach(() => {
    localStorage.setItem('user_id', '123');
    axios.post.mockResolvedValue({ data: { is_admin: false, is_prof: false } });
  });

  it('should render Sidebar with Home', () => {
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    );

    expect(screen.getByText(/home/i)).toBeInTheDocument();
  });
  it('should render Sidebar with Dashboard', () => {
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    );

    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
  });
  it('should render Sidebar with Profile', () => {
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    );

    expect(screen.getByText(/Profile/i)).toBeInTheDocument();
  });

  it('should render Sidebar with Requests', () => {
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    );

    expect(screen.getByText(/Requests/i)).toBeInTheDocument();
  });
  it('should render Sidebar with Exams', () => {
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    );

    expect(screen.getByText(/Exams/i)).toBeInTheDocument();
  });

  it('should render Sidebar with Logout', () => {
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    );

    expect(screen.getByText(/Logout/i)).toBeInTheDocument();
  });
  it('should render Sidebar with Exams', () => {
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    );

    expect(screen.getByText(/Logout/i)).toBeInTheDocument();
  });
  //fails
  it('should render Sidebar without save button', () => {
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    );

    expect(screen.getByText(/Save/i)).toBeInTheDocument();
  });
});

//Home Tests
import Home from '../src/Pages/Home';
const mockAxios1 = axios as jest.Mocked<typeof axios>;

describe('Home Page', () => {
  beforeEach(() => {
    // 👇 mock user_id BEFORE rendering
    localStorage.setItem('user_id', '123456789');

    // 👇 clear all previous mocks
    vi.clearAllMocks();
  });

  it('renders user name from backend', async () => {
    // 👇 Mock axios.post to return user name
    mockAxios1.post.mockImplementation((url) => {
      if (url.includes('/users/Home')) {
        return Promise.resolve({ data: { name: 'StudentTest' } });
      }
      if (url.includes('/isadmin')) {
        return Promise.resolve({ data: { is_admin: false } });
      }
      return Promise.resolve({ data: {} });
    });

    // 👇 Mock axios.get
    mockAxios.get.mockResolvedValue({ data: {
      totalRequests: 5,
      doneRequests: 3,
      IN_progress: 1,
      pendingRequests: 1,
    } });

    render(<Home />);

    // 👇 Should show loading first
    expect(screen.getByText(/loading user name/i)).toBeInTheDocument();

    // 👇 Then wait for the name to appear
    await waitFor(() => {
      expect(screen.getByText(/Hello StudentTest 👋/i)).toBeInTheDocument();
    });
  });
  it("Should show Latest Requests"),async () => {
    expect(screen.getByText(/Latest Requests /i)).toBeInTheDocument();
  }
  it('Should show current date', () => {
    // 🧠 Format the date exactly like in the component
    const today = new Date().toLocaleDateString('en-GB', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    render(<Home />);
    console.log('🕒 Expected date string:', today); 

    // ✅ Check that the formatted date appears
    const dateElement = screen.getByText(new RegExp(today, 'i'));
    console.log('✅ Found element text:', dateElement.textContent); //  Print what was found

    expect(dateElement).toBeInTheDocument();
  });

  describe('Student_Dashboard Integration Test', () => {
    beforeEach(() => {
      localStorage.setItem('user_id', '123456789'); // replace with a valid test user ID
    });
  
    it('renders student dashboard with real backend data', async () => {
      render(
        <MemoryRouter>
          <Student_Dashboard />
        </MemoryRouter>
      );
  
      // Expect initial loading
      expect(screen.getByText(/Loading your courses/i)).toBeInTheDocument();
  
      // Wait for data to load from backend
      await waitFor(() => {
        expect(screen.getByText(/Student Dashboard/i)).toBeInTheDocument();
      });
  
      // ✅ Optionally log fetched values from DOM
      const earned = screen.getByText(/Earned Credits/i);
      const remaining = screen.getByText(/Credits Remaining/i);
      console.log('✅ Earned:', earned.textContent);
      console.log('✅ Remaining:', remaining.textContent);
  
      // Confirm a known course exists
      expect(screen.getByText(/Completed Courses/i)).toBeInTheDocument();
    });
  });
});

import Requestsubmission_student from '../src/Pages/Requestsubmissions_student'
//Requests
describe('Request_Tests.', () => {
  it('should give Request Type block', () => {
    render(
      <MemoryRouter>
        <Requestsubmission_student />
      </MemoryRouter>
    );

    // Expect initial loading
    expect(screen.getByText(/Submit a Request/i)).toBeInTheDocument();

  })
  it('Should have a placeholder subject request.',() =>{
    render(
      <MemoryRouter>
        <Requestsubmission_student />
      </MemoryRouter>
    );
    expect(screen.getByPlaceholderText("Enter the subject of your request")).toBeInTheDocument();
  })
  it('Should have a placeholder detailed request ',() =>{
    render(
      <MemoryRouter>
        <Requestsubmission_student />
      </MemoryRouter>
    );
    expect(screen.getByPlaceholderText("Your detailed request")).toBeInTheDocument();
  })
  it('Should have a text. ',() =>{
    render(
      <MemoryRouter>
        <Requestsubmission_student />
      </MemoryRouter>
    );
    expect(screen.getByText("please submit request in an orderly and complete manner to allow for quick and fair processing."));
  })
  it('Should have a title,',() =>{
  render(
    <MemoryRouter>
      <Requestsubmission_student />
    </MemoryRouter>
  );
  expect(screen.getByText("please submit request in an orderly and complete manner to allow for quick and fair processing."));
  });
  it('Should have a  sumbit button',()=>{
    render(
      <MemoryRouter>
        <Requestsubmission_student />
      </MemoryRouter>
    );
    const submitButton = screen.getByRole('button', { name: /submit/i });
    expect(submitButton).toBeInTheDocument();
    })

    it('Should have a Upload button.',()=>{
      render(
        <MemoryRouter>
          <Requestsubmission_student />
        </MemoryRouter>
      );
      const submitButton = screen.getByRole('input', { name: /upload file/i });
      expect(submitButton).toBeInTheDocument();
    })
  });