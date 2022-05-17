# on

Javascript dynamic event handling in a few bytes of code

Provides a way to setup event handlers targetting html elements that are not already in the DOM
		=> No more need to wait for the onload event to setup event handlers
		=> Handlers will be allways up and running, even for future dynamic content

	Use node.On( event, <element|selector|selector list>, function ) to attach :
		- the given function as a listener of
		- the given event name
		- on any given element or selected elements 
		- that are descendants of node

	If the base node is omitted (e.g. when calling on.(...)), the entire document is used as base.

	Example :
  
		On( 'click', 'INPUT', doclick );
    
    will attach the doclick(evt) function to the 'click' event on any present and future INPUT element.
