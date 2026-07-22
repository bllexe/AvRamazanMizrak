/**
 * Formats legal document text (KVKK, Privacy Policy, Terms of Use) into clean,
 * semantic HTML paragraphs, headings, lists, and bold text.
 */
export function formatLegalContent(rawContent: string): string {
  if (!rawContent || !rawContent.trim()) return '';

  const content = rawContent.trim();

  // Check if content already contains HTML block tags like <p>, <h2>, <ul>, <ol>, <div>, <br>
  const hasHtmlBlockTags = /<\/(p|h[1-6]|ul|ol|li|div|blockquote|section|article)>|<br\s*\/?>/i.test(content);

  if (hasHtmlBlockTags) {
    return content;
  }

  // Parse plain text / markdown into structured HTML blocks
  const blocks = content.split(/\r?\n\r?\n+/);

  const formattedBlocks = blocks.map((block) => {
    const trimmed = block.trim();
    if (!trimmed) return '';

    // 1. Markdown headers: ### Header, ## Header, # Header
    if (/^(#{1-4})\s+(.+)$/.test(trimmed)) {
      const match = trimmed.match(/^(#{1-4})\s+(.+)$/);
      if (match) {
        const level = match[1].length;
        const text = match[2];
        const tag = level === 1 ? 'h2' : 'h3';
        return `<${tag}>${formatInlineText(text)}</${tag}>`;
      }
    }

    const lines = trimmed.split(/\r?\n/);

    // 2. Section titles: E.g., "1. GİRİŞ VE KAPSAM", "MADDE 1 - AMAC", "KİŞİSEL VERİLERİN İŞLENME AMACI:"
    if (
      lines.length === 1 &&
      (/^(MADDE\s+\d+|[0-9]+\.|\b[A-ZÇĞİÖŞÜ0-9\s\.\,\-]{4,}\b:?)/.test(trimmed) && trimmed.length < 140)
    ) {
      return `<h3>${formatInlineText(trimmed)}</h3>`;
    }

    // 3. Bullet lists: Lines starting with -, *, •, or custom bullet characters
    const isBulletList = lines.every((line) => /^\s*[\-\*\•]\s+/.test(line.trim()));
    if (isBulletList) {
      const listItems = lines
        .map((line) => {
          const itemText = line.trim().replace(/^[\-\*\•]\s+/, '');
          return `<li>${formatInlineText(itemText)}</li>`;
        })
        .join('');
      return `<ul>${listItems}</ul>`;
    }

    // 4. Numbered lists: Lines starting with "1. ", "2) ", etc.
    const isNumberedList = lines.every((line) => /^\s*\d+[\.\)]\s+/.test(line.trim()));
    if (isNumberedList) {
      const listItems = lines
        .map((line) => {
          const match = line.trim().match(/^(\d+)[\.\)]\s+(.+)$/);
          if (match) {
            const itemText = match[2];
            return `<li>${formatInlineText(itemText)}</li>`;
          }
          return `<li>${formatInlineText(line)}</li>`;
        })
        .join('');
      return `<ol>${listItems}</ol>`;
    }

    // 5. Normal paragraphs
    const paragraphContent = lines
      .map((line) => formatInlineText(line.trim()))
      .join('<br />');

    return `<p>${paragraphContent}</p>`;
  });

  return formattedBlocks.filter(Boolean).join('\n');
}

function formatInlineText(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/__(.*?)__/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>');
}
