// ==UserScript==
// @name         Pobreflix
// @namespace    pobretv-enhanced
// @version      0.0.10
// @author       monkey
// @description  Pobretv enhanced
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pobre.wtf
// @downloadURL  https://raw.githubusercontent.com/joelcc97/pobreflix/master/dist/pobretv.user.js
// @updateURL    https://raw.githubusercontent.com/joelcc97/pobreflix/master/dist/pobretv.user.js
// @match        https://www3.pobre.wtf/
// @match        https://www3.pobre.wtf/animes
// @match        https://www3.pobre.wtf/animes/*
// @match        https://www3.pobre.wtf/movies
// @match        https://www3.pobre.wtf/movies/*
// @match        https://www3.pobre.wtf/tvshows
// @match        https://www3.pobre.wtf/tvshows/*
// @exclude      https://www3.pobre.wtf/play
// @exclude      https://www3.pobre.wtf/play/*
// ==/UserScript==

(n=>{const t=document.createElement("style");t.dataset.source="vite-plugin-monkey",t.innerText=n,document.head.appendChild(t)})("section#enhanced_pobretv{display:flex;margin:0;padding:0;flex:1;width:100%}section#enhanced_pobretv>p,h1,h2,h3,h4,h5,h6{margin:0;padding:0}@media screen and (max-width: 768px){.slider-nav{display:none!important}}@media screen and (max-width: 768px){div.content-episodes{flex-direction:row;flex-wrap:nowrap!important;overflow-y:auto!important;overflow-x:scroll}}._List_1fdrj_1{display:flex;flex-direction:row!important;column-gap:10px;justify-content:start;margin-bottom:30px!important;overflow-x:auto;scroll-behavior:smooth;scroll-snap-type:x mandatory}@media screen and (max-width: 768px){._List_1fdrj_1{-ms-overflow-style:none;scrollbar-width:none}._List_1fdrj_1::-webkit-scrollbar{display:none}}._Scroll_1fdrj_23{display:flex;flex-direction:column!important;max-width:100%;padding:0 48px}._Title_1fdrj_30{color:#fff;margin-bottom:20px}._Snap_1fdrj_35{scroll-snap-align:start;scroll-snap-stop:always}._Container_1ttvj_1{width:100%;max-width:100%;margin-top:40px;margin-bottom:-20px;padding:0 12px;display:flex;justify-content:space-around;column-gap:30px}@media screen and (min-width: 1200px){._Container_1ttvj_1{flex:0 0 auto;width:66.66666666%;justify-content:flex-end}}._Button_1ttvj_20{padding:10px 15px;outline:0;border-radius:12px;background:rgba(92,139,147,.2);color:#fff;border:0;font-weight:600}._Button_1ttvj_20:hover{background:rgba(92,139,147,.4)}");

(function() {
  var _a;
  "use strict";
  const sharedConfig = {};
  function setHydrateContext(context) {
    sharedConfig.context = context;
  }
  const equalFn = (a, b) => a === b;
  const $TRACK = Symbol("solid-track");
  const signalOptions = {
    equals: equalFn
  };
  let runEffects = runQueue;
  const STALE = 1;
  const PENDING = 2;
  const UNOWNED = {
    owned: null,
    cleanups: null,
    context: null,
    owner: null
  };
  var Owner = null;
  let Transition = null;
  let Listener = null;
  let Updates = null;
  let Effects = null;
  let ExecCount = 0;
  function createRoot(fn, detachedOwner) {
    const listener = Listener, owner = Owner, unowned = fn.length === 0, root = unowned ? UNOWNED : {
      owned: null,
      cleanups: null,
      context: null,
      owner: detachedOwner === void 0 ? owner : detachedOwner
    }, updateFn = unowned ? fn : () => fn(() => untrack(() => cleanNode(root)));
    Owner = root;
    Listener = null;
    try {
      return runUpdates(updateFn, true);
    } finally {
      Listener = listener;
      Owner = owner;
    }
  }
  function createSignal(value, options) {
    options = options ? Object.assign({}, signalOptions, options) : signalOptions;
    const s = {
      value,
      observers: null,
      observerSlots: null,
      comparator: options.equals || void 0
    };
    const setter = (value2) => {
      if (typeof value2 === "function") {
        value2 = value2(s.value);
      }
      return writeSignal(s, value2);
    };
    return [readSignal.bind(s), setter];
  }
  function createRenderEffect(fn, value, options) {
    const c = createComputation(fn, value, false, STALE);
    updateComputation(c);
  }
  function createEffect(fn, value, options) {
    runEffects = runUserEffects;
    const c = createComputation(fn, value, false, STALE);
    c.user = true;
    Effects ? Effects.push(c) : updateComputation(c);
  }
  function createMemo(fn, value, options) {
    options = options ? Object.assign({}, signalOptions, options) : signalOptions;
    const c = createComputation(fn, value, true, 0);
    c.observers = null;
    c.observerSlots = null;
    c.comparator = options.equals || void 0;
    updateComputation(c);
    return readSignal.bind(c);
  }
  function untrack(fn) {
    if (Listener === null)
      return fn();
    const listener = Listener;
    Listener = null;
    try {
      return fn();
    } finally {
      Listener = listener;
    }
  }
  function onCleanup(fn) {
    if (Owner === null)
      ;
    else if (Owner.cleanups === null)
      Owner.cleanups = [fn];
    else
      Owner.cleanups.push(fn);
    return fn;
  }
  function readSignal() {
    const runningTransition = Transition;
    if (this.sources && (this.state || runningTransition)) {
      if (this.state === STALE || runningTransition)
        updateComputation(this);
      else {
        const updates = Updates;
        Updates = null;
        runUpdates(() => lookUpstream(this), false);
        Updates = updates;
      }
    }
    if (Listener) {
      const sSlot = this.observers ? this.observers.length : 0;
      if (!Listener.sources) {
        Listener.sources = [this];
        Listener.sourceSlots = [sSlot];
      } else {
        Listener.sources.push(this);
        Listener.sourceSlots.push(sSlot);
      }
      if (!this.observers) {
        this.observers = [Listener];
        this.observerSlots = [Listener.sources.length - 1];
      } else {
        this.observers.push(Listener);
        this.observerSlots.push(Listener.sources.length - 1);
      }
    }
    return this.value;
  }
  function writeSignal(node, value, isComp) {
    let current = node.value;
    if (!node.comparator || !node.comparator(current, value)) {
      node.value = value;
      if (node.observers && node.observers.length) {
        runUpdates(() => {
          for (let i = 0; i < node.observers.length; i += 1) {
            const o = node.observers[i];
            const TransitionRunning = Transition && Transition.running;
            if (TransitionRunning && Transition.disposed.has(o))
              ;
            if (TransitionRunning && !o.tState || !TransitionRunning && !o.state) {
              if (o.pure)
                Updates.push(o);
              else
                Effects.push(o);
              if (o.observers)
                markDownstream(o);
            }
            if (TransitionRunning)
              ;
            else
              o.state = STALE;
          }
          if (Updates.length > 1e6) {
            Updates = [];
            if (false)
              ;
            throw new Error();
          }
        }, false);
      }
    }
    return value;
  }
  function updateComputation(node) {
    if (!node.fn)
      return;
    cleanNode(node);
    const owner = Owner, listener = Listener, time = ExecCount;
    Listener = Owner = node;
    runComputation(node, node.value, time);
    Listener = listener;
    Owner = owner;
  }
  function runComputation(node, value, time) {
    let nextValue;
    try {
      nextValue = node.fn(value);
    } catch (err) {
      if (node.pure) {
        {
          node.state = STALE;
          node.owned && node.owned.forEach(cleanNode);
          node.owned = null;
        }
      }
      handleError(err);
    }
    if (!node.updatedAt || node.updatedAt <= time) {
      if (node.updatedAt != null && "observers" in node) {
        writeSignal(node, nextValue);
      } else
        node.value = nextValue;
      node.updatedAt = time;
    }
  }
  function createComputation(fn, init, pure, state = STALE, options) {
    const c = {
      fn,
      state,
      updatedAt: null,
      owned: null,
      sources: null,
      sourceSlots: null,
      cleanups: null,
      value: init,
      owner: Owner,
      context: null,
      pure
    };
    if (Owner === null)
      ;
    else if (Owner !== UNOWNED) {
      {
        if (!Owner.owned)
          Owner.owned = [c];
        else
          Owner.owned.push(c);
      }
    }
    return c;
  }
  function runTop(node) {
    const runningTransition = Transition;
    if (node.state === 0 || runningTransition)
      return;
    if (node.state === PENDING || runningTransition)
      return lookUpstream(node);
    if (node.suspense && untrack(node.suspense.inFallback))
      return node.suspense.effects.push(node);
    const ancestors = [node];
    while ((node = node.owner) && (!node.updatedAt || node.updatedAt < ExecCount)) {
      if (node.state || runningTransition)
        ancestors.push(node);
    }
    for (let i = ancestors.length - 1; i >= 0; i--) {
      node = ancestors[i];
      if (node.state === STALE || runningTransition) {
        updateComputation(node);
      } else if (node.state === PENDING || runningTransition) {
        const updates = Updates;
        Updates = null;
        runUpdates(() => lookUpstream(node, ancestors[0]), false);
        Updates = updates;
      }
    }
  }
  function runUpdates(fn, init) {
    if (Updates)
      return fn();
    let wait = false;
    if (!init)
      Updates = [];
    if (Effects)
      wait = true;
    else
      Effects = [];
    ExecCount++;
    try {
      const res = fn();
      completeUpdates(wait);
      return res;
    } catch (err) {
      if (!wait)
        Effects = null;
      Updates = null;
      handleError(err);
    }
  }
  function completeUpdates(wait) {
    if (Updates) {
      runQueue(Updates);
      Updates = null;
    }
    if (wait)
      return;
    const e = Effects;
    Effects = null;
    if (e.length)
      runUpdates(() => runEffects(e), false);
  }
  function runQueue(queue) {
    for (let i = 0; i < queue.length; i++)
      runTop(queue[i]);
  }
  function runUserEffects(queue) {
    let i, userLength = 0;
    for (i = 0; i < queue.length; i++) {
      const e = queue[i];
      if (!e.user)
        runTop(e);
      else
        queue[userLength++] = e;
    }
    if (sharedConfig.context)
      setHydrateContext();
    for (i = 0; i < userLength; i++)
      runTop(queue[i]);
  }
  function lookUpstream(node, ignore) {
    const runningTransition = Transition;
    node.state = 0;
    for (let i = 0; i < node.sources.length; i += 1) {
      const source = node.sources[i];
      if (source.sources) {
        if (source.state === STALE || runningTransition) {
          if (source !== ignore)
            runTop(source);
        } else if (source.state === PENDING || runningTransition)
          lookUpstream(source, ignore);
      }
    }
  }
  function markDownstream(node) {
    const runningTransition = Transition;
    for (let i = 0; i < node.observers.length; i += 1) {
      const o = node.observers[i];
      if (!o.state || runningTransition) {
        o.state = PENDING;
        if (o.pure)
          Updates.push(o);
        else
          Effects.push(o);
        o.observers && markDownstream(o);
      }
    }
  }
  function cleanNode(node) {
    let i;
    if (node.sources) {
      while (node.sources.length) {
        const source = node.sources.pop(), index2 = node.sourceSlots.pop(), obs = source.observers;
        if (obs && obs.length) {
          const n = obs.pop(), s = source.observerSlots.pop();
          if (index2 < obs.length) {
            n.sourceSlots[s] = index2;
            obs[index2] = n;
            source.observerSlots[index2] = s;
          }
        }
      }
    }
    if (node.owned) {
      for (i = 0; i < node.owned.length; i++)
        cleanNode(node.owned[i]);
      node.owned = null;
    }
    if (node.cleanups) {
      for (i = 0; i < node.cleanups.length; i++)
        node.cleanups[i]();
      node.cleanups = null;
    }
    node.state = 0;
    node.context = null;
  }
  function castError(err) {
    if (err instanceof Error || typeof err === "string")
      return err;
    return new Error("Unknown error");
  }
  function handleError(err) {
    err = castError(err);
    throw err;
  }
  const FALLBACK = Symbol("fallback");
  function dispose(d) {
    for (let i = 0; i < d.length; i++)
      d[i]();
  }
  function mapArray(list, mapFn, options = {}) {
    let items = [], mapped = [], disposers = [], len = 0, indexes = mapFn.length > 1 ? [] : null;
    onCleanup(() => dispose(disposers));
    return () => {
      let newItems = list() || [], i, j;
      newItems[$TRACK];
      return untrack(() => {
        let newLen = newItems.length, newIndices, newIndicesNext, temp, tempdisposers, tempIndexes, start, end, newEnd, item;
        if (newLen === 0) {
          if (len !== 0) {
            dispose(disposers);
            disposers = [];
            items = [];
            mapped = [];
            len = 0;
            indexes && (indexes = []);
          }
          if (options.fallback) {
            items = [FALLBACK];
            mapped[0] = createRoot((disposer) => {
              disposers[0] = disposer;
              return options.fallback();
            });
            len = 1;
          }
        } else if (len === 0) {
          mapped = new Array(newLen);
          for (j = 0; j < newLen; j++) {
            items[j] = newItems[j];
            mapped[j] = createRoot(mapper);
          }
          len = newLen;
        } else {
          temp = new Array(newLen);
          tempdisposers = new Array(newLen);
          indexes && (tempIndexes = new Array(newLen));
          for (start = 0, end = Math.min(len, newLen); start < end && items[start] === newItems[start]; start++)
            ;
          for (end = len - 1, newEnd = newLen - 1; end >= start && newEnd >= start && items[end] === newItems[newEnd]; end--, newEnd--) {
            temp[newEnd] = mapped[end];
            tempdisposers[newEnd] = disposers[end];
            indexes && (tempIndexes[newEnd] = indexes[end]);
          }
          newIndices = /* @__PURE__ */ new Map();
          newIndicesNext = new Array(newEnd + 1);
          for (j = newEnd; j >= start; j--) {
            item = newItems[j];
            i = newIndices.get(item);
            newIndicesNext[j] = i === void 0 ? -1 : i;
            newIndices.set(item, j);
          }
          for (i = start; i <= end; i++) {
            item = items[i];
            j = newIndices.get(item);
            if (j !== void 0 && j !== -1) {
              temp[j] = mapped[i];
              tempdisposers[j] = disposers[i];
              indexes && (tempIndexes[j] = indexes[i]);
              j = newIndicesNext[j];
              newIndices.set(item, j);
            } else
              disposers[i]();
          }
          for (j = start; j < newLen; j++) {
            if (j in temp) {
              mapped[j] = temp[j];
              disposers[j] = tempdisposers[j];
              if (indexes) {
                indexes[j] = tempIndexes[j];
                indexes[j](j);
              }
            } else
              mapped[j] = createRoot(mapper);
          }
          mapped = mapped.slice(0, len = newLen);
          items = newItems.slice(0);
        }
        return mapped;
      });
      function mapper(disposer) {
        disposers[j] = disposer;
        if (indexes) {
          const [s, set] = createSignal(j);
          indexes[j] = set;
          return mapFn(newItems[j], s);
        }
        return mapFn(newItems[j]);
      }
    };
  }
  function createComponent(Comp, props) {
    return untrack(() => Comp(props || {}));
  }
  function For(props) {
    const fallback = "fallback" in props && {
      fallback: () => props.fallback
    };
    return createMemo(mapArray(() => props.each, props.children, fallback || void 0));
  }
  function reconcileArrays(parentNode, a, b) {
    let bLength = b.length, aEnd = a.length, bEnd = bLength, aStart = 0, bStart = 0, after = a[aEnd - 1].nextSibling, map = null;
    while (aStart < aEnd || bStart < bEnd) {
      if (a[aStart] === b[bStart]) {
        aStart++;
        bStart++;
        continue;
      }
      while (a[aEnd - 1] === b[bEnd - 1]) {
        aEnd--;
        bEnd--;
      }
      if (aEnd === aStart) {
        const node = bEnd < bLength ? bStart ? b[bStart - 1].nextSibling : b[bEnd - bStart] : after;
        while (bStart < bEnd)
          parentNode.insertBefore(b[bStart++], node);
      } else if (bEnd === bStart) {
        while (aStart < aEnd) {
          if (!map || !map.has(a[aStart]))
            a[aStart].remove();
          aStart++;
        }
      } else if (a[aStart] === b[bEnd - 1] && b[bStart] === a[aEnd - 1]) {
        const node = a[--aEnd].nextSibling;
        parentNode.insertBefore(b[bStart++], a[aStart++].nextSibling);
        parentNode.insertBefore(b[--bEnd], node);
        a[aEnd] = b[bEnd];
      } else {
        if (!map) {
          map = /* @__PURE__ */ new Map();
          let i = bStart;
          while (i < bEnd)
            map.set(b[i], i++);
        }
        const index2 = map.get(a[aStart]);
        if (index2 != null) {
          if (bStart < index2 && index2 < bEnd) {
            let i = aStart, sequence = 1, t;
            while (++i < aEnd && i < bEnd) {
              if ((t = map.get(a[i])) == null || t !== index2 + sequence)
                break;
              sequence++;
            }
            if (sequence > index2 - bStart) {
              const node = a[aStart];
              while (bStart < index2)
                parentNode.insertBefore(b[bStart++], node);
            } else
              parentNode.replaceChild(b[bStart++], a[aStart++]);
          } else
            aStart++;
        } else
          a[aStart++].remove();
      }
    }
  }
  const $$EVENTS = "_$DX_DELEGATE";
  function render(code, element, init, options = {}) {
    let disposer;
    createRoot((dispose2) => {
      disposer = dispose2;
      element === document ? code() : insert(element, code(), element.firstChild ? null : void 0, init);
    }, options.owner);
    return () => {
      disposer();
      element.textContent = "";
    };
  }
  function template(html, check, isSVG) {
    const t = document.createElement("template");
    t.innerHTML = html;
    let node = t.content.firstChild;
    if (isSVG)
      node = node.firstChild;
    return node;
  }
  function delegateEvents(eventNames, document2 = window.document) {
    const e = document2[$$EVENTS] || (document2[$$EVENTS] = /* @__PURE__ */ new Set());
    for (let i = 0, l = eventNames.length; i < l; i++) {
      const name = eventNames[i];
      if (!e.has(name)) {
        e.add(name);
        document2.addEventListener(name, eventHandler);
      }
    }
  }
  function className(node, value) {
    if (value == null)
      node.removeAttribute("class");
    else
      node.className = value;
  }
  function insert(parent, accessor, marker, initial) {
    if (marker !== void 0 && !initial)
      initial = [];
    if (typeof accessor !== "function")
      return insertExpression(parent, accessor, initial, marker);
    createRenderEffect((current) => insertExpression(parent, accessor(), current, marker), initial);
  }
  function eventHandler(e) {
    const key = `$$${e.type}`;
    let node = e.composedPath && e.composedPath()[0] || e.target;
    if (e.target !== node) {
      Object.defineProperty(e, "target", {
        configurable: true,
        value: node
      });
    }
    Object.defineProperty(e, "currentTarget", {
      configurable: true,
      get() {
        return node || document;
      }
    });
    if (sharedConfig.registry && !sharedConfig.done) {
      sharedConfig.done = true;
      document.querySelectorAll("[id^=pl-]").forEach((elem) => {
        while (elem && elem.nodeType !== 8 && elem.nodeValue !== "pl-" + e) {
          let x = elem.nextSibling;
          elem.remove();
          elem = x;
        }
        elem && elem.remove();
      });
    }
    while (node) {
      const handler = node[key];
      if (handler && !node.disabled) {
        const data = node[`${key}Data`];
        data !== void 0 ? handler.call(node, data, e) : handler.call(node, e);
        if (e.cancelBubble)
          return;
      }
      node = node._$host || node.parentNode || node.host;
    }
  }
  function insertExpression(parent, value, current, marker, unwrapArray) {
    if (sharedConfig.context && !current)
      current = [...parent.childNodes];
    while (typeof current === "function")
      current = current();
    if (value === current)
      return current;
    const t = typeof value, multi = marker !== void 0;
    parent = multi && current[0] && current[0].parentNode || parent;
    if (t === "string" || t === "number") {
      if (sharedConfig.context)
        return current;
      if (t === "number")
        value = value.toString();
      if (multi) {
        let node = current[0];
        if (node && node.nodeType === 3) {
          node.data = value;
        } else
          node = document.createTextNode(value);
        current = cleanChildren(parent, current, marker, node);
      } else {
        if (current !== "" && typeof current === "string") {
          current = parent.firstChild.data = value;
        } else
          current = parent.textContent = value;
      }
    } else if (value == null || t === "boolean") {
      if (sharedConfig.context)
        return current;
      current = cleanChildren(parent, current, marker);
    } else if (t === "function") {
      createRenderEffect(() => {
        let v = value();
        while (typeof v === "function")
          v = v();
        current = insertExpression(parent, v, current, marker);
      });
      return () => current;
    } else if (Array.isArray(value)) {
      const array = [];
      const currentArray = current && Array.isArray(current);
      if (normalizeIncomingArray(array, value, current, unwrapArray)) {
        createRenderEffect(() => current = insertExpression(parent, array, current, marker, true));
        return () => current;
      }
      if (sharedConfig.context) {
        if (!array.length)
          return current;
        for (let i = 0; i < array.length; i++) {
          if (array[i].parentNode)
            return current = array;
        }
      }
      if (array.length === 0) {
        current = cleanChildren(parent, current, marker);
        if (multi)
          return current;
      } else if (currentArray) {
        if (current.length === 0) {
          appendNodes(parent, array, marker);
        } else
          reconcileArrays(parent, current, array);
      } else {
        current && cleanChildren(parent);
        appendNodes(parent, array);
      }
      current = array;
    } else if (value instanceof Node) {
      if (sharedConfig.context && value.parentNode)
        return current = multi ? [value] : value;
      if (Array.isArray(current)) {
        if (multi)
          return current = cleanChildren(parent, current, marker, value);
        cleanChildren(parent, current, null, value);
      } else if (current == null || current === "" || !parent.firstChild) {
        parent.appendChild(value);
      } else
        parent.replaceChild(value, parent.firstChild);
      current = value;
    } else
      ;
    return current;
  }
  function normalizeIncomingArray(normalized, array, current, unwrap) {
    let dynamic = false;
    for (let i = 0, len = array.length; i < len; i++) {
      let item = array[i], prev = current && current[i];
      if (item instanceof Node) {
        normalized.push(item);
      } else if (item == null || item === true || item === false)
        ;
      else if (Array.isArray(item)) {
        dynamic = normalizeIncomingArray(normalized, item, prev) || dynamic;
      } else if (typeof item === "function") {
        if (unwrap) {
          while (typeof item === "function")
            item = item();
          dynamic = normalizeIncomingArray(normalized, Array.isArray(item) ? item : [item], Array.isArray(prev) ? prev : [prev]) || dynamic;
        } else {
          normalized.push(item);
          dynamic = true;
        }
      } else {
        const value = String(item);
        if (prev && prev.nodeType === 3 && prev.data === value) {
          normalized.push(prev);
        } else
          normalized.push(document.createTextNode(value));
      }
    }
    return dynamic;
  }
  function appendNodes(parent, array, marker = null) {
    for (let i = 0, len = array.length; i < len; i++)
      parent.insertBefore(array[i], marker);
  }
  function cleanChildren(parent, current, marker, replacement) {
    if (marker === void 0)
      return parent.textContent = "";
    const node = replacement || document.createTextNode("");
    if (current.length) {
      let inserted = false;
      for (let i = current.length - 1; i >= 0; i--) {
        const el = current[i];
        if (node !== el) {
          const isParent = el.parentNode === parent;
          if (!inserted && !i)
            isParent ? parent.replaceChild(node, el) : parent.insertBefore(node, marker);
          else
            isParent && el.remove();
        } else
          inserted = true;
      }
    } else
      parent.insertBefore(node, marker);
    return [node];
  }
  const configs = {
    baseUrl: "https://www3.pobre.wtf/",
    pages: ["movies", "tvshows", "animes"],
    excludedPages: ["play"],
    tvshowCompleteLinkTemplate: "https://www3.pobre.wtf/tvshows/${showId}/season/${season}/episode/${episode}#content-player",
    tvshowSeasonLinkTemplate: "https://www3.pobre.wtf/tvshows/${showId}/season/${season}",
    scriptVersion: "0.0.10"
  };
  var TypeOfContentEnum = /* @__PURE__ */ ((TypeOfContentEnum2) => {
    TypeOfContentEnum2["MOVIES"] = "movies";
    TypeOfContentEnum2["SHOWS"] = "tvshows";
    TypeOfContentEnum2["ANIMES"] = "animes";
    return TypeOfContentEnum2;
  })(TypeOfContentEnum || {});
  const extractContentInfoFromPath = (path) => {
    const cleanUrl = path.split("#")[0].slice(1);
    const info = cleanUrl.split("/");
    const type = Object.values(TypeOfContentEnum).find(
      (value) => value === info[0]
    );
    if (!type || info.length < 2)
      return void 0;
    return {
      id: info[1],
      type,
      season: info[3],
      episode: info[5]
    };
  };
  const extractContentInfoFromHref = (href) => {
    const path = href.replace(configs.baseUrl, "");
    return extractContentInfoFromPath("/" + path);
  };
  const getLoggedInUser = () => {
    const userInfo = document.querySelectorAll(
      "div.user div.menu div.username"
    )[0];
    if (!userInfo)
      return void 0;
    return userInfo.textContent || "";
  };
  const resolveTvShowUrl = ({
    showId,
    season,
    episode
  }) => {
    if (!episode) {
      return configs.tvshowSeasonLinkTemplate.replace("${showId}", showId).replace("${season}", season);
    }
    return configs.tvshowCompleteLinkTemplate.replace("${showId}", showId).replace("${season}", season).replace("${episode}", episode);
  };
  async function getParsedDocumentFromUrl(url) {
    const data = await fetch(url);
    const html = await data.text();
    const parser = new DOMParser();
    return parser.parseFromString(html, "text/html");
  }
  const STORE_KEY = "pobreflix";
  function getLocalStorage() {
    const rawData = localStorage.getItem(STORE_KEY);
    if (!rawData || rawData === "{}")
      return void 0;
    try {
      const parsedData = JSON.parse(rawData);
      return parsedData;
    } catch {
      return void 0;
    }
  }
  function setLocalStorage(newData) {
    localStorage.setItem(STORE_KEY, JSON.stringify(newData));
  }
  function initialStorageLoad() {
    const localStorageData = getLocalStorage();
    if (!localStorageData) {
      const initialStorage = { shows: /* @__PURE__ */ new Map() };
      setLocalStorage(initialStorage);
      return initialStorage;
    }
    return localStorageData;
  }
  async function markEpisodeRead(dataId, contentType = "ep") {
    try {
      const result = await fetch(
        `${configs.baseUrl}interaction?content_id=${dataId}&content_type=${contentType}&interaction_type=w`,
        {
          method: "POST",
          headers: {
            "x-requested-with": "XMLHttpRequest",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            accept: "application/json, text/javascript, */*; q=0.01"
          }
        }
      );
      const responseJson = await result.json();
      if (responseJson.success) {
        return true;
      } else {
        throw new Error();
      }
    } catch {
      console.error("Episode read status operation failed");
      return false;
    }
  }
  async function updateSeasonStatus(currentEpisode, episodesList) {
    try {
      const unwatchedEpisodes = episodesList.filter(
        (episode) => !episode.isWatched
      );
      if (unwatchedEpisodes.length === 0 && !currentEpisode.isSeasonWatched || unwatchedEpisodes.length === 1 && currentEpisode.isSeasonWatched) {
        const seasonUpdateSuccess = await markEpisodeRead(
          `${currentEpisode.seasonDataId}-${currentEpisode.season}`,
          "s-s"
        );
        if (seasonUpdateSuccess) {
          return true;
        } else {
          throw new Error();
        }
      } else {
        return false;
      }
    } catch {
      return false;
    }
  }
  let globalStore = {};
  function setGlobalStore(data) {
    globalStore = { ...globalStore, ...data };
  }
  function getGlobalStore() {
    return globalStore;
  }
  const index = "";
  const List = "_List_1fdrj_1";
  const Scroll = "_Scroll_1fdrj_23";
  const Title = "_Title_1fdrj_30";
  const Snap = "_Snap_1fdrj_35";
  const styles$1 = {
    List,
    Scroll,
    Title,
    Snap
  };
  const loadFollowingContent = async () => {
    const parsedDocument = await getParsedDocumentFromUrl(
      `${configs.baseUrl}profile/${getGlobalStore().username || ""}/t-f`
    );
    const following = parsedDocument.querySelectorAll(
      "div#content-listing > a.item-poster"
    );
    const continueWatchingContent = Array.from(following).map((item) => {
      const href = item.getAttribute("href") || "";
      const refSplit = href.split("/");
      const id = refSplit[refSplit.length - 1];
      return {
        id,
        item,
        href
      };
    });
    return continueWatchingContent;
  };
  const _tmpl$$1 = /* @__PURE__ */ template(`<div><h3>Continue Watching...</h3><div></div></div>`), _tmpl$2 = /* @__PURE__ */ template(`<div>Loading...</div>`), _tmpl$3 = /* @__PURE__ */ template(`<div></div>`);
  const HomePage = () => {
    const [content2, setContent] = createSignal([]);
    loadFollowingContent().then((data) => setContent(data));
    const clickHijack = (e, item) => {
      e.preventDefault();
      window.location.href = item.href;
    };
    return (() => {
      const _el$ = _tmpl$$1.cloneNode(true), _el$2 = _el$.firstChild, _el$3 = _el$2.nextSibling;
      insert(_el$3, createComponent(For, {
        get each() {
          return content2();
        },
        get fallback() {
          return _tmpl$2.cloneNode(true);
        },
        children: (contentItem) => (() => {
          const _el$5 = _tmpl$3.cloneNode(true);
          _el$5.$$click = (e) => clickHijack(e, contentItem);
          insert(_el$5, () => contentItem.item);
          createRenderEffect(() => className(_el$5, styles$1.Snap));
          return _el$5;
        })()
      }));
      createRenderEffect((_p$) => {
        const _v$ = styles$1.Scroll, _v$2 = styles$1.Title, _v$3 = styles$1.List;
        _v$ !== _p$._v$ && className(_el$, _p$._v$ = _v$);
        _v$2 !== _p$._v$2 && className(_el$2, _p$._v$2 = _v$2);
        _v$3 !== _p$._v$3 && className(_el$3, _p$._v$3 = _v$3);
        return _p$;
      }, {
        _v$: void 0,
        _v$2: void 0,
        _v$3: void 0
      });
      return _el$;
    })();
  };
  delegateEvents(["click"]);
  const Container = "_Container_1ttvj_1";
  const Button = "_Button_1ttvj_20";
  const styles = {
    Container,
    Button
  };
  const isActive = (node) => {
    return node.className.includes("active");
  };
  const getTvShowStatus = () => {
    const buttonElements = Array.from(
      document.querySelectorAll("div.content-actions > a")
    );
    const followNode = buttonElements.find(
      (element) => element.getAttribute("data-interaction-type") === "f"
    );
    const favoriteNode = buttonElements.find(
      (element) => element.getAttribute("data-interaction-type") === "l"
    );
    const watchLaterNode = buttonElements.find(
      (element) => element.getAttribute("data-interaction-type") === "wl"
    );
    if (!followNode || !favoriteNode || !watchLaterNode) {
      return void 0;
    }
    return {
      isFollowing: isActive(followNode),
      followNode,
      isFavorite: isActive(favoriteNode),
      favoriteNode,
      isWatchLater: isActive(watchLaterNode),
      watchLaterNode
    };
  };
  const mapEpisodesData = () => {
    var _a2, _b;
    let currentEpisode = void 0;
    const episodesList = [];
    const tvShowInfo = getGlobalStore().content;
    const episodesArray = Array.from(
      document.querySelectorAll("div.content-episodes > a")
    );
    const seasonList = Array.from(
      ((_a2 = document.querySelector("div#seasons div.list")) == null ? void 0 : _a2.children) || []
    ).filter(
      (element) => element.className.includes("season") || element.className.includes("open-season")
    );
    const currentSeasonIndex = seasonList.findIndex(
      (element) => element.className.includes("open-season")
    );
    const currentSeasonNode = currentSeasonIndex >= 0 ? seasonList[currentSeasonIndex] : void 0;
    const seasonDataId = (currentSeasonNode == null ? void 0 : currentSeasonNode.getAttribute("data-tvshow-id")) || "";
    const isSeasonWatched = currentSeasonNode == null ? void 0 : currentSeasonNode.className.includes("seen");
    const nextSeasonHref = currentSeasonNode ? ((_b = seasonList[currentSeasonIndex + 1]) == null ? void 0 : _b.getAttribute("href")) || "" : void 0;
    episodesArray.forEach((episode, index2) => {
      const episodeDataNode = episode.querySelector("div.episode");
      if (episodeDataNode) {
        const id = episodeDataNode.getAttribute("data-episode-number") || "";
        const dataId = episodeDataNode.getAttribute("data-episode-id") || "";
        const season = episodeDataNode.getAttribute("data-season-id") || "";
        const isWatched = episodeDataNode.className.includes("seen");
        const data = {
          id,
          dataId,
          number: id,
          season,
          node: episodeDataNode,
          seasonDataId,
          isSeasonLastEpisode: index2 === episodesArray.length - 1,
          isWatched,
          isSeasonWatched,
          seasonNode: currentSeasonNode,
          nextSeasonHref
        };
        if (data.id && (tvShowInfo == null ? void 0 : tvShowInfo.episode) && data.id === tvShowInfo.episode) {
          currentEpisode = data;
        }
        episodesList.push(data);
      }
    });
    return {
      currentEpisode,
      episodesList
    };
  };
  const _tmpl$ = /* @__PURE__ */ template(`<div><button></button><button>Next Episode</button></div>`);
  const ShowsPage = ({
    hasContentPlayer
  }) => {
    const [pageDataState, setPageDataState] = createSignal();
    const tvShowInfo = getGlobalStore().content;
    const pageData = mapEpisodesData();
    setPageDataState(pageData);
    const playerFrameNode = document.querySelector("div#content-player div.player-frame");
    setTimeout(() => {
      var _a2, _b;
      if (window.innerWidth < 768) {
        const episodesDiv = document.querySelector("div.content-episodes") || void 0;
        const currentEpisodeNode = ((_b = (_a2 = pageDataState()) == null ? void 0 : _a2.currentEpisode) == null ? void 0 : _b.node) || void 0;
        if (currentEpisodeNode && episodesDiv) {
          const leftOffset = currentEpisodeNode.offsetLeft;
          const episodeWidth = currentEpisodeNode.clientWidth;
          const scrolldivWidth = episodesDiv.clientWidth;
          const divLeftOffset = episodesDiv.offsetLeft;
          episodesDiv.scrollTo(leftOffset - divLeftOffset - (scrolldivWidth - episodeWidth) / 2, 0);
        }
      }
    }, 200);
    const [videoPlayer, setVideoPlayer] = createSignal();
    createEffect(() => {
      const videoPlayerState = videoPlayer();
      if (videoPlayerState) {
        videoPlayerState.onended = () => {
          var _a2, _b;
          const fullScreenButton = ((_b = (_a2 = document.querySelector("div.player-frame iframe")) == null ? void 0 : _a2.contentDocument) == null ? void 0 : _b.querySelector("button.vjs-fullscreen-control")) || void 0;
          if (document.fullscreenElement && fullScreenButton) {
            fullScreenButton.click();
          }
        };
      }
    });
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes" && mutation.attributeName === "class") {
          const currentShowStatus = getTvShowStatus();
          if (currentShowStatus && !currentShowStatus.isFollowing) {
            currentShowStatus.followNode.click();
          }
          const newEpisodesData = mapEpisodesData();
          setPageDataState(newEpisodesData);
        } else if (mutation.type === "childList" && mutation.target === playerFrameNode) {
          setTimeout(() => {
            var _a2;
            const videoIframe = document.querySelector("div.player-frame iframe") || void 0;
            const videoPlayer2 = ((_a2 = videoIframe == null ? void 0 : videoIframe.contentDocument) == null ? void 0 : _a2.querySelector("div#customVideoPlayer video")) || void 0;
            setVideoPlayer(videoPlayer2);
          }, 500);
        }
      });
    });
    if (playerFrameNode) {
      observer.observe(playerFrameNode, {
        childList: true
      });
    }
    pageData.episodesList.forEach((episode) => {
      observer.observe(episode.node, {
        attributes: true
      });
    });
    const handleNextEpisodeClick = () => {
      if (!tvShowInfo || !tvShowInfo.season || !tvShowInfo.episode) {
        return;
      }
      const currentPageDataState = pageDataState();
      if (!!(currentPageDataState == null ? void 0 : currentPageDataState.currentEpisode) && !currentPageDataState.currentEpisode.isSeasonLastEpisode) {
        window.location.href = resolveTvShowUrl({
          showId: tvShowInfo.id,
          season: tvShowInfo.season,
          episode: `${parseInt(tvShowInfo.episode) + 1}`
        });
      } else if (!!(currentPageDataState == null ? void 0 : currentPageDataState.currentEpisode) && currentPageDataState.currentEpisode.isSeasonLastEpisode && currentPageDataState.currentEpisode.nextSeasonHref) {
        const contentInfo = extractContentInfoFromHref(currentPageDataState.currentEpisode.nextSeasonHref);
        if (contentInfo) {
          window.location.href = resolveTvShowUrl({
            showId: tvShowInfo.id,
            season: contentInfo.season || "",
            episode: "1"
          });
        }
      }
    };
    const handleToggleWatched = async (data) => {
      const episodeUpdateSuccess = await markEpisodeRead(data.dataId);
      if (!episodeUpdateSuccess)
        return;
      data.node.classList.toggle("seen");
      const {
        currentEpisode,
        episodesList
      } = mapEpisodesData();
      if (!currentEpisode)
        return;
      const seasonUpdateSuccess = await updateSeasonStatus(currentEpisode, episodesList);
      if (!seasonUpdateSuccess || !currentEpisode.seasonNode)
        return;
      currentEpisode.seasonNode.classList.toggle("seen");
    };
    return hasContentPlayer ? (() => {
      const _el$ = _tmpl$.cloneNode(true), _el$2 = _el$.firstChild, _el$3 = _el$2.nextSibling;
      _el$2.$$click = () => {
        var _a2;
        const contentData = (_a2 = pageDataState()) == null ? void 0 : _a2.currentEpisode;
        if (contentData) {
          handleToggleWatched(contentData);
        }
      };
      insert(_el$2, () => {
        var _a2, _b;
        return `${((_b = (_a2 = pageDataState()) == null ? void 0 : _a2.currentEpisode) == null ? void 0 : _b.isWatched) ? "Unwatch" : "Mark watched"}`;
      });
      _el$3.$$click = handleNextEpisodeClick;
      createRenderEffect((_p$) => {
        const _v$ = styles.Container, _v$2 = styles.Button, _v$3 = styles.Button;
        _v$ !== _p$._v$ && className(_el$, _p$._v$ = _v$);
        _v$2 !== _p$._v$2 && className(_el$2, _p$._v$2 = _v$2);
        _v$3 !== _p$._v$3 && className(_el$3, _p$._v$3 = _v$3);
        return _p$;
      }, {
        _v$: void 0,
        _v$2: void 0,
        _v$3: void 0
      });
      return _el$;
    })() : null;
  };
  delegateEvents(["click"]);
  localStorage.setItem("adsVideo", new Date().toString());
  initialStorageLoad();
  (_a = document.querySelectorAll("section#banner")[0]) == null ? void 0 : _a.remove();
  document.querySelectorAll("script#recaptchaScript")[0].remove();
  const content = extractContentInfoFromPath(window.location.pathname);
  setGlobalStore({
    username: getLoggedInUser(),
    content
  });
  const homeContentSection = document.querySelectorAll("section#home-content")[0];
  if (homeContentSection) {
    render(() => createComponent(HomePage, {}), (() => {
      const app = document.createElement("section");
      app.id = "enhanced_pobretv";
      document.body.insertBefore(app, homeContentSection);
      return app;
    })());
  }
  if (content && (content.type === TypeOfContentEnum.SHOWS || content.type === TypeOfContentEnum.ANIMES)) {
    const contentWatchSection = document.querySelectorAll("section#content-watch")[0];
    const contentPlayer = document.querySelectorAll("div#content-player")[0];
    render(() => createComponent(ShowsPage, {
      hasContentPlayer: !!contentPlayer
    }), (() => {
      const section = document.createElement("section");
      section.id = "enhanced_pobretv";
      contentWatchSection.insertBefore(section, contentPlayer);
      return section;
    })());
  }
})();
