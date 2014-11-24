euler_step = function(h,t0,v0,F) {

	if (typeof v0 === 'number') {v0 = [v0];}
	if (typeof F === 'function') {F = [F];}

	var result = F.map(function(f) { //evaluates x'(t0,x0,...), y'(t0,x0,...)
		var args = [t0].concat(v0);
		return f.apply(null, args);
	}).map(function(n, i) { //evaluates v0 + h*v'(t0,x0,...)
		return v0[i] + h*v0[i];
	});
	return [t0+h].concat(result);
}


rk4_step = function(h,t0,v0,F) {
	var k1 = F.map(function(f) {
		return f.apply(null, [t0].concat(v0));
	});

	var k2_v0 = v0.map(function(v,i) {
		//adds (h/2)*k1 to each element of v0, required for k2
		return v + (h/2)*k1[i];
	});

	var k2 = F.map(function(f) {
		return f.apply(null, [t0+h/2].concat(k2_v0));
	});

	var k3_v0 = v0.map(function(v, i) {
		//adds (h/2)*k2 to each element of v0, required for k3
		return v + (h/2)*k2[i];
	});

	var k3 = F.map(function(f) {
		return f.apply(null, [t0+h/2].concat(k3_v0));
	});

	var k4_v0 = v0.map(function(v,i) {
		//adds h*k3 to each element of v0, required for k4
		return v + h*k3[i];
	});

	var k4 = F.map(function(f) {
		return f.apply(null, [t0+h].concat(k4_v0));
	});

	var result = v0.map(function(v,i) {
		return v0[i] + (h/6)*(k1[i] + 2*k2[i] + 2*k3[i] + k4[i]);
	});

	return [t0+h].concat(result); //returns [t1,x1,y1,...]
}


ode_solver = function(t0,tf,N,v0,f,stepper) {
	//t0 = start point, tf = endpoint, N = # of steps, v0 = [x0,y0,...], f = [x', y', ...]
	if (typeof v0 === 'number') {v0 = [v0];}
	if (typeof f === 'function') {f = [f];}
	var h = (tf - t0)/N;
	var result = new Array(N+1);

	result[0] = [t0].concat(v0);
	for (var i=1; i<N+1; i++) {
		var v_i = result[i-1];		
		result[i] = solvers[stepper](h, v_i[0], v_i.slice(1,v_i.length), f);
	}
	return result; //need to transpose this
}

solvers = {euler: euler_step, rk4: rk4_step};
var sigma, rho, beta;
var I;

f1 = function(t,x,y,z) {
	return sigma*(y - x);
}

f2 = function(t,x,y,z) {
	return (x*(rho - z) - y);
}

f3 = function(t,x,y,z) {
	return (x*y - beta*z);
}

$(window).load(function() {

	$(".navbar-btn").click(function() {
		var new_id = $(this).attr('id').replace('btn-', '');
		var active_id = $('.navbar-btn-active').attr('id').replace('btn-', '');

		$("#"+active_id).fadeOut(400, function() {
			//make current sec fade out
			$(".navbar-btn").each(function() {
				$(this).attr('disabled', 'disabled'); //disable all buttons so the mainframe doesn't kerplode
			});

			$("#"+new_id).fadeIn(400, function() {
				//make new sec fade in
				$('#btn-'+active_id).removeClass('navbar-btn-active'); 
				$("#btn-"+new_id).addClass('navbar-btn-active');
				$(".navbar-btn").each(function() {
					$(this).removeAttr('disabled');
				})
			});
		});
	});

	//ALL THE MATHY STUFF
	var pts_xy = [],
		pts_xz = [],
		pts_yz = [];

	var graph_width = $('body').width()/2.2;
	var graph_height = graph_width/1.5;

	var graph1 = new CanvasJS.Chart("graph1", {
		height: graph_height, width: graph_width,
		title: {text: "x vs y", fontColor: "#34495E"},
		axisY: {title: "y", titleFontColor: '#34495E', lineColor: '#34495E', gridColor: 'white', tickColor: '#34495E', labelFontColor: '#34495E'},
		axisX: {title: "x", titleFontColor: '#34495E', lineColor: '#34495E', tickColor: '#34495E', labelFontColor: '#34495E'},
		data: [{type: "line", dataPoints: pts_xy, color: 'red'}],
		backgroundColor: ""
	});
	graph1.render();

	var graph2 = new CanvasJS.Chart("graph2", {
		height: graph_height, width: graph_width,
		title: {text: "x vs z", fontColor: "#34495E"},
		axisY: {title: "z", titleFontColor: '#34495E', lineColor: '#34495E', gridColor: 'white', tickColor: '#34495E', labelFontColor: '#34495E'},
		axisX: {title: "x", titleFontColor: '#34495E', lineColor: '#34495E', tickColor: '#34495E', labelFontColor: '#34495E'},
		data: [{type: "line", dataPoints: pts_xz, color: 'red'}],
		backgroundColor: ""
	});
	graph2.render();

	var graph3 = new CanvasJS.Chart("graph3", {
		height: graph_height, width: graph_width,
		title: {text: "y vs z", fontColor: "#34495E"},
		axisY: {title: "z", titleFontColor: '#34495E', lineColor: '#34495E', gridColor: 'white', tickColor: '#34495E', labelFontColor: '#34495E'},
		axisX: {title: "y", titleFontColor: '#34495E', lineColor: '#34495E', tickColor: '#34495E', labelFontColor: '#34495E'},
		data: [{type: "line", dataPoints: pts_yz, color: 'red'}],
		backgroundColor: ""
	});
	graph3.render();

	$("#graph3cont").css('margin-top', graph_height); //cheap workarounds because you know how it be
	$("#app-ics").css('margin-left', $('body').width/2.0);


	$("#btn-graphall").click(function() {
		rho = $("#in-r").val(), sigma = $("#in-sigma").val(), beta = $("#in-b").val();
		var x0 = $("#in-x0").val(), y0 = $("#in-y0").val(), z0 = $("#in-z0").val(),
			t0 = $("#in-t0").val(), tf = $("#in-tf").val(), N = $("#in-N").val(),
			ode = $("#in-ode").val(), speed = $('#in-speed').val();

		$('#btn-graphall').attr('disabled', 'disabled');
		$('#btn-stop').removeAttr('disabled');

		while (pts_xy.length > 0) { pts_xy.pop(); pts_yz.pop(); pts_xz.pop(); }
		//this is gonna be terrible
		if (rho === '') {rho = 28}
		if (sigma === '') {sigma = 10}
		if (beta === '') {beta = 8/3}
		if (x0 === '') {x0 = 10*Math.random() - 5}
		if (y0 === '') {y0 = 10*Math.random() - 5}
		if (z0 === '') {z0 = 10*Math.random() - 5}
		if (t0 === '') {t0 = 0}
		if (tf === '') {tf = 100}
		if (N === '') {N = 10000}
		if ((ode === '') || ((ode !== 'rk4') && (ode !== 'euler'))) {ode = 'rk4';}
		if (speed === '') {speed=10;}

		var F = [f1,f2,f3], h = (tf-t0)/N, v0 = [x0,y0,z0];
		pts_xy.push({x: x0, y: y0}); pts_xz.push({x: x0, z: z0}); pts_yz.push({x: y0, z: z0});
		graph1.render(); graph2.render(); graph3.render();
		var i = 0;
		$("#app-ics").html('x = ' + x0.toString() + '<br>y = ' + y0.toString() + '<br>z = ' + z0.toString());

		I = setInterval(function() {
			//dynamic plotting
			var v1 = solvers[ode](h,t0,v0,F);
			t0 = v1[0], v0 = v1.slice(1,4);
			pts_xy.push({x:v0[0],y:v0[1]});	pts_xz.push({x:v0[0],y:v0[2]});	pts_yz.push({x:v0[1],y:v0[2]});
			graph1.render(); graph2.render(); graph3.render();

			if (i === N) {
				clearInterval(I);
				$('#btn-stop').attr('disabled', 'disabled');
				$('#btn-graphall').removeAttr('disabled');
			}
			i++;

		}, speed);
	});

	$("#btn-stop").click(function() {
		clearInterval(I);
		$('#btn-stop').attr('disabled', 'disabled');
		$('#btn-graphall').removeAttr('disabled');
	});

});