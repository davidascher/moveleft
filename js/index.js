var Thing = function() {
  this.message = 'Controls';
  this.period = 60;
  this.disk = 78;
  this.background = 47;
  this.offset = 50;
  this.mode = 'single';
  this.backAndForth = false;
  this.direction = 'left';
  this.explode = function() {
  };  
}

var controls = new Thing();
var JSON = {
  "preset": "Left Right 60",
  "mode": "single",
  "remembered": {
    "Default": {
      "0": {}
    },
    "Left": {
      "0": {
        "direction": "left",
        "period": 60
      }
    },
    "Right": {
      "0": {
        "direction": "right",
        "period": 60
      }
    },
    "Left Right 60": {
      "0": {
        "direction": "leftright",
        "period": 60
      }
    }
  },
  "closed": false,
  "background": 47,
  "offset": 50,
  "disk": 78,
  "folders": {}
}

function play () {
  $("#go").text("Pause")
  $(".box").css({'animation-play-state': 'running'});  
}
function pause () {
  $("#go").text("Play")
  $(".box").css({'animation-play-state': 'paused'});  
}
var playing = true
function playpause() {
  playing = ! playing
  if (playing) {
    pause()
  } else {
    play()
  }
}
var gui = new dat.GUI({load: JSON})
var dir = gui.add(controls, 'direction', [ 'left', 'right', 'leftright' ] )
var mode = gui.add(controls, 'mode', [ 'single', 'loop' ] )
$("#go").text("Restart")
$('#go').on('click.reset', function( ) { reset()  })
$('#go').off('click.playpause')
setDiskLightness(JSON.disk)
setBackground(JSON.background)

mode.onChange(function(value) {
  let iterCount = '1'
  if (value === "single") {
    iterCount = '1' 
    $("#go").text("Restart")
    $('#go').on('click.reset', function( ) { reset()  });
    $('#go').off('click.playpause');
  } else {
    iterCount = 'infinite';
    pause();
    $('#go').off('click.reset');
    $('#go').on('click.playpause', function( ) { playpause()  });
  }
  console.log("iterCount", iterCount)
  $(".box").css({'animation-iteration-count': iterCount});
  reset()
})

let reset = function () {
  console.log("in reset");
  var elm = document.getElementById('dot')
  var newone = elm.cloneNode(true);
  elm.parentNode.replaceChild(newone, elm);
}


let setOffset = function(value) {
  let css = {'top': Math.round(value) + '%'}
  $(".box").css(css);
  reset();
}
setOffset(JSON.offset)

dir.onFinishChange(function(value) {
  $(".box").css({'animation-name': value})
  reset()
})
var offset = gui.add(controls, "offset", 0, 100)
offset.onChange(setOffset)

function setBackground(value) {
  let l = Math.round(value * 2.56);
  let css = {'background-color': 'rgb('+l+','+l+','+l+')'}
  $(".wrap").css(css);
}

var background = gui.add(controls, "background", 0, 100)
background.onChange(setBackground)

function setDiskLightness(value) {
  let l = Math.round(value * 2.56);
  let css = {'background-color': 'rgb('+l+','+l+','+l+')'}
  $(".box").css(css);
}

var contrast = gui.add(controls, "disk", 0, 100)
contrast.onChange(setDiskLightness)

var controller = gui.add(controls, 'period', 1, 120);

controller.onChange(function(value) {
  value = String(Math.round(value))
  $(".box").css({'animation-duration':  value+'s'});
  reset()

  // console.log(value)
  // Fires on every change, drag, keypress, etc.
});
gui.remember(controls);