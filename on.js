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
