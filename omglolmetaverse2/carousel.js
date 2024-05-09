window.onload = function() {
  localStorage.clear();
};

const lol = document.getElementsByClassName("lol")[0];
const omg = document.getElementsByClassName("omg")[0];
const images = document.querySelectorAll('.carousel-image');
const starsContainer = document.querySelector('.stars-container');
const carousel = document.querySelector('.carousel');
let popupWindows = [];
let stars = null;
let radius = 242;

document.addEventListener("DOMContentLoaded", () => {
  new cursoreffects.emojiCursor({ element: carousel, emoji: ["⭐", "🌟", "✨", "💫"] });
  new cursoreffects.springyEmojiCursor({ element: carousel, emoji: ["⭐"] });
  new cursoreffects.ghostCursor({ element: carousel });

  stars = document.querySelectorAll('.star');

  // Store initial top positions
  stars.forEach(star => {
    const computedStyle = window.getComputedStyle(star);
    star.dataset.initialTop = parseInt(computedStyle.top, 10);
  });

  gsap.ticker.add(animate);
  alert("Haha! I loooove spinning!");

});

const progress = {
  value: 0 
};

function triggerPopup() {
  var width = 300;  // width of the popup window
  var height = 200; // height of the popup window

  // Randomize the position of the popup
  var left = Math.floor(Math.random() * (screen.width - width));
  var top = Math.floor(Math.random() * (screen.height - height));

  // Create a string for the window features
  var windowFeatures = 'width=' + width + ', height=' + height +
                      ', top=' + top + ', left=' + left +
                      ', resizable=yes, scrollbars=yes';

  // Open the popup
  window.open('./vomit.html', '_blank', windowFeatures);
  
}

Observer.create({
  target: carousel,
  type: "wheel, pointer",
  onPress: self => {
    carousel.style.cursor = 'grabbing';
  },
  onRelease: self => {
    carousel.style.cursor = 'grab';
  },
  onChange: self => {
    gsap.killTweensOf(progress);
    const p = self.event.type === 'wheel' ? self.deltaX * -.005 : self.deltaX * .5;
    gsap.to(progress, {
      duration: 5,
      ease: 'expo.out',
      value: `+=${p}`,
      modifiers: {
        value: gsap.utils.wrap(0, 1) // Wrapping the progress to allow continuous looping
      },
      onUpdate: () => checkSpin(progress.value)
    });
  }
});

let playedFirst = false;
let playedSecond = false;

let previousValue = 0;
function checkSpin(currentValue) {

  let direction;

  if (previousValue > 0.95 && currentValue < 0.5) {
    direction = 1;
    omg.value += "omg";  // Appends 'omg' to the existing value
    if (omg.value.length >= omg.maxLength) {

      if (!playedFirst) {
        alert('Woah! Im gonna throw up!');
        playedFirst = true;
      }

      if (!playedSecond) {
        alert('Blaaaaaaghghhhhhhh!');
        playedSecond = true;
      }

      triggerPopup();
    }
  }

  if (previousValue < 0.05 && currentValue > 0.95) {
    direction = 0;
    lol.value += "lo";
    if (lol.value.length >= lol.maxLength){
      alert("hahaha! now spin me the other way!")
    }
  }
  previousValue = currentValue;
}

const animate = () => {
  
  images.forEach((image, index) => {
    const theta = index / images.length - progress.value;
    const x = -Math.sin(theta * Math.PI * 2) * radius;
    const y = Math.cos(theta * Math.PI * 2) * radius;
    image.style.transform = `translate3d(${x}px, 0px, ${y}px) rotateY(${360 * -theta}deg)`;
    image.style.backgroundImage = `conic-gradient(#fff, #000, #fff, #000, #fff, #000, #fff, #000), conic-gradient(#fff, #000, #fff, #000, #fff, #000, #fff, #000), radial-gradient(circle at ${progress.value}% ${x+2}%, #2ad0ca, #e1f664, #feb0fe, #abb3fc, #5df7a4, #58c4f6)`;
  });

  if (stars) {
    stars.forEach(star => {
      // Update top position based on progress
      let newTop = parseInt(star.dataset.initialTop) + 50 * progress.value; // Adjust 100 as needed for the effect
      star.style.top = `${newTop}px`;
    });
  }

  starsContainer.style.backgroundImage = `conic-gradient(#fff, #000, #fff, #000, #fff, #000, #fff, #000, #fff), conic-gradient(#fff, #000, #fff, #000, #fff, #000, #fff, #000, #000), radial-gradient(circle at 55% ${progress.value*100}%, #2ad0ca, #e1f664, #feb0fe, #abb3fc, #5df7a4, #58c4f6)`;
};

gsap.ticker.add(animate);