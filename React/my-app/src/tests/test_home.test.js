import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock child components
jest.mock('../Components/RequestModal', () => () => <div data-testid="request-modal">Request Modal</div>);
jest.mock('../Components/Request_view', () => () => <div data-testid="request-view">Request View</div>);

// Mock axios
jest.mock('axios');

beforeEach(() => {
  localStorage.setItem('user_id', '2');
});

afterEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
});

test('renders loading text before data is loaded', () => {
  render(<Home_test />);
  expect(screen.getByText(/loading user name/i)).toBeInTheDocument();
});

// ✅ Test that user name is fetched and displayed
test('displays user name after fetch', async () => {
  axios.post.mockResolvedValueOnce({ data: { name: 'Tali' } });
  axios.get.mockResolvedValueOnce({ data: { totalRequests: 0, doneRequests: 0, IN_progress: 0, pendingRequests: 0 } });
  axios.post.mockResolvedValueOnce({ data: { is_admin: false } });
  axios.get.mockResolvedValueOnce({ data: [] });

  render(<Home_test />);

  await waitFor(() => {
    expect(screen.getByText(/hello tali/i)).toBeInTheDocument();
  });
});

// ✅ Test that stats are shown correctly
test('shows correct stats from backend', async () => {
  axios.post.mockResolvedValueOnce({ data: { name: 'Tali' } });
  axios.get.mockResolvedValueOnce({
    data: { totalRequests: 5, doneRequests: 2, IN_progress: 1, pendingRequests: 2 },
  });
  axios.post.mockResolvedValueOnce({ data: { is_admin: false } });
  axios.get.mockResolvedValueOnce({ data: [] });

  render(<Home_test />);

  await waitFor(() => {
    expect(screen.getByText(/5/i)).toBeInTheDocument(); // total
    expect(screen.getByText(/2/i)).toBeInTheDocument(); // done and pending
  });
});

// ✅ Test that latest requests are displayed
test('shows latest requests for student', async () => {
  axios.post.mockResolvedValueOnce({ data: { name: 'Tali' } });
  axios.get.mockResolvedValueOnce({ data: { totalRequests: 0, doneRequests: 0, IN_progress: 0, pendingRequests: 0 } });
  axios.post.mockResolvedValueOnce({ data: { is_admin: false } });
  axios.get.mockResolvedValueOnce({
    data: [
      { _id: '1', title: 'Request A', status: 'pending' },
      { _id: '2', title: 'Request B', status: 'closed' }
    ]
  });

  render(<Home_test />);

  await waitFor(() => {
    expect(screen.getByText('Request A')).toBeInTheDocument();
    expect(screen.getByText('Request B')).toBeInTheDocument();
  });
});

// ✅ Test that admin sees modal when clicking a request
test('admin can click and see RequestModal', async () => {
  axios.post.mockResolvedValueOnce({ data: { name: 'Admin' } });
  axios.get.mockResolvedValueOnce({ data: { totalRequests: 0, doneRequests: 0, IN_progress: 0, pendingRequests: 0 } });
  axios.post.mockResolvedValueOnce({ data: { is_admin: true } });
  axios.get.mockResolvedValueOnce({
    json: async () => [
      { _id: '1', title: 'Admin Req', status: 'in progress' }
    ]
  });
  axios.get.mockResolvedValueOnce({
    json: async () => [{ user_id: 2, name: 'Admin' }]
  });

  render(<Home_test />);

  await waitFor(() => {
    expect(screen.getByText('Admin Req')).toBeInTheDocument();
  });

  userEvent.click(screen.getByText('Admin Req'));

  await waitFor(() => {
    expect(screen.getByTestId('request-modal')).toBeInTheDocument();
  });
});

// ✅ Test that non-admin sees Request_view
test('non-admin can click and see Request_view', async () => {
  axios.post.mockResolvedValueOnce({ data: { name: 'Tali' } });
  axios.get.mockResolvedValueOnce({ data: { totalRequests: 0, doneRequests: 0, IN_progress: 0, pendingRequests: 0 } });
  axios.post.mockResolvedValueOnce({ data: { is_admin: false } });
  axios.get.mockResolvedValueOnce({
    json: async () => [
      { _id: '1', title: 'Student Req', status: 'pending' }
    ]
  });

  render(<Home_test />);

  await waitFor(() => {
    expect(screen.getByText('Student Req')).toBeInTheDocument();
  });

  userEvent.click(screen.getByText('Student Req'));

  await waitFor(() => {
    expect(screen.getByTestId('request-view')).toBeInTheDocument();
  });
});
