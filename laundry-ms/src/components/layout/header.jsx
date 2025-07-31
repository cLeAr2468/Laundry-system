// Header.js with Tailwind
import { Button } from '../ui/button.jsx'

const Header = () => {
    return (
      <header className="bg-[#126280] p-4 text-white flex justify-between items-center fixed top-0 left-0 right-0 z-50">
        <h1 className="text-xl font-bold px-10 flex items-center gap-2">
          <img src="/laundry-logo.jpg" alt="Laundry Shop" className="w-10 h-10 rounded-full" />
          LAUNDRY SHOP
        </h1>
        <nav className="flex justify-between items-center">
          <ul className="flex gap-4 px-10 font-semibold space-x-10">
                <li><a href="/" className="hover:underline">HOME</a></li>
                <li><a href="/about" className="hover:underline">ABOUT</a></li>
                <li><a href="/Services" className="hover:underline">SERVICES</a></li>
                <li><a href="/Prices" className="hover:underline">PRICES</a></li>
          </ul>
            <div className="flex gap-4 text-center px-10">
                <Button variant="outline" size="sm" className="text-black border-[#126280] hover:bg-[#126280] hover:text-white">
                    LOGIN
                </Button>
            </div>
        </nav>
      </header>
    );
  };
  
export default Header;