
var mouse = {x: 0, y: 0, hspd: 0, vspd: 0, down: false};
var mousePrev = {x: -1, y: 0, down: false};
var mouseInit = false;

var touch = {x: 0, y: 0, hspd: 0, vspd: 0, down: false};
var touchPrev = {x: -1, y: 0, down: false};


// -- KEY INPUT
// initialize key objects
var vk_left, vk_right, vk_up, vk_down,
    vk_w, vk_a, vk_s, vk_d;
var keys = [];
vk_left  = new Key(37);
vk_up    = new Key(38);
vk_right = new Key(39);
vk_down  = new Key(40);
vk_w     = new Key(87);
vk_a     = new Key(65);
vk_s     = new Key(83);
vk_d     = new Key(68);
keys.push(vk_left, vk_right, vk_up, vk_down, 
          vk_w, vk_a, vk_s, vk_d);

// Key class
function Key(ord) {
    this.ord = ord;
    this.down = false;
    this.pressed = false;
    this.released = false;

    // used by input handler
    this.reset = function()
    {
        pressed = false;
        released = false;
    }

    this.check_pressed = function(key) 
    {
        if (key == ord)
        {
            this.pressed = true;
            this.down = true;
        }
    }
    this.check_released = function(key)
    {
        if (key == ord)
        {
            this.released = true;
            this.down = false;
        }
    }
}

// Add event listeners
window.addEventListener( "keydown", key_pressed, true);
window.addEventListener( "keyup", key_released, true);

function reset_inputs()
{
    keys.forEach(function(element) {
        element.reset();
    });
}

function key_pressed(e)
{
    keys.forEach(function(element) {
        element.check_pressed(e.keyCode);
    });
}
function key_released(e)
{
    keys.forEach(function(element) {
        element.check_released(e.keyCode);
    });
}

// mouse input
 $('html').on("mousemove", function(evt) {
    evt.preventDefault();
    var off = $("#canvas").offset(); 
    var zoom = $("#canvas").css( "zoom" );
    mouse.x = (evt.clientX - off.left) / zoom;
    mouse.y = (evt.clientY - off.top) / zoom;

     if (mousePrev.x > -1)
     {
         mouse.hspd = (mouse.x-mousePrev.x) / fps;
         mouse.vspd = (mouse.y-mousePrev.y) / fps;
     }
     mousePrev.x =mouse.x;
     mousePrev.y = mouse.y;
     mousePrev.down = mouse.down;
 });

$(document).on("mousedown", function(evt) {     
    mouse.down = true;
});
$(document).on("mouseup", function(evt) { 
    mouse.down = false;
});

// touch input
 $('html').on("touchmove", function(evt) {
    evt.preventDefault();
    var off = $("#canvas").offset(); 
    var zoom = $("#canvas").css( "zoom" );
    var ts = evt.originalEvent.touches[0];
    touch.x = (ts.clientX - off.left) / zoom;
    touch.y = (ts.clientY - off.top) / zoom;

    if (touchPrev.x > -1)
    {
        touch.hspd = (touch.x-touchPrev.x) / fps;
        touch.vspd = (touch.y-touchPrev.y) / fps;
    }
    touchPrev.x = touch.x;
    touchPrev.y = touch.y;
    touchPrev.down = touch.down;
 });

 $('html').on("touchend", function(evt) {
    touchPrev.x = -1;
 });
