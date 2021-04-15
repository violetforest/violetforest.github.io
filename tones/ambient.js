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
    var speedX = Math.round(dx / dt * 50);
    var speedY = Math.round(dy / dt * 50);

    timestamp = now;
    lastMouseX = event.clientX;
    lastMouseY = event.clientY;

		play();

	function play() {
		var notes = [ "C", "D", "E", "F" ];
	  var note = notes[Math.floor(Math.random() * notes.length)];
	  var octave = Math.floor(Math.random() * 5);
	  tones.play(note, octave);
	}
}