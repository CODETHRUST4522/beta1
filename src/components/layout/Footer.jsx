import React from "react";

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <p>© {new Date().getFullYear()} GramSeva - Digital Portal for Rural Grievance Redressal & Citizen Empowerment.</p>
        <p className="footer-subtext">Building transparent communication between citizens and local governance.</p>
      </div>
    </footer>
  );
};

export default Footer;
