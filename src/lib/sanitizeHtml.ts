import sanitizeHtml from "sanitize-html";

export const sanitizeOption = {
  allowedTags: [
    "h1",
    "h2",
    "b",
    "i",
    "u",
    "s",
    "p",
    "ul",
    "ol",
    "li",
    "blockquote",
    "a",
    "img"
  ],
  allowedAttributes: {
    a: ["href", "name", "target"],
    img: ["src"],
    li: ["class"]
  },
  allowedSchemes: ["data", "http"]
};

// markdown에 악성코드 검사
export const removeHtmlAndShorten = (markdown: string): string => {
  const filtered: string = sanitizeHtml(markdown, {
    allowedTags: []
  });
  return filtered.length < 200 ? filtered : `${filtered.slice(0, 500)}`;
};
