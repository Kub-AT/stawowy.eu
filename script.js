(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function calcUptime() {
    var start = new Date(2012, 0, 1);
    var years = Math.floor((Date.now() - start) / (365.25 * 24 * 60 * 60 * 1000));
    return 'up ' + years + ' years, still shipping';
  }

  var COMMANDS = [
    { cmd: 'whoami',                   out: 'Jakub Stawowy'                              },
    { cmd: 'echo $TITLE',              out: 'Senior Software Engineer'                   },
    { cmd: 'timedatectl | grep zone',  out: 'Time zone: Europe/Warsaw (Poznań / Remote)' },
    { cmd: 'systemctl status career',  out: 'Active: running since Jan 2012'             },
    { cmd: 'rm -rf /',                 out: null                                         },
  ];

  var container = document.getElementById('terminal-lines');
  if (!container) return;
  var rmReady = false;

  function makePromptLine() {
    var wrap   = document.createElement('div');
    wrap.className = 'terminal-line';

    function span(cls, text) {
      var el = document.createElement('span');
      el.className = cls;
      if (text) el.textContent = text;
      return el;
    }

    wrap.appendChild(span('t-prompt', 'jakub@stawowy.eu'));
    wrap.appendChild(span('t-sep',    ':'));
    wrap.appendChild(span('t-dir',    '~'));
    wrap.appendChild(span('t-dollar', '$'));

    var cmdEl    = span('t-cmd',  '');
    var cursorEl = span('cursor', '█');
    wrap.appendChild(cmdEl);
    wrap.appendChild(cursorEl);

    container.appendChild(wrap);
    return { cmdEl: cmdEl, cursorEl: cursorEl };
  }

  function makeOutput(text) {
    var el = document.createElement('div');
    el.className = 'terminal-output';
    el.textContent = '> ' + text;
    container.appendChild(el);
  }

  function showAll() {
    COMMANDS.forEach(function (item) {
      var els = makePromptLine();
      els.cmdEl.textContent = item.cmd;
      if (item.out === null) rmReady = true;
      if (item.out === null) return;
      els.cursorEl.remove();
      makeOutput(item.out);
    });
  }

  function runSequence(index) {
    if (index >= COMMANDS.length) return;

    var item = COMMANDS[index];
    var els  = makePromptLine();
    var i    = 0;

    function tick() {
      if (i < item.cmd.length) {
        els.cmdEl.textContent += item.cmd[i];
        i++;
        setTimeout(tick, 65 + Math.random() * 45);
      } else {
        if (item.out === null) { rmReady = true; return; } // keep cursor blinking, done
        els.cursorEl.remove();
        setTimeout(function () {
          makeOutput(item.out);
          if (index < COMMANDS.length - 1) {
            setTimeout(function () { runSequence(index + 1); }, 300);
          }
        }, 250);
      }
    }

    setTimeout(tick, index === 0 ? 600 : 180);
  }

  if (reducedMotion) {
    showAll();
  } else {
    runSequence(0);
  }

  var defaultTitle = document.title;
  window.addEventListener('blur',  function () { document.title = '[ idle ] jakub@stawowy.eu:~$'; });
  window.addEventListener('focus', function () { document.title = defaultTitle; });

  console.log('%cjakub@stawowy.eu:~$ ls -la /secrets', 'color:#50fa7b;font-family:monospace;font-size:13px;');
  console.log('%c> hey, you found the backdoor',        'color:#6272a4;font-family:monospace;font-size:12px;');
  console.log('%c> since you\'re here — let\'s talk',  'color:#6272a4;font-family:monospace;font-size:12px;');
  console.log('%c> linkedin.com/in/jakub-stawowy',      'color:#8be9fd;font-family:monospace;font-size:12px;');

  var backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    backToTopBtn.removeAttribute('hidden');
    window.addEventListener('scroll', function () {
      backToTopBtn.classList.toggle('visible', window.scrollY > 320);
    }, { passive: true });
    backToTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
    });
  }

  if (!CSS.supports('scroll-behavior', 'smooth')) {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var target = document.querySelector(this.getAttribute('href'));
        if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
      });
    });
  }

  var terminalWindow = document.querySelector('.terminal-window');
  var armed = false;
  var armedTimer = null;

  function setArmed(next) {
    armed = next;
    if (!terminalWindow) return;
    terminalWindow.classList.toggle('terminal-armed', armed);
    if (armedTimer) clearTimeout(armedTimer);
    if (armed) armedTimer = setTimeout(function () { setArmed(false); }, 6000);
  }

  if (terminalWindow) {
    terminalWindow.addEventListener('click', function () { setArmed(true); });
  }

  window.addEventListener('keydown', function (e) {
    if (!armed) return;
    if (e.key !== 'Enter') return;
    if (!rmReady) return;

    var lastCmd = COMMANDS[COMMANDS.length - 1];
    if (!lastCmd || lastCmd.cmd !== 'rm -rf /') return;

    var cursor = document.querySelector('#terminal-lines .cursor');
    if (!cursor) return;

    e.preventDefault();
    window.location.href = '/oops/';
  });
})();
