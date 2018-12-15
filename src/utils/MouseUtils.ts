export const calculateMousePos = (elem: HTMLElement, e: MouseEvent | TouchEvent): { x: number, y: number} => {
  let m_posx = 0;
  let m_posy = 0;
  let e_posx = 0;
  let e_posy = 0;
  let obj = elem;
  // get mouse position on document crossbrowser
  if (!e) {
    e = window.event as DragEvent; // tslint:disable-line no-param-reassign
  }
  let pageX: number;
  let pageY: number;
  let clientX: number;
  let clientY: number;

  if (e instanceof MouseEvent) {
    pageX = e.pageX;
    pageY = e.pageY;
    clientX = e.clientX;
    clientY = e.clientY;
  }

  if ((window as any).TouchEvent && e instanceof TouchEvent) {
    pageX = e.touches[0].pageX;
    pageY = e.touches[0].pageY;
    clientX = e.touches[0].clientX;
    clientY = e.touches[0].clientY;
  }

  if (pageX || pageY) {
    m_posx = pageX;
    m_posy = pageY;
  } else if (clientX || clientY) {
    m_posx = clientX + document.body.scrollLeft
      + document.documentElement.scrollLeft;
    m_posy = clientY + document.body.scrollTop
      + document.documentElement.scrollTop;
  }

  /*
   * 1- get parent element positions in document
   * 2- accumulate all scroll tops / lefts for each parent
   */
  let parentScrollTop: number = 0;
  let parentScrollLeft: number = 0;
  if (obj.offsetParent) {
    do {
      e_posx += obj.offsetLeft;
      e_posy += obj.offsetTop;
      parentScrollTop += obj.scrollTop;
      parentScrollLeft += obj.scrollLeft;
    } while (obj = obj.offsetParent as HTMLElement); // tslint:disable-line no-conditional-assignment
  }

  // apply accumulated scroll tops / lefts (from parent elements)
  e_posy -= parentScrollTop;
  e_posx -= parentScrollLeft;

  // mouse position minus elm position is mouseposition relative to element:
  // console.log(' X Position: ' + (m_posx - e_posx), ' Y Position: ' + (m_posy - e_posy));
  return { x: m_posx - e_posx, y: m_posy - e_posy };
};
