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

const defaultClassName = 'list-header';
const scheme = {'': 'list-header--*'};

/**
 * @element ons-list-header
 * @category list
 * @description
 *   [en]Header element for list items. Must be put inside the `<ons-list>` component.[/en]
 *   [ja]リスト要素に使用するヘッダー用コンポーネント。ons-listと共に使用します。[/ja]
 * @seealso ons-list
 *   [en]The `<ons-list>` component[/en]
 *   [ja]ons-listコンポーネント[/ja]
 * @seealso ons-list-item
 *   [en]The `<ons-list-item>` component[/en]
 *   [ja]ons-list-itemコンポーネント[/ja]
 * @codepen yxcCt
 * @tutorial vanilla/Reference/list
 * @modifier material
 *   [en]Display a Material Design list header.[/en]
 *   [ja][/ja]
 * @example
 * <ons-list>
 *   <ons-list-header>Header Text</ons-list-header>
 *   <ons-list-item>Item</ons-list-item>
 *   <ons-list-item>Item</ons-list-item>
 * </ons-list>
 */
export default class ListHeaderElement extends BaseElement {

  /**
   * @attribute modifier
   * @type {String}
   * @description
   *   [en]The appearance of the list header.[/en]
   *   [ja]ヘッダーの表現を指定します。[/ja]
   */

  constructor() {
    super();

    this._connectedOnce = false;
  }

  connectedCallback() {
    if (!this._connectedOnce) {
      this._connectedOnce = true;

      this._applyDefaultClass();
      this._applyAutoStyling();
    }
  }

  static get observedAttributes() {
    return ['modifier', 'class'];
  }

  attributeChangedCallback(name, last, current) {
    switch (name) {
      case 'class':
        this._applyDefaultClass();
        break;
      case 'modifier':
        this._applyModifier(last, current);
        break;
    }
  }

  ////////////////////////////////////////////////////////////////////////////////
  // METHODS
  ////////////////////////////////////////////////////////////////////////////////

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
}

onsElements.ListHeader = ListHeaderElement;
customElements.define('ons-list-header', ListHeaderElement);
