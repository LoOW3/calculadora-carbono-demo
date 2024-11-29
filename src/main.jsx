import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import './index.css'
import App from './App.jsx'
import Results from './Results.jsx';
import { Link } from 'react-router';
import { Navbar, Dropdown, Avatar,  } from 'flowbite-react';
ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <Navbar fluid rounded className="fixed w-full top-0 z-50 bg-white shadow-md">
        <div className="flex md:order-2">
          <Navbar.Toggle />
        </div>
        <Navbar.Collapse>
          <Navbar.Link href="/" active={window.location.pathname === '/'}onClick={() => handleNavClick('calculadora')}>Calculadora</Navbar.Link>
          <Navbar.Link href="/results" active={window.location.pathname === '/results'} onClick={() => handleNavClick('resultados')}>Resultados</Navbar.Link>
        </Navbar.Collapse>
      </Navbar>

    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/results" element={<Results />} />
    </Routes>
  </BrowserRouter>
);
