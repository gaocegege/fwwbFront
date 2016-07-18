//var blocks = document.getElementById("blocks");
//var routs = [{
//    'id': 'id1',
//    'name': '线路1',
//    'stations': [{
//        'id': 1,
//        'name': '站点1',
//    }, {
//        'id': 2,
//        'name': '站点2',
//    }]
//}
//    , {
//        'id': 2,
//        'name': '线路2',
//        'stations': [{
//            'id': 3,
//            'name': '站点3',
//        }, {
//            'id': 4,
//            'name': '站点4',
//        }]
//    }, {
//        'id': 3,
//        'name': '线路3',
//        'stations': [{
//            'id': 5,
//            'name': '站点5',
//        }, {
//            'id': 6,
//            'name': '站点6',
//        }]
//    }];

//var routs = [{
//    "route": {"id": 1, "name": "route", "time": null, "status": "ok"},
//    "stations": [{
//        "id": 1,
//        "name": "station",
//        "address": "station",
//        "posx": 123,
//        "posy": 123,
//        "time": "2016-07-18T22:16:24.000Z"
//    }]
//}];
//var block_data = [14, 13, 13, 3, 3, 13, 3, 15, 6, 7, 8, 9, 14, 17];
var routes = [];
var COLOR = ["#FF9900", "#333333", "#548C00", "##009933", "#CC0066", "#009999", "#666699", "#FF6600", "#8F4586"];
var stations = [];

//getData();
loadData(routes);

function getData(){
    $.ajax({
        type: 'GET',
        url: 'http://192.168.1.4:3000/users/getRoute',
        //data: {username:$("#username").val(), content:$("#content").val()},
        dataType: 'json',
        async : false,
        success: function (data) {
            routes = data;
        },
        error: function () {
            alert("链接失败");
        }
    });

};

function loadData(routs) {
    for (var i = 0; i < routs.length; i++) {
        for (var j = 0; j < routs[i].stations.length; j++) {
            var row = j + 1;
            var col = i + 1;
            stations.push(routs[i].stations[j]);
            blocks.innerHTML += "<li data-row='" + row + "' data-col='" + col + "' data-sizex='1' data-sizey='1' style='background:" + COLOR[i % COLOR.length] + " '> " + "<span style='display: none' class='id'>" + routs[i].stations[j].id + "</span>" + routs[i].stations[j].name + "</li>";
        }
    }
    render();
}
function render() {
    var gridster;
    $(function () {
        gridster = $(".gridster > ul").gridster({
            widget_margins: [15, 10],
            widget_base_dimensions: [75, 25],
            min_cols: 6
        }).data('gridster');
    });

}
var newRoutes = routes;
function saveRoute() {
    //var lis = $("#blocks li");
    //var liLength = lis.length;
    //alert(liLength);

    for (var i = 0; i < newRoutes.length; i++) {
        newRoutes[i].stations.length = 0;
    }
    var col = 1;
    $("#blocks li").each(function () {

        var data_row = $(this).attr('data-row') - 1;
        var data_col = $(this).attr('data-col') - 1;

        var currentId = $(this).children('span').text();
        for (var j = 0; j < stations.length; j++) {
            if (currentId == stations[j].id) {
                newRoutes[data_col].stations[data_row] = stations[j];
            }
        }
    });
    var postDatas = new Array();
    for(var i=0;i<newRoutes.length;i++){
        var routeId = newRoutes[i].route.id;
        var currentStations = newRoutes[i].stations;
        for(var j=0;j<currentStations.length;j++){
            var data = {"station_id":currentStations[j].id,"route_id":routeId,"index":(j+1)};
            postDatas.push(data);
        }
    }
    var da = JSON.stringify(postDatas);
    $.ajax({
        type: 'POST',
        url: 'http://192.168.1.4:3000/users/changeRoute',
        data: da,
        contentType: "application/json",
        async : false,
        success: function (data) {
            alert(data);
        },
        error: function () {
            alert("wrong");
        }
    });
}