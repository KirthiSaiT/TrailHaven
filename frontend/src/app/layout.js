import './globals.css';
import Navbar from '../components/Navbar';

export const metadata = {
  title: 'TrailHaven',
  description: 'A safety-focused web app for urban navigation',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Navbar />
        {children}
      </body>
    </html>
  );
}