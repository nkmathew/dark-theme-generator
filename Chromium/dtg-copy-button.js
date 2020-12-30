const SVG = `

<svg height="1024" width="896" xmlns="http://www.w3.org/2000/svg">
  <path d="M128 768h256v64H128v-64z m320-384H128v64h320v-64z m128 192V448L384 640l192 192V704h320V576H576z
  m-288-64H128v64h160v-64zM128 704h160v-64H128v64z m576 64h64v128c-1 18-7 33-19 45s-27 18-45 19H64c-35
  0-64-29-64-64V192c0-35 29-64 64-64h192C256 57 313 0 384 0s128 57 128 128h192c35 0 64 29 64
  64v320h-64V320H64v576h640V768zM128 256h512c0-35-29-64-64-64h-64c-35 0-64-29-64-64s-29-64-64-64-64
  29-64 64-29 64-64 64h-64c-35 0-64 29-64 64z" />
</svg>

`;

const BUTTON_CSS = `

pre .x-copyCode:hover,
pre .x-copyCode {
  position: absolute !important;
  color: red !important;
  background: lime !important;
  top: 0px !important;
  right: 0px !important;
  padding: 5px !important;
  margin: 0 !important;
  background: transparent !important;
  outline: none !important;
  border: 0 !important;
  box-shadow: none !important;
}

pre .x-copyCode img {
  width: 19px;
  margin: 0;
  padding: 0;
  filter: sepia(1);
}

`;

function makeCopyButton() {
  let button = document.createElement('button');
  let img = document.createElement('img');
  button.classList.add('x-copyCode');
  button.title = 'Copy Code';
  // button.innerHTML = SVG;
  img.src = 'https://clipboardjs.com/assets/images/clippy.svg';
  img.width = 13;
  button.appendChild(img);
  return button;
}

function addCopyTrigger() {
  new Clipboard('.x-copyCode', {
    text: (trigger) => {
      return trigger.parentNode.innerText;
    },
  });
}