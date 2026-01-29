/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import Logo from "../../Assets/cms-high-resolution-logo-removebg.png";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import CommentRoundedIcon from "@mui/icons-material/CommentRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        minHeight: "90px",
      }}
    >
      {/* Logo */}
      <div className="nav-logo-container">
        <img src={Logo} style={{ height: "90px", width: "140px" }} alt="CMS" />
      </div>

      {/* Links */}
      <div className="navbar-links-container">
        <a href="#home-section" style={{ color: "#fd7e14" }}>
          Home
        </a>
        <a href="#about-section">About</a>
        <a href="#review-section">Reviews</a>
        <a href="#contact-section">Contact</a>

        {/* ✅ FIXED LOGIN ROUTE */}
        <Link to="/login">
          <strong>Login</strong>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
