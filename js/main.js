/**
 * Created by Administrator on 2018/5/16.
 */
	
window.debug=false;
var extent=[113.9580,22.5960,113.9780,22.6060];
var sourceProj='EPSG:4326';
var targetProj="EPSG:4326";
var view = new ol.View({
	enableRotation:false,
	projection: targetProj,
	center:[113.96834313869476,22.598670423030853],
	zoom: 18,
	minZoom:17,
	maxZoom:19,
	extent:extent
});
var styleHash={
	shop:new ol.style.Style({
		image:new ol.style.Icon({
				src:'images/icons/shop.png'
			})
		}),
	wc:new ol.style.Style({
		image:new ol.style.Icon({
			src:'images/icons/wc.png'
		})
	})
};
var flayer=new ol.layer.Vector({
	source:new ol.source.Vector(),
	style:function(feature){
		return styleHash[feature.get('type')]
	}
});
var map = new ol.Map({
	loadTilesWhileAnimating:true,
	controls: ol.control.defaults({
		attributionOptions: {
			collapsible: false
		}
	}),
	layers: [
/*		new ol.layer.Tile({
			title: "天地图路网",
			source: new ol.source.XYZ({
				url: "http://t4.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}"
			})
		}),
		new ol.layer.Tile({
			title: "天地图文字标注",
			source: new ol.source.XYZ({
				url: 'http://t3.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}'
			})
		}),*/
		new ol.layer.Tile({
			source: new ol.source.XYZ({
				url:'map2/{z}/{y}/{x}.png'
			})
		}),
		flayer
	],
	target: 'map',
	view: view
});
var mydis=new Mydis({id:'mydis',map:map});
var isFirst=true;
var info=document.getElementById('mouse-position');
mydis.events.changePosition=function(p){
	if(isFirst){
		if(isInExtent(p)){
			map.getView().setCenter(p);
		}
		isFirst=false;
	}
	if(window.debug){
		info.innerHTML=p[0].toFixed(6)+","+p[1].toFixed(6);
	}
};
window.onload=function(){
	document.getElementById('myposition').onclick=function(e){
		if(isInExtent(mydis.position)){
			map.getView().animate({
				center: mydis.position,
				duration: 1000
			});
		}else{
			
		}
	}
};
axios.get('data/features.json').then(function(res){
	var datas=res.data.results;
	datas.forEach(function(data){
		var feature=new ol.Feature({
			geometry: new ol.geom.Point([data.fields.x,data.fields.y]),
			name:data.fields.name
		});
		feature.set('type',data.fields.categories.name);
		flayer.getSource().addFeature(feature)
	})
});
checkNum=9;
setInterval(function(){
	if(navigator.connection&&navigator.connection.type==='wifi'){
		document.getElementById('tips').className='';
		checkNum=0;
	}else{
		if(checkNum>=10){
			document.getElementById('tips').className='active';
			checkNum=0;
		}
		checkNum+=1;
	}
},1000);

function isInExtent(p){
	if(p[0]<113.9580||p[0]>113.9780||p[1]<22.5960||p[1]>22.6060){
		return false;
	}else{
		return true;
	}
}



