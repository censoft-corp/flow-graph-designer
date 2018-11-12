import PropTypes from "prop-types";
import React from "react";
import { createPortal } from "react-dom";
import { image } from "../constants";
import {
  getNewFlowByAdd,
  getNewFlowByCopy,
  getNewFlowByDel,
  getNewFlowByMove,
  getNewIdFunc,
  getNewNode,
  getNodeById,
  getParentNodeById,
  getColorByNode,
} from "../utils";
import Recycle from "./recycle";
import css from "./workspace.less";

const UNEXPAND_STATE_ID_PREFIX = "unexpand-state-id-";
class Workspace extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleDragOver = this.handleDragOver.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.renderLine = this.renderLine.bind(this);
    this.renderNode = this.renderNode.bind(this);
    this.handleClearState = this.handleClearState.bind(this);
  }
  handleClick(id) {
    return e => {
      e.stopPropagation();
      this.setState({
        currentNode: id,
      });
      if (this.props.onClick && typeof this.props.onClick === "function") {
        this.props.onClick(id);
      }
    };
  }
  handleClickExpandIcon(id) {
    return e => {
      e.stopPropagation();
      const stateId = `${UNEXPAND_STATE_ID_PREFIX}${id}`;
      this.setState({
        [stateId]: !this.state[stateId],
      });
    };
  }
  handleDragStart(id) {
    return e => {
      e.dataTransfer.setData("dragId", id);
      e.dataTransfer.setDragImage(e.target, 10, 10);
      e.stopPropagation();
      const dragNode = getNodeById(this.state.data, id);
      const isDragCase = dragNode.type === "case";
      this.setState({
        dragId: id,
        isDragCase,
      });
    };
  }
  handleDragOver({ containerId, containerIndex }) {
    return e => {
      e.preventDefault();
      e.stopPropagation();
      if (
        this.state.containerId !== containerId ||
        this.state.containerInedx !== containerIndex
      ) {
        this.setState({
          containerId,
          containerIndex,
        });
      }
    };
  }
  handleDragLeave({ containerId, containerIndex }) {
    return e => {
      e.stopPropagation();
      if (
        this.state.containerId === containerId &&
        this.state.containerIndex === containerIndex
      ) {
        this.setState({
          containerId: null,
          containerIndex: null,
        });
      }
    };
  }
  handleClearState() {
    this.setState({
      containerId: null,
      containerIndex: null,
      dragId: null,
      isDragCase: false,
    });
  }
  handleDrop(e) {
    e.stopPropagation();
    const sourceId = e.dataTransfer.getData("dragId");
    const nodeName = e.dataTransfer.getData("nodeName");
    const method = e.dataTransfer.getData("method");
    const { containerId, containerIndex } = this.state;
    // 如果是从图标栏拖拽节点到垃圾箱，取消拖拽动作并返回
    if (method === "new" && containerId === "recycle") {
      this.handleClearState();
      return;
    }
    // 创建新的节点
    if (method === "new") {
      const type = e.dataTransfer.getData("type");
      const action = e.dataTransfer.getData("action");
      const node = getNewNode(
        type,
        action,
        nodeName,
        getNewIdFunc(this.state.data)
      );
      // 在流程配置中增加新建的节点
      const { flow, nodes } = getNewFlowByAdd({
        config: this.state.data,
        node,
        containerId,
        containerIndex,
      });
      if (this.props.onChange && typeof this.props.onChange === "function") {
        this.props.onChange({
          data: flow,
          detail: {
            action: "add",
            position: { id: containerId, index: containerIndex },
            nodes,
          },
        });
      }
      this.handleClearState();
      this.setState({ data: flow });
      return;
    }
    const { data: prevData } = this.state;
    const sourceParentNode = getParentNodeById(prevData, sourceId);
    const sourceIndex = sourceParentNode.children.findIndex(
      x => x.id === sourceId
    );
    if (containerId === "recycle") {
      const { flow, nodes } = getNewFlowByDel({
        config: this.state.data,
        sourceId,
      });
      if (this.props.onChange && typeof this.props.onChange === "function") {
        this.props.onChange({
          data: flow,
          detail: {
            action: "del",
            position: { id: sourceParentNode.id, index: sourceIndex },
            nodes,
          },
        });
      }
      this.handleClearState();
      this.setState({ data: flow });
      return;
    }
    const action =
      e.nativeEvent.ctrlKey || e.nativeEvent.metaKey ? "copy" : "move";

    if (action === "move") {
      // 如果新的位置和当前位置没有变化，取消行动
      if (
        sourceParentNode.id === containerId &&
        (containerIndex === sourceIndex || containerIndex === sourceIndex + 1)
      ) {
        this.handleClearState();
        return;
      }
    }
    if (action === "copy") {
      const { data, copyDetail } = getNewFlowByCopy({
        config: prevData,
        sourceId,
        containerId,
        containerIndex,
      });
      if (this.props.onChange && typeof this.props.onChange === "function") {
        this.props.onChange({
          data,
          detail: {
            action: "copy",
            position: { id: sourceParentNode.id, index: sourceIndex },
            position2: { id: containerId, index: containerIndex },
            nodes: copyDetail.map(x => x.from),
            nodes2: copyDetail.map(x => x.to),
          },
        });
      }
      this.handleClearState();
      this.setState({ data });
      return;
    } else if (action === "move") {
      const { flow, nodes } = getNewFlowByMove({
        config: prevData,
        sourceId,
        containerId,
        containerIndex,
      });
      if (flow === prevData) {
        this.handleClearState();
        return;
      }
      if (this.props.onChange && typeof this.props.onChange === "function") {
        this.props.onChange({
          data: flow,
          detail: {
            action: "move",
            position: { id: sourceParentNode.id, index: sourceIndex },
            position2: { id: containerId, index: containerIndex },
            nodes,
          },
        });
      }
      this.handleClearState();
      this.setState({ data: flow });
      return;
    }
  }
  renderLine({ containerId, containerIndex, hasArrow, style }) {
    const arrowClassName = hasArrow ? "arrow-line" : "";
    const dragoverClassName =
      this.state.containerId === containerId &&
      this.state.containerIndex === containerIndex
        ? "dragover"
        : "";
    return (
      <div
        className={`flow-line ${arrowClassName} ${dragoverClassName}`}
        key={`line-${containerId}:{containerIndex}`}
        style={style}
        onDragOver={this.handleDragOver({ containerId, containerIndex })}
        onDragLeave={this.handleDragLeave({ containerId, containerIndex })}
        onDrop={this.handleDrop}>
        <div className="line" />
        <div className="rect" />
        <div className="line" />
        {hasArrow && <div className="arrow" />}
      </div>
    );
  }
  renderHalfHeightLine() {
    return (
      <div className="flow-line">
        <div className="line" />
      </div>
    );
  }

  renderNode(node) {
    const unexpandState = this.state[`${UNEXPAND_STATE_ID_PREFIX}${node.id}`];
    if (node.type === "loop") {
      return (
        <div
          key={node.id}
          onClick={this.handleClick(node.id)}
          className={`${unexpandState ? "unexpand" : ""} flow-node loop ${
            this.state.dragId === node.id ? "draged" : ""
          } ${this.state.currentNode === node.id ? "clicked" : ""}`}
          draggable="true"
          onDragStart={this.handleDragStart(node.id)}>
          <div className="title" onClick={this.handleClickExpandIcon(node.id)}>
            <div>
              <img className="expand-icon" src={image.expand} />
              <img className="unexpand-icon" src={image.unexpand} />
              <span style={{ verticalAlign: "top" }}>{node.name}</span>
              <img
                src={image.loop}
                style={{
                  width: "18px",
                  height: "18px",
                  marginLeft: "4px",
                  marginTop: "2px",
                }}
              />
            </div>
          </div>
          {this.renderLine({ containerId: node.id, containerIndex: 0 })}
          <div className="flow-body">
            {node.children.map((x, index) => [
              this.renderNode(x),
              this.renderLine({
                containerId: node.id,
                containerIndex: index + 1,
                hasArrow: true,
              }),
            ])}
          </div>
        </div>
      );
    } else if (node.type === "switch") {
      return (
        <div
          key={node.id}
          className={`${unexpandState ? "unexpand" : ""} flow-node switch ${
            this.state.dragId === node.id ? "draged" : ""
          } ${this.state.currentNode === node.id ? "clicked" : ""}`}
          draggable="true"
          onClick={this.handleClick(node.id)}
          onDragStart={this.handleDragStart(node.id)}>
          <div className="title" onClick={this.handleClickExpandIcon(node.id)}>
            <div>
              <img className="expand-icon" src={image.expand} />
              <img className="unexpand-icon" src={image.unexpand} />
              <span style={{ verticalAlign: "top" }}>{node.name}</span>
              <img
                src={image.switch}
                style={{
                  width: "18px",
                  height: "18px",
                  marginLeft: "4px",
                  marginTop: "3px",
                }}
              />
            </div>
          </div>
          {this.renderHalfHeightLine()}
          <div className="switch-body">
            {node.children.map((x, index) => [
              <div className={`flow-node case`} key={`flow-node-${x.id}`}>
                <div className="flow-node-line-up">
                  <div className="line left-div" />
                  <div className="line right-div" />
                </div>
                <div className="flow-node-rect-wrap">
                  <div
                    className={`flow-node-rect ${
                      this.state.dragId === x.id ? "draged" : ""
                    } ${this.state.currentNode === x.id ? "clicked" : ""}`}
                    draggable="true"
                    onClick={this.handleClick(x.id)}
                    onDragStart={this.handleDragStart(x.id)}
                    onDragOver={this.handleDragOver({
                      containerId: node.id,
                      containerIndex: index + 1,
                      id: x.id,
                    })}
                    onDragLeave={this.handleDragLeave({
                      containerId: node.id,
                      containerIndex: index + 1,
                    })}
                    onDrop={this.handleDrop}>
                    <div className="title">
                      <div>{x.name}</div>
                      <img
                        src={image.case}
                        style={{ width: "18px", height: "18px" }}
                      />
                    </div>
                    {this.renderLine({
                      containerId: x.id,
                      containerIndex: 0,
                      style: {
                        flexGrow: x.children && x.children.length ? 0 : 1,
                      },
                    })}
                    <div className="flow-body">
                      {x.children &&
                        x.children.map((y, yIndex) => [
                          this.renderNode(y),
                          this.renderLine({
                            containerId: x.id,
                            containerIndex: yIndex + 1,
                            hasArrow: true,
                          }),
                        ])}
                    </div>
                  </div>
                  {this.state.containerId === node.id &&
                    this.state.containerIndex === index + 1 &&
                    this.state.isDragCase &&
                    this.state.dragId !== x.id && (
                      <div className="insert-rect-space" />
                    )}
                </div>
                <div className="flow-node-line-down">
                  <div className="line left-div" />
                  <div className="line right-div" />
                </div>
              </div>,
            ])}
          </div>
          {this.renderHalfHeightLine()}
        </div>
      );
    }
    const color = getColorByNode(node, this.props.template);
    return (
      <div
        key={node.id}
        className={`flow-node normal ${
          this.state.dragId === node.id ? "draged" : ""
        } ${this.state.currentNode === node.id ? "clicked" : ""}`}
        style={{
          backgroundColor: color,
          boxShadow: `0 0 0 2px white, 0 0 0 3px ${color}`,
        }}
        onClick={this.handleClick(node.id)}
        draggable="true"
        onDragStart={this.handleDragStart(node.id)}>
        {node.name || "节点"}
      </div>
    );
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    // render 函数将根据 state 中的 data 进行渲染
    // state 中的 data 除了会被 props 更新外，也会被用户的拖拽操作设置

    const data = (_data => {
      if (!_data) {
        return { id: "root", children: [] };
      }
      if (!_data.children) {
        return {
          ..._data,
          children: [],
        };
      }
      return _data;
    })(nextProps.data);
    const dataFromProps = JSON.stringify(data);
    if (!prevState.dataFromProps || dataFromProps !== prevState.dataFromProps) {
      // 如果 props 中的 data 发生了变化，修改 state 中的 data
      return {
        _has_getDerivedStateFromProps_func: true,
        dataFromProps, // 记录每次从 props 获取到的 data 对象
        data: data,
      };
    }
    return null;
  }
  render() {
    if (!this.state._has_getDerivedStateFromProps_func) {
      console.error(
        "Component flow-graph-designer need react with version 16.4 or above."
      );
      return null;
    }
    if (!this.state.data) {
      return null;
    }
    const theme = this.props.theme || "theme-1";
    return (
      <div
        className={`flow-designer-workspace-wrap ${css.mainClass}`}
        style={this.props.style || {}}
        onClick={this.handleClearState}>
        {window.recycleWrap &&
          createPortal(
            <Recycle
              visible={!!this.state.dragId}
              onDragOver={this.handleDragOver({
                containerId: "recycle",
                containerIndex: null,
              })}
              onDragLeave={this.handleDragLeave({
                containerId: "recycle",
                containerIndex: null,
              })}
              onDrop={this.handleDrop}
            />,
            window.recycleWrap
          )}
        <div className={`main ${theme}`}>
          <div className="flow-body root">
            <div className="node-begin">
              <img
                src={image.begin}
                style={{ width: "32px", height: "32px" }}
              />
            </div>
            {this.renderLine({ containerId: "root", containerIndex: 0 })}
            {this.state.data.children.map((x, index) => {
              const hasArrow = index !== this.state.data.children.length - 1;

              return [
                this.renderNode(x),
                this.renderLine({
                  containerId: "root",
                  containerIndex: index + 1,
                  hasArrow,
                }),
              ];
            })}
            <div className="node-end">
              <img src={image.end} style={{ width: "32px", height: "32px" }} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Workspace.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.string,
    children: PropTypes.array,
  }),
  template: PropTypes.object,
  theme: PropTypes.string,
  style: PropTypes.object,
  onClick: PropTypes.func,
  onChange: PropTypes.func,
};
export default Workspace;
