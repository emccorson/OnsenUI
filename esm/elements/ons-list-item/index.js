/*
Copyright 2013-2015 ASIAL CORPORATION

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

*/

import onsElements from '../../ons/elements.js';
import animit from '../../ons/animit.js';
import util from '../../ons/util.js';
import styler from '../../ons/styler.js';
import autoStyle from '../../ons/autostyle.js';
import ModifierUtil from '../../ons/internal/modifier-util.js';
import AnimatorFactory from '../../ons/internal/animator-factory.js';
import { ListItemAnimator, SlideListItemAnimator } from './animator.js';
import BaseElement from '../base/base-element.js';
import contentReady from '../../ons/content-ready.js';

const defaultClassName = 'list-item';
const scheme = {
  '.list-item': 'list-item--*',
  '.list-item__left': 'list-item--*__left',
  '.list-item__center': 'list-item--*__center',
  '.list-item__right': 'list-item--*__right',
  '.list-item__label': 'list-item--*__label',
  '.list-item__title': 'list-item--*__title',
  '.list-item__subtitle': 'list-item--*__subtitle',
  '.list-item__thumbnail': 'list-item--*__thumbnail',
  '.list-item__icon': 'list-item--*__icon'
};

const _animatorDict = {
  'default': SlideListItemAnimator,
  'none': ListItemAnimator
};

const template = document.createElement('template');
template.innerHTML = `
  <slot></slot>
`;

/**
 * @element ons-list-item
 * @category list
 * @modifier tappable
 *   [en]Make the list item change appearance when it's tapped. On iOS it is better to use the "tappable" and "tap-background-color" attribute for better behavior when scrolling.[/en]
 *   [ja]タップやクリックした時に効果が表示されるようになります。[/ja]
 * @modifier chevron
 *   [en]Display a chevron at the right end of the list item and make it change appearance when tapped.[/en]
 *   [ja][/ja]
 * @modifier longdivider
 *   [en]Displays a long horizontal divider between items.[/en]
 *   [ja][/ja]
 * @modifier nodivider
 *   [en]Removes the divider between list items.[/en]
 *   [ja][/ja]
 * @modifier material
 *   [en]Display a Material Design list item.[/en]
 *   [ja][/ja]
 * @description
 *   [en]
 *     Component that represents each item in a list. The list item is composed of four parts that are represented with the `left`, `center`, `right` and `expandable-content` classes. These classes can be used to ensure that the content of the list items is properly aligned.
 *
 *     ```
 *     <ons-list-item>
 *       <div class="left">Left</div>
 *       <div class="center">Center</div>
 *       <div class="right">Right</div>
 *       <div class="expandable-content">Expandable content</div>
 *     </ons-list-item>
 *     ```
 *
 *     There are also a number of classes (prefixed with `list-item__*`) that help when putting things like icons and thumbnails into the list items.
 *   [/en]
 *   [ja][/ja]
 * @seealso ons-list
 *   [en]ons-list component[/en]
 *   [ja]ons-listコンポーネント[/ja]
 * @seealso ons-list-header
 *   [en]ons-list-header component[/en]
 *   [ja]ons-list-headerコンポーネント[/ja]
 * @codepen yxcCt
 * @tutorial vanilla/Reference/list
 * @example
 * <ons-list-item>
 *   <div class="left">
 *     <ons-icon icon="md-face" class="list-item__icon"></ons-icon>
 *   </div>
 *   <div class="center">
 *     <div class="list-item__title">Title</div>
 *     <div class="list-item__subtitle">Subtitle</div>
 *   </div>
 *   <div class="right">
 *     <ons-switch></ons-switch>
 *   </div>
 * </ons-list-item>
 */
export default class ListItemElement extends BaseElement {

  /**
   * @attribute modifier
   * @type {String}
   * @description
   *   [en]The appearance of the list item.[/en]
   *   [ja]各要素の表現を指定します。[/ja]
   */

  /**
   * @attribute lock-on-drag
   * @type {String}
   * @description
   *   [en]Prevent vertical scrolling when the user drags horizontally.[/en]
   *   [ja]この属性があると、ユーザーがこの要素を横方向にドラッグしている時に、縦方向のスクロールが起きないようになります。[/ja]
   */

  /**
   * @attribute tappable
   * @type {Boolean}
   * @description
   *   [en]Makes the element react to taps. `prevent-tap` attribute can be added to child elements like buttons or inputs to prevent this effect. `ons-*` elements are ignored by default.[/en]
   *   [ja][/ja]
   */

  /**
   * @attribute tap-background-color
   * @type {Color}
   * @description
   *   [en] Changes the background color when tapped. For this to work, the attribute "tappable" needs to be set. The default color is "#d9d9d9". It will display as a ripple effect on Android.[/en]
   *   [ja][/ja]
   */

  /**
   * @attribute expandable
   * @type {Boolean}
   * @description
   *   [en]Makes the element able to be expanded to reveal extra content. For this to work, the expandable content must be defined in `div.expandable-content`.[/en]
   *   [ja][/ja]
   */

  /**
   * @attribute expanded
   * @type {Boolean}
   * @description
   *   [en]For expandable list items, specifies whether the expandable content is expanded or not.[/en]
   *   [ja][/ja]
   */

  /**
   * @property expanded
   * @type {Boolean}
   * @description
   *   [en]For expandable list items, specifies whether the expandable content is expanded or not.[/en]
   *   [ja][/ja]
   */

  /**
   * @attribute animation
   * @type {String}
   * @default default
   * @description
   *  [en]The animation used when showing and hiding the expandable content. Can be either `"default"` or `"none"`.[/en]
   *  [ja][/ja]
   */

  constructor() {
    super();

    this._connectedOnce = false;

    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.shadowRoot.querySelector('slot')
      .addEventListener('slotchange', this._onSlotChange.bind(this));

    util.defineBooleanProperty(this, 'expanded');

    this._animatorFactory = this._updateAnimatorFactory();
    this.toggleExpansion = this.toggleExpansion.bind(this);

    // show and hide functions for Vue hidable mixin
    this.show = this.showExpansion;
    this.hide = this.hideExpansion;
  }

  connectedCallback() {
    if (!this._connectedOnce) {
      this._connectedOnce = true;

      this.classList.add(defaultClassName);
      autoStyle.prepare(this);

      this._compile(); // in case of empty element
    }

    this._setupListeners(true);
    this._originalBackgroundColor = this.style.backgroundColor;
    this._tapped = false;
  }

  disconnectedCallback() {
    this._setupListeners(false);
  }

  static get observedAttributes() {
    return ['modifier', 'class', 'ripple', 'animation', 'expanded', 'expandable'];
  }

  attributeChangedCallback(name, last, current) {
    switch (name) {
      case 'class':
        util.restoreClass(this, defaultClassName, scheme);
        break;
      case 'modifier':
        ModifierUtil.onModifierChanged(last, current, this, scheme);
        break;
      case 'ripple':
        util.updateRipple(this);
        break;
      case 'animation':
        this._animatorFactory = this._updateAnimatorFactory();
        break;
      case 'expanded':
        this._animateExpansion();
        break;
      case 'expandable':
        if (!this.classList.contains('list-item--expandable')) {
          this.classList.add('list-item--expandable');
        }
        this._compile();
        break;
    }
  }

  ////////////////////////////////////////////////////////////////////////////////
  // PUBLIC METHODS
  ////////////////////////////////////////////////////////////////////////////////

  get expandable() {
    return this.hasAttribute('expandable');
  }

  set expandable(value) {
    if (value) {
      this.setAttribute('expandable', '');
    } else {
      this.removeAttribute('expandable');
    }
  }

  /**
   * @method showExpansion
   * @signature showExpansion()
   * @description
   *   [en]Show the expandable content if the element is expandable.[/en]
   *   [ja][/ja]
   */
  showExpansion() {
    this.expanded = true;
  }

  /**
   * @method hideExpansion
   * @signature hideExpansion()
   * @description
   *   [en]Hide the expandable content if the element expandable.[/en]
   *   [ja][/ja]
   */
  hideExpansion() {
    this.expanded = false;
  }

  toggleExpansion() {
    this.expanded = !this.expanded;
  }

  get expandableContent() {
    return this.querySelector('.list-item__expandable-content');
  }

  get expandChevron() {
    return this.querySelector('.list-item__expand-chevron');
  }

  ////////////////////////////////////////////////////////////////////////////////
  // PRIVATE METHODS
  ////////////////////////////////////////////////////////////////////////////////

  _onSlotChange() {
    this._compile();
    ModifierUtil.initModifier(this, scheme);
  }

  /**
   * Compiles the list item.
   *
   * Various elements are allowed in the body of a list item:
   *
   *  - div.left, div.right, and div.center are allowed as direct children
   *  - if div.center is not defined, anything that isn't div.left, div.right or div.expandable-content will be put in a div.center
   *  - if div.center is defined, anything that isn't div.left, div.right or div.expandable-content will be ignored
   *  - if list item has expandable attribute:
   *      - div.expandable-content is allowed as a direct child
   *      - div.top is allowed as direct child
   *      - if div.top is defined, anything that isn't div.expandable-content should be inside div.top - anything else will be ignored
   *      - if div.right is not defined, a div.right will be created with a drop-down chevron
   *
   * See the tests for examples.
   */
  _compile() {
    let topContent = this; // where .left, .center, .right etc. should go

    if (this.expandable) {
      let tops = this.querySelectorAll(':scope > div.top');

      let top;
      switch (tops.length) {
        case 0:
          top = document.createElement('div');
          top.classList.add('top');
          this.insertBefore(top, this.firstChild);
          break;

        case 1:
          top = tops[0];
          break;

        default:
          tops[0].remove();
          top = tops[1];
          break;
      }

      topContent = top;
      this._topElement = top;

      if (!top.classList.contains('list-item__top')) {
        top.classList.add('list-item__top');
      }


      const expandableContents = this.querySelectorAll(':scope > div.expandable-content');
      let expandableContent;
      switch (expandableContents.length) {
        case 0:
          expandableContent = document.createElement('div');
          expandableContent.classList.add('expandable-content');
          this.insertBefore(expandableContent, this.firstChild);
          break;

        case 1:
          expandableContent = expandableContents[0];
          break;

        default:
          expandableContents[0].remove();
          expandableContent = expandableContents[1];
          break;
      }
      this._expandableContentElement = expandableContent;

      if (!expandableContent.classList.contains('list-item__expandable-content')) {
        expandableContent.classList.add('list-item__expandable-content');
      }


      Array.from(this.childNodes)
        .filter(node =>
          node !== top && !node.classList?.contains('expandable-content') && node.nodeName !== 'ONS-RIPPLE')
        .forEach(node => top.appendChild(node));
    }

    const left = topContent.querySelector(':scope > div.left');
    if (left && !left.classList.contains('list-item__left')) {
      left.classList.add('list-item__left');
    }

    const rights = topContent.querySelectorAll(':scope > div.right');
    let right;
    switch (rights.length) {
      case 0:
        if (this.expandable) {
          // We cannot use a pseudo-element for this chevron, as we cannot animate it using
          // JS. So, we make a chevron span instead.
          const chevron = document.createElement('span');
          chevron.classList.add('list-item__expand-chevron');

          right = document.createElement('div');
          right.classList.add('right');
          right.appendChild(chevron);

          topContent.insertBefore(right, topContent.firstChild);
        }
        break;

      case 1:
        right = rights[0];
        break;

      default:
        rights[0].remove();
        right = rights[1];
        break;
    }

    if (right && !right.classList.contains('list-item__right')) {
      right.classList.add('list-item__right');
    }

    const centers = topContent.querySelectorAll(':scope > div.center');
    let center;
    switch (centers.length) {
      case 0:
        center = document.createElement('div');
        center.classList.add('center');
        topContent.insertBefore(center, topContent.firstChild);
        break;

      case 1:
        center = centers[0];
        break;

      default:
        centers[0].remove();
        center = centers[1];
        break;
    }

    if (!center.classList.contains('list-item__center')) {
      center.classList.add('list-item__center');
    }

    Array.from(topContent.childNodes)
      .filter(node => ![left, right, center].includes(node) && node.nodeName !== 'ONS-RIPPLE')
      .forEach(node => center.appendChild(node));

    util.updateRipple(this);
  }

  _animateExpansion() {
    // Stops the animation from running in the case where the list item should start already expanded
    const expandedAtStartup = this.expanded && this.classList.contains('list-item--expanded');

    if (!this.expandable || this._expanding || expandedAtStartup) {
      return;
    }

    this._expanding = true;

    this.dispatchEvent(new Event('expansion'));

    const animator = this._animatorFactory.newAnimator();
    animator._animateExpansion(this, this.expanded, () => {
      this._expanding = false;

      if (this.expanded) {
        this.classList.add('list-item--expanded');
      } else {
        this.classList.remove('list-item--expanded');
      }
    });
  }

  _updateAnimatorFactory() {
    return new AnimatorFactory({
      animators: _animatorDict,
      baseClass: ListItemAnimator,
      baseClassName: 'ListItemAnimator',
      defaultAnimation: this.getAttribute('animation') || 'default'
    });
  }

  _setupListeners(add) {
    const action = (add ? 'add' : 'remove') + 'EventListener';
    util[action](this, 'touchstart', this._onTouch, { passive: true });
    util[action](this, 'touchmove', this._onRelease, { passive: true });
    this[action]('touchcancel', this._onRelease);
    this[action]('touchend', this._onRelease);
    this[action]('touchleave', this._onRelease);
    this[action]('drag', this._onDrag);
    this[action]('mousedown', this._onTouch);
    this[action]('mouseup', this._onRelease);
    this[action]('mouseout', this._onRelease);

    if (this._topElement) {
      this._topElement[action]('click', this.toggleExpansion);
    }
  }

  _onDrag(event) {
    const gesture = event.gesture;
    // Prevent vertical scrolling if the users pans left or right.
    if (this.hasAttribute('lock-on-drag') && ['left', 'right'].indexOf(gesture.direction) > -1) {
      gesture.preventDefault();
    }
  }

  _onTouch(e) {
    // Elements ignored when tapping
    const re = /^ons-(?!col$|row$|if$)/i;
    const shouldIgnoreTap = e => e.hasAttribute('prevent-tap') || re.test(e.tagName);

    if (this._tapped ||
      (this !== e.target && (shouldIgnoreTap(e.target) || util.findParent(e.target, shouldIgnoreTap, p => p === this)))
    ) {
      return; // Ignore tap
    }

    this._tapped = true;
    const touchStyle = { transition: 'background-color 0.0s linear 0.02s, box-shadow 0.0s linear 0.02s' };

    if (this.hasAttribute('tappable')) {
      if (this.style.backgroundColor) {
        this._originalBackgroundColor = this.style.backgroundColor;
      }

      touchStyle.backgroundColor = this.getAttribute('tap-background-color') || '#d9d9d9';
      touchStyle.boxShadow = `0px -1px 0px 0px ${touchStyle.backgroundColor}`;
    }

    styler(this, touchStyle);
  }

  _onRelease() {
    this._tapped = false;
    this.style.backgroundColor = this._originalBackgroundColor || '';
    styler.clear(this, 'transition boxShadow');
  }
}

onsElements.ListItem = ListItemElement;
customElements.define('ons-list-item', ListItemElement);
