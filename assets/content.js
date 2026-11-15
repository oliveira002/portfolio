// Loads content.json and turns its text into safe HTML.

export async function loadContent() {
  const response = await fetch('content.json', { cache: 'no-cache' });
  if (!response.ok) throw new Error(`content.json: ${response.status}`);
  return response.json();
}

export function escape(text) {
  return String(text ?? '').replace(/[&<>"']/g, char => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]
  ));
}

// The only formatting content.json supports: **bold**.
export function rich(text) {
  return escape(text).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
}

export function period(item) {
  return [item.start, item.end].filter(Boolean).join(' – ');
}

// Fills every element marked data-field="name" with the matching top-level text.
export function fillFields(content) {
  document.querySelectorAll('[data-field]').forEach(element => {
    element.textContent = content[element.dataset.field] ?? '';
  });
}
