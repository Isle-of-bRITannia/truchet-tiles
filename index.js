const htl = window.htl;
const svg = htl.svg.fragment;

const truchetCurve = () => svg`
  <path d="M 0.5 1 Q 0.5 0.5, 1 0.5" fill="none" stroke="black" stroke-width=".01"/>
`;

const translate = (vector, elem) => {
  return svg`<g transform="translate(${vector[0]} ${vector[1]})">
    ${elem.cloneNode(true)}                   
  </g>`;
};

const rotate = (degrees, aboutPoint, elem) => {
  return svg`<g transform="rotate(${degrees} ${aboutPoint[0]} ${aboutPoint[1]})">
    ${elem.cloneNode(true)}
  </g>`
};

const reflect = (vector, elem) => {
  return svg`<g transform="translate(${vector[0]} ${vector[1]}) 
                           scale(-1, 1) 
                           translate(${-vector[0]} ${-vector[1]})">
    ${elem.cloneNode(true)}                   
  </g>`;
};

const rotated = rotate(0, [0.5, 0.5], truchetCurve());
const reflected = reflect([0.75, 0.75], rotated);
const translated = translate([-0.5, -0.5], reflected);

const finalTile = translated;

const theSVGElement = document.querySelector('#svg_container');
theSVGElement.append(
  htl.html`
    <svg width="500px" height="500px" viewBox="-2 -2 4 4">
      ${truchetCurve()}
      ${svg`<circle cx="0" cy="0" r="0.05" fill="red" />`}
      ${finalTile}
    </svg>`
)