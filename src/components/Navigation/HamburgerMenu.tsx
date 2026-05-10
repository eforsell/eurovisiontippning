import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, LogOut } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface HamburgerMenuProps {
  isAdmin: boolean;
  onLogout: () => void;
}

export function HamburgerMenu({ isAdmin, onLogout }: HamburgerMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    onLogout();
    setIsOpen(false);
    navigate('/');
  };

  const navItem = (path: string, label: string) => {
    const isActive = location.pathname.startsWith(path) && (path !== '/' || location.pathname === '/');
    return (
      <Link
        to={path}
        onClick={() => setIsOpen(false)}
        className={`block w-full text-left px-4 py-2 text-sm ${isActive ? "bg-primary text-primary-foreground" : "text-gray-700 hover:bg-gray-100"}`}
      >
        {label}
      </Link>
    );
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={toggleMenu}
        className="p-2 text-white hover:bg-primary-foreground/20 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition-colors"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700">
          {navItem("/", "Home")}
          {navItem("/tippning", "Tippning")}
          {navItem("/sharing", "Sharing")}
          {navItem("/account", "Account")}
          {isAdmin && navItem("/admin", "Admin")}
          <hr className="my-1 border-gray-200 dark:border-gray-700" />
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-end px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
          >
            <span>Sign Out</span>
            <LogOut className="h-4 w-4 ml-2" />
          </button>
        </div>
      )}
    </div>
  );
}
