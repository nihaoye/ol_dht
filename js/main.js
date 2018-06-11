/**
 * Created by Administrator on 2018/5/16.
 */
	
window.debug=false;
var extent=[113.9612, 22.5934, 113.9722,22.6044 ];
//分辨率
var resolutions = [
    1.40625,
    0.703125,
    0.3515625,
    0.17578125,
    0.087890625,
    0.0439453125,
    0.02197265625,
    0.010986328125,
    0.0054931640625,
    0.00274658203125,
    0.001373291015625,
    0.0006866455078125,
    0.00034332275390625,
    0.000171661376953125,
    0.0000858306884765625,
    0.00004291534423828125,
    0.000021457672119140625,
    0.000010728836059570312,
    0.000005364418029785156,
    0.000002682209014892578,
    0.000001341104507446289
];
var projection=ol.proj.get('EPSG:4326');//设置坐标系;
var matrixIds = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
var projectionExtent =projection.getExtent();

var sourceProj='EPSG:4326';
var targetProj='EPSG:4326';
var view = new ol.View({
	enableRotation:false,
	projection: targetProj,
	center:[113.96834313869476,22.598670423030853],
	zoom: 16,
	minZoom:16,
	maxZoom:17,
	extent:extent
});
var styleHash={
	shop:new ol.style.Style({
		image:new ol.style.Icon({
				src:'images/icons/shop.png',
				scale:0.7
			})
		}),
	wc:new ol.style.Style({
		image:new ol.style.Icon({
			src:'images/icons/wc.png',
			scale:0.7
		})
	})
};
var flayer=new ol.layer.Vector({
	source:new ol.source.Vector(),
	style:function(feature){
		return styleHash[feature.get('type')]
	}
});
flayer.setVisible(false);
var image=new ol.source.ImageStatic({
	url: 'images/194.jpg',
	projection: 'EPSG:4326',
	imageExtent: extent
});
var layer=new ol.layer.Image({
	source:image
});
var map = new ol.Map({
	controls: ol.control.defaults({
		attributionOptions: {
			collapsible: false
		}
	}),
	layers: [
		/*new ol.layer.Tile({
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
       /* new ol.layer.Tile({
            opacity: 1,
            source: new ol.source.XYZ({
                crossOrigin: ol.extent.getTopLeft(projectionExtent),
                projection: projection,
                tileGrid: new ol.tilegrid.WMTS({
                    origin: ol.extent.getTopLeft(projectionExtent),
                    resolutions: resolutions.slice(0, 21),
                    matrixIds: matrixIds.slice(0, 21)
                }),
                tileUrlFunction: function (tileCoord) {
                    return 'map3/' + tileCoord[0] + '/' + (-tileCoord[2]) + '/' + tileCoord[1] + '.jpg';
                },
            })
        }),*/
		layer,
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
	if(!p){
		return false;
	}
	if(p[0]<113.9580||p[0]>113.9780||p[1]<22.5960||p[1]>22.6060){
		openExtentTips();
		return false;
	}else{
		return true;
	}
}
var extentTimeId=null;
function openExtentTips(){
	var node=document.getElementById('extentTips');
	node.className='active';
	extentTimeId&&clearTimeout(extentTimeId);
	extentTimeId=setTimeout(function(){
		node.className='';
	},2000)
}

map.getView().on("change:resolution",function(){
	var zoom=map.getView().getZoom();
	if(zoom>=17){
		flayer.setVisible(true);
	}else{
        flayer.setVisible(false);
	}
});


