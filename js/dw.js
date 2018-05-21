/**
 * Created by Administrator on 2018/5/20.
 */
var Dw=function(proj){
	var _self=this;
	this.proj=proj||'GCJ02:3857';
	_self.position=null;
	_self.pos=[];//位置数组
	_self.inter=3000;
	this.change=function(p){
		
	};
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
						var position=ol.pro.transform([res.longitude,res.latitude],'EPSG:4326',_self.proj);
						_self.change(position);
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
			projection:_self.proj
		});
		geolocation.setTracking(true);
		// update the HTML page when the position changes.
		geolocation.on('change', function() {
			var coordinates = geolocation.getPosition();
			_self.change(coordinates);
			
		});
		// handle geolocation error.
		geolocation.on('error', function(error) {
		});
		/*		geolocation.on('change:accuracyGeometry', function() {

		 });*/
		geolocation.on('change:position', function() {

		});
	}
};
