

export default function Footer() {
    const year = new Date().getFullYear();
    return(
        <footer className="text-gray-400 font-light max-w-3xl mx-auto text-gray-100 py-10 text-sm text-center">
            &copy; {year} manal.dev. All rights reserved.
        </footer>
    )
}