import { getLang } from "../utils";

const langs = {
  en_US: {
    loop: "loop",
    switch: "switch",
    case: "case",
  },
  zh_CN: {
    loop: "循环流程",
    switch: "判断流程",
    case: "条件分支",
  },
};

export default message => {
  return langs[getLang()][message];
};
