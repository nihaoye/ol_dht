/**
 * Created by Administrator on 2018/5/19.
 */
function Dzlp(elm){
	var _self=this;
	this.elm=document.getElementById(elm);
	var currentScreenOrientation=null;
	this.change=function(e){
		//var q=getFinalQuaternion(e,currentScreenOrientation);
		//var calN=e.alpha;
	/*	if (e.webkitCompassHeading != undefined) {
			calN = e.webkitCompassHeading;
		} else {
			calN = 0;
		}*/
		var calN=e;
		var oricss='-webkit-transform: rotate('+calN+'deg);-moz-transform: rotate('+calN+'deg);-ms-transform: rotate('+calN+'deg);-o-transform: rotate('+calN+'deg);transform: rotate('+calN+'deg);';
		document.getElementById('mouse-position').innerHTML=calN;
		if(_self.elm){
			_self.elm.style=oricss;
		}
		this.events.change&&this.events.change(e);
	};
	this.events={
		change:function(e){
			
		}
	};
	/*window.addEventListener("compassneedscalibration", function(event){
		alert('你的指南针需要校正！举着你的设备，面对着天空划横8字型。正反各三次。');
		event.preventDefault();
	}, true);
	window.addEventListener('deviceorientation',function(e){
		_self.change(e);
	},false);*/
	Compass.watch(function(heading){
		_self.change(heading);
	})
}
function getFinalQuaternion(deviceOrientationData,currentScreenOrientation){
	var degtorad = Math.PI / 180;
	function getBaseQuaternion( alpha, beta, gamma ){
		var _x = beta ? beta - degtorad : 0; // beta value
		var _y = gamma ? gamma * degtorad : 0; // gamma value
		var _z = alpha ? alpha * degtorad : 0; // alpha value

		var cX = Math.cos(_x / 2);
		var cY = Math.cos(_y / 2);
		var cZ = Math.cos(_z / 2);
		var sX = Math.sin(_x / 2);
		var sY = Math.sin(_y / 2);
		var sZ = Math.sin(_z / 2);

//
// ZXY quaternion construction.
//

		var w = cX * cY * cZ - sX * sY * sZ;
		var x = sX * cY * cZ - cX * sY * sZ;
		var y = cX * sY * cZ + sX * cY * sZ;
		var z = cX * cY * sZ + sX * sY * cZ;

		return [w, x, y, z];
	}

	function getScreenTransformationQuaternion( screenOrientation ) {
		var orientationAngle = screenOrientation ? screenOrientation * degtorad : 0;

		var minusHalfAngle = - orientationAngle / 2;

		// Construct the screen transformation quaternion
		var q_s = [
			Math.cos( minusHalfAngle ),
			0,
			0,
			Math.sin( minusHalfAngle )
		];

		return q_s;}
	function getWorldTransformationQuaternion() {
		var worldAngle = 90 * degtorad;

		var minusHalfAngle = - worldAngle / 2;

		// Construct the world transformation quaternion
		var q_w = [
			Math.cos( minusHalfAngle ),
			Math.sin( minusHalfAngle ),
			0,
			0
		];

		return q_w;}
	function quaternionMultiply( a, b ) {
		var w = a[0] * b[0] - a[1] * b[1] - a[2] * b[2] - a[3] * b[3];
		var x = a[1] * b[0] + a[0] * b[1] + a[2] * b[3] - a[3] * b[2];
		var y = a[2] * b[0] + a[0] * b[2] + a[3] * b[1] - a[1] * b[3];
		var z = a[3] * b[0] + a[0] * b[3] + a[1] * b[2] - a[2] * b[1];

		return [ w, x, y, z ];}
	function computeQuaternion() {
		var quaternion = getBaseQuaternion(
			deviceOrientationData.alpha,
			deviceOrientationData.beta,
			deviceOrientationData.gamma    ); // q

		var worldTransform = getWorldTransformationQuaternion(); // q_w

		var worldAdjustedQuaternion = quaternionMultiply( quaternion, worldTransform ); // q'_w

		var screenTransform = getScreenTransformationQuaternion( currentScreenOrientation ); // q_s

		var finalQuaternion = quaternionMultiply( worldAdjustedQuaternion, screenTransform ); // q'_s

		return finalQuaternion;
	}
	return computeQuaternion();
}

