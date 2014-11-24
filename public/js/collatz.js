var I1, I2;

function collatz_step(n) {
	if (n === 1) {return n}
	else if (n%2 === 0) {return n/2}
	else {return 3*n + 1}
}

function stopping_time(n) {
	var i = 0;
	while (n !== 1) {
		i++;
		n = collatz_step(n);
	}
	return i;
}

$(window).load(function() {
	
	var pts = [{x:0,y:5}, {x:1,y:16},{x:2,y:8},{x:3,y:4},{x:4,y:2},{x:5,y:1}];
	var graph1 = new CanvasJS.Chart("graph1", {
		title: {text: "Iterates of n vs. Iteration number", fontColor: "black"},
		axisY: {title: "Iterates of n", titleFontColor: 'black', lineColor: 'black', gridColor: 'black', tickColor: 'black', labelFontColor: 'black'},
		axisX: {title: "Iteration number", titleFontColor: 'black', lineColor: 'black', tickColor: 'black', labelFontColor: 'black'},
		data: [{type: "line", dataPoints: pts, color: 'red'}],
		backgroundColor: ""
	});
	graph1.render();

	var pts2 = [{x:1,y:0}, {x:2,y:1}, {x:3,y:7}, {x:4,y:2}, {x:5,y:5}];
	var graph2 = new CanvasJS.Chart("graph2", {
		title: {text: "Stopping time vs. Initial value", fontColor: 'black'},
		axisY: {title: "Stopping time", titleFontColor: 'black', lineColor: 'black', gridColor: 'black', tickColor: 'black', labelFontColor: 'black'},
		axisX: {title: 'Initial  value', titleFontColor: 'black', lineColor: 'black', tickColor: 'black', labelFontColor: 'black'},
		data: [{type: "scatter", dataPoints: pts2, color: 'red'}],
		backgroundColor: ""
	});
	graph2.render();

	$("#btn-graph1").click(function() {

		$("#itslist").slideUp(400,function() {
			$("#itslist").empty();
		});
		
		while (pts.length>0) {pts.pop();}
		var N = $("#in-graph1").val();
		if (N==='') {N=5}
		N = Math.abs(parseInt(N));

		if (N>0) {
			$("#btn-stopg1").removeAttr('disabled');
			$("#btn-itslist").attr('disabled', 'disabled');
			$("#btn-graph1").attr('disabled', 'disabled')
			var i = 0;
			I1 = setInterval(function() {
				pts.push({x:i, y:N});
				graph1.render();
				if (N === 1) { 
					clearInterval(I1);
					$("#btn-itslist").removeAttr('disabled');
					$("#btn-graph1").removeAttr('disabled');
					$("#btn-stopg1").attr('disabled', 'disabled');
				}
				$("#itslist").append(N+", ");
				i++; N = collatz_step(N);
			},100);
		}
	});
	
	$("#btn-itslist").click(function() {
		$("#itslist").text($("#itslist").text().substring(0,$("#itslist").text().length-2));
		$("#btn-itslist").attr('disabled', 'disabled');
		$("#itslist").slideDown(400);
	});

	$("#btn-graph2").click(function() {
		$("#btn-stopg2").removeAttr('disabled');
		$("#btn-graph2").attr('disabled', 'disabled');

		while (pts2.length > 0) {pts2.pop();}
		var a = $("#in-g2min").val()
		var b = $("#in-g2max").val()
		if (a === '') {a=1}
		if (b === '') {b=100}
		a = Math.abs(parseInt(a)), b = Math.abs(parseInt(b));

		if ((a>0) && (b>a)) {
			var i = a;
			I2 = setInterval(function() {
				pts2.push({x:i, y:stopping_time(i)})
				graph2.render();
				if (i === b) {
					clearInterval(I2);
					$("#btn-graph2").removeAttr('disabled');
					$("#btn-stopg2").attr('disabled', 'disabled');
				}
				i++;
			}, 10);
		}
	});

	$("#btn-stopg1").click(function() {
		clearInterval(I1);
		$("#btn-stopg1").attr('disabled', 'disabled');
	});

	$("#btn-stopg2").click(function() {
		clearInterval(I2);
		$("#btn-stopg2").attr('disabled', 'disabled');
	});


});