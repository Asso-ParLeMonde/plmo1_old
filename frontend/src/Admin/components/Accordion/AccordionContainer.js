import React from "react";
import PropTypes from "prop-types";

import "./accordionContainer.css";

function AccordionContainer({ children }) {
  return <div className="container">{children}</div>;
}

AccordionContainer.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired
};

export default AccordionContainer;
