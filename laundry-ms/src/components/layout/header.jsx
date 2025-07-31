import { useState } from 'react';
import { Button } from '../ui/button.jsx';
import { Menu, X } from 'lucide-react'; // Optional: using Lucide for icons

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-[#126280] p-4 text-white fixed top-0 left-0 right-0 z-50">
      <div className="flex justify-between items-center px-4 md:px-10">

        <h1 className="text-xl font-bold flex items-center gap-2">
          <img src="/laundry-logo.jpg" alt="Laundry Shop" className="w-10 h-10 rounded-full" />
          LAUNDRY SHOP
        </h1>


        <nav className="hidden md:flex justify-between items-center gap-10">
          <ul className="flex gap-6 font-semibold">
            <li><a href="/" className="hover:underline">HOME</a></li>
            <li><a href="/about" className="hover:underline">ABOUT</a></li>
            <li><a href="/services" className="hover:underline">SERVICES</a></li>
            <li><a href="/prices" className="hover:underline">PRICES</a></li>
          </ul>
          <Button
            variant="outline"
            size="sm"
            className="text-black border-[#126280] hover:bg-white hover:text-[#126280]"
          >
            LOGIN
          </Button>
        </nav>


        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>


      {isOpen && (
        <div className="md:hidden mt-4 px-4 bg-[#126280]">
          <ul className="flex flex-col gap-4 font-semibold mb-4">
            <li><a href="/" className="hover:underline">HOME</a></li>
            <li><a href="/about" className="hover:underline">ABOUT</a></li>
            <li><a href="/services" className="hover:underline">SERVICES</a></li>
            <li><a href="/prices" className="hover:underline">PRICES</a></li>
          </ul>
          <Button
            variant="outline"
            size="sm"
            className="w-full text-black border-[#126280] hover:bg-white hover:text-[#126280]"
          >
            LOGIN
          </Button>
        </div>
      )}
    </header>
  );
};

export default Header;
