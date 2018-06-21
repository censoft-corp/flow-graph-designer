import Designer from "./components/container";
import { setLang, setTemplate } from "./utils";
export default function({ lang = "zh_CN", template }) {
  setLang(lang);
  if (template) {
    setTemplate(template);
  }
  return Designer;
}
