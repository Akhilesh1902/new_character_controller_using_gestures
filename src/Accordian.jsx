import React, { useState } from "react";

const Accordion = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: 4,
        marginBottom: 8,
        maxWidth: "50vw",
      }}>
      <button
        onClick={toggleAccordion}
        style={{
          width: "100%",
          padding: "10px 16px",
          cursor: "pointer",
          background: "#f1f1f1",
          border: "none",
          outline: "none",
          textAlign: "left",
          fontWeight: "bold",
        }}
        aria-expanded={isOpen}>
        {title}
        <span style={{ float: "right", marginLeft: "10px" }}>
          {isOpen ? "-" : "+"}
        </span>
      </button>
      {isOpen && (
        <div style={{ padding: "10px 16px", background: "#fff" }}>
          {children}
        </div>
      )}
    </div>
  );
};

export default Accordion;
