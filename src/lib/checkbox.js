(function () {
  function updateParent(parent) {
    const children = getChildren(parent);
    const checkedCount = children.filter(c => c.checked).length;
    if (checkedCount === 0) {
      parent.checked = false;
      parent.indeterminate = false;
    } else if (checkedCount === children.length) {
      parent.checked = true;
      parent.indeterminate = false;
    } else {
      parent.checked = false;
      parent.indeterminate = true;
    }
  }

  function getChildren(parent) {
    const group = parent.closest('[data-cb-group]');
    if (!group) return [];
    return Array.from(group.querySelectorAll('.cb-input[data-cb-child]'));
  }

  function getParent(child) {
    const group = child.closest('[data-cb-group]');
    if (!group) return null;
    return group.querySelector('.cb-input[data-cb-parent]');
  }

  function handleChange(e) {
    const input = e.target;
    if (!input.classList.contains('cb-input')) return;

    if (input.hasAttribute('data-cb-parent')) {
      const group = input.closest('[data-cb-group]');
      if (!group) return;
      const children = group.querySelectorAll('.cb-input[data-cb-child]');
      children.forEach(c => { c.checked = input.checked; });
    }

    if (input.hasAttribute('data-cb-child')) {
      const parent = getParent(input);
      if (parent) updateParent(parent);
    }
  }

  function handleKeydown(e) {
    if (e.key !== 'Enter') return;
    const input = e.target;
    if (!input.classList.contains('cb-input')) return;
    input.checked = !input.checked;
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function init(root) {
    const el = root || document;
    el.addEventListener('change', handleChange);
    el.addEventListener('keydown', handleKeydown);

    el.querySelectorAll('[data-cb-group]').forEach(group => {
      const parent = group.querySelector('.cb-input[data-cb-parent]');
      if (parent) updateParent(parent);
    });
  }

  window.CheckboxUI = { init };
  document.addEventListener('DOMContentLoaded', () => init());
})();
