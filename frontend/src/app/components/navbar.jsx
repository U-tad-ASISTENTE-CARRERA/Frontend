import Link from "next/link";
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function Navbar() {

    return(
        <nav className= "bg-blue-600 p-4 flex items-center justify-between rounded-lg shadow-lg m-4">
            <img src="/logo.png" title="Logo" className="h-10 w-10"></img>
                
            <input type="checkbox" id="menu-toggle" className="hidden peer" />

            <label htmlFor="menu-toggle" className="text-white cursor-pointer md:hidden">
                <i className="bi bi-list text-2xl"></i>
            </label>

			<ul className="hidden peer-checked:flex flex-col md:flex md:flex-row md:space-x-8 space-y-4 md:space-y-0 text-white text-lg">
                <li className="md:ml-auto">
                    <Link href="/" className="hover:text-gray-300 transition-colors duration-200 text-nowrap">
                        <i className="bi bi-house-door-fill text-4xl"></i>
                    </Link>
                </li>
                
                <li>
                    <a href="#" className="hover:text-gray-300 transition-colors duration-200">Introducción</a>
                </li>

                <li>
                    <a href="#" className="hover:text-gray-300 transition-colors duration-200">Catálogo</a>
                </li>

                <li>
                    <a href="#" className="hover:text-gray-300 transition-colors duration-200">Ayuda</a>
                </li>

                <li className="md:ml-auto">
                    <Link href="/login" className="hover:text-gray-300 transition-colors duration-200 text-nowrap">
                        <i className="bi bi-person-fill text-4xl"></i>
                    </Link>
                </li>
            </ul>   
		</nav>
    )
}


