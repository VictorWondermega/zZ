
// version: 1

// ザガタ。六 /////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////

var e = ("figure,figcaption,address,article,aside,footer,header,nav,section,main,time").split(','); 
for(i=0;i<e.length;i++) { document.createElement(e[i]); }
if(typeof(window.console)=='undefined') { window.console = { log:function(t) { /* alert(t); */ }, error:function(t) { alert(t); } }; } else {}
if(typeof(document.createElementNS)=='undefined') { document.createElementNS = function(a,b) { return document.createElement(b); }; }

var zlo  = {
	'ee':function(o,ca,fn) {
		if(o.addEventListener) { 
			o.addEventListener(ca, fn, false);
		} else {
			o.attachEvent('on'+ca, function() { return(fn.call(o, window.event)); } );
		}
	},
	'ar':new Array(),
	'da':function(m,o,f) { // module, object, function
		o = (typeof(o)=='undefined')?false:o;
		if(o) { // add 
			this.ar.push(new Array(m,o,f));
		} else { // call
			var i, ix=this.ar.length;
			for(i=0;i<ix;i++) {
				if(this.ar[i][0]==m) {
					this.ar[i][1][this.ar[i][2]](m);
					this.ar.splice(i,1);
					i--; ix--;
				} else {}
			}
		}		
	},
};

////////////////////////////////////////////////////////////////

function zZ() {
	/* Zagata.CORE */
	
	this.x = new Array(); // memo
	this.x[0] = new Object(); this.x[0].ca = 'vrs'; // IE5
	this.m = new Array(); // modules
	this.e = new Array(); // event
	this.done = new Array(); // events
	
	/////////////////////////////// 
	// memory
	this.mm = function(k, v) {
		var k = (typeof(k)=='undefined')?false:k;
		var v = (typeof(v)=='undefined')?false:v;
		
		if(k=='del'&&v) { // del
			if(typeof(v)=='number') { // by id
				var i=0, ix = this.x.length; 
				for(i;i<ix;i++) {
					if(typeof(this.x[i]['id'])=='number'&&this.x[i]['id']==v) {
						this.x.splice(i,1); 
						break;
					} else {}
				}
			} else { if(typeof(v)=='object') { // definite filed
				var re = this.mm(v[0]);
				delete re[0][v[1]];
				this.mm(v[0],re[0]);
			} else {} }
		} else { if(k&&v) { // red
			switch(typeof(k)) {
				case 'number':
					var i=0, ix = this.x.length; 
					for(i;i<ix;i++) {
						if(typeof(this.x[i]['id'])=='number'&&this.x[i]['id']==k) {
							this.x[i] = v; 
							break;
						} else {}
					}
					break;
				case 'string':
					var i=0, ix = this.x.length; 
					for(i;i<ix;i++) {
						if(typeof(this.x[i]['ca'])=='string'&&this.x[i]['ca']==k) {
							for(var a in v) { this.x[i][a] = v[a]; }
						} else {}
					}
					break;
				case 'object':
					var re = this.mm(k[0]);
					re[0][k[1]] = v;
					this.mm(k[0],re[0]);
					break;
				default:
					this.msg('err','zZ','u can not edit records by '+typeof(k));
			} 
		} else { if(k) { // get
			var re = new Array(), i=0, ix = this.x.length;
			for(i;i<ix;i++) {
				if(typeof(k)=='number'&&this.get(this.x[i],'id')==k) { // record by id
					re.push(this.x[i]); 
					break;
				} else { if(typeof(k)=='string'&&this.get(this.x[i],'ca')==k) { // record by category
					re.push(this.x[i]);
				} else { if(typeof(k)=='object'&&(this.get(this.x[i],'id')==k[0]||this.get(this.x[i],'ca')==k[0])) { // record by array
					if(this.get(this.x[i],k[1])) {
						re = this.x[i][k[1]];
						break;
					} else { re = false; }
				} else {} } }
			}
			return (typeof(re)=='boolean'||typeof(re)=='number'||this.len(re)>0)?re:false;
		} else { if(v) { // set
			this.x.push(v);
		} else {
			this.msg('err','zZ','no condition accepted by mm: '+k);
		} } } }
	return this;
	};
	this.len = function(o) { var i=false, ix=0; if(typeof(o.length)!=='undefined') { return o.length; } else { for(i in o) { ix++; } } return ix; };
	this.get = function(i,k) { return (typeof(i[k])!=='undefined')?i[k]:false; };
	
	this.max = function(k) {
		var re=0, i=0, ix = this.x.length; 
		for(i;i<ix;i++) {
			if(typeof(this.x[i][k])!=='undefined') { if(re<this.x[i][k]) {
				re = this.x[i][k];
			} else {} } else {}
		}
	return re;
	};
	
	/////////////////////////////// 
	// event
	this.ee = function(k, v) {
		var k = (typeof(k)=='undefined')?false:k;
		var v = (typeof(v)=='undefined')?false:v;
		
		if(k=='del'&&typeof(v)=='object') { // del
			if(typeof(this.e[v[0]])=='object'&&typeof(v[1])=='string'&&this.e[v[0]].indexOf(v[1])>=0) {
				this.e[v[0]].splice(this.e[v[0]].indexOf(v[1]),1);
			} else {
				if(typeof(this.e[v[0]])=='object'&&typeof(v[1])=='object') {
				var i=0, ix = this.e[v[0]].length; 
				for(i;i<ix;i++) {
					if(typeof(this.e[v[0]][i])=='object'&&this.e[v[0]][i][0]==v[1][0]&&this.e[v[0]][i][1]==v[1][1]) {
						this.e[v[0]].splice(i,1);
						break;
					} else {}
				}
			} else {} }
		} else { if(k&&v) { // add
			if(typeof(this.e[k])=='undefined') {
				this.e[k] = new Array();
			} else {}
			this.e[k].push(v);
		} else { if(k&&typeof(this.e[k])!='undefined') { // call
			this.now = k; // current event
			var i=0, ix = this.e[k].length; 
			for(i;i<ix;i++) {
				if(typeof(this.e[k][i])=='string'&&typeof( window[this.e[k][i]] )=='function') {
					window[this.e[k][i]]();
				} else { if(typeof(this.e[k][i])=='object') {
					if(typeof(this.e[k][i][0])=='object'&&typeof( this.e[k][i][0][ this.e[k][i][1] ] )=='function') {
						this.e[k][i][0][this.e[k][i][1]]();
					} else { if(typeof(this.m[this.e[k][i][0]])=='object'&&typeof( this.m[this.e[k][i][0]][ this.e[k][i][1] ] )=='function') {
						this.m[this.e[k][i][0]][ this.e[k][i][1] ]();
					} else {
						this.msg('err','zZ','strange type of v at ee: '+typeof(v));
						// console.log(k);
					} }
				} else {  
					this.msg('err','zZ','strange type of v at ee: '+typeof(v));
					// console.log(v);
				} }
			}
			this.done.push(k);
		} else { } } }
	return this;
	};
	
	/////////////////////////////// 
	// modules
	this.loa = new Object();
	this.lo = function(c,a,n) {
		var c = (typeof(c)=='undefined')?false:c;
		var a = (typeof(a)=='undefined')?false:a;
		var n = (typeof(n)=='undefined')?false:n;

		if(typeof(window[c])!=='undefined') {
			if(typeof(this.loa[c])!=='undefined'&&this.loa[c].length>0) { // mass loading
				var i=0, ix = this.loa[c].length;
				for(i;i<ix;i++) { // slightly thin place for old browsers 
					a = this.loa[c][i][0]; n = (this.loa[c][i][1])?this.loa[c][i][1]:c; 
					// console.log(c,typeof(window[c]));
					this.m[ n ] = new window[c](this,a,n);
					this.ee(n);
				}
				this.loa[c] = new Array();
			} else { // single loading
				n = ((n)?n:c);
				this.m[ n ] = new window[c](this,a,n);
				this.ee(n);
			}
		} else {
			if(typeof(this.loa[c])=='undefined') { // need loading
				var tmp = document.createElement('script'); tmp.type='text/javascript'; tmp.src='/za/'+c+'/'+c+'.js?'+Math.random(); tmp.async=true; 
				document.getElementsByTagName('head')[0].appendChild(tmp);
				this.loa[c] = new Array();
				// initiation inside $c
				zlo.da(c,this,'lo');
			} else {}
			this.loa[c].push( new Array(a,n) );
		}
	return this;
	};	

	/////////////////////////////// 
	// funcs
	this.msg = function(c,k,v) {  // err|ntf, module, text
		var c = (typeof(c)=='undefined')?'err':c;
		var k = (typeof(k)=='undefined')?false:k;
		var v = (typeof(v)=='undefined')?false:v;	
		
		this.mm(false,{'ca':'zmsg','cat':c,'m':k,'de':v});
		this.ee('zmsg');
	};

	this.a2x = function(a,tab) {
		var a = (typeof(a)=='undefined')?false:a;
		var tab = (typeof(tab)=='undefined')?'':tab;
		var k='', kk = '', re = '';
		for(k in a) {
			kk = parseInt(k);
			kk = (isNaN(kk))?k:'i';
			if(kk.indexOf('_')===0) { kk = kk.substring(1); } else {}
			if(typeof(a[k])=='object') {
				re += tab+"<"+kk+">\n"+this.a2x(a[k],tab+"\t")+tab+"</"+kk+">\n";
			} else {
				re += tab+"<"+kk+">"+((typeof(a[k])=='string'&&a[k].indexOf('<')>=0)?'<![CDATA[ '+a[k]+' ]]>':a[k])+"</"+kk+">\n";
			}
		}
	return re; 
	};
	
	///////////////////////////////
	// ini
	this.mm('vrs',ini);
}
