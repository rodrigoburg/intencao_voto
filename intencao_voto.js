function desenha_pesquisas() {
    intencao_voto();
    media_edados();
}

function intencao_voto() {
    var svg = dimple.newSvg("#todos_institutos", 850, 500);
      d3.csv("https://s3-sa-east-1.amazonaws.com/blogedados/javascripts/intencao_votos/todos_institutos.csv", function (data) {
        var myChart = new dimple.chart(svg, data);
        myChart.setBounds(60, 30, 615, 405);
        var x = myChart.addTimeAxis("x", "data","%Y-%m-%d","%d/%m");
        x.title = ""
        
        myChart.addMeasureAxis("y", "valor");
        
        series = myChart.addSeries("candidato", dimple.plot.line);
        series.lineMarkers = true;
        
        myChart.assignColor("Aécio Neves","#1C4587");
        myChart.assignColor("Dilma Rousseff","#CC0000");
        myChart.assignColor("Eduardo Campos","#E69138");
        myChart.assignColor("Pastor Everaldo","#6AA84F");
        myChart.assignColor("Outros","#2E2B2D");
        
        myChart = arruma_tooltip(myChart,"todos")
        
        //arruma ordem da legenda
        legenda = myChart.addLegend(700, 10, 50, 400, "left");
        legenda._getEntries = function () {
           return arruma_legenda(myChart)
        }
    
        myChart.draw();
        
        //translada labels do eixo x
        x.shapes.selectAll("text").attr("transform",
            function (d) {
              return d3.select(this).attr("transform") + " translate(0, 15) rotate(-60)";
            });
        
        //muda tamanho do texto
        jQuery("#todos_institutos").find("text").css({"font-size":"12px"})
        
        //muda bolinhas pra preto
        jQuery("#todos_institutos").find("circle").each(function (){
            var date = new Date(this.id.split("_")[1])
            var month = (1 + date.getMonth()).toString();
            month = month.length > 1 ? month : '0' + month;
            var day = date.getDate().toString();
            day = day.length > 1 ? day : '0' + day;
            data_string = "2014-" + month + "-" + day
            
            var instituto = data.filter(function (a) { return a["data"] == data_string})[0]["instituto"]
            
            var candidato = this.id.split("_")[0]
            
            if (["Ibope","Datafolha"].indexOf(instituto) > -1) {
                if (candidato == "Dilma Rousseff") {
                    jQuery(this).attr("fill","#CC0000")                        
                } else if (candidato == "Aécio Neves") {
                    jQuery(this).attr("fill","#1C4587")   
                } else if (candidato == "Eduardo Campos") {
                    jQuery(this).attr("fill","#E69138")   
                } else if (candidato == "Pastor Everaldo") {
                    jQuery(this).attr("fill","#6AA84F")   
                } else {
                    jQuery(this).attr("fill","#2E2B2D")   
                }                
            } 
        })
      });
      
          
}

function media_edados() {
    var svg = dimple.newSvg("#media_edados", 850, 500);
      d3.csv("https://s3-sa-east-1.amazonaws.com/blogedados/javascripts/intencao_votos/media_edados.csv", function (data) {
        var myChart = new dimple.chart(svg, data);
        myChart.setBounds(60, 30, 615, 405);
        var x = myChart.addTimeAxis("x", "data","%Y-%m-%d","%d/%m");
        x.title = ""
        
        myChart.addMeasureAxis("y", "valor");
        
        series = myChart.addSeries("candidato", dimple.plot.line);
        series.lineMarkers = true;
        
        myChart.assignColor("Aécio Neves","#1C4587");
        myChart.assignColor("Dilma Rousseff","#CC0000");
        myChart.assignColor("Eduardo Campos","#E69138");
        myChart.assignColor("Pastor Everaldo","#6AA84F");
        myChart.assignColor("Outros","#2E2B2D");
        
        myChart = arruma_tooltip(myChart,"media")        

        //arruma ordem da legenda
        legenda = myChart.addLegend(700, 10, 50, 400, "left");
        legenda._getEntries = function () {
           return arruma_legenda(myChart)
        }
    
        myChart.draw();
        
        //translada labels do eixo x
        x.shapes.selectAll("text").attr("transform",
            function (d) {
              return d3.select(this).attr("transform") + " translate(0, 15) rotate(-60)";
            });
        
        //muda tamanho do texto
        jQuery("#media_edados").find("text").css({"font-size":"12px"})
        
      });
      
          
}

function arruma_tooltip(chart,qual_dos_dois) {
    chart.series[0].getTooltipText = function (e) {
        
        //pega a data e transforma em string no formato em que os dados estão
        var data = e.xField[0]
        var month = (1 + data.getMonth()).toString();
        month = month.length > 1 ? month : '0' + month;
        var day = data.getDate().toString();
        day = day.length > 1 ? day : '0' + day;
        data_string = "2014-" + month + "-" + day
        
        //se for o gráfico com mais de um instituto
        if (qual_dos_dois == "todos") { 
            
            //pega o nome do instituto a partir dos dados originais do gráfico
            var instituto = chart.data.filter(function (a) { return a["data"] == data_string})[0]["instituto"]
            
            return [
            e.aggField[0]+": "+e.cy,
            "Data: "+day+"/"+month,
            "Instituto: "+instituto
            ];            
        } else { //se for só o da média estadão dados
            return [
            e.aggField[0]+": "+e.cy,
            "Data: "+day+"/"+month,
            ];
        }
        
    };
    return chart;
}

function arruma_legenda(grafico) {
    orderedValues = ["Dilma Rousseff", "Aécio Neves", "Eduardo Campos","Pastor Everaldo","Outros"];
    
    var entries = [];
    orderedValues.forEach(function (v) {
        entries.push(
        {
                key: v,
                fill: grafico.getColor(v).fill,
                stroke: grafico.getColor(v).stroke,
                opacity: grafico.getColor(v).opacity,
                series: grafico.series[0],
                aggField: [v]
            }
        );
    }, this);
    return entries
    
}


