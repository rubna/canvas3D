var zbuffer = [];
var screen_width, screen_height;
var screen_matrix;

var camera;

function init_rasterizer(width, height)
{
    camera = new Camera();

    screen_width = width;
    screen_height = height;
}

function update_screen_matrix()
{
    //setup view matrix
    screen_matrix = CreateIdentity();
    screen_matrix = MatMultiply(screen_matrix, camera.GetMatrix());
    screen_matrix = MatMultiply(screen_matrix, CreateToCanonical(camera.size, zNear, zFar))
    screen_matrix = MatMultiply(screen_matrix, CreateToScreen(screen_width, screen_height));
}

function clear_zbuffer()
{
    for (var i = 0; i < screen_width * screen_height; i++)
        zbuffer[i] = zFar;
}

//////////FUNDAMENTAL DRAWING FUNCTIONS
function draw_3d_point(x, y, z)
{
    if (x < 0 || y < 0 || x > screen_width || y > screen_height)
        return;
    var index = Math.floor(y) * screen_width + Math.floor(x);
    if (z < zNear || z > zFar || z > zbuffer[index])
        return;
    
    draw_pixel(x, y);
    zbuffer[index] = z;
}

//////////DRAWING TRIANGLES
function draw_triangle(vert1, vert2, vert3, flipped = -1) {
    var normal = cross(subtr(vert2, vert1), subtr(vert3, vert1));

    if (dot(normal, camera.direction) > 0 && flipped == 0)
        return;
    if (dot(normal, camera.direction) < 0 && flipped == 1)
        return;

    vert1 = TransformVector(vert1, screen_matrix);
    vert2 = TransformVector(vert2, screen_matrix);
    vert3 = TransformVector(vert3, screen_matrix);
    
    //sort vertices by Y-coord
    var v1 = vert1;
    if (vert2.y < v1.y)
        v1 = vert2;
    if (vert3.y < v1.y)
        v1 = vert3;
        
    var v2;
    if (v1 != vert1)
        v2 = vert1;
    else
        v2 = vert2;
    if (vert2.y < v2.y && v1 != vert2)
        v2 = vert2;
    if (vert3.y < v2.y && v1 != vert3)
        v2 = vert3;
    
    var v3;
    if (v1 != vert1 && v2 != vert1)
        v3 = vert1;
    else
    if (v1 != vert2 && v2 != vert2)
        v3 = vert2;
    else
        v3 = vert3;
    
    //draw triangles
    if (Math.floor(v1.y) == Math.floor(v2.y))
        draw_top_flat_triangle(v1, v2, v3);
    else
    if (Math.floor(v2.y) == Math.floor(v3.y))
        draw_bottom_flat_triangle(v1, v2, v3);
    else
    {
        var yslope = (v2.y - v1.y) / (v3.y - v1.y);
        var x4 = v1.x + yslope * (v3.x - v1.x);
        var z4 = v1.z + yslope * (v3.z - v1.z);
        var v4 = new Vector(x4, v2.y, z4);
        draw_bottom_flat_triangle(v1, add(v2, UnitY()), add(v4, UnitY()));
        draw_top_flat_triangle(v2, v4, v3);
    }
}

function draw_bottom_flat_triangle(v1, v2, v3) {
  var invslope1 = (v2.x - v1.x) / (v2.y - v1.y);
  var invslope2 = (v3.x - v1.x) / (v3.y - v1.y);

  var zslope1 = (v1.z - v2.z) / (v1.y - v2.y);
  var zslope2 = (v1.z - v3.z) / (v1.y - v3.y);
  
  var curx1 = v1.x;
  var curx2 = v1.x;

  var curz1 = v1.z;
  var curz2 = v1.z;
  
  for (var scanY = v1.y; scanY <= v2.y; scanY++)
  {
    drawScanline(curx1, curz1, curx2, curz2, scanY);
    curx1 += invslope1;
    curx2 += invslope2;
    curz1 += zslope1;
    curz2 += zslope2;
  }
}

function draw_top_flat_triangle(v1, v2, v3){
  var invslope1 = (v3.x - v1.x) / (v3.y - v1.y);
  var invslope2 = (v3.x - v2.x) / (v3.y - v2.y);
  
  var zslope1 = (v3.z - v1.z) / (v3.y - v1.y);
  var zslope2 = (v3.z - v2.z) / (v3.y - v2.y);

  var curx1 = v3.x;
  var curx2 = v3.x;
  
  var curz1 = v3.z;
  var curz2 = v3.z;

  for (var scanY = v3.y; scanY >= v1.y; scanY--)
  {
    drawScanline(curx1, curz1, curx2, curz2, scanY);
    curx1 -= invslope1;
    curx2 -= invslope2;
    curz1 -= zslope1;
    curz2 -= zslope2;
  }
}

function drawScanline(x1, z1, x2, z2, y){
    //sort by x
    var xfrom = x1; var zfrom = z1;
    var xto = x2; var zto = z2;
    if (xfrom > xto)
    {
        xto = x1; zto = z1;
        xfrom = x2; zfrom = z2;
    }
    //draw scanline
    var zSlope = (zto - zfrom) / (xto - xfrom)
    for (var x = xfrom; x < xto; x++)
    {
        draw_3d_point(x, y, zfrom + (x - xfrom) * zSlope);
    }
}

/////////DRAWING LINES
function draw_line(v1, v2){
    v1 = TransformVector(v1, screen_matrix);
    v2 = TransformVector(v2, screen_matrix);
    
    var x1 = v1.x; var y1 = v1.y; var z1 = v1.z;
    var x2 = v2.x; var y2 = v2.y; var z2 = v2.z;
    
    var fromX = x1; var fromY = y1; var fromZ = z1;
    var toX = x2; var toY = y2; var toZ = z2;
    //more horizontal line
    if (Math.abs(x2 - x1) > Math.abs(y2 - y1))
    {
        if (x2 < x1)
        {
            fromX = x2; fromY = y2; fromZ = z2;
            toX = x1; toY = y1; toZ = z1;
            
        }
        var slope = (toY - fromY) / (toX - fromX);
        var zSlope = (toZ - fromZ) / (toX - fromX);
        for (var x = fromX; x < toX; x++)
        {
            draw_3d_point(x, fromY + (x - fromX) * slope, fromZ + (x - fromX) * zSlope);
        }
    }
    else
    //more vertical line
    {
        if (y2 < y1)
        {
            fromX = x2; fromY = y2; fromZ = z2;
            toX = x1; toY = y1; toZ = z1;
        }
        var slope = (toX - fromX) / (toY - fromY);
        var zSlope = (toZ - fromZ) / (toY - fromY);
        for (var y = fromY; y < toY; y++)
        {
            draw_3d_point(fromX + (y - fromY) * slope, y, fromZ + (y - fromY) * zSlope);
        }
    }
}

////////draw octahedron !!
function drawOctahedron(position, radius)
{
    var p = position;
    var r = radius;
    var v0 = add(p, UnitX());
    var v1 = add(p, UnitZ());
    var v2 = subtr(p, UnitX());
    var v3 = subtr(p, UnitZ());
    //top/bottom
    var v4 = add(p, UnitY());
    var v5 = subtr(p, UnitY());
    
    draw_triangle(v0, v4, v1);
    draw_triangle(v1, v4, v2);
    draw_triangle(v2, v4, v3);
    draw_triangle(v3, v4, v0);
    draw_triangle(v0, v5, v1);
    draw_triangle(v1, v5, v2);
    draw_triangle(v2, v5, v3);
    draw_triangle(v3, v5, v0);
}

////////drawing spheres (BROKEN!!!)
function draw_sphere(position, radius)
{
    var p = TransformVector(position, screen_matrix);
    var r2 = subtr(TransformVector(add(position, multiply(radius, camera.Left())), screen_matrix), p).Length2();
    var r = Math.sqrt(r2);
    var xmin = clamp_width(p.x - r);
    var xmax = clamp_width(p.x + r);
    var ymin = clamp_height(p.y - r);
    var ymax = clamp_height(p.y + r);
    
    for (var x = xmin; x < xmax; x++)
        for (var y = ymin; y < ymax; y++)
        {
            var d2 = distance2(p.x, p.y, x, y)
            if (d2 < r2)
            {
                var zz = Math.sqrt(r2- d2);
                zz /= r;
                var n = zNear; var f = zFar;
                zz /= zFar;
                draw_3d_point(x, y, p.z - zz);
            }
        }
    //console.log(TransformVector(multiply(100, UnitZ()), screen_matrix).z);
}

function clamp_width(x)
{
    return clamp(x, 0, screen_width);
}
function clamp_height(y)
{
    return clamp(y, 0, screen_height);
}