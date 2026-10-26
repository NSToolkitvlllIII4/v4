// Writes rich text to the clipboard: { html, text } -> true if it worked.
// Modern path first (keeps both versions). If the browser lacks it, or refuses, a fallback
// that supplies the same two versions through the old copy command.
export async function writeClipboard({ html, text }) {
  if (navigator.clipboard?.write && window.ClipboardItem) {
    try {
      await navigator.clipboard.write([new ClipboardItem({
        'text/html': new Blob([html], { type: 'text/html' }),
        'text/plain': new Blob([text], { type: 'text/plain' }),
      })]);
      return true;
    } catch (err) {
      console.warn('[clipboard] async copy failed, trying fallback', err);
    }
  }
  return legacyCopy({ html, text });
}

function legacyCopy({ html, text }) {
  const previous = document.activeElement;
  // Some browsers only fire "copy" when something is selected.
  const box = document.createElement('textarea');
  box.value = text;
  box.setAttribute('aria-hidden', 'true');
  box.style.position = 'fixed';
  box.style.opacity = '0';
  document.body.append(box);
  box.select();

  const onCopy = (e) => {
    e.clipboardData.setData('text/html', html);
    e.clipboardData.setData('text/plain', text);
    e.preventDefault();
  };
  document.addEventListener('copy', onCopy, { once: true });

  let ok = false;
  try { ok = document.execCommand('copy'); } catch { /* not allowed */ }

  document.removeEventListener('copy', onCopy);
  box.remove();
  previous?.focus?.();
  return ok;
}
