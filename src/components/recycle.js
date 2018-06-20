import React, { Component } from "react";
import { image } from "../constants";
import PropTypes from "prop-types";

export default class Overlay extends Component {
  constructor(props) {
    super(props);
  }
  static propTypes = {
    visible: PropTypes.bool,
    onDragOver: PropTypes.func,
    onDragLeave: PropTypes.func,
    onDrop: PropTypes.func,
  };
  render() {
    const style = {
      backgroundColor: "#f1f1f1",
      border: "1px solid #e1e1e1",
      padding: "4px",
      position: "absolute",
      left: "10px",
      top: "10px",
      visibility: this.props.visible ? "visible" : "hidden",
    };
    return (
      <div
        style={style}
        onDragOver={this.props.onDragOver}
        onDragLeave={this.props.onDragLeave}
        onDrop={this.props.onDrop}>
        <img src={image.recycle} style={{ height: "48px", width: "48px" }} />
      </div>
    );
  }
}
