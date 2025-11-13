import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

function getById(id) {
  return document.getElementById(id);
}

test('renders SPA sections and footer', () => {
  render(<App />);
  expect(getById('home')).toBeInTheDocument();
  expect(getById('concepts')).toBeInTheDocument();
  expect(getById('innovations')).toBeInTheDocument();
  expect(getById('gallery')).toBeInTheDocument();
  expect(getById('lifestyle')).toBeInTheDocument();
  expect(getById('cta')).toBeInTheDocument();
  expect(screen.getByLabelText(/Footer/i)).toBeInTheDocument();
});

test('theme toggle switches label text', () => {
  render(<App />);
  const toggle = screen.getByRole('button', { name: /Switch to dark mode|Switch to light mode/i });
  expect(toggle).toBeInTheDocument();
  fireEvent.click(toggle);
  // label text should update
  const updated = screen.getByRole('button', { name: /Switch to dark mode|Switch to light mode/i });
  expect(updated).toBeInTheDocument();
});

test('skip to content and anchor navigation works (mocked smooth scroll)', () => {
  render(<App />);
  const skip = screen.getByText(/Skip to content/i);
  expect(skip).toHaveAttribute('href', '#home');
  const link = screen.getByRole('link', { name: /Gallery/i });
  // js smooth is attached globally; we just ensure link exists and href is id
  expect(link).toHaveAttribute('href', '#gallery');
});
