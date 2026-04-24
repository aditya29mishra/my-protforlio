import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { styles } from "../styles";
import { navLinks } from "../constants";
import { HiMenuAlt3, HiX } from "react-icons/hi";

const Navbar = () => {
  const [active, setActive] = useState("");
  const [toggle, setToggle] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      if (scrollTop > 100) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`${
        styles.paddingX
      } w-full flex items-center py-5 fixed top-0 z-20 ${
        scrolled ? "bg-primary/80 backdrop-blur-md" : "bg-transparent"
      } transition-all duration-300`}
    >
      <div className='w-full flex justify-between items-center max-w-7xl mx-auto'>
        <Link
          to='/'
          className='flex items-center gap-2'
          onClick={() => {
            setActive("");
            window.scrollTo(0, 0);
          }}
        >
          <p className='text-white text-[18px] font-bold cursor-pointer flex '>
            Aditya &nbsp;
            <span className='sm:block hidden'> | XR Portfolio</span>
          </p>
        </Link>

        <ul className='list-none hidden sm:flex flex-row gap-10'>
          {navLinks.map((nav) => (
            <li
              key={nav.id}
              className={`${
                active === nav.title ? "text-accent" : "text-secondary"
              } hover:text-white text-[18px] font-medium cursor-pointer transition-colors`}
              onClick={() => setActive(nav.title)}
            >
              <a href={`#${nav.id}`}>{nav.title}</a>
            </li>
          ))}
          <li className="text-secondary hover:text-white text-[18px] font-medium cursor-pointer group relative">
            <span>Misc</span>
            <div className="absolute top-full left-0 mt-2 w-48 bg-primary border border-white/10 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all backdrop-blur-md">
              <Link to="/music" className="block px-4 py-2 hover:bg-white/5">Music</Link>
              <Link to="/reading" className="block px-4 py-2 hover:bg-white/5">Reading</Link>
            </div>
          </li>
        </ul>

        {/* Mobile menu logic */}
        <div className='sm:hidden flex flex-1 justify-end items-center'>
          <div
            className='flex items-center cursor-pointer'
            onClick={() => setToggle(!toggle)}
            aria-label='Toggle menu'
            role='button'
          >
            {toggle ? (
              <HiX className="text-white text-3xl" aria-hidden="true" />
            ) : (
              <HiMenuAlt3 className="text-white text-3xl" aria-hidden="true" />
            )}
          </div>

          <div
            className={`${
              !toggle ? "hidden" : "flex"
            } p-6 black-gradient absolute top-20 right-0 mx-4 my-2 min-w-[140px] z-10 rounded-xl`}
          >
            <ul className='list-none flex justify-end items-start flex-1 flex-col gap-4'>
              {navLinks.map((nav) => (
                <li
                  key={nav.id}
                  className={`font-poppins font-medium cursor-pointer text-[16px] ${
                    active === nav.title ? "text-white" : "text-secondary"
                  }`}
                  onClick={() => {
                    setToggle(!toggle);
                    setActive(nav.title);
                  }}
                >
                  <a href={`#${nav.id}`}>{nav.title}</a>
                </li>
              ))}
              <li className="text-secondary font-medium"><Link to="/music">Music</Link></li>
              <li className="text-secondary font-medium"><Link to="/reading">Reading</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
