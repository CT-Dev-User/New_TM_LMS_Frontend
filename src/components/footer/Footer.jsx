
import React from 'react';
import {
  FaArrowUp,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
  FaYoutube
} from 'react-icons/fa';
import { HiOutlineMail } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import Logo from '../../assets/logo.jpg';

const Footer = ({ user }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleHomeClick = (e) => {
    if (window.location.pathname === '/') {
      e.preventDefault();
      scrollToTop();
    }
  };

  const renderExploreLinks = () => {
    const baseLinks = (
      <>
        <li>
          <Link
            to="/"
            onClick={handleHomeClick}
            className="text-blue-100 hover:text-white transition-colors"
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            to="/about"
            className="text-blue-100 hover:text-white transition-colors"
            onClick={scrollToTop}
          >
            About Us
          </Link>
        </li>
      </>
    );

    if (user?.role === 'admin') {
      return (
        <>
          {baseLinks}
          <li>
            <Link
              to="/admin/dashboard"
              className="text-blue-100 hover:text-white transition-colors"
              onClick={scrollToTop}
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/admin/users"
              className="text-blue-100 hover:text-white transition-colors"
              onClick={scrollToTop}
            >
              Manage Users
            </Link>
          </li>
          <li>
            {/* <Link
              to="/admin/course"
              className="text-blue-100 hover:text-white transition-colors"
              onClick={scrollToTop}
            >
              Manage Courses
            </Link> */}
          </li>
        </>
      );
    }

    if (user?.role === 'instructor') {
      return (
        <>
          {baseLinks}
          <li>
            <Link
              to="/instructor/dashboard"
              className="text-blue-100 hover:text-white transition-colors"
              onClick={scrollToTop}
            >
              Instructor Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/instructor/course"
              className="text-blue-100 hover:text-white transition-colors"
              onClick={scrollToTop}
            >
              My Courses
            </Link>
          </li>
          {/* <li>
            <Link
              to="/instructor/students"
              className="text-blue-100 hover:text-white transition-colors"
              onClick={scrollToTop}
            >
              My Students
            </Link>
          </li> */}
        </>
      );
    }

    // Default for normal user or guest
    return (
      <>
        {baseLinks}
        <li>
          <Link
            to="/courses"
            className="text-blue-100 hover:text-white transition-colors"
            onClick={scrollToTop}
          >
            Courses
          </Link>
        </li>
        <li>
          <Link
            to="/blog"
            className="text-blue-100 hover:text-white transition-colors"
            onClick={scrollToTop}
          >
            Blog
          </Link>
        </li>
      </>
    );
  };

  return (
  <footer className="bg-gradient-to-r from-[#1E3A8A] to-[#1E88E5] text-white px-4 sm:px-6">
<div className="max-w-7xl mx-auto py-8 sm:py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
      {/* Brand Column */}
      <div className="space-y-4">
        {/* <div className="flex items-center gap-3"> */}
        <div className="space-y-4 col-span-1 md:col-span-2 lg:col-span-1">

          <img
            className="w-10 h-10 rounded-full object-cover border-2 border-blue-200"
            src={Logo}
            alt="TechMomentum Logo"
          />
          <h3 className="text-xl font-bold">TechMomentum</h3>
        </div>
        <p className="text-blue-100 text-sm">
          Accelerating tech education for the next generation of innovators.
        </p>
        <div className="flex gap-4 pt-2">
          <a
            href="https://linkedin.com"
            className="text-blue-100 hover:text-white transition-colors"
          >
            <FaLinkedin size={18} />
          </a>
          <a
            href="https://instagram.com"
            className="text-blue-100 hover:text-pink-400 transition-colors"
          >
            <FaInstagram size={18} />
          </a>
          <a
            href="https://twitter.com"
            className="text-blue-100 hover:text-blue-300 transition-colors"
          >
            <FaTwitter size={18} />
          </a>
          <a
            href="https://youtube.com"
            className="text-blue-100 hover:text-red-500 transition-colors"
          >
            <FaYoutube size={18} />
          </a>
        </div>
      </div>

      {/* Explore Links */}
      <div>
        <h4 className="text-lg font-semibold mb-4 text-white">Explore</h4>
        <ul className="space-y-3">{renderExploreLinks()}</ul>
      </div>

      {/* Support */}
      <div>
        <h4 className="text-lg font-semibold mb-4 text-white">Support</h4>
        <ul className="space-y-3">
          <li>
            <Link
              to="/faq"
              className="text-blue-100 hover:text-white transition-colors"
            >
              FAQ
            </Link>
          </li>
          <li>
            <Link
              to="/contact"
              className="text-blue-100 hover:text-white transition-colors"
            >
              Contact
            </Link>
          </li>
          <li>
            <Link
              to="/privacy"
              className="text-blue-100 hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
          </li>
          <li>
            <Link
              to="/terms"
              className="text-blue-100 hover:text-white transition-colors"
            >
              Terms
            </Link>
          </li>
        </ul>
      </div>

      {/* Contact */}
      <div>
        <h4 className="text-lg font-semibold mb-4 text-white">
          Stay Connected
        </h4>
        <div className="flex items-start gap-3 mb-4 max-w-full sm:max-w-xs">
          <HiOutlineMail size={20} className="text-blue-200 mt-1" />
          <span className="break-all text-sm">hello@techmomentum.com</span>
        </div>
        <Link
          to="/"
          onClick={handleHomeClick}
          className="inline-block bg-white text-[#1E88E5] hover:bg-blue-100 px-6 py-2 rounded-full font-medium transition-colors w-full sm:w-auto text-center"
        >
          Get Started
        </Link>
      </div>
    </div>

    {/* Bottom Footer */}
    <div className="border-t border-blue-300/20 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
        <p className="text-blue-100 text-sm">
          © {new Date().getFullYear()} TechMomentum. All rights reserved.
        </p>
        <button
          onClick={scrollToTop}
          className="flex items-center gap-2 bg-white hover:bg-blue-600 px-4 py-2 rounded-full transition-all text-black"
        >
          <span className="text-sm">Back to top</span>
          <FaArrowUp size={14} />
        </button>
      </div>
    </div>
  </footer>
);

};

export default Footer;
