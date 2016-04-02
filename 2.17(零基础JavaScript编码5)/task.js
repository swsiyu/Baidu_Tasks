/* 数据格式演示
var aqiSourceData = {
  "北京": {
    "2016-01-01": 10,
    "2016-01-02": 10,
    "2016-01-03": 10,
    "2016-01-04": 10
  }
};
*/

// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
  var y = dat.getFullYear();
  var m = dat.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  var d = dat.getDate();
  d = d < 10 ? '0' + d : d;
  return y + '-' + m + '-' + d;
}

function randomBuildData(seed) {
  var returnData = {};
  var dat = new Date("2016-01-01");
  var datStr = ''
  for (var i = 1; i < 92; i++) {
    datStr = getDateStr(dat);
    returnData[datStr] = Math.ceil(Math.random() * seed);
    dat.setDate(dat.getDate() + 1);
  }
  return returnData;
}

var aqiSourceData = {
  "北京": randomBuildData(500),
  "上海": randomBuildData(300),
  "广州": randomBuildData(200),
  "深圳": randomBuildData(100),
  "成都": randomBuildData(300),
  "西安": randomBuildData(500),
  "福州": randomBuildData(100),
  "厦门": randomBuildData(100),
  "沈阳": randomBuildData(500)
};
var city=['北京','上海','广州','深圳','成都','西安','福州','厦门','沈阳']
// console.log(aqiSourceData);
function getObj(id) {
  return document.getElementById(id);
}

function getColor() {
  while (1) {
    var num = Math.floor(Math.random() * 256);
    if (num > 220)
      continue;
    return num.toString();
  }
}

var color=["#C76114","#4169E1","#C0C0C0","#FF6100","#F00","#0F0","#00F","#A020F0","#0B1746","#B0E0E6"]

window.onload = function() {

  // 用于渲染图表的数据
  var chartData = {};

  // 记录当前页面的表单选项
  var pageState = {
    nowSelectCity: -1,
    nowGraTime: "day"
  }

  /**
   * 渲染图表
   */
  function renderChart() {
    console.log(pageState)
    var data=chartData[city[pageState.nowSelectCity]][pageState.nowGraTime];
    console.log(data);
    getObj("res").innerHTML="";
    var css=window.getComputedStyle(getObj("res"));
    var width=parseInt(css.width)/data.count;
    console.log(width);
    var reversedata = Object.getOwnPropertyNames(data).reverse();
    console.log(reversedata);
    for(var i in reversedata){
      if(reversedata[i]=="count") continue;
      var o = document.createElement("div");
      o.title=reversedata[i]+":"+data[reversedata[i]];
      o.style.width=width+"px";
      o.style.height=data[reversedata[i]]+"px";
      if(pageState.nowGraTime=="week"){
        o.style.height=data[reversedata[i]]/5+"px";
        o.title="第"+reversedata[i]+"周："+data[reversedata[i]];
      }
      if(pageState.nowGraTime=="month"){
        o.style.height=data[reversedata[i]]/20+"px";
        o.title=reversedata[i]+"月："+data[reversedata[i]];
      }
      o.style.float="left";
      // o.style.float="left";
      o.style.backgroundColor=color[i%10];
      getObj("res").appendChild(o);
    }
  }

  /**
   * 日、周、月的radio事件点击时的处理函数
   */
  function graTimeChange(e) {
    // 确定是否选项发生了变化 
   
    // 设置对应数据
    var value=e.target.attributes["value"]["nodeValue"];
    pageState.nowGraTime=value;
    // 调用图表渲染函数
     renderChart();
  }

  /**
   * select发生变化时的处理函数
   */
  function citySelectChange() {
    // 确定是否选项发生了变化 
     var obj = getObj("city-select");
     // var index = obj.selectedIndex;
     // var text = obj.options[index].text;
    // 设置对应数据
     // var data=chartData[text];

     pageState.nowSelectCity=obj.selectedIndex;
    // 调用图表渲染函数
      renderChart();
  }

  /**
   * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
   */
  function initGraTimeForm() {
      var obj=document.getElementsByName("gra-time");
      obj[0].checked="checked";
      for(var i=0;i<obj.length;i++){ obj[i].addEventListener("click",graTimeChange);}
  }

  /**
   * 初始化城市Select下拉选择框中的选项
   */
  function initCitySelector() {
    // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
    var cityContainer = getObj("city-select");
    cityContainer.innerHTML = '';
    city = Object.getOwnPropertyNames(aqiSourceData);
    for (var i in city) {
      var option = document.createElement("option");
      option.innerHTML = city[i];

      cityContainer.appendChild(option);
    }
    pageState.nowSelectCity=cityContainer.selectedIndex;
    // 给select设置事件，当选项发生变化时调用函数citySelectChange
    cityContainer.addEventListener("change", citySelectChange);
  }

  /**
   * 初始化图表需要的数据格式
   */
  function initAqiChartData() {
    // 将原始的源数据处理成图表需要的数据格式
    // 处理好的数据存到 chartData 中

    for (var city in aqiSourceData) {
      var day = {};
      var week = {};
      var month = {};
      day.count = week.count = month.count = 0;
      for (var i in aqiSourceData[city]) {
           day.count++;    
        var m = parseInt(i.split("-")[1]);
        if (!month[m]) {
          month[m] = 0;
        }
        month[m] += aqiSourceData[city][i];
        month.count = m;

        day[day.count] = aqiSourceData[city][i];
         if((day.count-1)==0) week.count++;
         if ((day.count-1)!=0 && (day.count-1) % 7 == 0) {
           week.count++;
        }

        if (!week[week.count]) week[week.count] = 0;
        week[week.count] += aqiSourceData[city][i];
   
      }
      chartData[city]={};
      aqiSourceData[city].count=day.count;
      chartData[city].day = aqiSourceData[city];
      chartData[city].week = week;
      chartData[city].month = month;
    }
    

    console.log(chartData);


  }

  /**
   * 初始化函数
   */
  function init() {
    initGraTimeForm()
    initCitySelector();
    initAqiChartData();
    renderChart();
  }

  init();

};