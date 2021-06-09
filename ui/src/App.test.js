import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the heading', () => {
  render(<App />);
  const topLevelHeading = screen.getByText(/blueprint exercise/i);
  expect(topLevelHeading).toBeInTheDocument();
});
