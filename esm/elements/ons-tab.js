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

import onsElements from '../ons/elements.js';
import util from '../ons/util.js';
import autoStyle from '../ons/autostyle.js';
import ModifierUtil from '../ons/internal/modifier-util.js';
import BaseElement from './base/base-element.js';
import TabbarElement from './ons-tabbar/index.js';
import contentReady from '../ons/content-ready.js';
import { PageLoader, defaultPageLoader } from '../ons/page-loader.js';

// Dependencies
import './ons-icon.js';
import './ons-ripple/index.js';

const defaultClassName = 'tabbar__item';

const scheme = {
  '': 'tabbar--*__item',
  '.tabbar__button': 'tabbar--*__button'
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

/**
 * @element ons-tab
 * @category tabbar
 * @description
 *   [en]Represents a tab inside tab bar. Each `<ons-tab>` represents a page.[/en]
 *   [ja]
 *     タブバーに配置される各アイテムのコンポーネントです。それぞれのons-tabはページを表します。
 *     ons-tab要素の中には、タブに表示されるコンテンツを直接記述することが出来ます。
 *   [/ja]
 * @codepen pGuDL
 * @tutorial vanilla/Reference/tabbar
 * @guide fundamentals.html#managing-pages
 *   [en]Managing multiple pages.[/en]
 *   [ja]複数のページを管理する[/ja]]
 * @guide appsize.html#removing-icon-packs [en]Removing icon packs.[/en][ja][/ja]
 * @guide faq.html#how-can-i-use-custom-icon-packs [en]Adding custom icon packs.[/en][ja][/ja]
 * @seealso ons-tabbar
 *   [en]ons-tabbar component[/en]
 *   [ja]ons-tabbarコンポーネント[/ja]
 * @seealso ons-page
 *   [en]ons-page component[/en]
 *   [ja]ons-pageコンポーネント[/ja]
 * @seealso ons-icon
 *   [en]ons-icon component[/en]
 *   [ja]ons-iconコンポーネント[/ja]
 * @example
 * <ons-tabbar>
 *   <ons-tab
 *     page="home.html"
 *     label="Home"
 *     active>
 *   </ons-tab>
 *   <ons-tab
 *     page="settings.html"
 *     label="Settings"
 *     active>
 *   </ons-tab>
 * </ons-tabbar>
 *
 * <template id="home.html">
 *   ...
 * </template>
 *
 * <template id="settings.html">
 *   ...
 * </template>

 */
export default class TabElement extends BaseElement {

  /**
   * @attribute page
   * @initonly
   * @type {String}
   * @description
   *   [en]The page that is displayed when the tab is tapped.[/en]
   *   [ja]ons-tabが参照するページへのURLを指定します。[/ja]
   */

  /**
   * @attribute icon
   * @type {String}
   * @description
   *   [en]
   *     The icon name for the tab. Can specify the same icon name as `<ons-icon>`. Check [See also](#seealso) section for more information.
   *   [/en]
   *   [ja]
   *     アイコン名を指定します。ons-iconと同じアイコン名を指定できます。
   *     個別にアイコンをカスタマイズする場合は、background-imageなどのCSSスタイルを用いて指定できます。
   *   [/ja]
   */

  /**
   * @attribute active-icon
   * @type {String}
   * @description
   *   [en]The name of the icon when the tab is active.[/en]
   *   [ja]アクティブの際のアイコン名を指定します。[/ja]
   */

  /**
   * @attribute label
   * @type {String}
   * @description
   *   [en]The label of the tab item.[/en]
   *   [ja]アイコン下に表示されるラベルを指定します。[/ja]
   */

  /**
   * @attribute badge
   * @type {String}
   * @description
   *   [en]Display a notification badge on top of the tab.[/en]
   *   [ja]バッジに表示する内容を指定します。[/ja]
   */

  /**
   * @attribute active
   * @description
   *   [en]This attribute should be set to the tab that is active by default.[/en]
   *   [ja][/ja]
   */

  constructor() {
    super();

    this._connectedOnce = false;
    this._iconPropertiesTouched = false; // if user has not set icon or active-icon, we should not delete their div.tabbar__icon
    this._labelPropertyTouched = false;
    this._badgePropertyTouched = false;
    this._ripplePropertyTouched = false;

    this._createShadow();
    this._defineProperties();
  }

  connectedCallback() {
    if (!this._connectedOnce) {
      this._connectedOnce = true;

      this._applyDefaultClass();
      this._compile();
      this._applyAutoStyling();
    }

    this._setupOnClick();
    this._setupDefaultOnClick();
  }

  disconnectedCallback() {
    this._setupOnClick();
    this._setupDefaultOnClick();
  }

  static get observedAttributes() {
    return ['modifier', 'class', 'icon', 'active-icon', 'active', 'label', 'badge', 'ripple'];
  }

  attributeChangedCallback(name, last, current) {
    switch (name) {
      case 'class':
        this._applyDefaultClass();
        break;
      case 'modifier':
        this._applyModifier(last, current);
        break;
      case 'icon':
        this._iconPropertiesTouched = true;
        this._compile();
        this._updateIconElement();
        break;
      case 'active-icon':
        this._iconPropertiesTouched = true;
        this._compile();
        this._updateIconElement();
        break;
      case 'active':
        this._compile();
        this._inputElement.checked = this.active;
        this._updateIconElement();
        break;
      case 'label':
        this._labelPropertyTouched = true;
        this._compile();
        this._updateLabelElement();
        break;
      case 'badge':
        this._badgePropertyTouched = true;
        this._compile();
        this._updateBadgeElement();
        break;
      case 'ripple':
        this._ripplePropertyTouched = true;
        this._compile();
        break;
    }
  }
  //attributeChangedCallback(name, last, current) {
  //  switch (name) {
  //    case 'class':
  //      util.restoreClass(this, defaultClassName, scheme);
  //      break;
  //    case 'modifier':
  //      contentReady(this, () => ModifierUtil.onModifierChanged(last, current, this, scheme));
  //      break;
  //    case 'ripple':
  //      contentReady(this, () => this._updateRipple());
  //      break;
  //    case 'icon':
  //    case 'label':
  //    case 'badge':
  //      contentReady(this, () => this._updateButtonContent());
  //      break;
  //    case 'page':
  //      this.page = current || '';
  //      break;
  //  }
  //}

  _onSlotChange() {
    this._compile();
    this._applyAutoStyling();
  }

  ////////////////////////////////////////////////////////////////////////////////
  // PUBLIC METHODS
  ////////////////////////////////////////////////////////////////////////////////

  get page() {
    return this.getAttribute('page');
  }

  set page(value) {
    this.setAttribute('page', value);
  }

  get icon() {
    return this.getAttribute('icon');
  }

  set icon(value) {
    this.setAttribute('icon', value);
  }

  get activeIcon() {
    return this.getAttribute('active-icon');
  }

  set activeIcon(value) {
    this.setAttribute('active-icon', value);
  }

  get label() {
    return this.getAttribute('label');
  }

  set label(value) {
    this.setAttribute('label', value);
  }

  get badge() {
    return this.getAttribute('badge');
  }

  set badge(value) {
    this.setAttribute('badge', value);
  }

  setActive(active = true) {
    this.active = active;
  }

  isActive() {
    return this.active;
  }


  ////////////////////////////////////////////////////////////////////////////////
  // PRIVATE METHODS
  ////////////////////////////////////////////////////////////////////////////////

  _createShadow() {
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.shadowRoot.querySelector('slot')
      .addEventListener('slotchange', () => this._onSlotChange());
  }

  _defineProperties() {
    util.defineBooleanProperty(this, 'active');
    util.defineBooleanProperty(this, 'ripple');
    this._defineOnClickProperty();
  }

  _defineOnClickProperty() {
    let handler;
    Object.defineProperty(this, 'onClick', {
      get() {
        return handler;
      },
      set(newHandler) {
        this.removeEventListener('click', handler);
        handler = newHandler;
        this._setupOnClick();
      }
    });
  }

  _setupOnClick() {
    if (this.isConnected) {
      this.addEventListener('click', this.onClick);
    } else {
      this.removeEventListener('click', this.onClick);
    }
  }

  _setupDefaultOnClick() {
    const handler = event => {
      setImmediate(() => {
        if (!event.defaultPrevented) {
          this.active = true;
        }
      });
    };

    if (this.isConnected) {
      this.addEventListener('click', handler);
    } else {
      this.removeEventListener('click', handler);
    }
  }
  //_onClick(event) {
  //  setTimeout(() => {
  //    if (!event.defaultPrevented) {
  //      this._tabbar.setActiveTab(this.index, { reject: false });
  //    }
  //  });
  //}

  _applyDefaultClass() {
    if (!this.classList.contains(defaultClassName)) {
      this.classList.add(defaultClassName);
    }
  }

  _applyModifier(last, current) {
    ModifierUtil.onModifierChanged(last, current, this, scheme);
    autoStyle.restoreModifier(this);
  }

  _applyAutoStyling() {
    autoStyle.prepare(this);
  }

  _compile() {

    // BUTTON

    let button;
    const allButtons = Array.from(this.querySelectorAll(':scope > .tabbar__button'));
    const userAddedButton = allButtons.find(node => node !== this._automaticallyAddedButton);
    if (userAddedButton) {
      button = userAddedButton;

      if (this._automaticallyAddedButton) {
        this._automaticallyAddedButton.remove();
        this._automaticallyAddedButton = null;
      }

    } else if (this._automaticallyAddedButton) {
      button = this._automaticallyAddedButton;
    } else {
      button = document.createElement('button');
      button.classList.add('tabbar__button');
      this.appendChild(button);
      this._automaticallyAddedButton = button;
    }


    // INPUT

    let [input, ...furtherInputs] = this.querySelectorAll(':scope > input');
    if (!input) {
      input = document.createElement('input');
      input.type = 'radio';
      input.style.display = 'none';
      this.appendChild(input);
    }

    furtherInputs.forEach(node => node.remove());

    Array.from(this.childNodes)
      .filter(node => node !== button && node !== input)
      .forEach(node => button.appendChild(node));

    this._inputElement = input;


    // ICON

    let [iconWrapper, ...furtherIconWrappers] = button.querySelectorAll(':scope > .tabbar__icon');
    if (!iconWrapper && (this.icon || this.activeIcon)) {
      iconWrapper = document.createElement('div');
      iconWrapper.classList.add('tabbar__icon');

      const icon = document.createElement('ons-icon');
      iconWrapper.appendChild(icon);

      button.appendChild(iconWrapper);

    } else if (iconWrapper && !(this.icon || this.activeIcon)) {
      if (this._iconPropertiesTouched) {
        iconWrapper.remove();
        iconWrapper = null;
      } else {
        this.icon = iconWrapper.querySelector(':scope > ons-icon')?.icon;
      }
    }

    furtherIconWrappers.forEach(node => node.remove());

    this._iconElement = iconWrapper?.querySelector(':scope > ons-icon');


    // LABEL

    let [label, ...furtherLabels] = button.querySelectorAll(':scope > .tabbar__label');
    if (this.label && !label) {
      label = document.createElement('div');
      label.classList.add('tabbar__label');
      button.appendChild(label);
    } else if (!this.label && label) {
      if (this._labelPropertyTouched) {
        label.remove();
        label = null;
      } else {
        this.label = label.textContent;
      }
    }

    furtherLabels.forEach(node => node.remove());

    this._labelElement = label;


    // BADGE

    let [badge, ...furtherBadges] = button.querySelectorAll(':scope > .tabbar__badge');
    if (this.badge && !badge) {
      badge = document.createElement('div');
      badge.classList.add('tabbar__badge', 'notification');
      button.appendChild(badge);
    } else if (!this.badge && badge) {
      if (this._badgePropertyTouched) {
        badge.remove();
        badge = null;
      } else {
        this.badge = badge.textContent;
      }
    }

    furtherBadges.forEach(node => node.remove());

    this._badgeElement = badge;


    // RIPPLE

    let [ripple, ...furtherRipples] = button.querySelectorAll(':scope > ons-ripple');
    if (this.ripple && !ripple) {
      // ripple prop set but no ripple element so create ripple element
      ripple = document.createElement('ons-ripple');
      button.insertBefore(ripple, button.firstChild);
    } else if (!this.ripple && ripple) {
      if (this._ripplePropertyTouched) {
        // user set ripple prop to false so remove ripple elem
        ripple.remove();
        ripple = null;
      } else {
        // user created his own ripple and didn't touch ripple prop so set
        // ripple prop to true
        this.ripple = true;
      }
    }

    furtherRipples.forEach(node => node.remove());



  //  autoStyle.prepare(this);
  //  this.classList.add(defaultClassName);

  //  if (this._button) {
  //    return;
  //  }

  //  const button = util.create('button.tabbar__button');
  //  while (this.childNodes[0]) {
  //    button.appendChild(this.childNodes[0]);
  //  }

  //  const input = util.create('input', { display: 'none' });
  //  input.type = 'radio';

  //  this.appendChild(input);
  //  this.appendChild(button);

  //  this._updateButtonContent();
  //  ModifierUtil.initModifier(this, scheme);
  //  this._updateRipple();
  }

  //_updateButtonContent() {
  //  const button = this._button;

  //  let iconWrapper = this._icon;
  //  if (this.hasAttribute('icon')) {
  //    iconWrapper = iconWrapper || util.createElement('<div class="tabbar__icon"><ons-icon></ons-icon></div>');
  //    const icon = iconWrapper.children[0];
  //    const fix = (last => () => icon.attributeChangedCallback('icon', last, this.getAttribute('icon')))(icon.getAttribute('icon'));
  //    if (this.hasAttribute('icon') && this.hasAttribute('active-icon')) {
  //      icon.setAttribute('icon', this.getAttribute(this.isActive() ? 'active-icon' : 'icon'));
  //    } else if (this.hasAttribute('icon')) {
  //      icon.setAttribute('icon', this.getAttribute('icon'));
  //    }
  //    iconWrapper.parentElement !== button && button.insertBefore(iconWrapper, button.firstChild);

  //    // dirty fix for https://github.com/OnsenUI/OnsenUI/issues/1654
  //    icon.attributeChangedCallback instanceof Function
  //      ? fix()
  //      : setImmediate(() => icon.attributeChangedCallback instanceof Function && fix());
  //  } else {
  //    iconWrapper && iconWrapper.remove();
  //  }

  //  ['label', 'badge'].forEach(attr => {
  //    let prop = this.querySelector(`.tabbar__${attr}`);
  //    if (this.hasAttribute(attr)) {
  //      prop = prop || util.create(`.tabbar__${attr}` + (attr === 'badge' ? ' notification' : ''));
  //      prop.textContent = this.getAttribute(attr);
  //      prop.parentElement !== button && button.appendChild(prop);
  //    } else {
  //      prop && prop.remove();
  //    }
  //  });
  //}

  _updateIconElement() {
    if (!this._iconElement) {
      return;
    }

    if (this.active && this.activeIcon) {
      this._iconElement.icon = this.activeIcon;
    } else {
      this._iconElement.icon = this.icon;
    }
  }

  _updateLabelElement() {
    if (this._labelElement) {
      this._labelElement.textContent = this.label;
    }
  }

  _updateBadgeElement() {
    if (this._badgeElement) {
      this._badgeElement.textContent = this.badge;
    }
  }


  // JUNK

  //constructor() {
  //  super();

  //  if (['label', 'icon', 'badge'].some(this.hasAttribute.bind(this))) {
  //    this._compile();
  //  } else {
  //    contentReady(this, () => this._compile());
  //  }

  //  this._pageLoader = defaultPageLoader;
  //  this._onClick = this._onClick.bind(this);

  //  util.defineListenerProperty(this, 'click');
  //}

  //set pageLoader(loader) {
  //  if (!(loader instanceof PageLoader)) {
  //    util.throwPageLoader();
  //  }
  //  this._pageLoader = loader;
  //}

  //get pageLoader() {
  //  return this._pageLoader;
  //}


  //get _tabbar() {
  //  return util.findParent(this, 'ons-tabbar');
  //}

  //get index() {
  //  return Array.prototype.indexOf.call(this.parentElement.children, this);
  //}

  //_loadPageElement(parent, page) {
  //  this._hasLoaded = true;

  //  return new Promise(resolve => {
  //    this._pageLoader.load({ parent, page }, pageElement => {
  //      parent.replaceChild(pageElement, parent.children[this.index]); // Ensure position
  //      this._loadedPage = pageElement;
  //      resolve(pageElement);
  //    });
  //  });
  //}

  //get pageElement() {
  //  // It has been loaded by ons-tab
  //  if (this._loadedPage) {
  //    return this._loadedPage;
  //  }
  //  // Manually attached to DOM, 1 per tab
  //  const tabbar = this._tabbar;
  //  if (tabbar.pages.length === tabbar.tabs.length) {
  //    return tabbar.pages[this.index];
  //  }
  //  // Loaded in another way
  //  return null;
  //}

  //disconnectedCallback() {
  //  this.removeEventListener('click', this._onClick, false);
  //  if (this._loadedPage) {
  //    this._hasLoaded = false;
  //    this.loaded = null;
  //  }

  //  util.disconnectListenerProperty(this, 'click');
  //}

  //connectedCallback() {
  //  this.addEventListener('click', this._onClick, false);

  //  if (!util.isAttached(this) || this.loaded) {
  //    return; // ons-tabbar compilation may trigger this
  //  }

  //  const deferred = util.defer();
  //  this.loaded = deferred.promise;

  //  contentReady(this, () => {
  //    const index = this.index;
  //    const tabbar = this._tabbar;
  //    if (!tabbar) {
  //      util.throw('Tab elements must be children of Tabbar');
  //    }

  //    if (tabbar.hasAttribute('modifier')) {
  //      util.addModifier(this, tabbar.getAttribute('modifier'));
  //    }

  //    if (!this._hasLoaded) {
  //      if (this.hasAttribute('active')) {
  //        this.setActive(true);
  //        tabbar.setAttribute('activeIndex', index);
  //      }

  //      if (index === tabbar.tabs.length - 1) {
  //        tabbar._onRefresh();
  //        setImmediate(() => tabbar._onRefresh());
  //      }

  //      TabbarElement.rewritables.ready(tabbar, () => {
  //        const pageTarget = this.page || this.getAttribute('page');
  //        if (!this.pageElement && pageTarget) {
  //          const parentTarget = tabbar._targetElement;
  //          const dummyPage = util.create('div', { height: '100%', width: '100%', visibility: 'hidden' });
  //          parentTarget.insertBefore(dummyPage, parentTarget.children[index]); // Ensure position

  //          const load = () => this._loadPageElement(parentTarget, pageTarget).then(deferred.resolve);
  //          return this.isActive() ? load() : tabbar._loadInactive.promise.then(load);
  //        }

  //        return deferred.resolve(this.pageElement);
  //      });
  //    }
  //  });
  //}

}

onsElements.Tab = TabElement;
customElements.define('ons-tab', TabElement);
