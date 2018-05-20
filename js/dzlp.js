/**
 * Created by Administrator on 2018/5/19.
 */
function Dzlp(elm){
	var _self=this;
	this.elm=document.getElementById(elm);
	this.change=function(e){
		var alpha = e.alpha,
			beta = e.beta,
			gamma = e.gamma;
		var calN=360-alpha;
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
	window.addEventListener("compassneedscalibration", function(event){
		alert('你的指南针需要校正！举着你的设备，面对着天空划横8字型。正反各三次。');
		event.preventDefault();
	}, true);
	window.addEventListener('deviceorientation',function(e){
		_self.change(e);
	});
}



