window.testUtils = {

  createElement(elementString) {
    return new Promise(resolve => {
      const element = ons._util.createElement(elementString);
      setImmediate(() => resolve(element));
    });
  }

};
