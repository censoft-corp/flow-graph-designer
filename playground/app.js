import React, { Component } from "react";
import getDesigner from "../src";
import { render } from "react-dom";
import jsBeautify from "js-beautify";
const Designer = getDesigner({ lang: "zh_CN" });

function beautifyConfig(code) {
  return jsBeautify(code, {
    indent_size: 2,
    indent_char: " ",
    wrap_line_length: 100,
  });
}
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      flow: { id: "root", children: [] },
    };
    this.onChange = this.onChange.bind(this);
  }

  // fire when flow has been changed.
  onChange({ flow, detail }) {
    console.log("you change the flow.", flow, detail);
    this.setState({
      flow,
    });
  }
  // fire when node has been clicked.
  onClickNode(node) {
    console.log(`you click node(${node})`);
  }

  render() {
    const flowStr = JSON.stringify(this.state.flow);
    const flowText = beautifyConfig(flowStr);
    return (
      <div style={{ display: "flex", flexDirection: "row", height: "500px" }}>
        <div
          style={{
            flexGrow: 0,
            border: "1px solid red",
            margin: "10px",
            padding: "1px",
            overflow: "auto",
            width: "50%",
          }}>
          <pre>{flowText}</pre>
        </div>
        <div
          style={{
            flexGrow: 0,
            border: "1px solid red",
            margin: "10px",
            width: "50%",
          }}>
          <Designer
            flow={this.state.flow}
            onChange={this.onChange}
            onClick={this.onClick}
          />
        </div>
      </div>
    );
  }
}

render(<App />, document.getElementById("app"));
