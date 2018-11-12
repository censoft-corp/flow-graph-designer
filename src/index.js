import Designer from "./components/container";
import { setLang } from "./utils";
export default function({ lang = "zh_CN" }) {
  setLang(lang);
  return Designer;
}

export { colors } from "./style";
