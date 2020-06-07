chrome.runtime.onMessage.addListener(function (request, _, sendResponse) {
  if (request.action == 'go-dark') {
    makePageDark();
  } else if (request.action == 'generate-theme') {
    generateTheme();
  } else if (request.action.startsWith('brightness')) {
    document.querySelector('html').style.filter = request.action;
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

function makePageDark() {
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
    let isPre = tag == 'pre' || ptag == 'pre' || pptag == 'pre' ||
      tag == 'code' || ptag == 'code' || pptag == 'code';
    if (tag != 'video' && !isPre) {
      node.style.backgroundColor = '#191919';
      node.style.color = '#d1d1d1e6';
    }
    if (tag == 'a' || biglink || pptag == 'a' || ptag == 'a') {
      node.style.fontFamily = 'Arial';
      node.style.color = '#4db2ec';
      node.style.boxShadow = 'none';
      node.style.textDecoration = 'none';
      node.target = '_blank';
    } else if (tag == 'input') {
      node.style.borderRadius = '5px';
    } else if (['strong', 'b', 'em'].includes(tag)) {
      node.style.color = '#f2d297';
      node.style.fontWeight = 'normal';
    } else if (tag == 'img') {
      node.style.filter = 'brightness(0.8)';
    } else if (isPre) {
      node.style.fontFamily = 'Consolas';
      node.style.background = '#2A3340';
      node.style.fontSize = '13px';
      node.style.lineHeight = '17px';
      node.style.color = '#ccc';
      if (node.classList.contains('hljs-number')) {
        node.style.color = '#FFA0A0';
      } else if (node.classList.contains('hljs-attr')) {
        node.style.color = '#ccc';
        if (/["'].+["']/.test(node.innerText)) {
          node.style.color = '#ff9800';
        }
      } else if (node.classList.contains('hljs-string')) {
        node.style.color = 'khaki';
      } else {
        if (tag == 'span' && /["'].+["']/.test(node.innerText)) {
          node.style.color = '#ff9800';
        }
      }
    } else if (['p', 'li'].includes(tag)) {
      node.style.fontFamily = '"Segoe UI", Arial, san-serif';
      node.style.fontSize = '16px';
      node.style.lineHeight = '28px';
    }
    node.style.borderColor = '#555';
    node.style.borderRadius = '5px';
    node.style.boxShadow = 'none';
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

ROOT = `

:root {

  --bg-card      : #343A40;
  --bg-pre       : #2A3340;
  --bg-quote     : #2B29298C;
  --blue         : #1A73E8;
  --bold         : #F2D297;
  --bold-1       : #FFE4C4C2;
  --border       : #555555;
  --border-1     : #616161;
  --border-2     : #FFFFFF1A;
  --border-3     : #333333;
  --border-quote : #565680;
  --btn-like     : #EF5466;
  --btn-shadow   : 0 0 5px #0F0F0F;
  --fg           : #CCCCCC;
  --fg-1         : #FFFFFF;
  --fg-2         : #F5DEB3;
  --fg-3         : #B3B3B3;
  --fg-input     : #FFFFFFE0;
  --gray         : #191919;
  --gray-1       : #000000;
  --gray-2       : #121212;
  --gray-3       : #222222;
  --gray-4       : #262626;
  --gray-5       : #2E2E2E;
  --gray-6       : #23232D;
  --gray-7       : #42424C;
  --gray-alt     : #121212;
  --green        : #228822;
  --pink         : #FFDEAD;
  --header       : #BDB76B;
  --header-1     : #FF9800DE;
  --hover        : #CDDC39;
  --link         : #4DB2EC;
  --link-1       : #00BCD4;
  --link-2       : #ADD8E6;

}

`;

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

em,
bold,
strong {
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
  input.style.zIndex = '1e9';
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
  rules = [
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
  rules = joinSelectors(rules.concat(definedProperties()));
  rules = `${ROOT}${rules}${CSS}`;
  console.log(rules);
  copyText(rules);
}
