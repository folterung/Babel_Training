const AUTHOR = 'Kevin Warnock';
const SPACE = ' ';

export var BabelTrainingApp = (() => {
  class _BabelTrainingApp {
    header;
    content;
    footer;

    constructor() {
      this.header = new html('header');
      this.content = new html('.content');
      this.footer = new html('footer');
    }

    menu = {
      init() {

      },
      show() {

      },
      hide() {

      }
    };

    init() {
      this.header.addClass('active');
      this.footer.addClass('active');

      this.header.bind('transitionend', () => {
        this.content.addClass('active');
        this.header.unbind('transitionend');
      });
    }

    static getAuthor() {
      return AUTHOR;
    }
  }

  class html {
    element;

    constructor() {
      if(arguments.length < 1) {
        throw new ReferenceError('Invalid number of arguments');
      } else {
        this.element = _getElement(arguments[0]);
      }
    }

    addClass(className) {
      let regEx = /\w/g;

      if(regEx.test(this.element.className)) {
        this.element.className += SPACE;
      }

      this.element.className += className;
    }

    removeClass(className) {
      let classes = this.element.className.split(SPACE);

      if(classes.length < 1) { return; }

      for(let i = 0; i < classes.length; i++) {
        if(classes[i] === className) {
          classes.splice(i, 1);
        }
      }

      this.element.className = classes.join(SPACE);

      return this;
    }

    bind(eventName, cb) {
      this.element.addEventListener(eventName, cb);
    }

    unbind(eventName, cb) {
      this.element.removeEventListener(eventName, cb);
    }
  }

  function _getElement(arg) {
    let elements = document.querySelectorAll(arg);

    if(elements.length < 2) {
      elements = elements[0];
    }

    return elements;
  }

  return new _BabelTrainingApp();
})();