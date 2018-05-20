/**
 * Created by Administrator on 2018/5/19.
 */
var view = new ol.View({
	center:[12686910.3906, 2583069.4528],
	zoom: 18
});
var image=new ol.source.ImageStatic({
	url: 'images/dt3.jpg',
	projection: 'EPSG:3857',
	imageExtent: ol.proj.transformExtent([113.9672493,22.60455248,113.9794931,22.59117728],'EPSG:4326',"EPSG:3857")
});
var layer=new ol.layer.Image({
	opacity:0.4,
	source:image
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
})
var map = new ol.Map({
	controls: ol.control.defaults({
		attributionOptions: {
			collapsible: false
		}
	}),
	layers: [
		new ol.layer.Tile({
			source: new ol.source.XYZ({
				url:'http://webst0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}'
			})
		}),
		/*new ol.layer.Tile({
		 source: new ol.source.OSM()
		 }),*/
		flayer

	],
	target: 'map',
	view: view
});
var changeImage=function(){
	var extent=view.calculateExtent(4559,5031);
	layer.setSource(new ol.source.ImageStatic({
		url: 'images/dt3.jpg',
		projection: 'EPSG:3857',
		imageExtent: extent
	}));
};
map.on('moveend', function(){
	//changeImage();
	var feature1=map.getFeaturesAtPixel([508,3525]);
	var feature2=map.getFeaturesAtPixel([3468,3697]);
	if(feature1&&feature2){
		console.warn(view.calculateExtent());
		alert(view.calculateExtent().toString())
	}
});


