import produce from "immer";
import { colors, defaultColor } from "./style";
let lang = "en_US";

export function setLang(lg) {
  lang = lg;
}

export function getLang() {
  return lang;
}
export function getNodeById(node, id) {
  if (node.id === id) {
    return node;
  }
  if (node.children) {
    for (let i = 0; i < node.children.length; i += 1) {
      const nodeRes = getNodeById(node.children[i], id);
      if (nodeRes) {
        return nodeRes;
      }
    }
  }
  return null;
}
export function getParentNodeById(node, id) {
  if (!node.children) {
    return null;
  }
  if (node.children.find(x => x.id === id)) {
    return node;
  }
  for (let i = 0; i < node.children.length; i += 1) {
    const nodeRes = getParentNodeById(node.children[i], id);
    if (nodeRes) {
      return nodeRes;
    }
  }
  return null;
}

export function getPasteResultById(config, node, newIdFunc) {
  const copyResult = { node: {}, copyDetail: [] };
  const copydNode = node; // 拷贝节点
  const newIds = []; // 存储新创建的ID
  // 处理克隆后的节点，重新设置节点的ID
  const processcopydNode = node => {
    const prevId = node.id;
    const nextId = newIdFunc(newIds); // 传递新创建的ID，避免重复
    newIds.push(nextId);
    node.id = nextId;
    copyResult.copyDetail.push({ from: prevId, to: nextId });
    if (node.children) {
      for (let i = 0; i < node.children.length; i += 1) {
        processcopydNode(node.children[i]);
      }
    }
  };
  processcopydNode(copydNode);
  copyResult.node = copydNode;
  return copyResult;
}
export function getcopyResultById(config, id, newIdFunc) {
  const copyResult = { node: {}, copyDetail: [] };
  const sourceNode = getNodeById(config, id); // 源节点
  const str = JSON.stringify(sourceNode);
  const copydNode = JSON.parse(str); // 拷贝节点
  const newIds = []; // 存储新创建的ID
  // 处理克隆后的节点，重新设置节点的ID
  const processcopydNode = node => {
    const prevId = node.id;
    const nextId = newIdFunc(newIds); // 传递新创建的ID，避免重复
    newIds.push(nextId);
    node.id = nextId;
    copyResult.copyDetail.push({ from: prevId, to: nextId });
    if (node.children) {
      for (let i = 0; i < node.children.length; i += 1) {
        processcopydNode(node.children[i]);
      }
    }
  };
  processcopydNode(copydNode);
  copyResult.node = copydNode;
  return copyResult;
}
/**
 * 返回添加节点后的新流程对象，以及被添加的节点id数组
 * @param {*} param0
 */
export function getNewFlowByAdd({ config, node, containerId, containerIndex }) {
  const flow = produce(config, draft => {
    const containerNode = getNodeById(draft, containerId);
    // 【判断节点】不接受从图标栏拖拽其他节点
    if (containerNode.type === "switch") {
      return;
    }
    if (!containerNode.children) {
      containerNode.children = [];
    }
    containerNode.children.splice(containerIndex, 0, node);
  });
  const nodes = getAllId(node);
  return { flow, nodes };
}

// 返回节点的颜色
export function getColorByNode(node, template) {
  let color = defaultColor;
  if (node.color) {
    color = node.color;
  } else {
    const templateNodeId = template.nodes.find(
      x => template.entities.node[x].props.action === node.action
    );
    if (templateNodeId) {
      color = template.entities.node[templateNodeId].color || defaultColor;
    }
  }
  return (
    colors.find(x => x.name === color) ||
    colors.find(x => x.name === defaultColor)
  ).value;
}
// 返回包含节点及其子节点的所有ID的数组
export function getAllId(node) {
  const ids = [];
  const pushId = n => {
    ids.push(n.id);
    if (n.children && n.children.length) {
      for (let i = 0; i < n.children.length; i += 1) {
        pushId(n.children[i]);
      }
    }
  };
  pushId(node);
  return ids;
}
/**
 * 返回删除节点后的新流程对象，以及被删除的节点id数组
 * @param {*} param0
 */
export function getNewFlowByDel({ config, sourceId }) {
  const nodes = [];
  const flow = produce(config, draft => {
    const sourceParentNode = getParentNodeById(draft, sourceId);
    const sourceIndex = sourceParentNode.children.findIndex(
      x => x.id === sourceId
    );
    const sourceNode = sourceParentNode.children[sourceIndex];
    if (sourceNode.children && sourceNode.children.length) {
      const shouldDeleteNodeIds = getAllId(sourceNode);
      for (let i = 0; i < shouldDeleteNodeIds.length; i += 1) {
        nodes.push(shouldDeleteNodeIds[i]);
      }
    }
    // 删除移动的节点
    sourceParentNode.children.splice(sourceIndex, 1);
    // 如果拖拽的节点是条件分支并且是唯一分支，删除整个判断流程
    if (sourceNode.type === "case" && !sourceParentNode.children.length) {
      const switchParentNode = getParentNodeById(draft, sourceParentNode.id);
      const switchIndex = switchParentNode.children.findIndex(
        x => x.id === sourceParentNode.id
      );
      switchParentNode.children.splice(switchIndex, 1);
      nodes.push(sourceParentNode.id);
    }
    return;
  });
  return { flow, nodes };
}
export function getNewFlowByMove({
  config,
  sourceId,
  containerId,
  containerIndex,
}) {
  let nodes = [];
  const flow = produce(config, draft => {
    const sourceParentNode = getParentNodeById(draft, sourceId);
    const sourceIndex = sourceParentNode.children.findIndex(
      x => x.id === sourceId
    );
    const sourceNode = sourceParentNode.children[sourceIndex];
    nodes = getAllId(sourceNode);
    const containerNode = getNodeById(draft, containerId);
    // 【条件分支节点】只能移动或复制到【判断节点】
    if (sourceNode.type === "case" && containerNode.type !== "switch") {
      return;
    }

    // 其他节点不能移动或复制到【判断节点】
    if (sourceNode.type !== "case" && containerNode.type === "switch") {
      return;
    }
    // 如果只是在同一个容器中移动前后的顺序
    // 根据目标位置和当前位置的关系，计算节点被删除后再次插入的位置
    const newIndex =
      containerId === sourceParentNode.id && containerIndex > sourceIndex
        ? containerIndex - 1
        : containerIndex;
    sourceParentNode.children.splice(sourceIndex, 1);
    containerNode.children.splice(newIndex, 0, sourceNode);
    if (sourceNode.type === "case" && !sourceParentNode.children.length) {
      // 如果移动的是 switch 节点的唯一 case 节点，要删除 switch 节点
      const node = getParentNodeById(draft, sourceParentNode.id);
      const idnex = node.children.findIndex(x => x.id === sourceParentNode.id);
      node.children.splice(idnex, 1);
    }
  });
  return { flow, nodes };
}
/**
 * 返回节点粘贴后的新的流程对象，以及操作信息
 * @param {*} param0
 */
export function getNewFlowByPaste({
  config,
  sourceNode,
  containerId,
  containerIndex,
}) {
  let copyDetail = [];
  const data = produce(config, draft => {
    const containerNode = getNodeById(draft, containerId);
    const copyResult = getPasteResultById(
      config,
      sourceNode,
      getNewIdFunc(config)
    );
    copyDetail = copyResult.copyDetail;
    containerNode.children.splice(containerIndex, 0, copyResult.node);
  });
  return {
    data,
    copyDetail,
  };
}
/**
 * 返回节点拷贝后的新的流程对象，以及操作信息
 * @param {*} param0
 */
export function getNewFlowByCopy({
  config,
  sourceId,
  containerId,
  containerIndex,
}) {
  let copyDetail = [];
  const data = produce(config, draft => {
    const sourceParentNode = getParentNodeById(draft, sourceId);
    const sourceIndex = sourceParentNode.children.findIndex(
      x => x.id === sourceId
    );
    const sourceNode = sourceParentNode.children[sourceIndex];
    const containerNode = getNodeById(draft, containerId);
    // 【条件分支节点】只能移动或复制到【判断节点】
    if (sourceNode.type === "case" && containerNode.type !== "switch") {
      return;
    }
    // 其他节点不能移动或复制到【判断节点】
    if (sourceNode.type !== "case" && containerNode.type === "switch") {
      return;
    }
    const copyResult = getcopyResultById(
      config,
      sourceId,
      getNewIdFunc(config)
    );
    copyDetail = copyResult.copyDetail;
    containerNode.children.splice(containerIndex, 0, copyResult.node);
  });
  return {
    data,
    copyDetail,
  };
}

export function getNewNode(type, action, name, newIdFunc) {
  const newIds = [];
  const id = newIdFunc(newIds);
  newIds.push(id);
  const newNode = {
    id,
  };
  newNode.name = name;
  newNode.type = type;
  newNode.action = action;
  if (type === "loop") {
    newNode.type = "loop";
    newNode.children = [];
  } else if (type === "switch") {
    newNode.type = "switch";
    const caseId1 = newIdFunc(newIds);
    newIds.push(caseId1);
    const caseId2 = newIdFunc(newIds);
    newIds.push(caseId2);
    newNode.children = [
      {
        id: caseId1,
        type: "case",
        action: "case",
        name: `条件分支${caseId1}`,
        children: [],
      },
      {
        id: caseId2,
        type: "case",
        action: "case",
        name: `条件分支${caseId2}`,
        children: [],
      },
    ];
  }
  return newNode;
}

/**
 * 获取新的节点ID并保证唯一
 * @param {*} flow
 */
export const getNewIdFunc = (flow, prefix = "") => ids => {
  const prevIds = getAllId(flow);
  let id;
  let index = 0;
  do {
    index += 1;
    id = `${prefix}${index}`;
  } while (prevIds.includes(id) || ids.includes(id));
  return id;
};
