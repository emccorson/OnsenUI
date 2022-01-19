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

let queueMap = new WeakMap();
let readyMap = new WeakMap();

function consumeQueue(element) {
  const callbacks = queueMap.get(element, []) || [];
  queueMap.delete(element);
  callbacks.forEach(callback => callback());
}

function setContentReady(element) {
  readyMap.set(element, true);
  consumeQueue(element);
}

export default function contentReady(element, fn = () => {}) {
  if (!queueMap.has(element)) {
    queueMap.set(element, []);
  }
  queueMap.get(element).push(fn);

  if (readyMap.has(element)) {
    consumeQueue(element);
  } else if (document.readyState === 'interactive' || document.readyState === 'complete') {
    // use setImmediate to allow contentReady to be used in constructor
    setImmediate(() => setContentReady(element));
  } else {
    document.addEventListener('readystatechange', () => setContentReady(element), {once: true});
  }
}
