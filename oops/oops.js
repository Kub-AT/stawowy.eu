(function () {
  'use strict';

  var container = document.getElementById('oops-log');
  if (!container) return;
  container.textContent = '';

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function addPrompt(cmdText) {
    var line = el('div', 'terminal-line');
    line.appendChild(el('span', 't-prompt', 'root@localhost'));
    line.appendChild(el('span', 't-sep', ':'));
    line.appendChild(el('span', 't-dir', '/'));
    line.appendChild(el('span', 't-dollar', '#'));
    line.appendChild(el('span', 't-cmd', cmdText));
    container.appendChild(line);
  }

  function addOut(text) {
    container.appendChild(el('div', 'terminal-output', text));
  }

  function addCursorLine() {
    var line = el('div', 'terminal-line');
    line.appendChild(el('span', 't-prompt', 'root@localhost'));
    line.appendChild(el('span', 't-sep', ':'));
    line.appendChild(el('span', 't-dir', '/'));
    line.appendChild(el('span', 't-dollar', '#'));
    var cursor = el('span', 'cursor', '█');
    line.appendChild(cursor);
    container.appendChild(line);
  }

  addPrompt('rm -rf /');

  var steps = [
    { t: 250,  text: '> resolving / … ok' },
    { t: 520,  text: '> this is fine.' },
    { t: 820,  text: '> deleting: /bin  /etc  /home  /var' },
    { t: 1100, text: '> deleting: /usr  /opt  /tmp  /lost+found' },
    { t: 1380, text: '> removing feelings… ok' },
    { t: 1650, text: '> removed 1337 files (and 0 responsibilities)' },
    { t: 1950, text: '> done.' },
    { t: 2250, text: '> jk. still alive.' },
  ];

  steps.forEach(function (s) {
    setTimeout(function () { addOut(s.text); }, s.t);
  });

  setTimeout(function () {
    addCursorLine();
  }, steps[steps.length - 1].t + 350);
})();
