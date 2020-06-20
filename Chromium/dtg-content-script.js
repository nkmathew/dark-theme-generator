chrome.runtime.onMessage.addListener(function (request, _, sendResponse) {
  if (request.action == 'go-dark') {
    makePageDark();
  } else if (request.action == 'generate-theme') {
    generateTheme();
  } else if (request.action.startsWith('brightness')) {
    document.querySelector('html').style.filter = request.action;
  } else if (request.action == 'start-zapper') {
    Zapper();
    dqs('#dtg-delete').click();
  }
});

// }}============================================================================={{

KEYWORD  = '#8FEB08';
STRING   = '#FFA0A0';
CONSTANT = '#FFA0A0';
PRE_BG   = '#141414';
PRE_BG1  = '#2A3340';
COMMENT  = 'SkyBlue';

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

let addStylesheet = (rules) => {
  let style = document.createElement('style');
  style.type = 'text/css';
  style.textContent = rules;
  document.querySelector('head').appendChild(style);
};

const CSS = `

:root {
  --image1: url(https://en.wikipedia.org/w/skins/Vector/resources/skins.vector.styles/images/external-link-ltr-icon.png?325de);
  --image2: url(https://img.icons8.com/nolan/64/external-link.png);
}

a.dtg-linkHover:hover {
  color: #CDDC39 !important;
}

a.dtg-externalLink:hover {
  background: var(--image1) !important;
  padding-right: 14px;
  background-repeat: no-repeat !important;
  background-position: top right !important;
}

button.dtg-copy-button {
  background: #3f4d5f;
  border: 0;
  padding-top: 3px;
  padding-bottom: 3px;
  border-radius: 3px;
  position: absolute;
  top: 0px;
  right: 0px;
  font-size: 10px;
  font-family: monospace;
  color: #ccc;
  font-weight: bold;
}

textarea:active,
textarea:focus {
  outline: none;
}

`;


function makeCopyButton() {
  let button = document.createElement('button');
  button.classList.add('dtg-copy-button');
  button.innerText = 'Copy';
  button.addEventListener('click', (event) => {
    let preText = event.target.closest('pre').innerText;
    preText = preText.replace(/\n+Copy\n?$/g, '');
    copyText(preText, true);
  });
  return button;
}

function hasAnyClass(node, classList) {
  if (typeof classList == 'string') {
    if (classList.includes(',')) {
      classList = classList.split(/,\s*/);
    } else {
      classList = [classList];
    }
  }
  return [...node.classList].filter(item => classList.includes(item)).length;
}

function isInternal(link) {
  link = link || '';
  let href = window.location.href.split('#')[0];
  return href == link.split('#')[0];
}

function makePageDark() {
  addStylesheet(CSS);
  [...document.getElementsByTagName('*')].forEach((node) => {
    let tag = node.tagName.toLowerCase() || '';
    let ptag = node.parentNode.tagName;
    let pptag = null;
    let ppptag = null;
    if (node.parentNode) {
      if (node.parentNode.parentNode) {
        pptag = node.parentNode.parentNode.tagName;
        if (node.parentNode.parentNode.parentNode) {
          ppptag = node.parentNode.parentNode.parentNode.tagName;
        }
      }
    }
    ptag = ptag ? ptag.toLowerCase() : '';
    pptag = pptag ? pptag.toLowerCase() : '';
    ppptag = ppptag ? ppptag.toLowerCase() : '';
    let parents = [tag, ptag, pptag, ppptag];
    let biglink =
      (tag.startsWith('h') && ptag == 'a') ||
      (tag == 'a' && ptag.startsWith('h'));
    let inCode = parents.includes('code');
    let inPre = parents.includes('pre');
    let inVideo = parents.includes('video');
    let inParagraph = parents.includes('p');
    let inLink = parents.includes('a');
    let inQuote = parents.includes('blockquote');
    node.style.borderColor = '#555';
    node.style.borderRadius = '5px';
    node.style.boxShadow = 'none';
    if (!inVideo && !inCode && !inPre && !inQuote) {
      node.style.background = '#191919';
      node.style.color = '#d1d1d1e6';
    } else if (inQuote) {
      node.style.background = '#2B29298C';
      node.style.color = 'wheat';
    } else if (inLink) {
      node.style.background = '#191919';
      node.classList.add('dtg-linkHover');
      if (inParagraph) {
        node.classList.add('dtg-externalLink');
      }
    }
    if (tag == 'a' || biglink || pptag == 'a' || ptag == 'a') {
      node.style.fontFamily = 'Arial';
      node.style.color = '#4db2ec';
      node.style.boxShadow = 'none';
      node.style.textDecoration = 'none';
      if (!isInternal(node.href)) {
        node.target = '_blank';
      }
    } else if (tag == 'input') {
      node.style.borderRadius = '5px';
    } else if (['strong', 'b', 'em'].includes(tag)) {
      node.style.color = '#f2d297';
      node.style.fontWeight = 'normal';
    } else if (tag == 'img') {
      node.style.filter = 'brightness(0.8)';
    } else if (inCode || inPre) {
      if (inPre) {
        node.style.background = PRE_BG;
      } else {
        node.style.background = PRE_BG1;
        if (tag == 'code') {
          node.style.padding = '1px 4px 1px 4px';
          node.style.borderRadius = '3px';
        }
      }
      node.style.fontFamily = 'Consolas';
      node.style.fontSize = '13px';
      node.style.lineHeight = '17px';
      node.style.color = '#ccc';
      if (hasAnyClass(node, 'hljs-number, mi')) {
        node.style.color = CONSTANT;
      } else if (node.classList.contains('hljs-attr')) {
        node.style.color = '#ccc';
        if (/["'].+["']/.test(node.innerText)) {
          node.style.color = '#ff9800';
        }
      } else if (hasAnyClass(node, ['c1'])) {
        node.style.color = COMMENT;
      } else if (hasAnyClass(node, 'k, kn')) {
        node.style.color = KEYWORD;
      } else if (node.classList.contains('hljs-string')) {
        node.style.color = STRING;
      } else {
        let text = node.innerText;
        if (tag == 'span' && /["'].+["']/.test(text)) {
          node.style.color = STRING;
        } else if (tag == 'span' && /^[\d.]*\d$/.test(text)) {
          node.style.color =  CONSTANT;
        }
      }
    } else if (['p', 'li'].includes(tag)) {
      node.style.fontFamily = '"Segoe UI", Arial, san-serif';
      node.style.fontSize = '16px';
      node.style.lineHeight = '28px';
    }
    if (tag == 'pre') {
      node.style.position = 'relative';
      node.style.borderColor = '#555';
      node.style.padding = '10px';
      node.appendChild(makeCopyButton());
    }
  });
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

  --bg           : #191919;
  --bg-1a        : #000000;
  --bg-1b        : #121212;
  --bg-1c        : #222222;
  --bg-1d        : #262626;
  --bg-1e        : #2E2E2E;
  --bg-1f        : #23232D;
  --bg-1g        : #42424C;
  --bg-1h        : #090300;
  --bg-1i        : #151515;
  --bg-1j        : #1C1C1C;
  --bg-alt       : #121212;
  --bg-anki      : #2F2F31;
  --bg-card      : #343A40;
  --bg-imgur     : #141518;
  --bg-pre       : #2A3340;
  --bg-pre1      : #24292E;
  --bg-pre2      : #041D29;
  --bg-quote     : #232222;
  --bg-quote1    : #2B29298C;
  --blue         : #1A73E8;
  --bold         : #F2D297;
  --bold-1       : #FFE4C4C2;
  --bold-2       : #cddc39d9;
  --bold-3       : Khaki;
  --border       : #555555;
  --border-1     : #616161;
  --border-2     : #FFFFFF1A;
  --border-3     : #333333;
  --border-pre   : #58697b;
  --border-quote : #565680;
  --btn-blue     : #378AD3;
  --btn-like     : #EF5466;
  --btn-shadow   : 0 0 5px #0F0F0F;
  --btn-signup   : #009966;
  --fg           : #CCCCCC;
  --fg-1         : #FFFFFF;
  --fg-2         : #F5DEB3;
  --fg-3         : #B3B3B3;
  --fg-4         : #d3d3d3;
  --fg-5         : #ffffffbf;
  --fg-input     : #FFFFFFE0;
  --green        : #228822;
  --header       : #BDB76B;
  --header-1     : #FF9800DE;
  --hover        : #CDDC39;
  --link         : #4DB2EC;
  --link-1       : #00BCD4;
  --link-2       : #ADD8E6;
  --pink         : #FFDEAD;
  --pre-comment  : SkyBlue;
  --pre-constant : #FFA0A0;
  --pre-funcCall : #FEB43D;
  --pre-keyword  : Khaki;
  --pre-keyword1 : #8FEB08;
  --pre-number   : #FFA0A0;
  --pre-string   : #FFA0A0;
  --pre-todo     : OrangeRed;
  --pre-type     : #82FB98;
  --pre-var      : #82FB98;
  --username     : #6A98AF;

}

`;

DARKCSS = `

{
  background: #191919 !important;
  color: #ccc !important;
  font-family: "Segoe UI" !important;
  line-height: 28px;
  border-color: #555 !important;
  border-radius: 3px !important;
  /* font-size: 16px; */
  /* font-weight: */
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

i,
em,
bold,
strong {
  color: #F2D297;
  font-weight: normal;
}

.td-pb-span8 {
  width: 100%;
}

code,
pre,
pre.prettyprint {
  font-family: monospace !important;
  background: var(--bg-pre) !important;
  border-color: #58697b !important;
  border-radius: 5px;
  font-size: 14px !important;
  line-height: normal;
  color: var(--fg);
}

code {
  padding: 1px 4px;
}

kbd {
  background: var(--bg-pre) !important;
  border-color: transparent;
  color: var(--fg-2);
}

pre,
pre.prettyprint {
  padding: 10px;
}

pre .c1,
pre .com {
  color: var(--pre-comment) !important;
}

pre .ow,
pre .k,
pre .nb,
pre .kn,
pre .kc,
pre .kwd {
  color: var(--pre-keyword) !important;
}

pre .pln {
  color: var(--fg) !important;
}

pre .s1,
pre .str {
  color: var(--pre-string) !important;
}

`;

function copyText(text, hidden) {
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
  input.style.width = '100px';
  input.style.height = '100px';
  input.style.zIndex = '99999999';
  input.style.cursor = 'pointer';
  input.style.background = 'black';
  input.style.color = 'wheat';
  input.style.fontSize = '12px';
  input.style.border = '0';
  input.value = text;
  setTimeout(() => {
    input.select();
  }, 1e3);
  input.addEventListener('click', (event) => {
    document.execCommand('copy');
    setTimeout(() => {
      event.target.style.display = 'none';
    }, 2e3);
  });
}

function generateTheme() {
  let rules = [
    'aside',
    'body',
    'button',
    'div',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'header',
    'hr',
    'html',
    'input',
    'li',
    'nav',
    'p',
    'section',
    'span',
    'table',
    'td',
    'textarea',
    'tr',
    'ul',
  ];
  rules = joinSelectors(rules.concat(definedProperties()));
  rules = `${ROOT}${rules}${DARKCSS}`;
  console.log(rules);
  copyText(rules);
}
