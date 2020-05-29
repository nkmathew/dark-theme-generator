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
    if (node.tagName == 'P') {
      node.style.fontFamily = '"Segoe UI", Arial, san-serif';
      node.style.fontSize = '16px';
    } else if (node.tagName == 'A') {
      node.style.color = '#4db2ec';
    } else if (node.tagName == 'INPUT') {
      node.style.borderColor = '#666';
      node.style.borderRadius = '5px';
    }
  });
  console.log('Done themeing...');
}

function generateTheme() {}
