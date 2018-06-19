import React, { Component } from "react";
import { image } from "../constants";
import PropTypes from "prop-types";
import css from "./recycle.less";

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
    return (
      <div
        className={`recycle ${css.mainClass}`}
        style={{ visibility: this.props.visible ? "visible" : "hidden" }}
        onDragOver={this.props.onDragOver}
        onDragLeave={this.props.onDragLeave}
        onDrop={this.props.onDrop}>
        <img src={image.recycle} />
      </div>
    );
  }
}
