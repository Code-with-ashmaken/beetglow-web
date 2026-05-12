import { render, screen } from '@testing-library/react';
import App from './App';

test('renders BeetGlow storefront', () => {
  render(<App />);
  expect(
    screen.getByPlaceholderText(/Search skin care/i),
  ).toBeInTheDocument();
});
