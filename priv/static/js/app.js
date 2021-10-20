/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/js/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "../deps/phoenix/priv/static/phoenix.esm.js":
/*!**************************************************!*\
  !*** ../deps/phoenix/priv/static/phoenix.esm.js ***!
  \**************************************************/
/*! exports provided: Channel, LongPoll, Presence, Serializer, Socket */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Channel", function() { return Channel; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LongPoll", function() { return LongPoll; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Presence", function() { return Presence; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Serializer", function() { return serializer_default; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Socket", function() { return Socket; });
// js/phoenix/utils.js
var closure = value => {
  if (typeof value === "function") {
    return value;
  } else {
    let closure2 = function () {
      return value;
    };

    return closure2;
  }
}; // js/phoenix/constants.js


var globalSelf = typeof self !== "undefined" ? self : null;
var phxWindow = typeof window !== "undefined" ? window : null;
var global = globalSelf || phxWindow || void 0;
var DEFAULT_VSN = "2.0.0";
var SOCKET_STATES = {
  connecting: 0,
  open: 1,
  closing: 2,
  closed: 3
};
var DEFAULT_TIMEOUT = 1e4;
var WS_CLOSE_NORMAL = 1e3;
var CHANNEL_STATES = {
  closed: "closed",
  errored: "errored",
  joined: "joined",
  joining: "joining",
  leaving: "leaving"
};
var CHANNEL_EVENTS = {
  close: "phx_close",
  error: "phx_error",
  join: "phx_join",
  reply: "phx_reply",
  leave: "phx_leave"
};
var TRANSPORTS = {
  longpoll: "longpoll",
  websocket: "websocket"
};
var XHR_STATES = {
  complete: 4
}; // js/phoenix/push.js

var Push = class {
  constructor(channel, event, payload, timeout) {
    this.channel = channel;
    this.event = event;

    this.payload = payload || function () {
      return {};
    };

    this.receivedResp = null;
    this.timeout = timeout;
    this.timeoutTimer = null;
    this.recHooks = [];
    this.sent = false;
  }

  resend(timeout) {
    this.timeout = timeout;
    this.reset();
    this.send();
  }

  send() {
    if (this.hasReceived("timeout")) {
      return;
    }

    this.startTimeout();
    this.sent = true;
    this.channel.socket.push({
      topic: this.channel.topic,
      event: this.event,
      payload: this.payload(),
      ref: this.ref,
      join_ref: this.channel.joinRef()
    });
  }

  receive(status, callback) {
    if (this.hasReceived(status)) {
      callback(this.receivedResp.response);
    }

    this.recHooks.push({
      status,
      callback
    });
    return this;
  }

  reset() {
    this.cancelRefEvent();
    this.ref = null;
    this.refEvent = null;
    this.receivedResp = null;
    this.sent = false;
  }

  matchReceive({
    status,
    response,
    _ref
  }) {
    this.recHooks.filter(h => h.status === status).forEach(h => h.callback(response));
  }

  cancelRefEvent() {
    if (!this.refEvent) {
      return;
    }

    this.channel.off(this.refEvent);
  }

  cancelTimeout() {
    clearTimeout(this.timeoutTimer);
    this.timeoutTimer = null;
  }

  startTimeout() {
    if (this.timeoutTimer) {
      this.cancelTimeout();
    }

    this.ref = this.channel.socket.makeRef();
    this.refEvent = this.channel.replyEventName(this.ref);
    this.channel.on(this.refEvent, payload => {
      this.cancelRefEvent();
      this.cancelTimeout();
      this.receivedResp = payload;
      this.matchReceive(payload);
    });
    this.timeoutTimer = setTimeout(() => {
      this.trigger("timeout", {});
    }, this.timeout);
  }

  hasReceived(status) {
    return this.receivedResp && this.receivedResp.status === status;
  }

  trigger(status, response) {
    this.channel.trigger(this.refEvent, {
      status,
      response
    });
  }

}; // js/phoenix/timer.js

var Timer = class {
  constructor(callback, timerCalc) {
    this.callback = callback;
    this.timerCalc = timerCalc;
    this.timer = null;
    this.tries = 0;
  }

  reset() {
    this.tries = 0;
    clearTimeout(this.timer);
  }

  scheduleTimeout() {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.tries = this.tries + 1;
      this.callback();
    }, this.timerCalc(this.tries + 1));
  }

}; // js/phoenix/channel.js

var Channel = class {
  constructor(topic, params, socket) {
    this.state = CHANNEL_STATES.closed;
    this.topic = topic;
    this.params = closure(params || {});
    this.socket = socket;
    this.bindings = [];
    this.bindingRef = 0;
    this.timeout = this.socket.timeout;
    this.joinedOnce = false;
    this.joinPush = new Push(this, CHANNEL_EVENTS.join, this.params, this.timeout);
    this.pushBuffer = [];
    this.stateChangeRefs = [];
    this.rejoinTimer = new Timer(() => {
      if (this.socket.isConnected()) {
        this.rejoin();
      }
    }, this.socket.rejoinAfterMs);
    this.stateChangeRefs.push(this.socket.onError(() => this.rejoinTimer.reset()));
    this.stateChangeRefs.push(this.socket.onOpen(() => {
      this.rejoinTimer.reset();

      if (this.isErrored()) {
        this.rejoin();
      }
    }));
    this.joinPush.receive("ok", () => {
      this.state = CHANNEL_STATES.joined;
      this.rejoinTimer.reset();
      this.pushBuffer.forEach(pushEvent => pushEvent.send());
      this.pushBuffer = [];
    });
    this.joinPush.receive("error", () => {
      this.state = CHANNEL_STATES.errored;

      if (this.socket.isConnected()) {
        this.rejoinTimer.scheduleTimeout();
      }
    });
    this.onClose(() => {
      this.rejoinTimer.reset();
      if (this.socket.hasLogger()) this.socket.log("channel", `close ${this.topic} ${this.joinRef()}`);
      this.state = CHANNEL_STATES.closed;
      this.socket.remove(this);
    });
    this.onError(reason => {
      if (this.socket.hasLogger()) this.socket.log("channel", `error ${this.topic}`, reason);

      if (this.isJoining()) {
        this.joinPush.reset();
      }

      this.state = CHANNEL_STATES.errored;

      if (this.socket.isConnected()) {
        this.rejoinTimer.scheduleTimeout();
      }
    });
    this.joinPush.receive("timeout", () => {
      if (this.socket.hasLogger()) this.socket.log("channel", `timeout ${this.topic} (${this.joinRef()})`, this.joinPush.timeout);
      let leavePush = new Push(this, CHANNEL_EVENTS.leave, closure({}), this.timeout);
      leavePush.send();
      this.state = CHANNEL_STATES.errored;
      this.joinPush.reset();

      if (this.socket.isConnected()) {
        this.rejoinTimer.scheduleTimeout();
      }
    });
    this.on(CHANNEL_EVENTS.reply, (payload, ref) => {
      this.trigger(this.replyEventName(ref), payload);
    });
  }

  join(timeout = this.timeout) {
    if (this.joinedOnce) {
      throw new Error("tried to join multiple times. 'join' can only be called a single time per channel instance");
    } else {
      this.timeout = timeout;
      this.joinedOnce = true;
      this.rejoin();
      return this.joinPush;
    }
  }

  onClose(callback) {
    this.on(CHANNEL_EVENTS.close, callback);
  }

  onError(callback) {
    return this.on(CHANNEL_EVENTS.error, reason => callback(reason));
  }

  on(event, callback) {
    let ref = this.bindingRef++;
    this.bindings.push({
      event,
      ref,
      callback
    });
    return ref;
  }

  off(event, ref) {
    this.bindings = this.bindings.filter(bind => {
      return !(bind.event === event && (typeof ref === "undefined" || ref === bind.ref));
    });
  }

  canPush() {
    return this.socket.isConnected() && this.isJoined();
  }

  push(event, payload, timeout = this.timeout) {
    payload = payload || {};

    if (!this.joinedOnce) {
      throw new Error(`tried to push '${event}' to '${this.topic}' before joining. Use channel.join() before pushing events`);
    }

    let pushEvent = new Push(this, event, function () {
      return payload;
    }, timeout);

    if (this.canPush()) {
      pushEvent.send();
    } else {
      pushEvent.startTimeout();
      this.pushBuffer.push(pushEvent);
    }

    return pushEvent;
  }

  leave(timeout = this.timeout) {
    this.rejoinTimer.reset();
    this.joinPush.cancelTimeout();
    this.state = CHANNEL_STATES.leaving;

    let onClose = () => {
      if (this.socket.hasLogger()) this.socket.log("channel", `leave ${this.topic}`);
      this.trigger(CHANNEL_EVENTS.close, "leave");
    };

    let leavePush = new Push(this, CHANNEL_EVENTS.leave, closure({}), timeout);
    leavePush.receive("ok", () => onClose()).receive("timeout", () => onClose());
    leavePush.send();

    if (!this.canPush()) {
      leavePush.trigger("ok", {});
    }

    return leavePush;
  }

  onMessage(_event, payload, _ref) {
    return payload;
  }

  isMember(topic, event, payload, joinRef) {
    if (this.topic !== topic) {
      return false;
    }

    if (joinRef && joinRef !== this.joinRef()) {
      if (this.socket.hasLogger()) this.socket.log("channel", "dropping outdated message", {
        topic,
        event,
        payload,
        joinRef
      });
      return false;
    } else {
      return true;
    }
  }

  joinRef() {
    return this.joinPush.ref;
  }

  rejoin(timeout = this.timeout) {
    if (this.isLeaving()) {
      return;
    }

    this.socket.leaveOpenTopic(this.topic);
    this.state = CHANNEL_STATES.joining;
    this.joinPush.resend(timeout);
  }

  trigger(event, payload, ref, joinRef) {
    let handledPayload = this.onMessage(event, payload, ref, joinRef);

    if (payload && !handledPayload) {
      throw new Error("channel onMessage callbacks must return the payload, modified or unmodified");
    }

    let eventBindings = this.bindings.filter(bind => bind.event === event);

    for (let i = 0; i < eventBindings.length; i++) {
      let bind = eventBindings[i];
      bind.callback(handledPayload, ref, joinRef || this.joinRef());
    }
  }

  replyEventName(ref) {
    return `chan_reply_${ref}`;
  }

  isClosed() {
    return this.state === CHANNEL_STATES.closed;
  }

  isErrored() {
    return this.state === CHANNEL_STATES.errored;
  }

  isJoined() {
    return this.state === CHANNEL_STATES.joined;
  }

  isJoining() {
    return this.state === CHANNEL_STATES.joining;
  }

  isLeaving() {
    return this.state === CHANNEL_STATES.leaving;
  }

}; // js/phoenix/ajax.js

var Ajax = class {
  static request(method, endPoint, accept, body, timeout, ontimeout, callback) {
    if (global.XDomainRequest) {
      let req = new global.XDomainRequest();
      this.xdomainRequest(req, method, endPoint, body, timeout, ontimeout, callback);
    } else {
      let req = new global.XMLHttpRequest();
      this.xhrRequest(req, method, endPoint, accept, body, timeout, ontimeout, callback);
    }
  }

  static xdomainRequest(req, method, endPoint, body, timeout, ontimeout, callback) {
    req.timeout = timeout;
    req.open(method, endPoint);

    req.onload = () => {
      let response = this.parseJSON(req.responseText);
      callback && callback(response);
    };

    if (ontimeout) {
      req.ontimeout = ontimeout;
    }

    req.onprogress = () => {};

    req.send(body);
  }

  static xhrRequest(req, method, endPoint, accept, body, timeout, ontimeout, callback) {
    req.open(method, endPoint, true);
    req.timeout = timeout;
    req.setRequestHeader("Content-Type", accept);

    req.onerror = () => {
      callback && callback(null);
    };

    req.onreadystatechange = () => {
      if (req.readyState === XHR_STATES.complete && callback) {
        let response = this.parseJSON(req.responseText);
        callback(response);
      }
    };

    if (ontimeout) {
      req.ontimeout = ontimeout;
    }

    req.send(body);
  }

  static parseJSON(resp) {
    if (!resp || resp === "") {
      return null;
    }

    try {
      return JSON.parse(resp);
    } catch (e) {
      console && console.log("failed to parse JSON response", resp);
      return null;
    }
  }

  static serialize(obj, parentKey) {
    let queryStr = [];

    for (var key in obj) {
      if (!Object.prototype.hasOwnProperty.call(obj, key)) {
        continue;
      }

      let paramKey = parentKey ? `${parentKey}[${key}]` : key;
      let paramVal = obj[key];

      if (typeof paramVal === "object") {
        queryStr.push(this.serialize(paramVal, paramKey));
      } else {
        queryStr.push(encodeURIComponent(paramKey) + "=" + encodeURIComponent(paramVal));
      }
    }

    return queryStr.join("&");
  }

  static appendParams(url, params) {
    if (Object.keys(params).length === 0) {
      return url;
    }

    let prefix = url.match(/\?/) ? "&" : "?";
    return `${url}${prefix}${this.serialize(params)}`;
  }

}; // js/phoenix/longpoll.js

var LongPoll = class {
  constructor(endPoint) {
    this.endPoint = null;
    this.token = null;
    this.skipHeartbeat = true;

    this.onopen = function () {};

    this.onerror = function () {};

    this.onmessage = function () {};

    this.onclose = function () {};

    this.pollEndpoint = this.normalizeEndpoint(endPoint);
    this.readyState = SOCKET_STATES.connecting;
    this.poll();
  }

  normalizeEndpoint(endPoint) {
    return endPoint.replace("ws://", "http://").replace("wss://", "https://").replace(new RegExp("(.*)/" + TRANSPORTS.websocket), "$1/" + TRANSPORTS.longpoll);
  }

  endpointURL() {
    return Ajax.appendParams(this.pollEndpoint, {
      token: this.token
    });
  }

  closeAndRetry() {
    this.close();
    this.readyState = SOCKET_STATES.connecting;
  }

  ontimeout() {
    this.onerror("timeout");
    this.closeAndRetry();
  }

  poll() {
    if (!(this.readyState === SOCKET_STATES.open || this.readyState === SOCKET_STATES.connecting)) {
      return;
    }

    Ajax.request("GET", this.endpointURL(), "application/json", null, this.timeout, this.ontimeout.bind(this), resp => {
      if (resp) {
        var {
          status,
          token,
          messages
        } = resp;
        this.token = token;
      } else {
        status = 0;
      }

      switch (status) {
        case 200:
          messages.forEach(msg => {
            setTimeout(() => {
              this.onmessage({
                data: msg
              });
            }, 0);
          });
          this.poll();
          break;

        case 204:
          this.poll();
          break;

        case 410:
          this.readyState = SOCKET_STATES.open;
          this.onopen();
          this.poll();
          break;

        case 403:
          this.onerror();
          this.close();
          break;

        case 0:
        case 500:
          this.onerror();
          this.closeAndRetry();
          break;

        default:
          throw new Error(`unhandled poll status ${status}`);
      }
    });
  }

  send(body) {
    Ajax.request("POST", this.endpointURL(), "application/json", body, this.timeout, this.onerror.bind(this, "timeout"), resp => {
      if (!resp || resp.status !== 200) {
        this.onerror(resp && resp.status);
        this.closeAndRetry();
      }
    });
  }

  close(_code, _reason) {
    this.readyState = SOCKET_STATES.closed;
    this.onclose();
  }

}; // js/phoenix/presence.js

var Presence = class {
  constructor(channel, opts = {}) {
    let events = opts.events || {
      state: "presence_state",
      diff: "presence_diff"
    };
    this.state = {};
    this.pendingDiffs = [];
    this.channel = channel;
    this.joinRef = null;
    this.caller = {
      onJoin: function () {},
      onLeave: function () {},
      onSync: function () {}
    };
    this.channel.on(events.state, newState => {
      let {
        onJoin,
        onLeave,
        onSync
      } = this.caller;
      this.joinRef = this.channel.joinRef();
      this.state = Presence.syncState(this.state, newState, onJoin, onLeave);
      this.pendingDiffs.forEach(diff => {
        this.state = Presence.syncDiff(this.state, diff, onJoin, onLeave);
      });
      this.pendingDiffs = [];
      onSync();
    });
    this.channel.on(events.diff, diff => {
      let {
        onJoin,
        onLeave,
        onSync
      } = this.caller;

      if (this.inPendingSyncState()) {
        this.pendingDiffs.push(diff);
      } else {
        this.state = Presence.syncDiff(this.state, diff, onJoin, onLeave);
        onSync();
      }
    });
  }

  onJoin(callback) {
    this.caller.onJoin = callback;
  }

  onLeave(callback) {
    this.caller.onLeave = callback;
  }

  onSync(callback) {
    this.caller.onSync = callback;
  }

  list(by) {
    return Presence.list(this.state, by);
  }

  inPendingSyncState() {
    return !this.joinRef || this.joinRef !== this.channel.joinRef();
  }

  static syncState(currentState, newState, onJoin, onLeave) {
    let state = this.clone(currentState);
    let joins = {};
    let leaves = {};
    this.map(state, (key, presence) => {
      if (!newState[key]) {
        leaves[key] = presence;
      }
    });
    this.map(newState, (key, newPresence) => {
      let currentPresence = state[key];

      if (currentPresence) {
        let newRefs = newPresence.metas.map(m => m.phx_ref);
        let curRefs = currentPresence.metas.map(m => m.phx_ref);
        let joinedMetas = newPresence.metas.filter(m => curRefs.indexOf(m.phx_ref) < 0);
        let leftMetas = currentPresence.metas.filter(m => newRefs.indexOf(m.phx_ref) < 0);

        if (joinedMetas.length > 0) {
          joins[key] = newPresence;
          joins[key].metas = joinedMetas;
        }

        if (leftMetas.length > 0) {
          leaves[key] = this.clone(currentPresence);
          leaves[key].metas = leftMetas;
        }
      } else {
        joins[key] = newPresence;
      }
    });
    return this.syncDiff(state, {
      joins,
      leaves
    }, onJoin, onLeave);
  }

  static syncDiff(state, diff, onJoin, onLeave) {
    let {
      joins,
      leaves
    } = this.clone(diff);

    if (!onJoin) {
      onJoin = function () {};
    }

    if (!onLeave) {
      onLeave = function () {};
    }

    this.map(joins, (key, newPresence) => {
      let currentPresence = state[key];
      state[key] = this.clone(newPresence);

      if (currentPresence) {
        let joinedRefs = state[key].metas.map(m => m.phx_ref);
        let curMetas = currentPresence.metas.filter(m => joinedRefs.indexOf(m.phx_ref) < 0);
        state[key].metas.unshift(...curMetas);
      }

      onJoin(key, currentPresence, newPresence);
    });
    this.map(leaves, (key, leftPresence) => {
      let currentPresence = state[key];

      if (!currentPresence) {
        return;
      }

      let refsToRemove = leftPresence.metas.map(m => m.phx_ref);
      currentPresence.metas = currentPresence.metas.filter(p => {
        return refsToRemove.indexOf(p.phx_ref) < 0;
      });
      onLeave(key, currentPresence, leftPresence);

      if (currentPresence.metas.length === 0) {
        delete state[key];
      }
    });
    return state;
  }

  static list(presences, chooser) {
    if (!chooser) {
      chooser = function (key, pres) {
        return pres;
      };
    }

    return this.map(presences, (key, presence) => {
      return chooser(key, presence);
    });
  }

  static map(obj, func) {
    return Object.getOwnPropertyNames(obj).map(key => func(key, obj[key]));
  }

  static clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

}; // js/phoenix/serializer.js

var serializer_default = {
  HEADER_LENGTH: 1,
  META_LENGTH: 4,
  KINDS: {
    push: 0,
    reply: 1,
    broadcast: 2
  },

  encode(msg, callback) {
    if (msg.payload.constructor === ArrayBuffer) {
      return callback(this.binaryEncode(msg));
    } else {
      let payload = [msg.join_ref, msg.ref, msg.topic, msg.event, msg.payload];
      return callback(JSON.stringify(payload));
    }
  },

  decode(rawPayload, callback) {
    if (rawPayload.constructor === ArrayBuffer) {
      return callback(this.binaryDecode(rawPayload));
    } else {
      let [join_ref, ref, topic, event, payload] = JSON.parse(rawPayload);
      return callback({
        join_ref,
        ref,
        topic,
        event,
        payload
      });
    }
  },

  binaryEncode(message) {
    let {
      join_ref,
      ref,
      event,
      topic,
      payload
    } = message;
    let metaLength = this.META_LENGTH + join_ref.length + ref.length + topic.length + event.length;
    let header = new ArrayBuffer(this.HEADER_LENGTH + metaLength);
    let view = new DataView(header);
    let offset = 0;
    view.setUint8(offset++, this.KINDS.push);
    view.setUint8(offset++, join_ref.length);
    view.setUint8(offset++, ref.length);
    view.setUint8(offset++, topic.length);
    view.setUint8(offset++, event.length);
    Array.from(join_ref, char => view.setUint8(offset++, char.charCodeAt(0)));
    Array.from(ref, char => view.setUint8(offset++, char.charCodeAt(0)));
    Array.from(topic, char => view.setUint8(offset++, char.charCodeAt(0)));
    Array.from(event, char => view.setUint8(offset++, char.charCodeAt(0)));
    var combined = new Uint8Array(header.byteLength + payload.byteLength);
    combined.set(new Uint8Array(header), 0);
    combined.set(new Uint8Array(payload), header.byteLength);
    return combined.buffer;
  },

  binaryDecode(buffer) {
    let view = new DataView(buffer);
    let kind = view.getUint8(0);
    let decoder = new TextDecoder();

    switch (kind) {
      case this.KINDS.push:
        return this.decodePush(buffer, view, decoder);

      case this.KINDS.reply:
        return this.decodeReply(buffer, view, decoder);

      case this.KINDS.broadcast:
        return this.decodeBroadcast(buffer, view, decoder);
    }
  },

  decodePush(buffer, view, decoder) {
    let joinRefSize = view.getUint8(1);
    let topicSize = view.getUint8(2);
    let eventSize = view.getUint8(3);
    let offset = this.HEADER_LENGTH + this.META_LENGTH - 1;
    let joinRef = decoder.decode(buffer.slice(offset, offset + joinRefSize));
    offset = offset + joinRefSize;
    let topic = decoder.decode(buffer.slice(offset, offset + topicSize));
    offset = offset + topicSize;
    let event = decoder.decode(buffer.slice(offset, offset + eventSize));
    offset = offset + eventSize;
    let data = buffer.slice(offset, buffer.byteLength);
    return {
      join_ref: joinRef,
      ref: null,
      topic,
      event,
      payload: data
    };
  },

  decodeReply(buffer, view, decoder) {
    let joinRefSize = view.getUint8(1);
    let refSize = view.getUint8(2);
    let topicSize = view.getUint8(3);
    let eventSize = view.getUint8(4);
    let offset = this.HEADER_LENGTH + this.META_LENGTH;
    let joinRef = decoder.decode(buffer.slice(offset, offset + joinRefSize));
    offset = offset + joinRefSize;
    let ref = decoder.decode(buffer.slice(offset, offset + refSize));
    offset = offset + refSize;
    let topic = decoder.decode(buffer.slice(offset, offset + topicSize));
    offset = offset + topicSize;
    let event = decoder.decode(buffer.slice(offset, offset + eventSize));
    offset = offset + eventSize;
    let data = buffer.slice(offset, buffer.byteLength);
    let payload = {
      status: event,
      response: data
    };
    return {
      join_ref: joinRef,
      ref,
      topic,
      event: CHANNEL_EVENTS.reply,
      payload
    };
  },

  decodeBroadcast(buffer, view, decoder) {
    let topicSize = view.getUint8(1);
    let eventSize = view.getUint8(2);
    let offset = this.HEADER_LENGTH + 2;
    let topic = decoder.decode(buffer.slice(offset, offset + topicSize));
    offset = offset + topicSize;
    let event = decoder.decode(buffer.slice(offset, offset + eventSize));
    offset = offset + eventSize;
    let data = buffer.slice(offset, buffer.byteLength);
    return {
      join_ref: null,
      ref: null,
      topic,
      event,
      payload: data
    };
  }

}; // js/phoenix/socket.js

var Socket = class {
  constructor(endPoint, opts = {}) {
    this.stateChangeCallbacks = {
      open: [],
      close: [],
      error: [],
      message: []
    };
    this.channels = [];
    this.sendBuffer = [];
    this.ref = 0;
    this.timeout = opts.timeout || DEFAULT_TIMEOUT;
    this.transport = opts.transport || global.WebSocket || LongPoll;
    this.establishedConnections = 0;
    this.defaultEncoder = serializer_default.encode.bind(serializer_default);
    this.defaultDecoder = serializer_default.decode.bind(serializer_default);
    this.closeWasClean = false;
    this.binaryType = opts.binaryType || "arraybuffer";
    this.connectClock = 1;

    if (this.transport !== LongPoll) {
      this.encode = opts.encode || this.defaultEncoder;
      this.decode = opts.decode || this.defaultDecoder;
    } else {
      this.encode = this.defaultEncoder;
      this.decode = this.defaultDecoder;
    }

    let awaitingConnectionOnPageShow = null;

    if (phxWindow && phxWindow.addEventListener) {
      phxWindow.addEventListener("pagehide", _e => {
        if (this.conn) {
          this.disconnect();
          awaitingConnectionOnPageShow = this.connectClock;
        }
      });
      phxWindow.addEventListener("pageshow", _e => {
        if (awaitingConnectionOnPageShow === this.connectClock) {
          awaitingConnectionOnPageShow = null;
          this.connect();
        }
      });
    }

    this.heartbeatIntervalMs = opts.heartbeatIntervalMs || 3e4;

    this.rejoinAfterMs = tries => {
      if (opts.rejoinAfterMs) {
        return opts.rejoinAfterMs(tries);
      } else {
        return [1e3, 2e3, 5e3][tries - 1] || 1e4;
      }
    };

    this.reconnectAfterMs = tries => {
      if (opts.reconnectAfterMs) {
        return opts.reconnectAfterMs(tries);
      } else {
        return [10, 50, 100, 150, 200, 250, 500, 1e3, 2e3][tries - 1] || 5e3;
      }
    };

    this.logger = opts.logger || null;
    this.longpollerTimeout = opts.longpollerTimeout || 2e4;
    this.params = closure(opts.params || {});
    this.endPoint = `${endPoint}/${TRANSPORTS.websocket}`;
    this.vsn = opts.vsn || DEFAULT_VSN;
    this.heartbeatTimer = null;
    this.pendingHeartbeatRef = null;
    this.reconnectTimer = new Timer(() => {
      this.teardown(() => this.connect());
    }, this.reconnectAfterMs);
  }

  replaceTransport(newTransport) {
    this.disconnect();
    this.transport = newTransport;
  }

  protocol() {
    return location.protocol.match(/^https/) ? "wss" : "ws";
  }

  endPointURL() {
    let uri = Ajax.appendParams(Ajax.appendParams(this.endPoint, this.params()), {
      vsn: this.vsn
    });

    if (uri.charAt(0) !== "/") {
      return uri;
    }

    if (uri.charAt(1) === "/") {
      return `${this.protocol()}:${uri}`;
    }

    return `${this.protocol()}://${location.host}${uri}`;
  }

  disconnect(callback, code, reason) {
    this.connectClock++;
    this.closeWasClean = true;
    this.reconnectTimer.reset();
    this.teardown(callback, code, reason);
  }

  connect(params) {
    this.connectClock++;

    if (params) {
      console && console.log("passing params to connect is deprecated. Instead pass :params to the Socket constructor");
      this.params = closure(params);
    }

    if (this.conn) {
      return;
    }

    this.closeWasClean = false;
    this.conn = new this.transport(this.endPointURL());
    this.conn.binaryType = this.binaryType;
    this.conn.timeout = this.longpollerTimeout;

    this.conn.onopen = () => this.onConnOpen();

    this.conn.onerror = error => this.onConnError(error);

    this.conn.onmessage = event => this.onConnMessage(event);

    this.conn.onclose = event => this.onConnClose(event);
  }

  log(kind, msg, data) {
    this.logger(kind, msg, data);
  }

  hasLogger() {
    return this.logger !== null;
  }

  onOpen(callback) {
    let ref = this.makeRef();
    this.stateChangeCallbacks.open.push([ref, callback]);
    return ref;
  }

  onClose(callback) {
    let ref = this.makeRef();
    this.stateChangeCallbacks.close.push([ref, callback]);
    return ref;
  }

  onError(callback) {
    let ref = this.makeRef();
    this.stateChangeCallbacks.error.push([ref, callback]);
    return ref;
  }

  onMessage(callback) {
    let ref = this.makeRef();
    this.stateChangeCallbacks.message.push([ref, callback]);
    return ref;
  }

  onConnOpen() {
    if (this.hasLogger()) this.log("transport", `connected to ${this.endPointURL()}`);
    this.closeWasClean = false;
    this.establishedConnections++;
    this.flushSendBuffer();
    this.reconnectTimer.reset();
    this.resetHeartbeat();
    this.stateChangeCallbacks.open.forEach(([, callback]) => callback());
  }

  heartbeatTimeout() {
    if (this.pendingHeartbeatRef) {
      this.pendingHeartbeatRef = null;

      if (this.hasLogger()) {
        this.log("transport", "heartbeat timeout. Attempting to re-establish connection");
      }

      this.abnormalClose("heartbeat timeout");
    }
  }

  resetHeartbeat() {
    if (this.conn && this.conn.skipHeartbeat) {
      return;
    }

    this.pendingHeartbeatRef = null;
    clearTimeout(this.heartbeatTimer);
    setTimeout(() => this.sendHeartbeat(), this.heartbeatIntervalMs);
  }

  teardown(callback, code, reason) {
    if (!this.conn) {
      return callback && callback();
    }

    this.waitForBufferDone(() => {
      if (this.conn) {
        if (code) {
          this.conn.close(code, reason || "");
        } else {
          this.conn.close();
        }
      }

      this.waitForSocketClosed(() => {
        if (this.conn) {
          this.conn.onclose = function () {};

          this.conn = null;
        }

        callback && callback();
      });
    });
  }

  waitForBufferDone(callback, tries = 1) {
    if (tries === 5 || !this.conn || !this.conn.bufferedAmount) {
      callback();
      return;
    }

    setTimeout(() => {
      this.waitForBufferDone(callback, tries + 1);
    }, 150 * tries);
  }

  waitForSocketClosed(callback, tries = 1) {
    if (tries === 5 || !this.conn || this.conn.readyState === SOCKET_STATES.closed) {
      callback();
      return;
    }

    setTimeout(() => {
      this.waitForSocketClosed(callback, tries + 1);
    }, 150 * tries);
  }

  onConnClose(event) {
    if (this.hasLogger()) this.log("transport", "close", event);
    this.triggerChanError();
    clearTimeout(this.heartbeatTimer);

    if (!this.closeWasClean) {
      this.reconnectTimer.scheduleTimeout();
    }

    this.stateChangeCallbacks.close.forEach(([, callback]) => callback(event));
  }

  onConnError(error) {
    if (this.hasLogger()) this.log("transport", error);
    let transportBefore = this.transport;
    let establishedBefore = this.establishedConnections;
    this.stateChangeCallbacks.error.forEach(([, callback]) => {
      callback(error, transportBefore, establishedBefore);
    });

    if (transportBefore === this.transport || establishedBefore > 0) {
      this.triggerChanError();
    }
  }

  triggerChanError() {
    this.channels.forEach(channel => {
      if (!(channel.isErrored() || channel.isLeaving() || channel.isClosed())) {
        channel.trigger(CHANNEL_EVENTS.error);
      }
    });
  }

  connectionState() {
    switch (this.conn && this.conn.readyState) {
      case SOCKET_STATES.connecting:
        return "connecting";

      case SOCKET_STATES.open:
        return "open";

      case SOCKET_STATES.closing:
        return "closing";

      default:
        return "closed";
    }
  }

  isConnected() {
    return this.connectionState() === "open";
  }

  remove(channel) {
    this.off(channel.stateChangeRefs);
    this.channels = this.channels.filter(c => c.joinRef() !== channel.joinRef());
  }

  off(refs) {
    for (let key in this.stateChangeCallbacks) {
      this.stateChangeCallbacks[key] = this.stateChangeCallbacks[key].filter(([ref]) => {
        return refs.indexOf(ref) === -1;
      });
    }
  }

  channel(topic, chanParams = {}) {
    let chan = new Channel(topic, chanParams, this);
    this.channels.push(chan);
    return chan;
  }

  push(data) {
    if (this.hasLogger()) {
      let {
        topic,
        event,
        payload,
        ref,
        join_ref
      } = data;
      this.log("push", `${topic} ${event} (${join_ref}, ${ref})`, payload);
    }

    if (this.isConnected()) {
      this.encode(data, result => this.conn.send(result));
    } else {
      this.sendBuffer.push(() => this.encode(data, result => this.conn.send(result)));
    }
  }

  makeRef() {
    let newRef = this.ref + 1;

    if (newRef === this.ref) {
      this.ref = 0;
    } else {
      this.ref = newRef;
    }

    return this.ref.toString();
  }

  sendHeartbeat() {
    if (this.pendingHeartbeatRef && !this.isConnected()) {
      return;
    }

    this.pendingHeartbeatRef = this.makeRef();
    this.push({
      topic: "phoenix",
      event: "heartbeat",
      payload: {},
      ref: this.pendingHeartbeatRef
    });
    this.heartbeatTimer = setTimeout(() => this.heartbeatTimeout(), this.heartbeatIntervalMs);
  }

  abnormalClose(reason) {
    this.closeWasClean = false;

    if (this.isConnected()) {
      this.conn.close(WS_CLOSE_NORMAL, reason);
    }
  }

  flushSendBuffer() {
    if (this.isConnected() && this.sendBuffer.length > 0) {
      this.sendBuffer.forEach(callback => callback());
      this.sendBuffer = [];
    }
  }

  onConnMessage(rawMessage) {
    this.decode(rawMessage.data, msg => {
      let {
        topic,
        event,
        payload,
        ref,
        join_ref
      } = msg;

      if (ref && ref === this.pendingHeartbeatRef) {
        clearTimeout(this.heartbeatTimer);
        this.pendingHeartbeatRef = null;
        setTimeout(() => this.sendHeartbeat(), this.heartbeatIntervalMs);
      }

      if (this.hasLogger()) this.log("receive", `${payload.status || ""} ${topic} ${event} ${ref && "(" + ref + ")" || ""}`, payload);

      for (let i = 0; i < this.channels.length; i++) {
        const channel = this.channels[i];

        if (!channel.isMember(topic, event, payload, join_ref)) {
          continue;
        }

        channel.trigger(event, payload, ref, join_ref);
      }

      for (let i = 0; i < this.stateChangeCallbacks.message.length; i++) {
        let [, callback] = this.stateChangeCallbacks.message[i];
        callback(msg);
      }
    });
  }

  leaveOpenTopic(topic) {
    let dupChannel = this.channels.find(c => c.topic === topic && (c.isJoined() || c.isJoining()));

    if (dupChannel) {
      if (this.hasLogger()) this.log("transport", `leaving duplicate topic "${topic}"`);
      dupChannel.leave();
    }
  }

};


/***/ }),

/***/ "../deps/phoenix_html/priv/static/phoenix_html.js":
/*!********************************************************!*\
  !*** ../deps/phoenix_html/priv/static/phoenix_html.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


(function () {
  var PolyfillEvent = eventConstructor();

  function eventConstructor() {
    if (typeof window.CustomEvent === "function") return window.CustomEvent; // IE<=9 Support

    function CustomEvent(event, params) {
      params = params || {
        bubbles: false,
        cancelable: false,
        detail: undefined
      };
      var evt = document.createEvent('CustomEvent');
      evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
      return evt;
    }

    CustomEvent.prototype = window.Event.prototype;
    return CustomEvent;
  }

  function buildHiddenInput(name, value) {
    var input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    return input;
  }

  function handleClick(element, targetModifierKey) {
    var to = element.getAttribute("data-to"),
        method = buildHiddenInput("_method", element.getAttribute("data-method")),
        csrf = buildHiddenInput("_csrf_token", element.getAttribute("data-csrf")),
        form = document.createElement("form"),
        target = element.getAttribute("target");
    form.method = element.getAttribute("data-method") === "get" ? "get" : "post";
    form.action = to;
    form.style.display = "hidden";
    if (target) form.target = target;else if (targetModifierKey) form.target = "_blank";
    form.appendChild(csrf);
    form.appendChild(method);
    document.body.appendChild(form);
    form.submit();
  }

  window.addEventListener("click", function (e) {
    var element = e.target;

    while (element && element.getAttribute) {
      var phoenixLinkEvent = new PolyfillEvent('phoenix.link.click', {
        "bubbles": true,
        "cancelable": true
      });

      if (!element.dispatchEvent(phoenixLinkEvent)) {
        e.preventDefault();
        e.stopImmediatePropagation();
        return false;
      }

      if (element.getAttribute("data-method")) {
        handleClick(element, e.metaKey || e.shiftKey);
        e.preventDefault();
        return false;
      } else {
        element = element.parentNode;
      }
    }
  }, false);
  window.addEventListener('phoenix.link.click', function (e) {
    var message = e.target.getAttribute("data-confirm");

    if (message && !window.confirm(message)) {
      e.preventDefault();
    }
  }, false);
})();

/***/ }),

/***/ "./css/app.scss":
/*!**********************!*\
  !*** ./css/app.scss ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./js/app.js":
/*!*******************!*\
  !*** ./js/app.js ***!
  \*******************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _css_app_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../css/app.scss */ "./css/app.scss");
/* harmony import */ var _css_app_scss__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_css_app_scss__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _socket__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./socket */ "./js/socket.js");
/* harmony import */ var phoenix_html__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! phoenix_html */ "../deps/phoenix_html/priv/static/phoenix_html.js");
/* harmony import */ var phoenix_html__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(phoenix_html__WEBPACK_IMPORTED_MODULE_2__);
// We need to import the CSS so that webpack will load it.
// The MiniCssExtractPlugin is used to separate it out into
// its own CSS file.
 // webpack automatically bundles all modules in your
// entry points. Those entry points can be configured
// in "webpack.config.js".
//
// Import deps with the dep name or local files with a relative path, for example:
//
//     import {Socket} from "phoenix"

 //


var channel = _socket__WEBPACK_IMPORTED_MODULE_1__["default"].channel('room:lobby', {}); // connect to chat "room"

channel.on('shout', function (payload) {
  // listen to the 'shout' event
  var li = document.createElement("li"); // create new list item DOM element

  var name = payload.name || 'guest'; // get name from payload or set default

  li.innerHTML = '<b>' + name + '</b>: ' + payload.message; // set li contents

  ul.appendChild(li); // append to list

  scrollToBottom();
});
channel.join(); // join the channel.

var ul = document.getElementById('msg-list'); // list of messages.

var name = document.getElementById('name'); // name of message sender

var msg = document.getElementById('msg'); // message input field
// "listen" for the [Enter] keypress event to send a message:

msg.addEventListener('keypress', function (event) {
  if (event.keyCode == 13 && msg.value.length > 0) {
    // don't sent empty msg.
    channel.push('shout', {
      // send the message to the server on "shout" channel
      name: sanitise(name.value),
      // get value of "name" of person sending the message
      message: sanitise(msg.value) // get message text (value) from msg input field.

    });
    msg.value = ''; // reset the message input field for next message.
  }
}); // see: https://stackoverflow.com/a/33193668/1148249

var scrollingElement = document.scrollingElement || document.body;

function scrollToBottom() {
  scrollingElement.scrollTop = scrollingElement.scrollHeight;
}
/**
 * sanitise input to avoid XSS see: https://git.io/fjpGZ
 * function borrowed from: https://stackoverflow.com/a/48226843/1148249
 * @param {string} str - the text to be sanitised.
 * @return {string} str - the santised text
 */


function sanitise(str) {
  var map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    "/": '&#x2F;'
  };
  var reg = /[&<>"'/]/ig;
  return str.replace(reg, function (match) {
    return map[match];
  });
}

/***/ }),

/***/ "./js/socket.js":
/*!**********************!*\
  !*** ./js/socket.js ***!
  \**********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var phoenix__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! phoenix */ "../deps/phoenix/priv/static/phoenix.esm.js");
// NOTE: The contents of this file will only be executed if
// you uncomment its entry in "assets/js/app.js".
// To use Phoenix channels, the first step is to import Socket,
// and connect at the socket path in "lib/web/endpoint.ex".
//
// Pass the token on params as below. Or remove it
// from the params if you are not using authentication.

var socket = new phoenix__WEBPACK_IMPORTED_MODULE_0__["Socket"]("/socket", {
  params: {
    token: window.userToken
  }
}); // When you connect, you'll often need to authenticate the client.
// For example, imagine you have an authentication plug, `MyAuth`,
// which authenticates the session and assigns a `:current_user`.
// If the current user exists you can assign the user's token in
// the connection for use in the layout.
//
// In your "lib/web/router.ex":
//
//     pipeline :browser do
//       ...
//       plug MyAuth
//       plug :put_user_token
//     end
//
//     defp put_user_token(conn, _) do
//       if current_user = conn.assigns[:current_user] do
//         token = Phoenix.Token.sign(conn, "user socket", current_user.id)
//         assign(conn, :user_token, token)
//       else
//         conn
//       end
//     end
//
// Now you need to pass this token to JavaScript. You can do so
// inside a script tag in "lib/web/templates/layout/app.html.eex":
//
//     <script>window.userToken = "<%= assigns[:user_token] %>";</script>
//
// You will need to verify the user token in the "connect/3" function
// in "lib/web/channels/user_socket.ex":
//
//     def connect(%{"token" => token}, socket, _connect_info) do
//       # max_age: 1209600 is equivalent to two weeks in seconds
//       case Phoenix.Token.verify(socket, "user socket", token, max_age: 1209600) do
//         {:ok, user_id} ->
//           {:ok, assign(socket, :user, user_id)}
//         {:error, reason} ->
//           :error
//       end
//     end
//
// Finally, connect to the socket:

socket.connect(); // Now that you are connected, you can join channels with a topic:
// let channel = socket.channel("topic:subtopic", {})
// channel.join()
//   .receive("ok", resp => { console.log("Joined successfully", resp) })
//   .receive("error", resp => { console.log("Unable to join", resp) })

/* harmony default export */ __webpack_exports__["default"] = (socket);

/***/ }),

/***/ 0:
/*!*************************!*\
  !*** multi ./js/app.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./js/app.js */"./js/app.js");


/***/ })

/******/ });
//# sourceMappingURL=app.js.map