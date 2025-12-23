export function createElement(tag, props = {}, ...children) {
  const element = document.createElement(tag);

  Object.entries(props).forEach(([key, value]) => {
    if (key === 'className') {
      element.className = value;
    } else if (key.startsWith('on') && typeof value === 'function') {
      const eventName = key.slice(2).toLowerCase();
      element.addEventListener(eventName, value);
    } else if (key === 'style' && typeof value === 'object') {
      Object.assign(element.style, value);
    } else {
      element.setAttribute(key, value);
    }
  });

  children.flat().forEach(child => {
    if (typeof child === 'string') {
      element.appendChild(document.createTextNode(child));
    } else if (child instanceof Node) {
      element.appendChild(child);
    }
  });

  return element;
}

export function mount(element, container) {
  if (typeof container === 'string') {
    container = document.querySelector(container);
  }
  if (container) {
    container.innerHTML = '';
    container.appendChild(element);
  }
}

export function html(strings, ...values) {
  const htmlString = strings.reduce((acc, str, i) => {
    return acc + str + (values[i] || '');
  }, '');

  const template = document.createElement('template');
  template.innerHTML = htmlString.trim();
  return template.content.firstChild;
}
