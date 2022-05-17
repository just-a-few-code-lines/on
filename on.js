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
	}

	else {
		// New event.

		// Register
		this._on[event] = [ {selector:selector, func:func} ];

		// Setup listener
		this.addEventListener( event, evt => {
			let e, f;

			// On receiving the event, build the list of the elements from evt.target to this
			// They potentially have setup a listener for the event
			// Build a parallel an array that will contain the listener functions to call
			let elements = [];
			let calls = []
			for( e = evt.target; e && e != this.parentNode; e = e.parentNode ) {
				elements.push(e);
				calls.push([]);
			}

			// for each {selector;function} of this event
			this._on[event].forEach( i => {
				// use the selector to filter the concerned elements
				for( e = evt.target.closest(i.selector); e && elements.includes(e); e = e.parentNode.closest(i.selector) )
					// and for each one, archive the function to call
					calls[elements.indexOf(e)].push(i.func);
			});

			// Finally, iterate once again from evt.target to this to make the event bubbling
			for( e = 0; e < elements.length && evt.bubbles && !evt.cancelBubble; e++ ) {
				for( f = 0; f < calls[e].length && evt.bubbles && !evt.cancelBubble; f++ ) {
					calls[e][f].call(elements[e],evt);
				}
			}
		});
	}
};
