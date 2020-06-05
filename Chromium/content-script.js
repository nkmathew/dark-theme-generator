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

let getStyle = function (element, property) {
  return window.getComputedStyle
    ? window.getComputedStyle(element, null).getPropertyValue(property)
    : element.style[
        property.replace(/-([a-z])/g, function (g) {
          return g[1].toUpperCase();
        })
      ];
};

function darkTheme() {
  [...document.getElementsByTagName('*')].forEach((node) => {
    let tag = node.tagName.toLowerCase() || '';
    let ptag = node.parentNode.tagName;
    let pptag = null;
    if (node.parentNode && node.parentNode.parentNode) {
      pptag = node.parentNode.parentNode.tagName;
    }
    ptag = ptag ? ptag.toLowerCase() : '';
    pptag = pptag ? pptag.toLowerCase() : '';
    let biglink =
      (tag.startsWith('h') && ptag == 'a') ||
      (tag == 'a' && ptag.startsWith('h'));
    if (tag != 'video') {
      node.style.backgroundColor = '#191919';
      node.style.color = '#d1d1d1e6';
    }
    if (tag == 'p') {
      node.style.fontFamily = '"Segoe UI", Arial, san-serif';
      node.style.fontSize = '16px';
      node.style.lineHeight = '28px';
    } else if (tag == 'a' || biglink || pptag == 'a' || ptag == 'a') {
      node.style.fontFamily = 'Arial';
      node.style.color = '#4db2ec';
      node.style.boxShadow = 'none';
      node.style.textDecoration = 'none';
    } else if (tag == 'input') {
      node.style.borderRadius = '5px';
    } else if (['strong', 'b', 'em'].includes(tag)) {
      node.style.color = '#f2d297';
      node.style.fontWeight = 'normal';
    } else if (tag == 'img') {
      node.style.filter = 'brightness(0.8)';
    }
    node.style.borderColor = '#555';
    node.style.borderRadius = '5px';
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
  color: #ccc !important;
  font-family: "Segoe UI" !important;
  line-height: 28px;
  border-color: #555;
  /* font-weight: */
  /* font-size: 16px; */
}

a {
  color: #4db2ec;
  background: #191919 !important;
  border: 0 !important;
}

.social {
  display: none;
}

.image {
  filter: brightness(0.7);
}

input {
  background: var(--bg-alt);
  color: var(--fg);
  border-color: var(--border2);
}

div#gtx-host,
.jfk-bubble,
.jfk-bubble div,
.jfk-bubble-content-id {
  background: #ffdead !important;
  line-height: normal;
  border-radius: 5px;
  filter: invert(1);
}

td,
tr,
th,
tbody,
table {
  border-collapse: separate;
  border-color: #333 !important;
  border-radius: 2px;
}


hr {
  border-color: var(--border1) !important;
  background: var(--border1) !important;
}

em, bold, strong {
  color: #F2D297;
  font-weight: normal;
}

.td-pb-span8 {
  width: 100%;
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
  res = [
    'body',
    'html',
    'div',
    'span',
    'aside',
    'p',
    'header',
    'h1',
    'h2',
    'h3',
    'h4',
    'ul',
    'li',
    'input',
    'section',
    'nav',
    'table',
    'tr',
    'td',
  ];
  res = res.concat(definedProperties());
  res = definedProperties();
  res = joinSelectors(res);
  res += CSS;
  console.log(res);
  copyText(res);
}
