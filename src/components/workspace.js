import PropTypes from "prop-types";
import React from "react";
import { image } from "../constants";
import message from "../models/local";
import {
  getNewFlowAndCopyDetailByCopy,
  getNewFlowByAdd,
  getNewFlowByDel,
  getNewFlowByMove,
  getNewIdFunc,
  getNewNode,
  getNodeById,
  getParentNodeById,
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
    this.handleClearState = this.handleClearState.bind(this);
  }
  handleClick(id) {
    return e => {
      e.stopPropagation();
      this.setState({
        currentNode: id,
      });
      if (
        this.props.onClickNode &&
        typeof this.props.onClickNode === "function"
      ) {
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
      const dragNode = getNodeById(this.state.flow, id);
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
      const node = getNewNode(
        sourceId,
        nodeName,
        getNewIdFunc(this.state.flow)
      );
      // 在流程配置中增加新建的节点
      const flow = getNewFlowByAdd({
        config: this.state.flow,
        node,
        containerId,
        containerIndex,
      });
      if (this.props.onChange && typeof this.props.onChange === "function") {
        this.props.onChange({
          flow,
          detail: {
            action: "add",
            position: { id: containerId, index: containerIndex },
            node: node.id,
          },
        });
      }
      this.handleClearState();
      this.setState({ flow });
      return;
    }
    if (containerId === "recycle") {
      const newFlow = getNewFlowByDel({
        config: this.state.flow,
        sourceId,
      });
      if (this.props.onChange && typeof this.props.onChange === "function") {
        this.props.onChange({
          flow: newFlow,
          detail: {
            action: "del",
            position: { id: sourceParentNode, index: sourceIndex },
            node: sourceId,
          },
        });
      }
      this.handleClearState();
      return;
    }
    const { flow } = this.props;
    const action =
      e.nativeEvent.ctrlKey || e.nativeEvent.metaKey ? "copy" : "move";
    const sourceParentNode = getParentNodeById(flow, sourceId);
    const sourceIndex = sourceParentNode.children.findIndex(
      x => x.id === sourceId
    );
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
      const { newFlow, copyDetail } = getNewFlowAndCopyDetailByCopy({
        config: flow,
        sourceId,
        containerId,
        containerIndex,
      });
      if (this.props.onChange && typeof this.props.onChange === "function") {
        this.props.onChange({
          flow: newFlow,
          detail: {
            action: "copy",
            position: { id: sourceParentNode.id, index: sourceIndex },
            position2: { id: containerId, index: containerIndex },
            node: copyDetail.map(x => x.from)[0],
            node2: copyDetail.map(x => x.to)[0],
          },
        });
      }
      this.handleClearState();
      return;
    } else if (action === "move") {
      const newFlow = getNewFlowByMove({
        config: flow,
        sourceId,
        containerId,
        containerIndex,
      });
      if (this.props.onChange && typeof this.props.onChange === "function") {
        this.props.onChange({
          flow: newFlow,
          detail: {
            action: "move",
            position: { id: sourceParentNode.id, index: sourceIndex },
            position2: { id: containerId, index: containerIndex },
            node: sourceId,
          },
        });
      }
      this.handleClearState();
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
              <span style={{ verticalAlign: "top" }}>{message("loop")}</span>
            </div>
            <img src={image.loop} />
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
              <span style={{ verticalAlign: "top" }}>{message("switch")}</span>
            </div>
            <img src={image.switch} />
          </div>
          {this.renderHalfHeightLine()}
          <div className="switch-body">
            {node.children.map((x, index) => [
              <div className="flow-node case" key={`flow-node-${x.id}`}>
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
                      <div>{message("case")}</div>
                      <img src={image.case} />
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
    return (
      <div
        key={node.id}
        className={`flow-node normal ${
          this.state.dragId === node.id ? "draged" : ""
        } ${this.state.currentNode === node.id ? "clicked" : ""}`}
        onClick={this.handleClick(node.id)}
        draggable="true"
        onDragStart={this.handleDragStart(node.id)}>
        {node.name || "节点"}
      </div>
    );
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    // render 函数将根据 state 中的 flow 进行渲染
    // state 中的 flow 除了会被 props 更新外，也会被用户的拖拽操作设置
    const flowFromProps = JSON.stringify(nextProps.flow || {});
    if (flowFromProps !== prevState.flowFromProps) {
      // 如果 props 中的 flow 发生了变化，修改 state 中的 flow
      return {
        flowFromProps: JSON.stringify(nextProps.flow), // 记录每次从 props 获取到的 flow 对象
        flow: nextProps.flow,
      };
    }
    return null;
  }
  render() {
    if (!this.state.flow) {
      return null;
    }
    return (
      <div
        className={`flow-designer-workspace-wrap ${css.mainClass}`}
        style={this.props.style || {}}>
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
        />
        <div className="main">
          <div className="flow-body root">
            <div className="node-begin">
              <img src={image.begin} />
            </div>
            {this.renderLine({ containerId: "root", containerIndex: 0 })}
            {this.state.flow.children.map((x, index) => {
              const hasArrow = index !== this.state.flow.children.length - 1;

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
              <div className="img" title="结束" />
              <img src={image.end} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Workspace.propTypes = {
  flow: PropTypes.shape({
    id: PropTypes.string,
    children: PropTypes.array,
  }),
  style: PropTypes.object,
  onClick: PropTypes.func,
  onChange: PropTypes.func,
};
export default Workspace;
