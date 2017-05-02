var cube = new Model("cube");

function setup()
{
    set_fps(45);
}

function loop()
{
    ArcballCam(Zero());
    update_screen_matrix();

    draw_set_color("#FFFF00");
    draw_clear();

    cube.draw(CreateScale(new Vector(0.75, 0.75, 0.75)));
    draw_end();
}