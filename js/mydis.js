/**
 * Created by Administrator on 2018/5/19.
 */
function Dzlp(elm){
	var _self=this;
	this.elm=document.getElementById(elm);
	this.change=function(e){
		var alpha =360-e.alpha,
			beta = e.beta,
			gamma = e.gamma;
		var calN=alpha;
		var oricss='-webkit-transform: rotate('+calN+'deg);-moz-transform: rotate('+calN+'deg);-ms-transform: rotate('+calN+'deg);-o-transform: rotate('+calN+'deg);transform: rotate('+calN+'deg);';
		//document.getElementById('mouse-position').innerHTML=calN;
		if(_self.elm){
			_self.elm.style=oricss;
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
		_self.geolocation=initLocate();
	}
	init();
	function initLocate(){
		if(window.wx){
			wx.config({
				debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。    
				appId: 'wx7bdbdab200ed9e42', // 必填，公众号的唯一标识    
				timestamp: '${ timestamp}' , // 必填，生成签名的时间戳    
				nonceStr: '${ nonceStr}', // 必填，生成签名的随机串    
				signature: '${ signature}',// 必填，签名，见附录1    
				jsApiList: ['checkJsApi',
					'getNetworkType',//网络状态接口  
					'openLocation',//使用微信内置地图查看地理位置接口  
					'getLocation' //获取地理位置接口  
				] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2    
			});
			wx.ready(function () {
				setInterval(function(){
					wx.getLocation({
						success: function (res) {
							console.log(res.latitude);  //纬度
							console.log(res.longitude); //经度
							_self.position=ol.pro.transform([res.longitude,res.latitude],'EPSG:4326','GCJ02:3857');
							if(_self.position){
								_self.overlay.setPosition(_self.position);
								_self.events.changePosition&&_self.events.changePosition(_self.position);
							}
						},
						fail: function (res) {
							alert('fail')
						},
						cancel: function (res) {
							alert(cancel);
						}
					});
				},200);
			});
		}else{
			var geolocation = new ol.Geolocation({
				projection: map.getView().getProjection()
			});
			geolocation.setTracking(true);
			// update the HTML page when the position changes.
			geolocation.on('change', function() {
				var coordinates = geolocation.getPosition();
				//alert(coordinates);
				_self.position=coordinates;
				if(_self.position){
					_self.overlay.setPosition(coordinates);
					_self.events.changePosition&&_self.events.changePosition(coordinates);
				}
			});
			// handle geolocation error.
			geolocation.on('error', function(error) {
			});
			/*		geolocation.on('change:accuracyGeometry', function() {

			 });*/
			geolocation.on('change:position', function() {
				
			});
			return geolocation;
		}
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
