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
import BaseElement from './base/base-element.js';
import autoStyle from '../ons/autostyle.js';
import ModifierUtil from '../ons/internal/modifier-util.js';
import util from '../ons/util.js';

const defaultClassName = 'list-title';
const scheme = {'': 'list-title--*'};

/**
 * @element ons-list-title
 * @category list
 * @description
 *   [en]Represents a list title.[/en]
 *   [ja]リストのタイトルを表現します。[/ja]
 * @example
 * <ons-list-title>List Title</ons-list-title>
 * <ons-list>
 *   <ons-list-item>Item</ons-list-item>
 * </ons-list>
 * @modifier material
 *   [en]Display a Material Design list title.[/en]
 *   [ja][/ja]
 */

export default class ListTitleElement extends BaseElement {

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

onsElements.ListTitle = ListTitleElement;
customElements.define('ons-list-title', ListTitleElement);
