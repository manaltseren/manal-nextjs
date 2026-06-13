export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="font-light max-w-4xl mx-auto text-gray-400 py-10 text-sm text-center">
      &copy; {year} manal.dev. All rights reserved.
    </footer>
  );
}
