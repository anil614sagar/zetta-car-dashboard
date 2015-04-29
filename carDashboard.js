$(function () {
    $(document).ready(function () {

      // dataPoints
      var dataPoints1 = [];
      var dataPoints2 = [];

      var chart = new CanvasJS.Chart("chartContainer",{
        zoomEnabled: true,
        title: {
          text: "Car Speed & Coolant Temparature"
        },
        toolTip: {
          shared: true

        },
        legend: {
          verticalAlign: "top",
          horizontalAlign: "center",
                                  fontSize: 14,
          fontWeight: "bold",
          fontFamily: "calibri",
          fontColor: "dimGrey"
        },
        axisX: {
          title: "chart updates every 0.5 secs"
        },
        axisY:{
          suffix: '',
          includeZero: false
        },
        data: [{
          // dataSeries1
          type: "line",
          xValueType: "dateTime",
          showInLegend: true,
          name: "Speed",
          dataPoints: dataPoints1
        },
        {
          // dataSeries2
          type: "line",
          xValueType: "dateTime",
          showInLegend: true,
          name: "Coolant Temparature" ,
          dataPoints: dataPoints2
        }],
            legend:{
              cursor:"pointer",
              itemclick : function(e) {
                if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                  e.dataSeries.visible = false;
                }
                else {
                  e.dataSeries.visible = true;
                }
                chart.render();
              }
            }
      });



      var updateInterval = 250;
      // initial value
      var yValue1 = 0;
      var yValue2 = 0;

      var time = new Date;
      time.setHours(time.getHours());
      time.setMinutes(time.getMinutes());
      time.setSeconds(time.getSeconds());
      time.setMilliseconds(time.getMilliseconds());
      // starting at 9.30 am

      var updateChart1 = function (count, speed) {
        count = count || 1;

        // count is number of times loop runs to generate random dataPoints.

        for (var i = 0; i < count; i++) {

          // add interval duration to time
          time.setTime(time.getTime()+ updateInterval);



          // adding random value and rounding it to two digits.
          yValue1 = speed;

          // pushing the new values
          dataPoints1.push({
            x: time.getTime(),
            y: yValue1
          });


        };

        // updating legend text with  updated with y Value
        chart.options.data[0].legendText = " Speed " + yValue1;

        chart.render();

      };

      var updateChart2 = function (count, temp) {
        count = count || 1;

        // count is number of times loop runs to generate random dataPoints.

        for (var i = 0; i < count; i++) {

          // add interval duration to time
          time.setTime(time.getTime()+ updateInterval);



          // adding random value and rounding it to two digits.
          yValue2 = temp;

          // pushing the new values
          dataPoints2.push({
            x: time.getTime(),
            y: yValue2
          });


        };

        // updating legend text with  updated with y Value
        chart.options.data[1].legendText = " Coolant Temp " + yValue2;

        chart.render();

      };


      var speed = new JustGage({
       id: "speed",
       value: 0,
       min: 0,
       max: 150,
       title: "Car Speed",
       label: "Km/hour"
     });

     var rpm = new JustGage({
      id: "rpm",
      value: 0,
      min: 0,
      max: 16000,
      title: "Car RPM",
      label: "Per Minute"
    });

    var temp = new JustGage({
     id: "temp",
     value: 0,
     min: -40,
     max: 215,
     title: "Car Coolant Temparature",
     label: "Celsius"
   });

   var serverUrl = "getStreamUrl.php";
   var wsUrl = 'ws://example.com:3000/servers/Anil-Car/events?topic=obd2/';
   var speedUrl = '';
   var rpmUrl = '';
   var tempUrl = '';
   $.getJSON( serverUrl, function( data ) {
     speedUrl = wsUrl + data.entities[0].properties.id + "/speed";
     rpmUrl = wsUrl + data.entities[0].properties.id + "/rpm";
     tempUrl = wsUrl + data.entities[0].properties.id + "/temp";
   });


    function getCarSpeed() {
      if ("WebSocket" in window && speedUrl)
      {
         // Let us open a web socket
         var ws = new WebSocket(speedUrl);

         ws.onmessage = function (evt)
         {
             var car = JSON.parse(evt.data);
             speed.refresh(car.data);
             updateChart1(1, car.data);
         };
         ws.onclose = function()
         {
            // websocket is closed.
            //console.log("Connection is closed...");
         };
      }
      else
      {
         //console.log("WebSocket NOT supported by your Browser!");
      }
    }
    function getCarRpm() {
      if ("WebSocket" in window && rpmUrl)
      {
         // Let us open a web socket
         var ws = new WebSocket(rpmUrl);

         ws.onmessage = function (evt)
         {
             var car = JSON.parse(evt.data);
             rpm.refresh(car.data);
         };
         ws.onclose = function()
         {
            // websocket is closed.
            //console.log("Connection is closed...");
         };
      }
      else
      {
         //console.log("WebSocket NOT supported by your Browser!");
      }
    }
    function getCarTemp() {
      if ("WebSocket" in window && tempUrl)
      {
         // Let us open a web socket
         var ws = new WebSocket(tempUrl);

         ws.onmessage = function (evt)
         {
             var car = JSON.parse(evt.data);
             temp.refresh(car.data);
             updateChart2(1, car.data);
         };
         ws.onclose = function()
         {
            // websocket is closed.
            //console.log("Connection is closed...");
         };
      }
      else
      {
         //console.log("WebSocket NOT supported by your Browser!");
      }
    }
    setInterval(function(){ getCarSpeed(); getCarRpm(); getCarTemp(); }, 250);
  });
});
