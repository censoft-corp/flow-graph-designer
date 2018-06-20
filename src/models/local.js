import { getLang } from "../utils";

const langs = {
  en_US: {
    loop: "loop",
    switch: "switch",
    case: "case",
  },
  zh_CN: {
    loop: "循环",
    switch: "判断",
    case: "分支",
  },
};

export default message => {
  return langs[getLang()][message];
};
