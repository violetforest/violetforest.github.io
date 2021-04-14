// ambient();
// scoredAmbient();
// song();
// interactive();
// physics();
// piano();

var w = window.innerWidth / 2;
var h = window.innerHeight / 2;
var mouseX = Math.random() * 255
var mouseY = Math.random() * 255

updateGradient();

document.addEventListener( 'touchmove', onDocumentTouchMove, false );
document.addEventListener( 'mousemove', onDocumentMouseMove, false );
document.addEventListener( 'touchstart', onDocumentTouchMove, false );

function updateGradient (event) {
	if (event) {
		mouseX = event.clientX;
		mouseY = event.clientY;
	}
  var gradDeg = (mouseX / 5) + 'Deg';
	var gradStart = 'hsl(' + mouseX + ', 100%, 75%)';
  var gradEnd   = 'hsl(' + mouseY + ', 100%, 50%)';

  document.documentElement.style.setProperty('--grad-deg', gradDeg);
  document.documentElement.style.setProperty('--grad-start', gradStart);
  document.documentElement.style.setProperty('--grad-end', gradEnd);
}

document.addEventListener('mousemove', updateGradient);

document.addEventListener('touchstart', function(event) {
	if ( event.touches.length > 1 ) {
		event.preventDefault();

	  var percentX  = event.touches[ 0 ].pageX;
	  var gradDeg = percentX + 'Deg';
	  var gradStart = 'hsl(' + (percentX - w) + ', 100%, 75%)';
	  var gradEnd   = 'hsl(' + (percentX - h) + ', 50%, 50%)';

		document.documentElement.style.setProperty('--grad-deg', gradDeg);
	  document.documentElement.style.setProperty('--grad-start', gradStart)
	  document.documentElement.style.setProperty('--grad-end', gradEnd)
	}
})


document.addEventListener('touchmove', function(event) {
	if ( event.touches.length == 1 ) {
		// event.preventDefault();

	  var percentX  = event.touches[ 0 ].pageX;
	  var gradDeg = percentX + 'Deg';
	  var gradStart = 'hsl(' + (percentX - w) + ', 100%, 75%)';
	  var gradEnd   = 'hsl(' + (percentX - h) + ', 50%, 50%)';

		document.documentElement.style.setProperty('--grad-deg', gradDeg);
	  document.documentElement.style.setProperty('--grad-start', gradStart)
	  document.documentElement.style.setProperty('--grad-end', gradEnd)
	}
})

function onDocumentTouchMove( event ) {
	if ( event.touches.length == 1 ) {
		// event.preventDefault();
	  play();
	  var percentX  = event.touches[ 0 ].pageY / 2;

		function play(percentX) {
			var notes = [ "C", "D", "E", "F" ];
		  var note = notes[Math.floor(Math.random() * notes.length)];
		  var octave = Math.floor(Math.random() * 10);
		  tones.play(note, octave);
		}
	}
}

var timestamp = null;
var lastMouseX = null;
var lastMouseY = null;

function onDocumentMouseMove( event ) {
	event.preventDefault();

	 if (timestamp === null) {
	    timestamp = Date.now();
	    lastMouseX = event.clientX;
	    lastMouseY = event.clientY;
	    return;
	  }

    var now = Date.now();
    var dt =  now - timestamp;
    var dx = event.clientX - lastMouseX;
    var dy = event.clientY - lastMouseY;
    var speedX = Math.round(dx / dt * 100);
    var speedY = Math.round(dy / dt * 100);

    timestamp = now;
    lastMouseX = event.clientX;
    lastMouseY = event.clientY;

		console.log('dx', dx, 'dy', dy)

		// if (speedX < 1 && speedY < 1) {
		//   play();
		// }

		  play();

	function play() {
		var notes = [ "C", "D", "E", "F" ];
	  var note = notes[Math.floor(Math.random() * notes.length)];
	  var octave = Math.floor(Math.random() * 10);
	  tones.play(note, octave);
	}
}

function onDocumentTouchStart( event ) {
	// if ( event.touches.length > 1 ) {
	// 	event.preventDefault();
	//   play();
	//   var percentX  = event.touches[ 0 ].pageX;

	// 	function play(percentX) {
	// 		var notes = [ "C", "D", "E", "F" ];
	// 	  var note = notes[Math.floor(Math.random() * notes.length)];
	// 	  var octave = Math.floor(Math.random() * 10);
	// 	  tones.play(note, octave);
	// 	}
	// }
}

////////////
// sounds
////////////

/*
	tone types:
	"sine",
	"square",
	"sawtooth",
	"triangle",
	"custom"
*/

// function interactive() {
//     var types = ["sine", "square", "sawtooth", "triangle"];
//     var typeLabel = document.createElement("h3");
//     typeLabel.textContent = "type: " + tones.type;
//     document.body.appendChild(typeLabel);

//     var typeSlider = document.createElement("input");
//     typeSlider.type = "range";
//     typeSlider.min = 0;
//     typeSlider.max = 3;
//     typeSlider.value = types.indexOf(tones.type);
//     typeSlider.style.width = "500px";
//     typeSlider.addEventListener("input", function() {
//         tones.type = types[typeSlider.value];
//         typeLabel.textContent = "type: " + tones.type;
//     })
//     document.body.appendChild(typeSlider);

//     var attackLabel = document.createElement("h3");
//     attackLabel.textContent = "attack: " + tones.attack;
//     document.body.appendChild(attackLabel);

//     var attackSlider = document.createElement("input");
//     attackSlider.type = "range";
//     attackSlider.min = 1;
//     attackSlider.max = 300;
//     attackSlider.value = tones.attack;
//     attackSlider.style.width = "500px";
//     attackSlider.addEventListener("input", function() {
//         tones.attack = attackSlider.value;
//         attackLabel.textContent = "attack: " + tones.attack;
//     })
//     document.body.appendChild(attackSlider);

//     var releaseLabel = document.createElement("h3");
//     releaseLabel.textContent = "release: " + tones.release;
//     document.body.appendChild(releaseLabel);

//     var releaseSlider = document.createElement("input");
//     releaseSlider.type = "range";
//     releaseSlider.min = 1;
//     releaseSlider.max = 300;
//     releaseSlider.value = tones.release;
//     releaseSlider.style.width = "500px";
//     releaseSlider.addEventListener("input", function() {
//         tones.release = releaseSlider.value;
//         releaseLabel.textContent = "release: " + tones.release;
//     })
//     document.body.appendChild(releaseSlider);

//     ambient();
// }

// function scoredAmbient() {
//     tones.type = "triangle";
//     tones.release = 300;

//     var timing = 250;
//     var notes = [ "C#", "D#", "F#", "D#"];

//     score = [];
//     for(var i = 0; i < 16; i++) {
//         var note = notes[Math.floor(Math.random() * notes.length)];
//         var octave = Math.floor(Math.random() * 10);
//         console.log(i, ":", note, octave);
//         score.push({
//             note: note,
//             octave: octave
//         });
//     }
//     var index = 0;



//     var prevTime = tones.getTimeMS();
//     var elapsed = 0
//     play();



//     function play() {
//         var now = tones.getTimeMS();
//         elapsed += now - prevTime;
//         if(elapsed > timing) {
//             elapsed -= timing;
//             var t = score[index];
//             tones.play(t.note, t.octave);
//             index++;
//             index %= score.length;
//         }
//         prevTime = now;
//         requestAnimationFrame(play);

//     }

// }

// function song() {
//     tones.type = "square";
//     tones.attack = 20;
//     tones.release = 200;

//     var notes = "ccggaag-ffeeddc-ggffeed-ggffeed-ccggaag-ffeeddc-----",
//         timing = 300,
//         index = 0;

//     var prevTime = tones.getTimeMS();
//     var elapsed = 0
//     play();



//     function play() {
//         var now = tones.getTimeMS();
//         elapsed += now - prevTime;
//         if(elapsed > timing) {
//             elapsed -= timing;
//             var note = notes.charAt(index);
//             if(note !== "-") {
//                 tones.play(note);
//             }
//             index++;
//             index %= notes.length;
//         }
//         prevTime = now;
//         requestAnimationFrame(play);

//     }
// }

// function physics() {
//     var canvas = document.createElement("canvas"),
//         context = canvas.getContext("2d"),
//         width = canvas.width = window.innerWidth,
//         height = canvas.height = window.innerHeight;

//     canvas.style.display = "block";
//     document.body.style.margin = 0;
//     document.body.appendChild(canvas);


//     var balls = [],
//         num = 8,
//         gravity = 0.5;

//     for(var i = 0; i < num; i++) {
//         var size = Math.random();
//         balls.push({
//             x: Math.random() * width,
//             y: Math.random() * height,
//             vx: Math.random() * 10 - 5,
//             vy: Math.random() * 10 - 5,
//             radius: 10 + size * 50,
//             freq: 350 - size * 300
//         })
//     }

//     play();

//     function play() {
//         context.clearRect(0, 0, width, height);
//         for(var i = 0; i < num; i++) {
//             var ball = balls[i];
//             ball.x += ball.vx;
//             ball.y += ball.vy;
//             if(ball.x + ball.radius > width) {
//                 ball.x = width - ball.radius;
//                 ball.vx *= -1;
//                 tones.play(ball.freq);
//             }
//             else if(ball.x - ball.radius < 0) {
//                 ball.x = ball.radius;
//                 ball.vx *= -1;
//                 tones.play(ball.freq);
//             }
//             if(ball.y + ball.radius > height) {
//                 ball.y = height - ball.radius;
//                 ball.vy *= -1;
//                 if(Math.abs(ball.vy) > 2)
//                     tones.play(ball.freq);
//             }
//             else if(ball.y - ball.radius < 0) {
//                 ball.y = ball.radius;
//                 ball.vy *= -1;
//                 tones.play(ball.freq);
//             }
//             ball.vy += gravity;
//             context.beginPath();
//             context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2, false);
//             context.fill();
//         }



//         requestAnimationFrame(play);
//     }
// }
