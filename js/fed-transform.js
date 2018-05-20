
/*
 * transform  坐标转换支持坐标集合转换
 * transformExtent 坐标边界转换
 * addProjection 注册一个坐标系
 * addProjectionAlias 添加一个坐标系别名
 * */
function _UtilProj(){
    var _self=this;
    /*
     * 坐标系别名字典表
     * */
    // 高德地图、谷歌地图、腾讯地图、arcgis地图、必应地图都使用'GCJ02:3857'坐标系
    // PGIS、天地图使用'EPSG:4326'坐标系
    // OSM使用'EPSG:3857'坐标系
    this._projNameMap={
        //高德
        "GAODE":"GCJ02:3857",
        "GAODE:3857":"GCJ02:3857",
        "GAODE:4326":"GCJ02:4326",
        //google
        "GOOGLE":"GCJ02:3857",
        "GOOGLE:3857":"GCJ02:3857",
        //腾讯
        "TENCENT":"GCJ02:3857",
        "TENCENT:3857":"GCJ02:3857",
        "TENCENT:4326":"GCJ02:4326",
        //arcgis
        "ARCGIS":"GCJ02:3857",
        "ARCGIS:3857":"GCJ02:3857",
        //必应
        "BING":"GCJ02:3857",
        "BING:3857":"GCJ02:3857",
        //pgis
        "PGIS":"EPSG:4326",
        "PGIS:4326":"EPSG:4326",
        "WGS:84":"EPSG:4326",
        //天地图
        "TIANDITU":"EPSG:4326",
        "TIANDITU:4326":"EPSG:4326",
        //osm
        "OSM":"EPSG:3857",
        "OSM:3857":"EPSG:3857"
    };
    this._resolutions3857 = [
        156543.03392804097,
        78271.51696402048,
        39135.75848201024,
        19567.87924100512,
        9783.93962050256,
        4891.96981025128,
        2445.98490512564,
        1222.99245256282,
        611.49622628141,
        305.748113140705,
        152.8740565703525,
        76.43702828517625,
        38.21851414258813,
        19.109257071294063,
        9.554628535647032,
        4.777314267823516,
        2.388657133911758,
        1.194328566955879,
        0.5971642834779395,
        0.29858214173896974,
        0.14929107086948487
    ];

    this._resolutions4326 = [
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
        0.0000107288360595703125,
        0.00000536441802978515625,
        0.000002682209014892578125,
        0.0000013411045074462890625
    ];

    // sougou坐标转换参数
    var transSougouTo84Param1 = [12890594.86, 8362377.87, 5591021, 3481989.83, 1678043.12, 0];
    var transSougouTo84Param2=[[1.410526172116255e-8,0.00000898305509648872,-1.9939833816331,200.9824383106796,-187.2403703815547,91.6087516669843,-23.38765649603339,2.57121317296198,-0.03801003308653,17337981.2],
        [-7.435856389565537e-9,0.000008983055097726239,-0.78625201886289,96.32687599759846,-1.85204757529826,-59.36935905485877,47.40033549296737,-16.50741931063887,2.28786674699375,10260144.86],
        [-3.030883460898826e-8,0.00000898305509983578,0.30071316287616,59.74293618442277,7.357984074871,-25.38371002664745,13.45380521110908,-3.29883767235584,0.32710905363475,6856817.37],
        [-1.981981304930552e-8,0.000008983055099779535,0.03278182852591,40.31678527705744,0.65659298677277,-4.44255534477492,0.85341911805263,0.12923347998204,-0.04625736007561,4482777.06],
        [3.09191371068437e-9,0.000008983055096812155,0.00006995724062,23.10934304144901,-0.00023663490511,-0.6321817810242,-0.00663494467273,0.03430082397953,-0.00466043876332,2555164.4],
        [2.890871144776878e-9,0.000008983055095805407,-3.068298e-8,7.47137025468032,-0.00000353937994,-0.02145144861037,-0.00001234426596,0.00010322952773,-0.00000323890364,826088.5]];
    var trans84ToSougouParams1= [75, 60, 45, 30, 15, 0];
    var trans84ToSougouParams2 = [[-0.0015702102444,111320.7020616939,1704480524535203,-10338987376042340,26112667856603880,-35149669176653700,26595700718403920,-10725012454188240,1800819912950474,82.5],
        [0.0008277824516172526,111320.7020463578,647795574.6671607,-4082003173.641316,10774905663.51142,-15171875531.51559,12053065338.62167,-5124939663.577472,913311935.9512032,67.5],
        [0.00337398766765,111320.7020202162,4481351.045890365,-23393751.19931662,79682215.47186455,-115964993.2797253,97236711.15602145,-43661946.33752821,8477230.501135234,52.5],
        [0.00220636496208,111320.7020209128,51751.86112841131,3796837.749470245,992013.7397791013,-1221952.21711287,1340652.697009075,-620943.6990984312,144416.9293806241,37.5],
        [-0.0003441963504368392,111320.7020576856,278.2353980772752,2485758.690035394,6070.750963243378,54821.18345352118,9540.606633304236,-2710.55326746645,1405.483844121726,22.5],
        [-0.0003218135878613132,111320.7020701615,0.00369383431289,823725.6402795718,0.46104986909093,2351.343141331292,1.58060784298199,8.77738589078284,0.37238884252424,7.45]];

    // 百度坐标转换参数
    var transBaiduToMc1 = [ 75, 60, 45, 30, 15, 0 ];
    var transBaiduToMc2 = [
        [-0.0015702102444, 111320.7020616939, 1704480524535203, -10338987376042340, 26112667856603880, -35149669176653700, 26595700718403920, -10725012454188240, 1800819912950474, 82.5],
        [0.0008277824516172526, 111320.7020463578, 647795574.6671607, -4082003173.641316, 10774905663.51142, -15171875531.51559, 12053065338.62167, -5124939663.577472, 913311935.9512032, 67.5],
        [0.00337398766765, 111320.7020202162, 4481351.045890365, -23393751.19931662, 79682215.47186455, -115964993.2797253, 97236711.15602145, -43661946.33752821, 8477230.501135234, 52.5],
        [0.00220636496208, 111320.7020209128, 51751.86112841131, 3796837.749470245, 992013.7397791013, -1221952.21711287, 1340652.697009075, -620943.6990984312, 144416.9293806241, 37.5],
        [-0.0003441963504368392, 111320.7020576856, 278.2353980772752, 2485758.690035394, 6070.750963243378, 54821.18345352118, 9540.606633304236, -2710.55326746645, 1405.483844121726, 22.5],
        [-0.0003218135878613132, 111320.7020701615, 0.00369383431289, 823725.6402795718, 0.46104986909093, 2351.343141331292, 1.58060784298199, 8.77738589078284, 0.37238884252424, 7.45]
    ];
    var transMcToBaidu1 = [ 12890594.86, 8362377.87, 5591021, 3481989.83, 1678043.12, 0 ];
    var transMcToBaidu2 = [
        [1.410526172116255e-8, 0.00000898305509648872, -1.9939833816331, 200.9824383106796, -187.2403703815547, 91.6087516669843, -23.38765649603339, 2.57121317296198, -0.03801003308653, 17337981.2],
        [-7.435856389565537e-9, 0.000008983055097726239, -0.78625201886289, 96.32687599759846, -1.85204757529826, -59.36935905485877, 47.40033549296737, -16.50741931063887, 2.28786674699375, 10260144.86],
        [-3.030883460898826e-8, 0.00000898305509983578, 0.30071316287616, 59.74293618442277, 7.357984074871, -25.38371002664745, 13.45380521110908, -3.29883767235584, 0.32710905363475, 6856817.37],
        [-1.981981304930552e-8, 0.000008983055099779535, 0.03278182852591, 40.31678527705744, 0.65659298677277, -4.44255534477492, 0.85341911805263, 0.12923347998204, -0.04625736007561, 4482777.06],
        [3.09191371068437e-9, 0.000008983055096812155, 0.00006995724062, 23.10934304144901, -0.00023663490511, -0.6321817810242, -0.00663494467273, 0.03430082397953, -0.00466043876332, 2555164.4],
        [2.890871144776878e-9, 0.000008983055095805407, -3.068298e-8, 7.47137025468032, -0.00000353937994, -0.02145144861037, -0.00001234426596, 0.00010322952773, -0.00000323890364, 826088.5]
    ];

    /*
     * 百度坐标转换函数,百度API自己的内部私有方法
     */
    var _baiduConvert = function(coordinate, param){
        var tt = param[0] + param[1] * Math.abs(coordinate[0]);
        var cc = Math.abs(coordinate[1]) / param[9];
        var cf = param[2] + param[3] * cc + param[4] * cc * cc + param[5] * cc * cc * cc + param[6] * cc * cc * cc * cc + param[7] * cc * cc * cc * cc * cc + param[8] * cc * cc * cc * cc * cc * cc;
        tt *= (coordinate[0] < 0 ? -1 : 1);
        cf *= (coordinate[1] < 0 ? -1 : 1);
        return [tt, cf ];
    };

    var _transformLat = function(lng, lat) {
        var ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
        ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(lat * PI) + 40.0 * Math.sin(lat / 3.0 * PI)) * 2.0 / 3.0;
        ret += (160.0 * Math.sin(lat / 12.0 * PI) + 320 * Math.sin(lat * PI / 30.0)) * 2.0 / 3.0;
        return ret
    };

    var _transformLng = function(lng, lat) {
        var ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
        ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(lng * PI) + 40.0 * Math.sin(lng / 3.0 * PI)) * 2.0 / 3.0;
        ret += (150.0 * Math.sin(lng / 12.0 * PI) + 300.0 * Math.sin(lng / 30.0 * PI)) * 2.0 / 3.0;
        return ret
    };

    /*
     * 判断是否在国内，不在国内则不做偏移
     * @returns {boolean}
     */
    var _outOfChina = function(coordinate) {
        return (coordinate[0] < 72.004 || coordinate[0] > 137.8347) || ((coordinate[1] < 0.8293 || coordinate[1] > 55.8271) || false);
    };

    var xpi = 3.14159265358979324 * 3000.0 / 180.0;
    var PI = 3.1415926535897932384626;
    var a = 6378245.0;
    var ee = 0.00669342162296594323;

    var parseCoord = function(coordinate){
        coordinate[0] = parseFloat(coordinate[0]);
        coordinate[1] = parseFloat(coordinate[1]);
        return coordinate;
    };

    /*
     * 百度坐标系 (BD-09) 与 火星坐标系 (GCJ-02)的转换
     * 即 百度 转 谷歌、高德
     * @param coordinate 百度经纬度坐标
     * @returns {coordinate} 国测局经纬度坐标
     */
    var _bd09ToGcj02Jw = function(coordinate) {
        var x_pi = 3.14159265358979324 * 3000.0 / 180.0;
        var x = coordinate[0] - 0.0065;
        var y = coordinate[1] - 0.006;
        var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * xpi);
        var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * xpi);
        var gg_lng = z * Math.cos(theta);
        var gg_lat = z * Math.sin(theta);
        return [gg_lng, gg_lat]
    };

    /*
     * 火星坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的转换
     * 即谷歌、高德 转 百度
     * @param coordinate 国测局经纬度坐标
     * @returns {coordinate} 百度经纬度坐标
     */
    var _gcj02JwToBd09 = function(coordinate) {
        var z = Math.sqrt(coordinate[0] * coordinate[0] + coordinate[1] * coordinate[1]) + 0.00002 * Math.sin(coordinate[1] * xpi);
        var theta = Math.atan2(coordinate[1], coordinate[0]) + 0.000003 * Math.cos(coordinate[0] * xpi);
        var bd_lng = z * Math.cos(theta) + 0.0065;
        var bd_lat = z * Math.sin(theta) + 0.006;
        return [bd_lng, bd_lat]
    };

    var _notrans = function(coordinate){
        return coordinate;
    };

    /*
     * 百度经纬度坐标转百度墨卡托
     */
    var _baiduToMc = function(coordinate) {
        var arr = null;
        var n_lat = coordinate[1] > 74 ? 74 : coordinate[1];
        n_lat = n_lat < -74 ? -74 : n_lat;
        for (var i = 0; i < transBaiduToMc1.length; i++)
        {
            if (coordinate[1] >= transBaiduToMc1[i])
            {
                arr = transBaiduToMc2[i];
                break;
            }
        }
        if (arr == null)
        {
            for (var i = transBaiduToMc1.length - 1; i >= 0; i--)
            {
                if (coordinate[1] <= -transBaiduToMc1[i])
                {
                    arr = transBaiduToMc2[i];
                    break;
                }
            }
        }
        return _baiduConvert(coordinate, arr);
    };

    /*
     * 百度墨卡托坐标转百度
     */
    var _mcToBaiduJw = function(coordinate) {
        var arr = null;
        for (var i = 0; i < transMcToBaidu1.length; i++)
        {
            if (coordinate[1] >= transMcToBaidu1[i])
            {
                arr = transMcToBaidu2[i];
                break;
            }
        }
        return _baiduConvert(coordinate, arr);
    };

    ///////////////////////////////////////////////////////////////////////////////////////
    /*
     * EPSG:4326 -> GCJ02:4326
     * @private
     */
    var _wgs84ToGcj02Jw = function(coordinate){
        if (_outOfChina(coordinate)) {
            return coordinate;
        } else {
            var dlat = _transformLat(coordinate[0] - 105.0, coordinate[1] - 35.0);
            var dlng = _transformLng(coordinate[0] - 105.0, coordinate[1] - 35.0);
            var radlat = coordinate[1] / 180.0 * PI;
            var magic = Math.sin(radlat);
            magic = 1 - ee * magic * magic;
            var sqrtmagic = Math.sqrt(magic);
            dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
            dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI);
            var mglat = coordinate[1] + dlat;
            var mglng = coordinate[0] + dlng;
            return [mglng, mglat]
        }
    };
    this.wgs84ToGcj02Jw = _wgs84ToGcj02Jw;

    /*
     * GCJ02:4326 -> EPSG:4326
     * @private
     */
    var _gcj02JwToWgs84 = function(coordinate){
        if (_outOfChina(coordinate)) {
            return coordinate;
        } else {
            var dlat = _transformLat(coordinate[0] - 105.0, coordinate[1] - 35.0);
            var dlng = _transformLng(coordinate[0] - 105.0, coordinate[1] - 35.0);
            var radlat = coordinate[1] / 180.0 * PI;
            var magic = Math.sin(radlat);
            magic = 1 - ee * magic * magic;
            var sqrtmagic = Math.sqrt(magic);
            dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
            dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI);
            var mglat = coordinate[1] + dlat;
            var mglng = coordinate[0] + dlng;
            return [coordinate[0] * 2 - mglng, coordinate[1] * 2 - mglat]
        }
    };
    this.gcj02JwToWgs84 = _gcj02JwToWgs84;

    /*
     *  EPSG:4326 -> GCJ02:3857
     * @private
     */
    var _wgs84ToGcj02Mc = function(coordinate){
        var tcoord = _wgs84ToGcj02Jw(coordinate);
        tcoord = ol.proj.transform(tcoord, 'EPSG:4326', 'EPSG:3857');
        return tcoord;
    };
    this.wgs84ToGcj02Mc = _wgs84ToGcj02Mc;

    /*
     *  GCJ02:3857 -> EPSG:4326
     * @private
     */
    var _gcj02McToWgs84 = function(coordinate){
        var tcoord = ol.proj.transform(coordinate, 'EPSG:3857', 'EPSG:4326');
        tcoord = _gcj02JwToWgs84(tcoord);
        return tcoord;
    };
    this.gcj02McToWgs84 = _gcj02McToWgs84;

    /*
     *  EPSG:4326 -> SOUGOU:3857
     * @private
     */
    var _wgs84ToSougouMc = function(coordinate){
        var x = coordinate[0];
        var y = coordinate[1];
        var arr = [];
        for(var i = 0;i<trans84ToSougouParams1.length;i++){
            if(y>=trans84ToSougouParams1[i])
            {
                arr = trans84ToSougouParams2[i];
                break;
            }
        }

        var x0 = arr[0] + arr[1]*Math.abs(x);
        var f = Number(Math.abs(y)/arr[9]);
        var y0 = arr[2] + arr[3]*f+ arr[4]*f*f + arr[5]*f*f*f + arr[6]*f*f*f*f + arr[7]*f*f*f*f*f + arr[8]*f*f*f*f*f*f;
        x0 *= (x<0 ? -1:1);
        y0 *= (y<0 ? -1:1);
        return [x0,y0];
    };
    this.wgs84ToSougouMc = _wgs84ToSougouMc;

    /*
     * SOUGOU:3857 -> EPSG:4326
     * @private
     */
    var _sougouMcToWgs84 = function(coordinate){
        var x = coordinate[0];
        var y = coordinate[1];
        var arr = [];
        for (var i = 0; i < transSougouTo84Param1.length; i++){
            if (y > transSougouTo84Param1[i])
            {
                arr = transSougouTo84Param2[i];
                break;
            }
        }

        var x0 = arr[0] + arr[1] * Math.abs(x);
        var f = Number(Math.abs(y)/arr[9]);
        var y0 = arr[2] + arr[3]*f+ arr[4]*f*f + arr[5]*f*f*f + arr[6]*f*f*f*f + arr[7]*f*f*f*f*f + arr[8]*f*f*f*f*f*f;
        x0 *= (x<0 ? -1:1);
        y0 *= (y<0 ? -1:1);

        return [x0,y0];
    };
    this.sougouMcToWgs84 = _sougouMcToWgs84;

    /*
     * EPSG:4326 -> SOUGOU:4326
     * @private
     */
    var _wgs84ToSougouJw = function(coordinate){
        var tcoord = _wgs84ToSougouMc(coordinate);
        tcoord = ol.proj.transform(tcoord, 'EPSG:3857', 'EPSG:4326');
        return tcoord;
    };
    this.wgs84ToSougouJw = _wgs84ToSougouJw;

    /*
     * SOUGOU:4326 -> EPSG:4326
     * @private
     */
    var _sougouJwToWgs84 = function(coordinate){
        var tcoord = ol.proj.transform(coordinate, 'EPSG:4326', 'EPSG:3857');
        tcoord = _sougouMcToWgs84(tcoord);
        return tcoord;
    };
    this.sougouJwToWgs84 = _sougouJwToWgs84;

    /*
     * EPSG:4326 -> BAIDU:3857
     * @private
     */
    var _wgs84ToBaiduMc = function(coordinate){
        // wgs84坐标转国测局坐标
        var tcoord = _wgs84ToGcj02Jw(coordinate);
        // 国测局坐标转百度经纬度
        tcoord = _gcj02JwToBd09(tcoord);
        // 百度经纬度坐标转百度墨卡托坐标
        tcoord = _baiduToMc(tcoord);
        return tcoord;
    };
    this.wgs84ToBaiduMc = _wgs84ToBaiduMc;

    /*
     * BAIDU:3857 -> EPSG:4326
     * @private
     */
    var _baiduMcToWgs84 = function(coordinate){
        var tcoord = _mcToBaiduJw(coordinate);
        tcoord = _bd09ToGcj02Jw(tcoord);
        tcoord = _gcj02JwToWgs84(tcoord);
        return tcoord;
    };
    this.baiduMcToWgs84 = _baiduMcToWgs84;

    /*
     * EPSG:4326 -> BAIDU:4326
     * @private
     */
    var _wgs84ToBaiduJw = function(coordinate){
        // wgs84坐标转国测局坐标
        var tcoord = _wgs84ToGcj02Jw(coordinate);
        // 国测局坐标转百度经纬度
        tcoord = _gcj02JwToBd09(tcoord);
        return tcoord;
    };
    this.wgs84ToBaiduJw = _wgs84ToBaiduJw;

    /*
     * BAIDU:4326 -> EPSG:4326
     * @private
     */
    var _baiduJwToWgs84 = function(coordinate){
        var tcoord = _bd09ToGcj02Jw(coordinate);
        tcoord = _gcj02JwToWgs84(tcoord);
        return tcoord;
    };
    this.baiduJwToWgs84 = _baiduJwToWgs84;

    /*
     * GCJ02:3857 -> SOUGOU:3857
     * @private
     */
    var _gcj02McToSougouMc = function(coordinate){
        var tcoord = ol.proj.transform(coordinate, 'EPSG:3857', 'EPSG:4326');
        tcoord = _gcj02JwToWgs84(tcoord);
        tcoord = _wgs84ToSougouMc(tcoord);
        return tcoord;
    };
    this.gcj02McToSougouMc = _gcj02McToSougouMc;

    /*
     * SOUGOU:3857 -> GCJ02:3857
     * @private
     */
    var _sougouMcToGcj02Mc = function(coordinate){
        var tcoord = _sougouMcToWgs84(coordinate);
        tcoord = _wgs84ToGcj02Mc(tcoord);
        return tcoord;
    };
    this.sougouMcToGcj02Mc = _sougouMcToGcj02Mc;

    /*
     * GCJ02:3857 -> BAIDU:3857
     * @private
     */
    var _gcj02McToBaiduMc = function(coordinate){
        var tcoord = ol.proj.transform(coordinate, 'EPSG:3857', 'EPSG:4326');
        tcoord = _gcj02JwToBd09(tcoord);
        tcoord = _baiduToMc(tcoord);
        return tcoord;
    };
    this.gcj02McToBaiduMc = _gcj02McToBaiduMc;

    /*
     * BAIDU:3857 -> GCJ02:3857
     * @private
     */
    var _baiduMcToGcj02Mc = function(coordinate){
        var tcoord = _baiduMcToWgs84(coordinate);
        tcoord = _wgs84ToGcj02Mc(tcoord);
        return tcoord;
    };
    this.baiduMcToGcj02Mc = _baiduMcToGcj02Mc;

    /*
     * SOUGOU:3857 -> BAIDU:3857
     * @private
     */
    var _sougouMcToBaiduMc = function(coordinate){
        var tcoord = _sougouMcToWgs84(coordinate);
        tcoord = _wgs84ToBaiduMc(tcoord);
        return tcoord;
    };
    this.sougouMcToBaiduMc = _sougouMcToBaiduMc;

    /*
     * BAIDU:3857 -> SOUGOU:3857
     * @private
     */
    var _baiduMcToSougouMc = function(coordinate){
        var tcoord = _baiduMcToWgs84(coordinate);
        tcoord = _wgs84ToSougouMc(tcoord);
        return tcoord;
    };
    this.baiduMcToSougouMc = _baiduMcToSougouMc;

    /*
     * 获取任意两个坐标系间的转换函数，都是构造一个函数，函数内部先将原作标转成84坐标，在将84坐标转成目标坐标
     * 这样我们就不需要人为地定义 N阶乘个函数，而只用定义2N个函数，然后任意两个坐标系间的转换函数动态构造
     * 即A坐标系与B坐标系的正向反向转换过程分别是
     * A->84->B
     * B->84->A
     */
    var _transform = function(coordinate,sourceProj,targetProj){
        if(typeof sourceProj == "string"){
            sourceProj=sourceProj.toUpperCase();
            sourceProj=_self._projNameMap[sourceProj]||sourceProj;
        }
        if(typeof targetProj == "string"){
            targetProj=targetProj.toUpperCase();
            targetProj=_self._projNameMap[targetProj]||targetProj;
        }
/*        // WGS84坐标系是EPSG4326坐标系的别名
        sourceProj = sourceProj=='WGS:84'? 'EPSG:4326' : sourceProj;
        targetProj = sourceProj=='WGS:84'? 'EPSG:4326' : targetProj;*/
        // 如果源或目标是84坐标系，直接转
        if(sourceProj=='EPSG:4326' || targetProj=='EPSG:4326'){
            result = ol.proj.transform(coordinate, sourceProj, targetProj);
        }
        // 如果不是，把84坐标系作为中介坐标系进行转换
        else{
            result = ol.proj.transform(coordinate, sourceProj, 'EPSG:4326');
            result = ol.proj.transform(result,'EPSG:4326', targetProj);
        }
        return result;
    };
    /**
     * 坐标转换
     * @param coordinate{Array} 传入坐标或者坐标集合
     * @param sourceProj {string} 原坐标系名称
     * @param targetProj {string} 目标坐标系名称
     * */
    this.transform = function(coordinate,sourceProj,targetProj){
        if(coordinate instanceof Array&&coordinate[0] instanceof Array){
            var cs = new Array();
            for(var i=0; i<coordinate.length; i++){
                var ocoordinate = coordinate[i];
                var tcoordinate = _transform(ocoordinate,sourceProj,targetProj);
                cs.push(tcoordinate);
            }
            return cs;
        }else{
            return _transform(coordinate,sourceProj,targetProj);
        }
    };

    /**
     * 边界转换函数
     * @param extent {Array} 传入边界[x1,y1,x2,y2]
     * @param sourceProj {string} 原坐标系名称
     * @param targetProj {string} 目标坐标系名称
     */
    /*不调用openlayers原生的，把矩形坐标值拆分成两个对角坐标来转换*/
    this.transformExtent = function(extent, sourceProj, targetProj){
        var spMin = [extent[0], extent[1]];
        var spMax = [extent[2], extent[3]];
        var tpMin = _transform(spMin, sourceProj, targetProj);
        var tpMax = _transform(spMax, sourceProj, targetProj);
        return [tpMin[0], tpMin[1], tpMax[0], tpMax[1]];
    };

    this.transDistance = function(distance, sourceProj, targetProj){
        var sourceCoord = [distance, 0];
        var targetCoord = ol.proj.transform(sourceCoord, sourceProj, targetProj);
        return targetCoord[0];
    };

    this.transformCoordinate = function(coordinates, sourceProj, targetProj){
        if(coordinates instanceof Array){
            var result = new Array();
            for(var i=0; i<coordinates.length; i++){
                var tcoord = ol.proj.transform(coordinates[i], sourceProj, targetProj);
                result.push(tcoord);
            }
            return result;
        }else{
            return ol.proj.transform(coordinates, sourceProj, targetProj);
        }
    };

    /*
     * 展开坐标数组，拼接字符串
     * @param array [[x,y],[x,y],[x,y]]
     */
    this.coordsConcat=function(coordArr, char){
        char = char?char:',';
        var tmpArr=[];
        coordArr.forEach(function(coord){
            tmpArr.push(coord[0]);
            tmpArr.push(coord[1]);
        });
        return tmpArr.join(char);
    };

    var self = this;

    /*
     * Jw-经纬度后缀
     * Mc-墨卡拓后缀
     */
    this._registInnerProjs = function(){

        // 注册像素坐标系
        // ol.proj.addProjection(new ol.proj.Projection({code: 'pixel', units: 'pixels'}));
        // 注册WGS84坐标(等同EPSG:4326，已经存在)

        // 注册国测局坐标系
        ol.proj.addProjection(new ol.proj.Projection({code: 'GCJ02:4326'}));
        ol.proj.addProjection(new ol.proj.Projection({code: 'GCJ02:3857'}));
        ol.proj.addCoordinateTransforms('EPSG:4326', 'GCJ02:4326', self.wgs84ToGcj02Jw, self.gcj02JwToWgs84);
        ol.proj.addCoordinateTransforms('EPSG:4326', 'GCJ02:3857', self.wgs84ToGcj02Mc, self.gcj02McToWgs84);

        // 注册搜狗坐标系
        ol.proj.addProjection(new ol.proj.Projection({code: 'SOUGOU:3857'}));
        ol.proj.addProjection(new ol.proj.Projection({code: 'SOUGOU:4326'}));
        ol.proj.addCoordinateTransforms('EPSG:4326', 'SOUGOU:3857', self.wgs84ToSougouMc, self.sougouMcToWgs84);
        ol.proj.addCoordinateTransforms('EPSG:4326', 'SOUGOU:4326', self.wgs84ToSougouJw, self.sougouJwToWgs84);

        // 注册百度地图
        ol.proj.addProjection(new ol.proj.Projection({code: 'BAIDU:3857'}));
        ol.proj.addProjection(new ol.proj.Projection({code: 'BAIDU:4326'}));
        ol.proj.addCoordinateTransforms('EPSG:4326', 'BAIDU:3857', self.wgs84ToBaiduMc, self.baiduMcToWgs84);
        ol.proj.addCoordinateTransforms('EPSG:4326', 'BAIDU:4326', self.wgs84ToBaiduJw, self.baiduJwToWgs84);

        // GCJ02:3857 <-> SOUGOU:3857
        ol.proj.addCoordinateTransforms('GCJ02:3857', 'SOUGOU:3857', self.gcj02McToSougouMc, self.sougouMcToGcj02Mc);
        // GCJ02:3857 <-> SOUGOU:4326
        //ol.proj.addCoordinateTransforms('GCJ02:3857', 'SOUGOU:4326', self.gcj02McToSougouJw, self.sougouJwToGcj02Mc);
        // GCJ02:4326 <-> SOUGOU:4326
        //ol.proj.addCoordinateTransforms('GCJ02:4326', 'SOUGOU:4326', self.gcj02JwToSougouJw, self.sougouJwToGcj02Jw);
        // GCJ02:4326 <-> SOUGOU:3857
        //ol.proj.addCoordinateTransforms('GCJ02:4326', 'SOUGOU:3857', self.gcj02JwToSougouMc, self.sougouMcToGcj02Jw);

        // GCJ02:3857 <-> BAIDU:3857
        ol.proj.addCoordinateTransforms('GCJ02:3857', 'BAIDU:3857', self.gcj02McToBaiduMc, self.baiduMcToGcj02Mc);
        // GCJ02:3857 <-> BAIDU:4326
        //ol.proj.addCoordinateTransforms('GCJ02:3857', 'BAIDU:4326', self.gcj02McToBaiduJw, self.baiduJwToGcj02Mc);
        // GCJ02:4326 <-> BAIDU:4326
        //ol.proj.addCoordinateTransforms('GCJ02:4326', 'BAIDU:4326', self.gcj02JwToBaiduJw, self.baiduJwToGcj02Jw);
        // GCJ02:4326 <-> BAIDU:3857
        //ol.proj.addCoordinateTransforms('GCJ02:4326', 'BAIDU:3857', self.gcj02JwToBaiduMc, self.baiduMcToGcj02Jw);

        // SOUGOU:3857 <-> BAIDU:3857
        ol.proj.addCoordinateTransforms('SOUGOU:3857', 'BAIDU:3857', self.sougouMcToBaiduMc, self.baiduMcToSougouMc);
        // SOUGOU:3857 <-> BAIDU:4326
        //ol.proj.addCoordinateTransforms('SOUGOU:3857', 'BAIDU:4326', self.sougouMcToBaiduJw, self.baiduJwToSougouMc);
        // SOUGOU:4326 <-> BAIDU:4326
        //ol.proj.addCoordinateTransforms('SOUGOU:4326', 'BAIDU:4326', self.sougouJwToBaiduJw, self.baiduJwToSougouJw);
        // SOUGOU:4326 <-> BAIDU:3857
        //ol.proj.addCoordinateTransforms('SOUGOU:4326', 'BAIDU:3857', self.sougouJwToBaiduMc, self.baiduMcToSougouJw);

        // 高德地图、谷歌地图、腾讯地图、arcgis地图、必应地图都使用'GCJ02:3857'坐标系，不需再注册
        // PGIS、天地图使用'EPSG:4326'坐标系,不需再注册
        // OSM使用'EPSG:3857'坐标系,不需再注册
    };
    /**
     * 添加一个坐标系
     * @param code {string}
     * @param sourceToDest {function} 原坐标转目标坐标函数
     * @param destToSource {function} 目标坐标转原坐标函数
     * */
    this.addProjection = function(code,sourceToDest,destToSource){
        code=code.toUpperCase();
        ol.proj.addProjection(new ol.proj.Projection({code:code}));
        ol.proj.addCoordinateTransforms('EPSG:4326',code,sourceToDest,destToSource);
    };
    /**
     *添加一个坐标系别名
     * @param projAlias {string} 坐标系别名
     * @param realProjName {string} 实际坐标系名称
     * */
    this.addProjectionAlias=function(projAlias,realProjName){
        projAlias=projAlias.toUpperCase();
        realProjLike=realProjName.toUpperCase();
        this._projNameMap[projAlias]=realProjName;
    };
    this._registInnerProjs();

    return this;
}
var fc=fc||{};
fc.proj=new _UtilProj();
