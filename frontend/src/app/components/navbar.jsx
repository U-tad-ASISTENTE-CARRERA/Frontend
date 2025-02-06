import Link from "next/link";
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function Navbar() {
    return(
        <nav className="m-4 p-2 bg-blue-600 border-r-2 rounded-md">
            <ul className=" flex flex-row-reverse justify-between">
                <li>
                    <Link href='/login'><i className="bi bi-person-fill text-5xl"></i></Link>                
                </li>
            </ul>
        </nav>
    )
}