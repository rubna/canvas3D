var zFar = 10;
var zNear = 0;

function Camera()
{
    this.position = multiply(-1, new Vector(1, 2, 1));
    this.direction = normalize(new Vector(1, 2, 1));
    this.up = UnitY();
    this.size = 2.7;
    
    this.GetMatrix = function()
    {
        var zaxis = normalize(this.direction);
        var xaxis = this.Left();
        var yaxis = normalize(cross(zaxis, xaxis));
        var trans = multiply(-1, this.position);
        
        var mat = [[xaxis.x, xaxis.y, xaxis.z, dot(xaxis, trans)],
                   [yaxis.x, yaxis.y, yaxis.z, dot(yaxis, trans)],
                   [zaxis.x, zaxis.y, zaxis.z, dot(zaxis, trans)],
                   [0, 0, 0, 1]];
        
        return new Matrix(mat);
    }
    
    this.LookAt = function(target)
    {
        this.direction = normalize(subtr(target, this.position)); // mult -1
        this.position = add(target, multiply(-2,this.direction));
    }
    
    this.Left = function()
    {
        return normalize(cross(this.up, this.direction));
    }
    this.Down = function()
    {
        return normalize(cross(this.direction, this.Left()));
    }
}

function ArcballCam(camTarget) {
    //camera controls
    var dr = multiply(1, camera.direction);
    var l = multiply(2, camera.Left());
    var d = multiply(-2, camera.Down());

    //arcball
    var camdot = dot(camera.direction, camera.up);
    var ldot = multiply(Math.abs(dot(camera.Down(), camera.up)), l);
    if (vk_a.down)
        camera.position = add(camera.position, ldot);
    if (vk_d.down)
        camera.position = subtr(camera.position, ldot);
    if (vk_w.down && camdot < 0.95)
        camera.position = add(camera.position, d);
    if (vk_s.down && camdot > -0.95)
        camera.position = subtr(camera.position, d);
    
    // mouse controls
    if (mouse.down)
    {
        var mouse_x = multiply(mouse.hspd, ldot);
        camera.position = add(camera.position, mouse_x);

        var mouse_y = multiply(mouse.vspd, d);
        if ((mouse.vspd < 0 && camdot > -0.98) || (mouse.vspd > 0 && camdot < 0.98))
            camera.position = add(camera.position, mouse_y);
    }

    mouse.hspd = 0;
    mouse.vspd = 0;
    
    // touch controls
    //if (touch.down)
    {
        var xs = multiply(touch.hspd, ldot);
        camera.position = add(camera.position, xs);

        var ys = multiply(touch.vspd, d);
        if ((touch.vspd < 0 && camdot > -0.98) || (touch.vspd > 0 && camdot < 0.98))
            camera.position = add(camera.position, ys);
    }
    touch.hspd = 0;
    touch.vspd = 0;

    // move target
    /*if (vk_up.down)
    {
        camTarget = add(camTarget, d);
        camera.position = add(camera.position, d);
    }
    if (vk_down.down)
    {
        camTarget = subtr(camTarget, d);
        camera.position = subtr(camera.position, d);
    }
    if (vk_right.down)
    {
        camTarget = add(camTarget, l);
        camera.position = add(camera.position, l);
    }
    if (vk_left.down)
    {
        camTarget = subtr(camTarget, l);
        camera.position = subtr(camera.position, l);
    }*/
    
    camera.LookAt(camTarget);
}
