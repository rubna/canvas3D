var global_data;
var currentFaceColor = "#FFFFFF"
function Model(filename)
{
    this.verts = [];
    this.faces = [];
    this.lines = [];
    this.spheres = [];

    //load model
    var obj = this;
    $.ajax({
        url: filename + ".obj",
        dataType: "text",
        success: function(data)
        {
            global_data = data;
            readData(obj);
        },
    });
    
    this.draw = function(matrix, flipped = false)
    {
        for (var i = 0; i < this.faces.length; i++)
        {
            var face = this.faces[i];
            var v1 = TransformVector(this.verts[face[0]], matrix);
            var v2 = TransformVector(this.verts[face[1]], matrix);
            var v3 = TransformVector(this.verts[face[2]], matrix);

            draw_set_color(String(face[3]));
            draw_triangle(v1, v2, v3, flipped);
        }
        for (var i = 0; i < this.lines.length; i++)
        {
            var line = this.lines[i];
            var v1 = TransformVector(this.verts[line[0]], matrix);
            var v2 = TransformVector(this.verts[line[1]], matrix);

            draw_set_color(String(line[2]));
            draw_line(v1, v2);
        }
        for (var i = 0; i < this.spheres.length; i++)
        {
            var sphere = this.spheres[i];
            var v = TransformVector(this.verts[sphere[0]], matrix);
            var r = sphere[1];
            draw_set_color(String(sphere[2]));
            draw_sphere(v, r);
        }
    }
}
    
function readData(obj)
{
    var lines = global_data.replace(/  +/g, ' ').split('\n');
    for (var i = 0; i < lines.length; i++)
    {
        var line = lines[i].split(' ');
        
        if (line[0] == 'v')
        {
            obj.verts.push(new Vector(Number(line[1]), Number(line[2]), Number(line[3])));
            
        }
        if (line[0] == 'f')
        {
            obj.faces.push([parseInt(line[1]) - 1, parseInt(line[2]) - 1, parseInt(line[3]) - 1, currentFaceColor]);
        }
        if (line[0] == 'l')
        {
            obj.lines.push([parseInt(line[1]) - 1, parseInt(line[2]) - 1, currentFaceColor]);
        }
        if (line[0] == 's')
        {
            obj.spheres.push([parseInt(line[1]) - 1, Number(line[2]), currentFaceColor]);
        }
        if (line[0] == 'c')
        {
            currentFaceColor = line[1];
        }
    }
}