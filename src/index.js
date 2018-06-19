import Designer from "./components/designer";
import { setLang, setSchema } from "./utils";
export default function({ lang = "zh_CN", schema }) {
  setLang(lang);
  if (schema) {
    setSchema(schema);
  }
  return Designer;
}
