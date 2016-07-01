/**
 * Created by zouwenyun on 2016/6/30.
 */

var btn_1 = document.getElementById("addMarker");

var clickInfo = document.getElementById("clickInfo");
var dragInfo = document.getElementById("dragInfo");

//��ע������
var markerArr = [{title:"�������",content:"���������¥",point:"121.447895|31.030189",isOpen:0,icon:{w:21,h:21,l:0,t:0,x:6,lb:5}},
    {title:"ʵ����",content:"���ѧԺ",point:"121.449099|31.029295",isOpen:0,icon:{w:21,h:21,l:0,t:0,x:6,lb:5}}
];
//��ע������
var polylinePoints = [{style:"solid",weight:3,color:"#f00",opacity:0.6,points:["121.447899|31.030185","121.448789|31.029999","121.446552|31.029319","121.447154|31.027957","121.448205|31.028274","121.448205|31.028321","121.449247|31.028731","121.449076|31.029226"]}
];

var ifAddMarker = false;

var markCount = 1;
var driving =null;

btn_1.onclick = function(){
    if(ifAddMarker==true){
        ifAddMarker=false;
        btn_1.value = "������ӱ��";
    }else{
        ifAddMarker=true;
        btn_1.value = "������ӱ��";
    }
};

//�����ͳ�ʼ����ͼ����
function initMap(){
    createMap();//������ͼ
    setMapEvent();//���õ�ͼ�¼�
    addMapControl();//���ͼ��ӿؼ�
    addMarker(markerArr);//���ͼ���marker
    addPolyline(polylinePoints);//���ͼ�����
}

//������ͼ����
function createMap(){
    var map = new BMap.Map("dituContent");//�ڰٶȵ�ͼ�����д�����ͼ
    var point = new BMap.Point(121.448892,31.028955);//����һ�����ĵ�����
    map.centerAndZoom(point,14);//�趨��ͼ�����ĵ�����겢����ͼ��ʾ�ڵ�ͼ������
    window.map = map;//��map�����洢��ȫ��
    driving = new BMap.DrivingRoute(map, {
        renderOptions: {//���ƽ��
            map: map
        }
    });
    driving.setPolicy(BMAP_DRIVING_POLICY_LEAST_DISTANCE);
}

//��ͼ�¼����ú�����
function setMapEvent(){
    map.enableDragging();//���õ�ͼ��ק�¼���Ĭ������(�ɲ�д)
    map.enableScrollWheelZoom();//���õ�ͼ���ַŴ���С
    map.enableDoubleClickZoom();//�������˫���Ŵ�Ĭ������(�ɲ�д)
    map.enableKeyboard();//���ü����������Ҽ��ƶ���ͼ
    map.addEventListener("click", function(e){
        var pos = e.point.lng + "|" + e.point.lat;
        clickInfo.innerHTML = "�����Ϣ�� "+pos;
        if(ifAddMarker==true){//��ע������
            var marker = [{title:"���_"+markCount,content:"ͨ����ҳ�������",point:pos,isOpen:0,icon:{w:21,h:21,l:0,t:0,x:6,lb:5}}];
            addMarker(marker);
            markCount++;
        }
    });
}
//��ͼ�ؼ���Ӻ�����
function addMapControl(){
    //���ͼ��������ſؼ�
    var ctrl_nav = new BMap.NavigationControl({anchor:BMAP_ANCHOR_TOP_LEFT,type:BMAP_NAVIGATION_CONTROL_LARGE});
    map.addControl(ctrl_nav);
    //���ͼ����ӱ����߿ؼ�
    var ctrl_sca = new BMap.ScaleControl({anchor:BMAP_ANCHOR_BOTTOM_LEFT});
    map.addControl(ctrl_sca);
}

//����marker
function addMarker(Arr){
    for(var i=0;i<Arr.length;i++){
        var json = Arr[i];
        var p0 = json.point.split("|")[0];
        var p1 = json.point.split("|")[1];
        var point = new BMap.Point(p0,p1);
        var iconImg = createIcon(json.icon);
        var marker = new BMap.Marker(point,{icon:iconImg});
        marker.enableDragging();
        marker.addEventListener('dragend',function(event){
            dragInfo.innerHTML = "��ҷ��Ϣ "
                +event.point.lng+"|"+event.point.lat;
        });

        var iw = createInfoWindow(Arr,i);
        var label = new BMap.Label(json.title,{"offset":new BMap.Size(json.icon.lb-json.icon.x+10,-20)});
        marker.setLabel(label);
        map.addOverlay(marker);
        label.setStyle({
            borderColor:"#808080",
            color:"#333",
            cursor:"pointer"
        });

        (function(){
            var index = i;
            var _iw = createInfoWindow(Arr,i);
            var _marker = marker;
            _marker.addEventListener("click",function(){
                this.openInfoWindow(_iw);
            });
            _iw.addEventListener("open",function(){
                _marker.getLabel().hide();
            });
            _iw.addEventListener("close",function(){
                _marker.getLabel().show();
            });
            label.addEventListener("click",function(){
                _marker.openInfoWindow(_iw);
            });
            if(!!json.isOpen){
                label.hide();
                _marker.openInfoWindow(_iw);
            }
        })()
    }
}
//����InfoWindow
function createInfoWindow(Arr,i){
    var json = Arr[i];
    var iw = new BMap.InfoWindow("<b class='iw_poi_title' title='" + json.title + "'>" + json.title + "</b><div class='iw_poi_content'>"+json.content+"</div>");
    return iw;
}
//����һ��Icon
function createIcon(json){
    var icon = new BMap.Icon("http://app.baidu.com/map/images/us_mk_icon.png", new BMap.Size(json.w,json.h),{imageOffset: new BMap.Size(-json.l,-json.t),infoWindowOffset:new BMap.Size(json.lb+5,1),offset:new BMap.Size(json.x,json.h)})
    return icon;
}

//���ͼ������ߺ���
function addPolyline(plPoints){
    for(var i=0;i<plPoints.length;i++){
        var json = plPoints[i];
        var points = [];
        for(var j=0;j<json.points.length;j++){
            var p1 = json.points[j].split("|")[0];
            var p2 = json.points[j].split("|")[1];
            points.push(new BMap.Point(p1,p2));
        }
        var line = new BMap.Polyline(points,{strokeStyle:json.style,strokeWeight:json.weight,strokeColor:json.color,strokeOpacity:json.opacity});
        map.addOverlay(line);
    }
}

function getRoute(pointStart,pointEnd) {
    driving.clearResults();
    driving.search(pointStart, pointEnd);
}

initMap();//�����ͳ�ʼ����ͼ