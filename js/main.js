/**
 * Created by Administrator on 2018/5/16.
 */
	
var extent=[113,23,113.5,22.5];
var sourceProj='EPSG:4326';
var targetProj="EPSG:4326";
var view = new ol.View({
	enableRotation:false,
	projection: targetProj,
	center:fc.proj.transform([113.9672493,22.60450238],sourceProj,targetProj),
	zoom: 18,
	minZoom:15
/*	extent:extent,*/
/*	rotation:-1.5707963*/
});
/*var image=new ol.source.ImageStatic({
	url: 'images/dt5.jpg',
	projection: 'EPSG:3857',
	imageExtent: extent
});

var layer=new ol.layer.Image({
	opacity:0.9,
	source:image
});*/
/*var imagelayer=new ol.layer.Image({
	opacity:0.5,
	source: new ol.source.ImageStatic({
		url: 'images/zoomda.jpg',
		projection:'EPSG:3857',
		imageExtent: extent
	})
});*/
/*var rk=new ol.Feature(new ol.geom.Point([12686910.3906, 2583069.4528]));
var mxg=new ol.Feature(new ol.geom.Point([12687302.8021, 2583445.2558]));
var yws=new ol.Feature(new ol.geom.Point([12686925.533077912, 2583125.8121094285]));
var xsj=new ol.Feature(new ol.geom.Point([12687733.940686736, 2583171.0395570323]));
var flayer=new ol.layer.Vector({
	source:new ol.source.Vector({
		features: [yws,xsj]
	}),
	style:new ol.style.Style({
		image: new ol.style.Circle({
			radius: 10,
			stroke: new ol.style.Stroke({
				color: '#fff'
			}),
			fill: new ol.style.Fill({
				color: 'red'
			})
		})
	})
});*/
var map = new ol.Map({
	loadTilesWhileAnimating:true,
	controls: ol.control.defaults({
		attributionOptions: {
			collapsible: false
		}
	}),//.extend([mousePositionControl]),
	layers: [
		new ol.layer.Tile({
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
		}),
		/*new ol.layer.Tile({
			source: new ol.source.XYZ({
				url:'http://webst0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}'
			})
		}),*/
		/*new ol.layer.Tile({
			source: new ol.source.OSM()
		}),*/
		//imagelayer,
		//flayer
		
	],
	target: 'map',
	view: view
});
var mydis=new Mydis({id:'mydis',map:map});
var isFirst=true;
var info=document.getElementById('mouse-position');
mydis.events.changePosition=function(p){
	if(isFirst){
		map.getView().setCenter(p);
		isFirst=false;
	}
	var hp=ol.proj.transform(p,targetProj,'EPSG:4326');
	//info.innerHTML=hp[0].toFixed(6)+","+hp[1].toFixed(6);
	
};
window.onload=function(){
	document.getElementById('myposition').onclick=function(e){
		map.getView().animate({
			center: mydis.position,
			duration: 1000
		});
	}
};
/*map.on("moveend",function(e){
	var center=map.getView().getCenter();
	if(center[0]<extent[0]){
		center[0]=extent[0];
	}
	if(center[0]>extent[2]){
		center[0]=extent[2];
	}
	if(center[1]>extent[1]){
		center[1]=extent[1]
	}
	if(center[1]<extent[3]){
		center[1]=extent[3]
	}
	map.getView().setCenter(center);
});*/




