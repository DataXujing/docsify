require = require('esm')(module/*, options*/)
const {JSDOM} = require('jsdom')
const XMLHttpRequest = require('xhr2')
// TODO: try to fix tests when using `<div id="app"></div>` in body
const dom = new JSDOM('<!DOCTYPE html><html><head></head><body></body></html>') 

global.window = dom.window
global.document = dom.window.document
global.navigator = dom.window.navigator
global.location = dom.window.location
global.XMLHttpRequest = XMLHttpRequest

const {initMixin} = require('../src/core/init')
const {routerMixin} = require('../src/core//router')
const {renderMixin} = require('../src/core//render')
const {fetchMixin} = require('../src/core/fetch')
const {eventMixin} = require('../src/core//event')

// mimic src/core/index.js but for Node.js

function Docsify() {
  this._init()
}

const proto = Docsify.prototype

initMixin(proto)
routerMixin(proto)
renderMixin(proto)
fetchMixin(proto)
eventMixin(proto)

function ready(callback) {
  const state = document.readyState

  if (state === 'complete' || state === 'interactive') {
    return setTimeout(callback, 0)
  }

  document.addEventListener('DOMContentLoaded', callback)
}
let docsify = null
module.exports = function(callback) {
	return new Promise((resolve, reject) => {
		// return cached version
		if (docsify != null) {
			return resolve(docsify)
		}
		ready(_ => {
			docsify = new Docsify()
			return resolve(docsify)
		})
		
	})
}
