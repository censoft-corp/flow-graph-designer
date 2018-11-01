import React from "react";
import css from "./container.less";
import Toolbar from "./toolbar";
import Workspace from "./workspace";

class Container extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    this.setState({
      height: this.container.offsetHeight,
    });
  }
  componentDidUpdate() {
    if (this.container.offsetHeight !== this.state.height) {
      this.setState({
        height: this.container.offsetHeight,
      });
    }
  }
  render() {
    const {
      template,
      data,
      style,
      workspaceStyle,
      onClick,
      onChange,
      iconWritingMode,
      theme,
    } = this.props;
    const renderToolbar = (iconSize = 34, toolbarPadding = 2) => {
      if (!this.state.height) {
        return null;
      }
      // 计算工具栏的宽度
      const {
        nodes,
        entities: { node: nodeEntity },
      } = this.props.template;
      const tools = nodes.filter(
        x => nodeEntity[x].props.showInToolbar === "Y"
      );
      const count = tools.length;
      const rows = Math.floor(
        (this.state.height - toolbarPadding * 2) / iconSize
      );
      const columns = Math.ceil(count / rows);
      const width = columns * iconSize;
      return (
        <Toolbar
          template={template}
          width={width}
          iconWritingMode={iconWritingMode}
        />
      );
    };
    return (
      <div
        className={css.mainClass}
        style={style}
        ref={container => {
          this.container = container;
        }}>
        {renderToolbar()}
        <Workspace
          data={data}
          style={workspaceStyle}
          theme={theme}
          onChange={onChange}
          onClick={onClick}
          recycleWrap={this.state.recycleWrapRef}
        />
        <div
          ref={ref => (window.recycleWrap = ref)}
          style={{ position: "absolute", left: "50px", top: "10px" }}
        />
      </div>
    );
  }
}

export default Container;
