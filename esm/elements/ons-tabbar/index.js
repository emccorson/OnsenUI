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
import util from '../../ons/util.js';
import internal from '../../ons/internal/index.js';
import autoStyle from '../../ons/autostyle.js';
import Swiper from '../../ons/internal/swiper.js';
import ModifierUtil from '../../ons/internal/modifier-util.js';
import BaseElement from '../base/base-element.js';
import contentReady from '../../ons/content-ready.js';
import { defaultPageLoader } from '../../ons/page-loader.js';

const scheme = {
  '.tabbar__content': 'tabbar--*__content',
  '.tabbar__border': 'tabbar--*__border',
  '.tabbar': 'tabbar--*'
};

const rewritables = {
  /**
   * @param {Element} tabbarElement
   * @param {Function} callback
   */
  ready(tabbarElement, callback) {
    callback();
  }
};

const nullPage = internal.nullElement;
const lerp = (x0, x1, t) => (1 - t) * x0 + t * x1;

const template = document.createElement('template');
template.innerHTML = `
  <style>${style()}</style>
  <div id="content" class="tabbar__content ons-tabbar__content">
    <div>
      <slot name="_content"></slot>
    </div>
    <div></div>
  </div>
  <div id="footer" class="tabbar ons-tabbar__footer ons-swiper-tabbar">
    <slot></slot>
    <div id="border" class="tabbar__border"></div>
  </div>
`;

/**
 * @element ons-tabbar
 * @category tabbar
 * @description
 *   [en]A component to display a tab bar on the bottom of a page. Used with `<ons-tab>` to manage pages using tabs.[/en]
 *   [ja]タブバーをページ下部に表示するためのコンポーネントです。ons-tabと組み合わせて使うことで、ページを管理できます。[/ja]
 * @codepen pGuDL
 * @tutorial vanilla/Reference/tabbar
 * @modifier material
 *   [en]A tabbar in Material Design.[/en]
 *   [ja][/ja]
 * @modifier autogrow
 *   [en]Tabs automatically grow depending on their content instead of having a fixed width.[/en]
 *   [ja][/ja]
 * @modifier top-border
 *   [en]Shows a static border-bottom in tabs for iOS top tabbars.[/en]
 *   [ja][/ja]
 * @guide fundamentals.html#managing-pages
 *  [en]Managing multiple pages.[/en]
 *  [ja]複数のページを管理する[/ja]
 * @seealso ons-tab
 *   [en]The `<ons-tab>` component.[/en]
 *   [ja]ons-tabコンポーネント[/ja]
 * @seealso ons-page
 *   [en]The `<ons-page>` component.[/en]
 *   [ja]ons-pageコンポーネント[/ja]
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
export default class TabbarElement extends BaseElement {

  /**
   * @event prechange
   * @description
   *   [en]Fires just before the tab is changed.[/en]
   *   [ja]アクティブなタブが変わる前に発火します。[/ja]
   * @param {Object} event
   *   [en]Event object.[/en]
   *   [ja]イベントオブジェクト。[/ja]
   * @param {Number} event.index
   *   [en]Current index.[/en]
   *   [ja]現在アクティブになっているons-tabのインデックスを返します。[/ja]
   * @param {Object} event.tabItem
   *   [en]Tab item object.[/en]
   *   [ja]tabItemオブジェクト。[/ja]
   * @param {Function} event.cancel
   *   [en]Call this function to cancel the change event.[/en]
   *   [ja]この関数を呼び出すと、アクティブなタブの変更がキャンセルされます。[/ja]
   */

  /**
   * @event postchange
   * @description
   *   [en]Fires just after the tab is changed.[/en]
   *   [ja]アクティブなタブが変わった後に発火します。[/ja]
   * @param {Object} event
   *   [en]Event object.[/en]
   *   [ja]イベントオブジェクト。[/ja]
   * @param {Number} event.index
   *   [en]Current index.[/en]
   *   [ja]現在アクティブになっているons-tabのインデックスを返します。[/ja]
   * @param {Object} event.tabItem
   *   [en]Tab item object.[/en]
   *   [ja]tabItemオブジェクト。[/ja]
   */

  /**
   * @event reactive
   * @description
   *   [en]Fires if the already open tab is tapped again.[/en]
   *   [ja]すでにアクティブになっているタブがもう一度タップやクリックされた場合に発火します。[/ja]
   * @param {Object} event
   *   [en]Event object.[/en]
   *   [ja]イベントオブジェクト。[/ja]
   * @param {Number} event.index
   *   [en]Current index.[/en]
   *   [ja]現在アクティブになっているons-tabのインデックスを返します。[/ja]
   * @param {Object} event.tabItem
   *   [en]Tab item object.[/en]
   *   [ja]tabItemオブジェクト。[/ja]
   */

  /**
   * @event swipe
   * @description
   *   [en]Fires when the tabbar swipes.[/en]
   *   [ja][/ja]
   * @param {Object} event
   *   [en]Event object.[/en]
   *   [ja]イベントオブジェクト。[/ja]
   * @param {Number} event.index
   *   [en]Current index.[/en]
   *   [ja]現在アクティブになっているons-tabのインデックスを返します。[/ja]
   * @param {Object} event.options
   *   [en]Animation options object.[/en]
   *   [ja][/ja]
   */

  /**
   * @attribute animation
   * @type {String}
   * @default none
   * @description
   *   [en]If this attribute is set to `"none"` the transitions will not be animated.[/en]
   *   [ja][/ja]
   */

  /**
   * @attribute animation-options
   * @type {Expression}
   * @description
   *  [en]Specify the animation's duration, timing and delay with an object literal. E.g. `{duration: 0.2, delay: 1, timing: 'ease-in'}`.[/en]
   *  [ja]アニメーション時のduration, timing, delayをオブジェクトリテラルで指定します。e.g. {duration: 0.2, delay: 1, timing: 'ease-in'}[/ja]
   */

  /**
   * @attribute position
   * @initonly
   * @type {String}
   * @default bottom
   * @description
   *   [en]Tabbar's position. Available values are `"bottom"` and `"top"`. Use `"auto"` to choose position depending on platform (bottom for iOS flat design, top for Material Design).[/en]
   *   [ja]タブバーの位置を指定します。"bottom"もしくは"top"を選択できます。デフォルトは"bottom"です。[/ja]
   */

  /**
   * @attribute swipeable
   * @description
   *   [en]If this attribute is set the tab bar can be scrolled by drag or swipe.[/en]
   *   [ja]この属性がある時、タブバーをスワイプやドラッグで移動できるようになります。[/ja]
   */

  /**
   * @attribute ignore-edge-width
   * @type {Number}
   * @default 20
   * @description
   *   [en]Distance in pixels from both edges. Swiping on these areas will prioritize parent components such as `ons-splitter` or `ons-navigator`.[/en]
   *   [ja][/ja]
   */

  /**
   * @attribute hide-tabs
   * @description
   *   [en]Whether to hide the tabs.[/en]
   *   [ja]タブを非表示にする場合に指定します。[/ja]
   */

  /**
   * @attribute tab-border
   * @description
   *   [en]If this attribute is set the tabs show a dynamic bottom border. Only works for iOS flat design since the border is always visible in Material Design.[/en]
   *   [ja][/ja]
   */

  /**
   * @attribute modifier
   * @type {String}
   * @description
   *   [en]The appearance of the tabbar.[/en]
   *   [ja]タブバーの表現を指定します。[/ja]
   */

  constructor() {
    super();

    this._connectedOnce = false;
    this._watchedTabs = new Set();
    this._pageLoader = defaultPageLoader;

    this._createShadow();
  }

  connectedCallback() {
    if (!this._connectedOnce) {
      this._connectedOnce = true;

      this._upgradeProperties();
    }
  }

  disconnectedCallback() {

  }

  _onSlotChange() {
    this._tabElements = this.shadowRoot.querySelector('slot:not([name])').assignedElements()
      .filter(element => element.tagName === 'ONS-TAB');

    const added = this._tabElements.filter(tab => !this._watchedTabs.has(tab));
    added.forEach(tab => {
      tab.addEventListener('active', this._onActive.bind(this));
      this._watchedTabs.add(tab);
    });
  }

  static get observedAttributes() {
    return ['active-index'
    //'modifier', 'position', 'swipeable', 'tab-border', 'hide-tabs'
    ];
  }

  attributeChangedCallback(name, last, current) {
    switch (name) {
      case 'active-index':
        break;
    }
    //if (name === 'modifier') {
    //  ModifierUtil.onModifierChanged(last, current, this, scheme);
    //  const isTop = m => /(^|\s+)top($|\s+)/i.test(m);
    //  isTop(last) !== isTop(current) && this._updatePosition();
    //} else if (name === 'position') {
    //  util.isAttached(this) && this._updatePosition();
    //} else if (name === 'swipeable') {
    //  this._swiper && this._swiper.updateSwipeable(this.hasAttribute('swipeable'));
    //} else if (name === 'hide-tabs') {
    //  this.setTabbarVisibility(!this.hasAttribute('hide-tabs') || current === 'false');
    //}
  }

  ////////////////////////////////////////////////////////////////////////////////
  // PUBLIC METHODS
  ////////////////////////////////////////////////////////////////////////////////

  get activeIndex() {
    return this.getAttribute('active-index');
  }

  set activeIndex(value) {
    this.setAttribute('active-index', value);
  }

  ////////////////////////////////////////////////////////////////////////////////
  // PRIVATE METHODS
  ////////////////////////////////////////////////////////////////////////////////

  _createShadow() {
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.shadowRoot.querySelector('slot:not([name])')
      .addEventListener('slotchange', () => this._onSlotChange());
  }

  _upgradeProperties() {
    ['activeIndex']
      .forEach(property => {
        if (this.hasOwnProperty(property)) {
          const value = this[property];
          delete this[property];
          this[property] = value;
        }
      });
  }

  _onActive(event) {
    const lastActive = this._tabElements[this.activeIndex];
    if (lastActive) {
      lastActive.active = false;
    }
    this.activeIndex = this._tabElements.indexOf(event.target);
  }

  // JUNK

  //constructor() {
  //  super();
  //  this._loadInactive = util.defer(); // Improves #2324
  //  contentReady(this, () => this._compile());

  //  util.defineListenerProperty(this, 'swipe');
  //}

  //connectedCallback() {
  //  if (!this._swiper) {
  //    this._swiper = new Swiper({
  //      getElement: () => this._contentElement,
  //      getInitialIndex: () => this.getAttribute('activeIndex') || this.getAttribute('active-index'),
  //      getAutoScrollRatio: this._getAutoScrollRatio.bind(this),
  //      getBubbleWidth: () => parseInt(this.getAttribute('ignore-edge-width') || 25, 10),
  //      isAutoScrollable: () => true,
  //      preChangeHook: this._onPreChange.bind(this),
  //      postChangeHook: this._onPostChange.bind(this),
  //      refreshHook: this._onRefresh.bind(this),
  //      scrollHook: this._onScroll.bind(this)
  //    });

  //    contentReady(this, () => {
  //      this._tabbarBorder = util.findChild(this._tabbarElement, '.tabbar__border');
  //      this._swiper.init({ swipeable: this.hasAttribute('swipeable') });
  //    });
  //  }

  //  contentReady(this, () => {
  //    this._updatePosition();

  //    if (!util.findParent(this, 'ons-page', p => p === document.body)) {
  //      this._show(); // This tabbar is the top component
  //    }
  //  });
  //}

  //disconnectedCallback() {
  //  if (this._swiper && this._swiper.initialized) {
  //    this._swiper.dispose();
  //    this._swiper = null;
  //    this._tabbarBorder = null;
  //    this._tabsRect = null;
  //  }

  //  util.disconnectListenerProperty(this, 'swipe');
  //}

  //_normalizeEvent(event) {
  //  return { ...event, index: event.activeIndex, tabItem: this.tabs[event.activeIndex] };
  //}

  //_onPostChange(event) {
  //  event = this._normalizeEvent(event);
  //  util.triggerElementEvent(this, 'postchange', event);
  //  const page = event.tabItem.pageElement;
  //  page && page._show();
  //}

  //_onPreChange(event) {
  //  event = this._normalizeEvent(event);
  //  event.cancel = () => event.canceled = true;

  //  util.triggerElementEvent(this, 'prechange', event);

  //  if (!event.canceled) {
  //    const { activeIndex, lastActiveIndex } = event;
  //    const tabs = this.tabs;

  //    tabs[activeIndex].setActive(true);
  //    if (lastActiveIndex >= 0) {
  //      const prevTab = tabs[lastActiveIndex];
  //      prevTab.setActive(false);
  //      prevTab.pageElement && prevTab.pageElement._hide();
  //    }
  //  }

  //  return event.canceled;
  //}

  //_onScroll(index, options = {}) {
  //  if (this._tabbarBorder) {
  //    this._tabbarBorder.style.transition = `all ${options.duration || 0}s ${options.timing || ''}`;

  //    if (this._autogrow && this._tabsRect.length > 0) {
  //      const a = Math.floor(index), b = Math.ceil(index), r = index % 1;
  //      this._tabbarBorder.style.width = lerp(this._tabsRect[a].width, this._tabsRect[b].width, r) + 'px';
  //      this._tabbarBorder.style.transform = `translate3d(${lerp(this._tabsRect[a].left, this._tabsRect[b].left, r)}px, 0, 0)`;
  //    } else {
  //      this._tabbarBorder.style.transform = `translate3d(${index * 100}%, 0, 0)`;
  //    }
  //  }

  //  util.triggerElementEvent(this, 'swipe', { index, options });
  //}

  //_onRefresh() {
  //  this._autogrow = util.hasModifier(this, 'autogrow');
  //  this._tabsRect = this.tabs.map(tab => tab.getBoundingClientRect());
  //  if (this._tabbarBorder) {
  //    this._tabbarBorder.style.display = this.hasAttribute('tab-border') || util.hasModifier(this, 'material') ? 'block' : 'none';
  //    const index = this.getActiveTabIndex();
  //    if (this._tabsRect.length > 0 && index >= 0) {
  //      this._tabbarBorder.style.width = this._tabsRect[index].width + 'px';
  //    }
  //  }
  //}

  //_getAutoScrollRatio(matches, velocity, size) {
  //  const ratio = .6; // Base ratio
  //  const modifier = size / 300 * (matches ? -1 : 1); // Based on screen size
  //  return Math.min(1, Math.max(0, ratio + velocity * modifier));
  //}

  //get _tabbarElement() {
  //  return util.findChild(this, '.tabbar');
  //}

  //get _contentElement() {
  //  return util.findChild(this, '.tabbar__content');
  //}

  //get _targetElement() {
  //  const content = this._contentElement;
  //  return content && content.children[0] || null;
  //}

  //_compile() {
  //  autoStyle.prepare(this);

  //  const content = this._contentElement || util.create('.tabbar__content');
  //  content.classList.add('ons-tabbar__content');
  //  const tabbar = this._tabbarElement || util.create('.tabbar');
  //  tabbar.classList.add('ons-tabbar__footer');

  //  if (!tabbar.parentNode) {
  //    while (this.firstChild) {
  //      tabbar.appendChild(this.firstChild);
  //    }
  //  }

  //  const activeIndex = Number(this.getAttribute('activeIndex')); // 0 by default
  //  if (tabbar.children.length > activeIndex && !util.findChild(tabbar, '[active]')) {
  //    tabbar.children[activeIndex].setAttribute('active', '');
  //  }

  //  this._tabbarBorder = util.findChild(tabbar, '.tabbar__border') || util.create('.tabbar__border');
  //  tabbar.appendChild(this._tabbarBorder);
  //  tabbar.classList.add('ons-swiper-tabbar'); // Hides material border

  //  !content.children[0] && content.appendChild(document.createElement('div'));
  //  !content.children[1] && content.appendChild(document.createElement('div'));
  //  content.appendChild = content.appendChild.bind(content.children[0]);
  //  content.insertBefore = content.insertBefore.bind(content.children[0]);

  //  this.appendChild(content);
  //  this.appendChild(tabbar); // Triggers ons-tab connectedCallback

  //  ModifierUtil.initModifier(this, scheme);
  //}

  //_updatePosition(position = this.getAttribute('position')) {
  //  const top = this._top = position === 'top' || (position === 'auto' && util.hasModifier(this, 'material'));
  //  const action = top ? util.addModifier : util.removeModifier;

  //  action(this, 'top');

  //  const page = util.findParent(this, 'ons-page');
  //  if (page) {
  //    contentReady(page, () => {
  //      let p = 0;
  //      if (page.children[0] && util.match(page.children[0], 'ons-toolbar')) {
  //        action(page.children[0], 'noshadow');
  //        p = 1; // Visual fix for some devices
  //      }

  //      const content = page._getContentElement();
  //      const cs = window.getComputedStyle(page._getContentElement(), null);

  //      this.style.top = top ? parseInt(cs.getPropertyValue('padding-top'), 10) - p + 'px' : '';

  //      // Refresh content top - Fix for iOS 8
  //      content.style.top = cs.top;
  //      content.style.top = '';
  //    });
  //  }

  //  internal.autoStatusBarFill(() => {
  //    const filled = util.findParent(this, e => e.hasAttribute('status-bar-fill'));
  //    util.toggleAttribute(this, 'status-bar-fill', top && !filled);
  //  });
  //}

  //get topPage() {
  //  const tabs = this.tabs,
  //    index = this.getActiveTabIndex();
  //  return tabs[index]
  //    ? tabs[index].pageElement || this.pages[0] || null
  //    : null;
  //}

  //get pages() {
  //  return util.arrayFrom(this._targetElement.children);
  //}

  //get tabs() {
  //  return Array.prototype.filter.call(this._tabbarElement.children, e => e.tagName === 'ONS-TAB');
  //}

  ///**
  // * @method setActiveTab
  // * @signature setActiveTab(index, [options])
  // * @param {Number} index
  // *   [en]Tab index.[/en]
  // *   [ja]タブのインデックスを指定します。[/ja]
  // * @param {Object} [options]
  // *   [en]Parameter object.[/en]
  // *   [ja]オプションを指定するオブジェクト。[/ja]
  // * @param {Function} [options.callback]
  // *   [en]Function that runs when the new page has loaded.[/en]
  // *   [ja][/ja]
  // * @param {String} [options.animation]
  // *   [en]If this option is "none", the transition won't slide.[/en]
  // *   [ja][/ja]
  // * @param {String} [options.animationOptions]
  // *   [en]Specify the animation's duration, delay and timing. E.g. `{duration: 0.2, delay: 0.4, timing: 'ease-in'}`.[/en]
  // *   [ja]アニメーション時のduration, delay, timingを指定します。e.g. {duration: 0.2, delay: 0.4, timing: 'ease-in'}[/ja]
  // * @description
  // *   [en]Show specified tab page. Animations and their options can be specified by the second parameter.[/en]
  // *   [ja]指定したインデックスのタブを表示します。アニメーションなどのオプションを指定できます。[/ja]
  // * @return {Promise}
  // *   [en]A promise that resolves to the new page element.[/en]
  // *   [ja][/ja]
  // */
  //setActiveTab(nextIndex, options = {}) {
  //  const prevIndex = this.getActiveTabIndex();
  //  const prevTab = this.tabs[prevIndex],
  //    nextTab = this.tabs[nextIndex];

  //  if (!nextTab) {
  //    return Promise.reject('Specified index does not match any tab.');
  //  }

  //  if (nextIndex === prevIndex) {
  //    util.triggerElementEvent(this, 'reactive', { index: nextIndex, activeIndex: nextIndex, tabItem: nextTab });
  //    return Promise.resolve(nextTab.pageElement);
  //  }

  //  // FIXME: nextTab.loaded is broken in Zone.js promises (Angular2)
  //  const nextPage = nextTab.pageElement;
  //  return (nextPage ? Promise.resolve(nextPage) : nextTab.loaded)
  //    .then(nextPage => this._swiper.setActiveIndex(nextIndex, {
  //      reject: true,
  //      ...options,
  //      animation: prevTab && nextPage ? options.animation || this.getAttribute('animation') : 'none',
  //      animationOptions: util.extend(
  //        { duration: .3, timing: 'cubic-bezier(.4, .7, .5, 1)' },
  //        this.hasAttribute('animation-options') ? util.animationOptionsParse(this.getAttribute('animation-options')) : {},
  //        options.animationOptions || {}
  //      )
  //    }).then(() => {
  //      options.callback instanceof Function && options.callback(nextPage);
  //      return nextPage;
  //    }));
  //}

  ///**
  // * @method setTabbarVisibility
  // * @signature setTabbarVisibility(visible)
  // * @param {Boolean} visible
  // * @description
  // *   [en]Used to hide or show the tab bar.[/en]
  // *   [ja][/ja]
  // */
  //setTabbarVisibility(visible) {
  //  contentReady(this, () => {
  //    this._contentElement.style[this._top ? 'top' : 'bottom'] = visible ? '' : '0px';
  //    this._tabbarElement.style.display = visible ? '' : 'none';
  //    visible && this._onRefresh();
  //  });
  //}

  //show() {
  //  this.setTabbarVisibility(true);
  //}

  //hide() {
  //  this.setTabbarVisibility(false);
  //}

  ///**
  // * @property visible
  // * @readonly
  // * @type {Boolean}
  // * @description
  // *   [en]Whether the tabbar is visible or not.[/en]
  // *   [ja]タブバーが見える場合に`true`。[/ja]
  // */
  //get visible() {
  //  return this._tabbarElement.style.display !== 'none';
  //}

  ///**
  // * @property swipeable
  // * @type {Boolean}
  // * @description
  // *   [en]Enable swipe interaction.[/en]
  // *   [ja]swipeableであればtrueを返します。[/ja]
  // */
  //get swipeable() {
  //  return this.hasAttribute('swipeable');
  //}

  //set swipeable(value) {
  //  return util.toggleAttribute(this, 'swipeable', value);
  //}

  ///**
  // * @property onSwipe
  // * @type {Function}
  // * @description
  // *   [en]Hook called whenever the user slides the tabbar. It gets a decimal index and an animationOptions object as arguments.[/en]
  // *   [ja][/ja]
  // */

  ///**
  // * @method getActiveTabIndex
  // * @signature getActiveTabIndex()
  // * @return {Number}
  // *   [en]The index of the currently active tab.[/en]
  // *   [ja]現在アクティブになっているタブのインデックスを返します。[/ja]
  // * @description
  // *   [en]Returns tab index on current active tab. If active tab is not found, returns -1.[/en]
  // *   [ja]現在アクティブになっているタブのインデックスを返します。現在アクティブなタブがない場合には-1を返します。[/ja]
  // */
  //getActiveTabIndex(tabs = this.tabs) {
  //  for (let i = 0; i < tabs.length; i++) {
  //    if (tabs[i] && tabs[i].tagName === 'ONS-TAB' && tabs[i].isActive()) {
  //      return i;
  //    }
  //  }
  //  return -1;
  //}

  //_show() {
  //  this._swiper.show();

  //  setImmediate(() => {
  //    const tabs = this.tabs;
  //    const activeIndex = this.getActiveTabIndex(tabs);
  //    this._loadInactive.resolve();
  //    if (tabs.length > 0 && activeIndex >= 0) {
  //      tabs[activeIndex].loaded.then(el => el && setImmediate(() => el._show()));
  //    }
  //  });
  //}

  //_hide() {
  //  this._swiper.hide();
  //  const topPage = this.topPage;
  //  topPage && topPage._hide();
  //}

  //_destroy() {
  //  this.tabs.forEach(tab => tab.remove());
  //  this.remove();
  //}

  //static get observedAttributes() {
  //  return ['modifier', 'position', 'swipeable', 'tab-border', 'hide-tabs'];
  //}

  //attributeChangedCallback(name, last, current) {
  //  if (name === 'modifier') {
  //    ModifierUtil.onModifierChanged(last, current, this, scheme);
  //    const isTop = m => /(^|\s+)top($|\s+)/i.test(m);
  //    isTop(last) !== isTop(current) && this._updatePosition();
  //  } else if (name === 'position') {
  //    util.isAttached(this) && this._updatePosition();
  //  } else if (name === 'swipeable') {
  //    this._swiper && this._swiper.updateSwipeable(this.hasAttribute('swipeable'));
  //  } else if (name === 'hide-tabs') {
  //    this.setTabbarVisibility(!this.hasAttribute('hide-tabs') || current === 'false');
  //  }
  //}

  //static get rewritables() {
  //  return rewritables;
  //}

  //static get events() {
  //  return ['prechange', 'postchange', 'reactive'];
  //}
}

onsElements.Tabbar = TabbarElement;
customElements.define('ons-tabbar', TabbarElement);

function style() {
  return `
:root {
  --tabbar-button-color: var(--tabbar-text-color); /* Text color */
  --tabbar-active-color: var(--tabbar-highlight-text-color); /* Text color active */
  --material-tabbar-current-color: var(--material-tabbar-highlight-text-color);
  --tabbar-active-border-top: none;
  --tabbar-focus-border-top: none;
  --tabbar-height: 49px;
  --tabbar-button-line-height: 49px;
  --tabbar-button-border: none;
  --tabbar-active-box-shadow: none;
  --tabbar-button-focus-box-shadow: none;
  --tabbar-border-top: 1px solid var(--tabbar-border-color);
}

/*~
  name: Icon Tabbar
  category: Tabbar
  elements: ons-tabbar ons-tab
  markup: |
    <!-- Prerequisite=This example use ionicons(http://ionicons.com) to display icons. -->
    <div class="tabbar">
      <label class="tabbar__item">
        <input type="radio" name="tabbar-a" checked="checked">
        <button class="tabbar__button">
          <i class="tabbar__icon ion-ios-square"></i>
          <div class="tabbar__label">One</div>
        </button>
      </label>

      <label class="tabbar__item">
        <input type="radio" name="tabbar-a">
        <button class="tabbar__button">
          <i class="tabbar__icon ion-ios-radio-button-on"></i>
          <div class="tabbar__label">Two</div>
        </button>
      </label>

      <label class="tabbar__item">
        <input type="radio" name="tabbar-a">
        <button class="tabbar__button">
          <i class="tabbar__icon ion-ios-star"></i>
          <div class="tabbar__label">Three</div>
        </button>
      </label>
    </div>
*/

/*~
  name: Tabbar
  category: Tabbar
  elements: ons-tabbar ons-tab
  markup: |
    <div class="tabbar">
      <label class="tabbar__item">
        <input type="radio" name="tabbar-c" checked="checked">
        <button class="tabbar__button">
          <div class="tabbar__label">One</div>
        </button>
      </label>

      <label class="tabbar__item">
        <input type="radio" name="tabbar-c">
        <button class="tabbar__button">
          <div class="tabbar__label">Two</div>
        </button>
      </label>

      <label class="tabbar__item">
        <input type="radio" name="tabbar-c">
        <button class="tabbar__button">
          <div class="tabbar__label">Three</div>
        </button>
      </label>
    </div>
*/

.tabbar {

  /* mixin: reset-font */
  font-family: -apple-system, 'Helvetica Neue', 'Helvetica', 'Arial', 'Lucida Grande', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-weight: var(--font-weight);

  display: flex;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  white-space: nowrap;
  margin: 0;
  padding: 0;
  height: var(--tabbar-height);
  background-color: var(--tabbar-background-color);
  border-top: var(--tabbar-border-top);
  width: 100%;
}

/* @media (--retina-query) */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi), (min-resolution: 2dppx) {
  .tabbar {
    border-top: none;
    background-size: 100% 1px;
    background-repeat: no-repeat;
    background-position: top;
    background-image: linear-gradient(180deg, var(--tabbar-border-color), var(--tabbar-border-color) 50%, transparent 50%);
  }
}

.tabbar__item {
  /* mixin: reset-font */
  font-family: -apple-system, 'Helvetica Neue', 'Helvetica', 'Arial', 'Lucida Grande', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-weight: var(--font-weight);

  /* mixin: hide-input-parent */
  position: relative;

  flex-grow: 1;
  flex-basis: 0;
  width: auto;
  border-radius: 0;
}

.tabbar__item > input {
  /* mixin: hide-input */
  position: absolute;
  right: 0;
  top: 0;
  left: 0;
  bottom: 0;
  padding: 0;
  border: 0;
  background-color: transparent;
  z-index: 1;
  vertical-align: top;
  outline: none;
  width: 100%;
  height: 100%;
  margin: 0;
  appearance: none;
}

.tabbar__button {
  /* mixin: reset-font */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  /* mixin: reset-box-model */
  box-sizing: border-box;

  /* mixin: reset-base */
  margin: 0;
  font: inherit;
  background: transparent;
  border: none;

  /* mixin: reset-cursor */
  cursor: default;
  user-select: none;

  /* mixin: ellipsis */
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;

  position: relative;
  display: inline-block;
  text-decoration: none;
  padding: 0;
  height: var(--tabbar-button-line-height);
  letter-spacing: 0;
  color: var(--tabbar-button-color);
  vertical-align: top;
  background-color: transparent;
  border-top: var(--tabbar-button-border);
  width: 100%;
  font-weight: var(--font-weight);
  line-height: var(--tabbar-button-line-height);
}

/* @media (--retina-query) */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi), (min-resolution: 2dppx) {
  .tabbar__button {
    border-top: none;
  }
}

.tabbar__icon {
  font-size: 24px;
  padding: 0;
  margin: 0;
  line-height: 26px;
  display: block !important; /* stylelint-disable-line declaration-no-important */
  height: 28px;
}

.tabbar__label {

  /* mixin: reset-font */
  font-family: -apple-system, 'Helvetica Neue', 'Helvetica', 'Arial', 'Lucida Grande', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-weight: var(--font-weight);

  display: inline-block;
}

.tabbar__badge.notification {
  vertical-align: text-bottom;
  top: -1px;
  margin-left: 5px;
  z-index: 10;
  font-size: 12px;
  height: 16px;
  min-width: 16px;
  line-height: 16px;
  border-radius: 8px;
}

.tabbar__icon ~ .tabbar__badge.notification {
  position: absolute;
  top: 5px;
  margin-left: 0;
}

.tabbar__icon + .tabbar__label {
  display: block;
  font-size: 10px;
  line-height: 1;
  margin: 0;
  font-weight: var(--font-weight);
}

.tabbar__label:first-child {
  font-size: 16px;
  line-height: var(--tabbar-button-line-height);
  margin: 0;
  padding: 0;
}

:checked + .tabbar__button {
  color: var(--tabbar-active-color);
  background-color: transparent;
  box-shadow: var(--tabbar-active-box-shadow);
  border-top: var(--tabbar-active-border-top);
}

.tabbar__button:disabled {
  /* mixin: disabled */
  opacity: 0.3;
  cursor: default;
  pointer-events: none;
}

.tabbar__button:focus {
  z-index: 1;
  border-top: var(--tabbar-focus-border-top);
  box-shadow: var(--tabbar-button-focus-box-shadow);
  outline: 0;
}

.tabbar__content {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: var(--tabbar-height);
  z-index: 0;
}

.tabbar--autogrow .tabbar__item {
  flex-basis: auto;
}

/*~
  name: Icon Only Tabbar
  category: Tabbar
  elements: ons-tabbar ons-tab
  markup: |
    <!-- Prerequisite=This example use ionicons(http://ionicons.com) to display icons. -->
    <div class="tabbar">
      <label class="tabbar__item">
        <input type="radio" name="tabbar-b" checked="checked">
        <button class="tabbar__button">
          <i class="tabbar__icon ion-ios-square"></i>
        </button>
      </label>

      <label class="tabbar__item">
        <input type="radio" name="tabbar-b">
        <button class="tabbar__button">
          <i class="tabbar__icon ion-ios-radio-button-on"></i>
        </button>
      </label>

      <label class="tabbar__item">
        <input type="radio" name="tabbar-b">
        <button class="tabbar__button">
          <i class="tabbar__icon ion-ios-star"></i>
        </button>
      </label>

    </div>
*/

/*~
  name: Top Tabbar
  category: Tabbar
  elements: ons-tabbar ons-tab
  markup: |
    <div class="tabbar tabbar--top">
      <label class="tabbar__item">
        <input type="radio" name="top-tabbar-a" checked="checked">
        <button class="tabbar__button">
          <i class="tabbar__icon ion-ios-square"></i>
        </button>
      </label>

      <label class="tabbar__item">
        <input type="radio" name="top-tabbar-a">
        <button class="tabbar__button">
          <i class="tabbar__icon ion-ios-radio-button-on"></i>
        </button>
      </label>

      <label class="tabbar__item">
        <input type="radio" name="top-tabbar-a">
        <button class="tabbar__button">
          <i class="tabbar__icon ion-ios-star"></i>
        </button>
      </label>
    </div>
*/

.tabbar--top {
  position: relative;
  top: 0;
  left: 0;
  right: 0;
  bottom: auto;
  border-top: none;
  border-bottom: var(--tabbar-border-top);
}

/* @media (--retina-query) */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi), (min-resolution: 2dppx) {
  .tabbar--top {
    border-bottom: none;
    background-size: 100% 1px;
    background-repeat: no-repeat;
    background-position: bottom;
    background-image: linear-gradient(0deg, var(--tabbar-border-color), var(--tabbar-border-color) 50%, transparent 50%);
  }
}

.tabbar--top__content {
  top: var(--tabbar-height);
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
}

/*~
  name: Bordered Top Tabbar
  category: Tabbar
  elements: ons-tabbar ons-tab
  markup: |
    <div class="tabbar tabbar--top tabbar--top-border">
      <label class="tabbar__item tabbar--top-border__item">
        <input type="radio" name="top-tabbar-b" checked="checked">
        <button class="tabbar__button tabbar--top-border__button">
          Home
        </button>
      </label>

      <label class="tabbar__item tabbar--top-border__item">
        <input type="radio" name="top-tabbar-b">
        <button class="tabbar__button tabbar--top-border__button">
          Comments
        </button>
      </label>

      <label class="tabbar__item tabbar--top-border__item">
        <input type="radio" name="top-tabbar-b">
        <button class="tabbar__button tabbar--top-border__button">
          Activity
        </button>
      </label>
    </div>
*/

/*~
  name: Material Tabbar
  category: Tabbar
  elements: ons-tabbar ons-tab
  markup: |
    <div class="tabbar tabbar--top tabbar--material">
      <label class="tabbar__item tabbar--material__item">
        <input type="radio" name="tabbar-material-a" checked="checked">
        <button class="tabbar__button tabbar--material__button">
          Music
        </button>
      </label>

      <label class="tabbar__item tabbar--material__item">
        <input type="radio" name="tabbar-material-a">
        <button class="tabbar__button tabbar--material__button">
          Movies
        </button>
      </label>

      <label class="tabbar__item tabbar--material__item">
        <input type="radio" name="tabbar-material-a">
        <button class="tabbar__button tabbar--material__button">
          Books
        </button>
      </label>

      <label class="tabbar__item tabbar--material__item">
        <input type="radio" name="tabbar-material-a">
        <button class="tabbar__button tabbar--material__button">
          Games
        </button>
      </label>

    </div>
*/

.tabbar--top-border__button {
  background-color: transparent;
  border-bottom: 4px solid transparent;
}

:checked + .tabbar--top-border__button {
  background-color: transparent;
  border-bottom: 4px solid var(--tabbar-active-color);
}

.tabbar__border {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 4px;
  background-color: var(--tabbar-active-color);
}

.tabbar--material {
  background: none;
  background-color: var(--material-tabbar-background-color);
  border-bottom-width: 0;
  box-shadow:
    0 4px 2px -2px rgba(0, 0, 0, 0.14),
    0 3px 5px -2px rgba(0, 0, 0, 0.12),
    0 5px 1px -4px rgba(0, 0, 0, 0.2);
}

.tabbar--material__button {
  background-color: transparent;
  color: var(--material-tabbar-text-color);
  text-transform: uppercase;
  font-size: 14px;

  /* mixin: material-font */
  font-family: 'Roboto', 'Noto', sans-serif;
  -webkit-font-smoothing: antialiased;
  font-weight: var(--material-font-weight);
}

.tabbar--material__button:after {
  content: '';
  display: block;
  width: 0;
  height: 2px;
  bottom: 0;
  position: absolute;
  margin-top: -2px;
  background-color: var(--material-tabbar-current-color);
}

:checked + .tabbar--material__button:after {
  width: 100%;
  transition: width 0.2s ease-in-out;
}

:checked + .tabbar--material__button {
  background-color: transparent;
  color: var(--material-tabbar-current-color);
}

.tabbar--material__item:not([ripple]):active {
  background-color: var(--material-tabbar-highlight-color);
}

.tabbar--material__border {
  height: 2px;
  background-color: var(--material-tabbar-current-color);
}

/*~
  name: Material Tabbar (Icon only)
  category: Tabbar
  elements: ons-tabbar ons-tab
  markup: |
    <div class="tabbar tabbar--top tabbar--material">
      <label class="tabbar__item tabbar--material__item">
        <input type="radio" name="tabbar-material-b" checked="checked">
        <button class="tabbar__button tabbar--material__button">
          <i class="tabbar__icon tabbar--material__icon zmdi zmdi-phone"></i>
        </button>
      </label>

      <label class="tabbar__item tabbar--material__item">
        <input type="radio" name="tabbar-material-b">
        <button class="tabbar__button tabbar--material__button">
          <i class="tabbar__icon tabbar--material__icon zmdi zmdi-favorite"></i>
        </button>
      </label>

      <label class="tabbar__item tabbar--material__item">
        <input type="radio" name="tabbar-material-b">
        <button class="tabbar__button tabbar--material__button">
          <i class="tabbar__icon tabbar--material__icon zmdi zmdi-pin-account"></i>
        </button>
      </label>
    </div>
*/

.tabbar--material__icon {
  font-size: 22px !important; /* stylelint-disable-line declaration-no-important */
  line-height: 36px;
}

/*~
  name: Material Tabbar (Icon and Label)
  category: Tabbar
  elements: ons-tabbar ons-tab
  markup: |
    <div class="tabbar tabbar--top tabbar--material">
      <label class="tabbar__item tabbar--material__item">
        <input type="radio" name="tabbar-material-c" checked="checked">
        <button class="tabbar__button tabbar--material__button">
          <i class="tabbar__icon tabbar--material__icon zmdi zmdi-phone"></i>
          <div class="tabbar__label tabbar--material__label">Call</div>
        </button>
      </label>

      <label class="tabbar__item tabbar--material__item">
        <input type="radio" name="tabbar-material-c">
        <button class="tabbar__button tabbar--material__button">
          <i class="tabbar__icon tabbar--material__icon zmdi zmdi-favorite"></i>
          <div class="tabbar__label tabbar--material__label">Favorites</div>
        </button>
      </label>

      <label class="tabbar__item tabbar--material__item">
        <input type="radio" name="tabbar-material-c">
        <button class="tabbar__button tabbar--material__button">
          <i class="tabbar__icon tabbar--material__icon zmdi zmdi-delete"></i>
          <div class="tabbar__label tabbar--material__label">Delete</div>
        </button>
      </label>
    </div>
*/

.tabbar--material__label {
  /* mixin: material-font */
  font-family: 'Roboto', 'Noto', sans-serif;
  -webkit-font-smoothing: antialiased;
  font-weight: var(--material-font-weight);
}

.tabbar--material__label:first-child {
  /* mixin: material-font */
  font-family: 'Roboto', 'Noto', sans-serif;
  -webkit-font-smoothing: antialiased;

  letter-spacing: 0.015em;
  font-weight: 500;
  font-size: 14px;
}

.tabbar--material__icon + .tabbar--material__label {
  font-size: 10px;
}
  `;
}
