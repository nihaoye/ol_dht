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
var styleHash={
	shop:new ol.style.Style({
		image:new ol.style.Icon({
				src:'images/icons/shop.png',
			})
		}),
	wc:new ol.style.Style({
		image:new ol.style.Icon({
			src:'images/icons/wc.png',
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
		flayer
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



