/**
 * Created by Administrator on 2018/5/16.
 */
var extent=[12686826.330880566, 2582764.0012257705, 12687961.789686656, 2584247.1004240722];//[12686813.812213715, 2582713.078183079, 12688175.048197903, 2584215.2449381677];
var view = new ol.View({
	center:fc.proj.transform([113.9672493,22.60450238],'EPSG:4326','GCJ02:3857'),
	zoom: 18,
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
var imagelayer=new ol.layer.Image({
	opacity:0.5,
	source: new ol.source.ImageStatic({
		url: 'images/zoomda.jpg',
		projection:'EPSG:3857',
		imageExtent: extent
	})
});
var rk=new ol.Feature(new ol.geom.Point([12686910.3906, 2583069.4528]));
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
});
var map = new ol.Map({
	controls: ol.control.defaults({
		attributionOptions: {
			collapsible: false
		}
	}),//.extend([mousePositionControl]),
	layers: [
		new ol.layer.Tile({
			source: new ol.source.XYZ({
				url:'http://webst0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}'
			})
		}),
		/*new ol.layer.Tile({
			source: new ol.source.OSM()
		}),*/
		imagelayer,
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
		map.getView().setCenter(p);
		isFirst=false;
	}
	var hp=ol.proj.transform(p,'GCJ02:3857','EPSG:4326');
	info.innerHTML=hp[0].toFixed(6)+","+hp[1].toFixed(6);
	
};
/*var imageSize=[4559,5031];
var a1=[12686925.533077912, 2583125.8121094285];
var a1_1=[508,3625];
var a2=[12687733.940686736, 2583171.0395570323];
var a2_2=[3468,3697];
var calExt=function(){
	var px=(a1[0]-a2[0])/(a1_1[0]-a2_2[0]);
	var py=(a1[1]-a2[1])/(a1_1[1]-a2_2[1]);
	var x1=a1[0]-a1_1[0]*px;
	var y1=a1[1]-a1_1[1]*py;
	var x2=a1[0]+(imageSize[0]-a1_1[0])*px;
	var y2=a1[1]+(imageSize[1]-a1_1[1])*py;
	return [x1,y1,x2,y2];
};

console.log(calExt());*/






