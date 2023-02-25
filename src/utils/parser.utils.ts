export async function getParsedDocumentFromUrl(url: string): Promise<Document> {
  const data = await fetch(url);

  const html = await data.text();

  const parser = new DOMParser();
  return parser.parseFromString(html, "text/html");
}
