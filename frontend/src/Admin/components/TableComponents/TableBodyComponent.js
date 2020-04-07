import React from "react";
import PropTypes from "prop-types";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import { makeStyles } from "@material-ui/core";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";

import { getElementInformation } from "./component/getElementInformation";
import { typedActionButtons } from "./component/typedActionButtons";

const useStyles = makeStyles((theme) => ({
  th: {
    backgroundColor: theme.palette.primary.light,
  },
  trow: {
    backgroundColor: "#eaebff",
  },
}));

function TableBodyComponent(props) {
  const classes = useStyles();

  const rowBackgroundColor = (index) => {
    return index % 2 === 0 ? classes.trow : "";
  };

  function typedBody() {
    let information = [];

    switch (props.type) {
      default:
        break;
      case "THEME":
        information = ["ID", "NAME"];
        break;
      case "THEMEDND":
        information = ["ID", "NAME"];
        break;
      case "SCENARIO":
        information = ["ID", "NAME", "THEMEID", "DESCRIPTION"];
        break;
      case "LANGUAGE":
        information = ["ID", "LABEL", "VALUE"];
        break;
      case "QUESTION":
        information = ["ID", "SCENARIOID", "LANGUAGECODE", "QUESTION"];
        break;
      case "USER":
        information = [
          "ID",
          "LANGUAGECODE",
          "FIRSTNAME",
          "LASTNAME",
          "MAIL",
          "TYPE",
        ];
        break;
    }

    return information;
  }

  const onDragEnd = (result) => {
    const { destination, source } = result;
    if (!destination) {
      return;
    }
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    let newState = [];
    newState = newState.concat(props.elements.slice(0, source.index));
    newState = newState.concat(props.elements.slice(source.index + 1));
    newState.splice(destination.index, 0, props.elements[source.index]);

    props.setElements(newState);
  };

  if (props.type === "THEMEDND") {
    return (
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="table">
          {(provided) => (
            <TableBody ref={provided.innerRef} {...provided.droppableProps}>
              {props.elements &&
                props.elements.map((el, index) => (
                  <Draggable
                    draggableId={`draggable-${el.id}`}
                    key={el.id}
                    index={index}
                  >
                    {(provided) => (
                      <TableRow
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={rowBackgroundColor(index)}
                      >
                        {typedBody().map((info, index) => {
                          return (
                            <TableCell key={index}>
                              {getElementInformation(el, info)}
                            </TableCell>
                          );
                        })}
                        <TableCell
                          align="center"
                          style={{ width: 100, padding: "0 16px 0 0" }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "flex-end",
                            }}
                          >
                            {typedActionButtons(
                              props.type,
                              el,
                              props.validIcon,
                              props.invalidIcon
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </Draggable>
                ))}
              {provided.placeholder}
            </TableBody>
          )}
        </Droppable>
      </DragDropContext>
    );
  }

  return (
    <TableBody>
      {props.elements.map((el, index) => (
        <TableRow key={el.id} className={rowBackgroundColor(index)}>
          {typedBody().map((info, index) => {
            return (
              <TableCell key={index}>
                {getElementInformation(el, info)}
              </TableCell>
            );
          })}
          <TableCell
            align="center"
            style={{ width: 100, padding: "0 16px 0 0" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              {typedActionButtons(
                props.type,
                el,
                props.validIcon,
                props.invalidIcon
              )}
            </div>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
}

TableBodyComponent.propTypes = {
  type: PropTypes.oneOf([
    "THEMEDND",
    "THEME",
    "SCENARIO",
    "QUESTION",
    "LANGUAGE",
    "USER",
  ]).isRequired,
  elements: PropTypes.array.isRequired,
  setElements: PropTypes.func,
  validIcon: PropTypes.object.isRequired,
  invalidIcon: PropTypes.object.isRequired,
};

export default TableBodyComponent;
