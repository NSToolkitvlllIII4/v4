// Report pane. Features push content in with: bus.emit('report:update', node)
// It only accepts DOM nodes (never HTML strings), so nothing unsanitized can land here.
export function mountReport({ bus }) {
  const output = document.getElementById('report-output');
  const empty = output.innerHTML;

  bus.on('report:update', (node) => output.replaceChildren(node));
  bus.on('report:clear', () => { output.innerHTML = empty; });
}
