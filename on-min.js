EventTarget.prototype.On=function(r,e,t){if(e instanceof Node)return e.addEventListener(r,t);this._on||(this._on={}),this._on[r]?this._on[r].push({selector:e,func:t}):(this._on[r]=[{selector:e,func:t}],this.addEventListener(r,t=>{let n,e,s=[],o=[];for(n=t.target;n&&n!=this.parentNode;n=n.parentNode)s.push(n),o.push([]);for(this._on[r].forEach(e=>{for(n=t.target.closest(e.selector);n&&s.includes(n);n=n.parentNode.closest(e.selector))o[s.indexOf(n)].push(e.func)}),n=0;n<s.length&&t.bubbles&&!t.cancelBubble;n++)for(e=0;e<o[n].length&&t.bubbles&&!t.cancelBubble;e++)o[n][e].call(s[n],t)}))};