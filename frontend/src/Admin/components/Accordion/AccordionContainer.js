import React from "react";
import PropTypes from "prop-types";

import "./accordionContainer.css";

function AccordionContainer(props) {
  return <div className="container">{props.children}</div>;
}

AccordionContainer.propTypes = {
  children: PropTypes.element
};

export default AccordionContainer;
