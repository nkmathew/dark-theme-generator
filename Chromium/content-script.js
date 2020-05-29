chrome.runtime.onMessage.addListener(function (request, _, sendResponse) {
  if (request.action == 'go-dark') {
    darkTheme();
  } else if (request.action == 'generate-theme') {
    generateTheme();
  }
});

// }}============================================================================={{

const dqs = (selector) => document.querySelector(selector);
const dqsa = (selector) => document.querySelectorAll(selector);

function darkTheme() {
  var getStyle = function (element, property) {
    return window.getComputedStyle
      ? window.getComputedStyle(element, null).getPropertyValue(property)
      : element.style[
          property.replace(/-([a-z])/g, function (g) {
            return g[1].toUpperCase();
          })
        ];
  };
  [...document.getElementsByTagName('*')].forEach((node) => {
    back = getStyle(node, 'background-color');
    node.style.backgroundColor = '#191919';
    node.style.color = 'rgb(209, 209, 209, 0.90)';
    let tagname = node.tagName.toLowerCase();
    if (tagname == 'p') {
      node.style.fontFamily = '"Segoe UI", Arial, san-serif';
      node.style.fontSize = '16px';
    } else if (tagname == 'a') {
      node.style.color = '#4db2ec';
    } else if (tagname == 'input') {
      node.style.borderColor = '#666';
      node.style.borderRadius = '5px';
    } else if (['strong', 'b', 'em'].includes(tagname)) {
      node.style.color = 'rgba(255, 228, 196, 0.76)';
      node.style.fontFamily = 'Roboto';
    }
  });
  console.log('Done themeing...');
}

function definedProperties() {
  let cssrules;
  let defined = [];
  for (var sheet of document.styleSheets) {
    try {
      cssrules = sheet.cssRules;
      console.log('Working: ', sheet.href);
    } catch (error) {
      console.log('Error', sheet.href);
      continue;
    }
    for (var rule of cssrules) {
      if (rule.style && (rule.style.color || rule.style.backgroundColor)) {
        let selector = rule.selectorText;
        defined.push(...selector.split(/,\s*/));
      }
    }
  }
  return defined;
}

function joinSelectors(res) {
  res = res
    .map((sel) => [sel, document.querySelector(sel)])
    .filter(([sel, node]) => node && node.tagName != 'A')
    .map(([sel, node]) => sel);
  res = [...new Set(res)];
  res.sort((a, b) => {
    a = ('~' + a).replace(/^(~[.#])/, '');
    b = ('~' + b).replace(/^(~[.#])/, '');
    return a < b ? -1 : a > b ? 1 : 0;
  });
  return res.join(',\n');
}

CSS = `

{
  background: #191919 !important;
  color: #ccc;
  font-family: "Segoe UI";
  line-height: 1.3;
}

a {
  color: #4db2ec;
}

`;

function copyText(text) {
  let input = document.querySelector('#copy-area');
  if (!input) {
    input = document.createElement('textarea');
    input.id = 'copy-area';
    document.body.appendChild(input);
  }
  input.style.position = 'fixed';
  input.style.top = '5%';
  input.style.display = 'block';
  input.style.marginLeft = '35%';
  input.style.width = '500px';
  input.style.height = '500px';
  input.value = text;
  setTimeout(() => {
    input.select();
  }, 500);
  input.addEventListener('click', (event) => {
    document.execCommand('copy');
    setTimeout(() => {
      event.target.style.display = 'none';
    });
  });
}

function generateTheme() {
  res = definedProperties();
  res = joinSelectors(res);
  res += CSS;
  console.log(res);
  copyText(res);
}
