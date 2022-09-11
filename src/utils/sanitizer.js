import { stripHtml } from "string-strip-html";

function sanitaze(text) {
  return stripHtml(text).result.trim();
}

export { sanitaze };
