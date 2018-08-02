import React from 'react';
import ReactDOM from 'react-dom';

import ons from 'onsenui';

/**
 * This adds some stuff for handling classes.
 * Whenever the component mounts or updates, the component's classes are passed to the node. The node is then refreshed.
 */
class BasicComponent extends React.Component {
  constructor(...args) {
    super(...args);
    this.updateClasses = this.updateClasses.bind(this);
  }

  updateClasses() {
    // get the node
    const node = ReactDOM.findDOMNode(this); // should use a ref instead of findDOMNode

    // no node? go home.
    if (!node) {
      return;
    }

    // if we have something in the class prop
    if (typeof this.props.className !== 'undefined') {
      // remove last class(es) from class list
      if (this.lastClass) {
        node.className = node.className.replace(this.lastClass, ' '); // if the order of classes in node.className got changed this would break
      }

      // save class prop as the current class
      // (would it be better if lastClass was called currentClasses?)
      this.lastClass = this.props.className.trim();

      // add the class prop to the class list
      node.className = node.className.trim() + ' ' + this.lastClass;
    }

    // error if no onsen (but why here?)
    if (!ons) {
      throw new Error("react-onsenui requires `onsenui`, make sure you are loading it with `import onsenui` or `require('onsenui')` before using the components");
    }

    // force restyling I guess
    ons._autoStyle.prepare(node);
  }

  componentDidMount() {
    this.updateClasses();
  }

  componentDidUpdate() {
    this.updateClasses();
  }
}

export default BasicComponent;
