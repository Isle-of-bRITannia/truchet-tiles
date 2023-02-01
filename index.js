// const htl = window.htl;
// const svg = htl.svg.fragment;
const makeElement = (html) => {
  let template = document.createElement('template');
  template.innerHTML = html.trim();

  return template.content.firstChild;
};

const truchetCurve = `
  <path d="M 0.5 1 Q 0.5 0.5, 1 0.5" fill="none" stroke="black" stroke-width=".01"/>
`;

const translate = (vector, elem) => {
  return `<g transform="translate(${vector[0]} ${vector[1]})">
    ${elem}                   
  </g>`;
};

const rotate = (degrees, aboutPoint, elem) => {
  return `<g transform="rotate(${degrees} ${aboutPoint[0]} ${aboutPoint[1]})">
    ${elem}
  </g>`
};

const reflect = (vector, elem) => {
  return `<g transform="translate(${vector[0]} ${vector[1]}) 
                           scale(-1, 1) 
                           translate(${-vector[0]} ${-vector[1]})">
    ${elem}                   
  </g>`;
};


class Tile {
  constructor(svgStringF) {
    this.svgStringF = svgStringF;
  }

  translate(vector) {
    if (typeof vector === 'function')
      return new Tile(() => translate(vector(), this.svgStringF()))
    return new Tile(() => translate(vector, this.svgStringF()));
  }

  rotate(degrees, aboutPoint) {
    if (typeof degrees === 'function')
      return new Tile(() => rotate(degrees(), aboutPoint, this.svgStringF()))
    return new Tile(() => rotate(degrees, aboutPoint, this.svgStringF()));
  }

  reflect(vector) {
    return new Tile(() => reflect(vector, this.svgStringF()));
  }

  multiply(diffVector, num) {
    return new Tile(() => {
      let row = '';
      let currentVec = [0, 0];
      for (let i = 0; i < num; i++) {
        row += translate(currentVec, this.svgStringF());
        currentVec = [currentVec[0] + diffVector[0], currentVec[1] + diffVector[1]];
      }
      return row;
    });
  }

  toString() {
    return this.svgStringF();
  }

  toElement() {
    return makeElement(this.toString());
  }
}

const rotated = rotate(0, [0.5, 0.5], truchetCurve);
const reflected = reflect([0.75, 0.75], rotated);
const translated = translate([-0.5, -0.5], reflected);

const finalTile = new Tile(() => truchetCurve)
  .rotate(() => Math.random() * 30, [0.5, 0.5])
  // .reflect([0.75, 0.75])
  // .translate([-2, -0.5])
  .multiply([1, 0], 20)
  .multiply([0, 1], 20)
  .toString();

const theSVGElement = document.querySelector('#svg_container');
theSVGElement.append(
  makeElement(`
    <svg width="500px" height="500px" viewBox="0 0 10 10">
      ${truchetCurve.trim()}
      <circle cx="0" cy="0" r="0.05" fill="red" />
      ${finalTile}
    </svg>
  `)
);
