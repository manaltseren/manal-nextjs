

export default function Footer() {
    const year = new Date().getFullYear();
    return(
        <footer className="text-gray-400 font-light max-w-3xl mx-auto text-gray-100 py-10 text-sm text-center">
            <div className="flex gap-3 justify-center mb-5">
                <a className="transition duration-300 text-gray-400 hover:text-gray-100" href="https://www.linkedin.com/in/manaltseren-b-5883b214b/" target="_blank"><i className="text-4xl lab la-linkedin"></i></a>
                <a className="transition duration-300 text-gray-400 hover:text-gray-100" href="https://www.instagram.com/manal.dev/" target="_blank"><i className="text-4xl lab la-instagram"></i></a>
                <a className="transition duration-300 text-gray-400 hover:text-gray-100" href="https://www.facebook.com/gyalb44" target="_blank"><i className="text-4xl lab la-facebook-square"></i></a>
            </div>

            &copy; {year} manal.dev. All rights reserved.
        </footer>
    )
}