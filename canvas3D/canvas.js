var canvas;
var context;
var currentColor = [0, 0, 0];

var screenClearImage;
var predraw;

var fps = 10;

$(document).ready(function() 
{
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");

    predraw = context.createImageData(canvas.width, canvas.height);
    init_rasterizer(canvas.width, canvas.height);

    ArcballCam(Zero());
    update_screen_matrix();
    draw_clear();
    setup();

    setInterval(function(){loop();}, 1000 / fps);
});

function set_fps(frames)
{
    fps = frames;
}

// draw functions 2D
function draw_set_color_rgb(r, g, b) 
{
    currentColor[0] = r;
    currentColor[1] = g;
    currentColor[2] = b;
}

function draw_set_color(hex) 
{ 
    hex = hex_to_rgb(hex);
    
    currentColor[0] = hex.r;
    currentColor[1] = hex.g;
    currentColor[2] = hex.b;
}

function draw_clear()
{
    clear_zbuffer();
    for (var i=0;i < predraw.data.length;i+=4)
    {
        predraw.data[i+0]=currentColor[0];//backgroundColor.r;
        predraw.data[i+1]=currentColor[1];//backgroundColor.g;
        predraw.data[i+2]=currentColor[2];//backgroundColor.b;
        predraw.data[i+3]=255;
    } 
}

function draw_pixel(x, y) 
{
    x = Math.floor(x);
    y = Math.floor(y);
    if (x < 0 || y < 0 || x > canvas.width || y > canvas.height)
        return;
    var i = (x + y * canvas.width) * 4;
    predraw.data[i] = currentColor[0];
    predraw.data[i + 1] = currentColor[1];
    predraw.data[i + 2] = currentColor[2];
}

function draw_end()
{
    context.putImageData(predraw, 0, 0);
}


// color casting functions
function hex_to_rgb(hex) 
{
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function component_to_hex(c) 
{
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgb_to_hex(r, g, b) {
    return "#" + component_to_hex(r) + component_to_hex(g) + component_to_hex(b);
}