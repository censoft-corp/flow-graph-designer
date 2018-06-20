import React from "react";
import { getTemplate } from "../utils";
import css from "./toolbar.less";

const DRAG_IMAGE_DOM_ID = "flow-icon-draged-image";
class Toolbar extends React.Component {
  handleDragStart({ typeId, title }) {
    return e => {
      e.dataTransfer.setData("dragId", typeId);
      e.dataTransfer.setData("nodeName", title);
      e.dataTransfer.setData("method", "new");
      const dragImage = e.target.cloneNode();
      dragImage.innerHTML = title;
      dragImage.style.width = "150px";
      dragImage.style.height = "23px";
      dragImage.style.display = "block";
      dragImage.style.border = "1px solid black";
      dragImage.style.backgroundColor = "lightyellow";
      dragImage.style.textAlign = "center";
      dragImage.id = DRAG_IMAGE_DOM_ID;
      document.body.append(dragImage);
      dragImage.style.position = "absolute";
      dragImage.style.left = "-100px";
      dragImage.style.top = "-100px";
      e.dataTransfer.setDragImage(dragImage, 10, 10);
    };
  }
  handleDragEnd() {
    // 删除拖拽的图片
    const dragImage = document.getElementById(DRAG_IMAGE_DOM_ID);
    if (dragImage) {
      document.body.removeChild(dragImage);
    }
  }
  render() {
    const {
      nodes,
      entities: { node: nodeEntity },
    } = getTemplate();
    return (
      <div className={`flow-icon-toolbar ${css.mainClass}`}>
        {nodes.filter(x => nodeEntity[x].props.showInToolbar === "Y").map(x => (
          <div
            className="icon-wrap"
            key={x}
            title={nodeEntity[x].props.title}
            draggable="true"
            onDragStart={this.handleDragStart({
              typeId: nodeEntity[x].props.typeId,
              title: nodeEntity[x].props.title,
            })}
            onDragEnd={this.handleDragEnd}>
            <div className="icon">
              <img src={nodeEntity[x].icon} alt="" />
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export default Toolbar;
