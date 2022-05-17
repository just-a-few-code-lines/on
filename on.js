/* Copyright 2022, Vincent GRENIER, vincent@kermitou.com
 *
 * MIT licence
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
  *all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/*
 *	Dynamic events.
 *
 *	Provides a way to setup event handlers targetting html elements that are not already in the DOM
 *		=> No more need to wait for the onload event to setup listeners
 *		=> Listeners will be allways up and running, even for future dynamic content
 *
 *	Use node.On( event, <element|selector|selector list>, function ) to attach :
 *		- the given function as a listener of
 *		- the given event name
 *		- on any given element or selected elements 
 *		- that are descendants of node
 *
 *	If the base node is omitted (e.g. when calling on.(...)), the entire document is used as base.
 *
 *	Example :
 *		On( 'change', 'INPUT', evt => { dochange(evt.target); });
 *
 *	JS warning: Note that change(this) will not work here, since arrow functions doesn't have their
 *	own this. althrought, you can use On( 'change', 'INPUT', function(evt) { dochange(this); });
 *
 */

EventTarget.prototype.On = function( event, selector, func ) {
	if( selector instanceof Node ) {
		// static handler shortcut
		return selector.addEventListener( event, func );
	}

	if( !this._on )
		// create event table
		this._on = {};

	if( this._on[event] ) {
		// Add to existing event
		this._on[event].push( {selector:selector, func:func} );
		return;
	}

	// New event. Register and setup handler
	this._on[event] = [ {selector:selector, func:func} ];

	// Setup base for querySelectorAll
	var base = this === window ? document : this;

	// On this event
	this.addEventListener( event, evt => {
		// Iterate throught the On calls
		this._on[event].forEach( i => {
			// If the target is concerned
			if( Array.prototype.includes.call(base.querySelectorAll( i.selector ), evt.target) ) {
				// Call the listener
				i.func.call(evt.target,evt);
			}
		});
	});
};
