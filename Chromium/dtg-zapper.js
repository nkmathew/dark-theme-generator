var Zapper = function () {

  var Stack = [];

  addStylesheet = (rules) => {
    let style = document.createElement('style');
    style.type = 'text/css';
    style.textContent = rules;
    style.id = 'dtg-zapper';
    document.querySelector('head').appendChild(style);
  };

  css = `

  .dtg-hover {
    background: red !important;
    border-color: yellow !important;
    border-style: dotted !important;
  }

  button.dtg-delete:hover {
    background: #378AD3;
  }

  button.dtg-delete {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99999999;
    margin: 10px 6px 6px 6px;
    background: black;
  }

  `;

  lastNode = null;

  nodeScanner = (event) => {
    if (lastNode != event.target) {
      if (lastNode != null) {
        lastNode.classList.remove('dtg-hover');
      }
      lastNode = event.target;
      if (!event.target.classList.contains('dtg-delete')) {
        event.target.classList.add('dtg-hover');
      }
    }
  };

  deleteNode = (event) => {
    let isProtected =
      event.target.classList.contains('dtg-delete') ||
      ['html', 'body'].includes(event.target.localName);
    if (isProtected) {
      return;
    }
    event.target.style.display = 'none';
    Stack.push(event.target);
    var label = `Undo (${Stack.length})`;
    document.querySelector('.dtg-delete').innerText = label;
  };

  stopZapper = (event) => {
    document.querySelector('.dtg-delete').innerText = 'Zap';

    let isEscape = event && event.key == 'Escape';
    if (isEscape || !event) {
      document.removeEventListener('mouseover', nodeScanner);
      document.removeEventListener('click', deleteNode);
      document.removeEventListener('keydown', stopZapper);

      document.querySelectorAll('a').forEach(function (node) {
        node.removeEventListener('click', preventClick);
      });

      var hover = document.querySelector('.dtg-hover');
      if (hover) {
        hover.classList.remove('dtg-hover');
      }
    }
  };

  preventClick = (event) => {
    event.preventDefault();
  };

  addStylesheet(css);

  startZapper = () => {
    document.addEventListener('mouseover', nodeScanner);
    document.addEventListener('click', deleteNode);
    document.addEventListener('keydown', stopZapper);
    document.querySelectorAll('a').forEach(function (node) {
      node.addEventListener('click', preventClick);
    });
  };

  let btnZap = document.querySelector('.dtg-delete');
  if (!btnZap) {
    btnZap = document.createElement('button');
  }
  btnZap.id = 'dtg-delete';
  btnZap.classList.add('dtg-delete');
  btnZap.innerText = 'Zap';
  btnZap.style.display = 'block';
  document.body.appendChild(btnZap);

  btnZap.addEventListener('click', (event) => {
    if (event.target.innerText.startsWith('Undo')) {
      if (Stack.length) {
        Stack.pop().style.display = '';
      }
    } else {
      startZapper();
    }
    var label = `Undo (${Stack.length})`;
    document.querySelector('.dtg-delete').innerText = label;
  });

  btnZap.addEventListener('contextmenu', (event) => {
    btnZap.style.display = 'none';
    stopZapper();
    event.preventDefault();
  });

};
