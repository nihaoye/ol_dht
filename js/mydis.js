/**
 * Created by Administrator on 2018/5/19.
 */
function Dzlp(elm){
	var targetProj='EPSG:4326';
	var _self=this;
	this.elm=document.getElementById(elm);
	this.change=function(e){
		calN=0;
		if(!e.webkitCompassHeading){
			calN=-e.alpha
		}else{
			calN=e.webkitCompassHeading;
		}
		//var oricss='-webkit-transform: rotate('+calN+'deg);-moz-transform: rotate('+calN+'deg);-ms-transform: rotate('+calN+'deg);-o-transform: rotate('+calN+'deg);transform: rotate('+calN+'deg);';
		//document.getElementById('mouse-position').innerHTML=calN;
		if(_self.elm){
			_self.elm.style.webkitTransform='rotateZ('+calN+'deg)';
		}
		_self.events.change&&_self.events.change(e);
	};
	this.events={
		change:function(e){
			
		}
	};
	window.addEventListener("compassneedscalibration", function(event){
		alert('你的指南针需要校正！举着你的设备，面对着天空划横8字型。正反各三次。');
		event.preventDefault();
	}, true);
	window.addEventListener('deviceorientation',function(e){
		_self.change(e);
	},false);
}
/**
 * 
 * @param opt
 * @param opt.id{string}
 * @param opt.map{ol.Map}
 * @param opt.proj{string
 * @constructor
 */
function Mydis(opt){
	var _self=this;
	this.id=opt.id||'defaults';
	this.map=opt.map;
	this.proj=opt.proj;
	this.container=null;
	this.jt=null;
	this.dzlp=null;
	this.overlay=null;
	this.position=null;
	this.events={
		changePosition:function(){
			
		}
	};
	function init(){
		_self.container=document.createElement('div');
		_self.container.id=_self.id;
		_self.container.className='mydis';
		_self.container.innerHTML='<div class="jtbg"></div><div id="jt_'+_self.id+'" class="jt"></div>';
		document.body.appendChild(_self.container);
		_self.overlay=new ol.Overlay({
			positioning: 'center-center',
			element:_self.container
		});
		_self.map.addOverlay(_self.overlay);
		_self.dzlp=new Dzlp('jt_'+_self.id);
		setTimeout(function(){
			_self.geolocation=initLocate();
		},200);
		
	}
	init();
	function initLocate(){
		var geolocation = new ol.Geolocation({
			projection: map.getView().getProjection()
		});
		geolocation.setTracking(true);
		// update the HTML page when the position changes.
		geolocation.on('change', function() {
			
		});
		// handle geolocation error.
		geolocation.on('error', function(error) {
		});
		/*		geolocation.on('change:accuracyGeometry', function() {

		 });*/
		geolocation.on('change:position', function() {
			var coordinates = geolocation.getPosition();
			//alert(coordinates);
			_self.position=coordinates;
			if(_self.position){
				_self.overlay.setPosition(coordinates);
				_self.events.changePosition&&_self.events.changePosition(coordinates);
				document.getElementById('mouse-position').innerHTML=_self.position[0].toFixed(6)+","+_self.position[1].toFixed(6);
			}
		});
		return geolocation;
	}
	
	function caculateFc(coords){
		var result=[0,0];
		for(var i=0;i<coords.length;i++){
			result[0]+=Math.pow(coords[0]);
			result[1]+=Math.pow(coords[1]);
		}
		return result;
	}
}
function compassHeading( alpha, beta, gamma ) {
	var degtorad = Math.PI / 180;
	var _x = beta  ? beta  * degtorad : 0; // beta value
	var _y = gamma ? gamma * degtorad : 0; // gamma value
	var _z = alpha ? alpha * degtorad : 0; // alpha value

	var cX = Math.cos( _x );
	var cY = Math.cos( _y );
	var cZ = Math.cos( _z );
	var sX = Math.sin( _x );
	var sY = Math.sin( _y );
	var sZ = Math.sin( _z );

	// Calculate Vx and Vy components
	var Vx = - cZ * sY - sZ * sX * cY;
	var Vy = - sZ * sY + cZ * sX * cY;

	// Calculate compass heading
	var compassHeading = Math.atan( Vx / Vy );

	// Convert compass heading to use whole unit circle
	if( Vy < 0 ) {
		compassHeading += Math.PI;
	} else if( Vx < 0 ) {
		compassHeading += 2 * Math.PI;
	}

	return compassHeading * ( 180 / Math.PI ); // Compass Heading (in degrees)

}
