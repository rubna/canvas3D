//matrices
function Matrix(matrix)
{
    this.matrix = matrix;
    
    this.getCol = function(col)
    {
        return new Vector4(this.matrix[col][0], this.matrix[col][1], this.matrix[col][2], this.matrix[col][3]);
    }
    this.getRow = function(row)
    {
        return new Vector4(this.matrix[row][0], this.matrix[row][1], this.matrix[row][2], this.matrix[row][3]);
    }
    
    this.GetDeterminant = function()
    {
        var m = this.matrix;
        return m[0][3] * m[1][2] * m[2][1] * m[3][0] - m[0][2] * m[1][3] * m[2][1] * m[3][0] -
         m[0][3] * m[1][1] * m[2][2] * m[3][0] + m[0][1] * m[1][3] * m[2][2] * m[3][0] +
         m[0][2] * m[1][1] * m[2][3] * m[3][0] - m[0][1] * m[1][2] * m[2][3] * m[3][0] -
         m[0][3] * m[1][2] * m[2][0] * m[3][1] + m[0][2] * m[1][3] * m[2][0] * m[3][1] +
         m[0][3] * m[1][0] * m[2][2] * m[3][1] - m[0][0] * m[1][3] * m[2][2] * m[3][1] -
         m[0][2] * m[1][0] * m[2][3] * m[3][1] + m[0][0] * m[1][2] * m[2][3] * m[3][1] +
         m[0][3] * m[1][1] * m[2][0] * m[3][2] - m[0][1] * m[1][3] * m[2][0] * m[3][2] -
         m[0][3] * m[1][0] * m[2][1] * m[3][2] + m[0][0] * m[1][3] * m[2][1] * m[3][2] +
         m[0][1] * m[1][0] * m[2][3] * m[3][2] - m[0][0] * m[1][1] * m[2][3] * m[3][2] -
         m[0][2] * m[1][1] * m[2][0] * m[3][3] + m[0][1] * m[1][2] * m[2][0] * m[3][3] +
         m[0][2] * m[1][0] * m[2][1] * m[3][3] - m[0][0] * m[1][2] * m[2][1] * m[3][3] -
         m[0][1] * m[1][0] * m[2][2] * m[3][3] + m[0][0] * m[1][1] * m[2][2] * m[3][3];
    }
}

function MatMultiply(matA, matB)
{
    var result = [[0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0]];
    
    for (var i = 0; i < 4; i++)
        for (var j = 0; j < 4; j++)
        {
            result[i][j] = 0;
            for (var m = 0; m < 4; m++)
                result[i][j] += matA.matrix[m][j] * matB.matrix[i][m];
        }
    return new Matrix(result);
}

function Transpose(mat)
{
    var result = [[0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0]];
                
    for (var i = 0; i < 4; i++)
        for (var j = 0; j < 4; j++)
        {
            result[i][j] = mat.matrix[j][i];
        }
    return new Matrix(result);
}

//transform vector
function TransformVector(vector, matrix)
{
    var vec4 = vector.GetVector4(1);
    var x = dot4(vec4, matrix.getCol(0));
    var y = dot4(vec4, matrix.getCol(1));
    var z = dot4(vec4, matrix.getCol(2));
    var w = dot4(vec4, matrix.getCol(3));
    return new Vector(x / w, y / w, z / w);
}

//instantiation functions
function CreateIdentity()
{
    var mat =  [[1, 0, 0, 0],
                [0, 1, 0, 0],
                [0, 0, 1, 0],
                [0, 0, 0, 1]];
    
    return new Matrix(mat);
}

function CreateTranslation(vec)
{
    var mat =      [[1, 0, 0, vec.x],
                    [0, 1, 0, vec.y],
                    [0, 0, 1, vec.z],
                    [0, 0, 0, 1]];
    return new Matrix(mat);
}

function CreateScale(vec)
{
    var mat =      [[vec.x, 0, 0, 0],
                    [0, vec.y, 0, 0],
                    [0, 0, vec.z, 0],
                    [0, 0, 0, 1]];
    return new Matrix(mat);
}

function CreateFromAxes(xaxis, yaxis, zaxis)
{
    var mat =      [[xaxis.x, yaxis.x, zaxis.x, 0],
                    [xaxis.y, yaxis.y, zaxis.y, 0],
                    [xaxis.z, yaxis.z, zaxis.z, 0],
                    [0, 0, 0, 1]];
                    
    return new Matrix(mat);
}

function CreateAxisAngle(axis, angle)
{
    var t = angle * (Math.PI / 180);
    var a = normalize(axis);
    
    var c = Math.cos(t); var s = Math.sin(t);
    var x = a.x; var y = a.y; var z = a.z;
    var mat=[[c + x*x * (1-c),      x * y * (1-c) - z*s,   x * z * (1-c) + y*s, 0],
             [y*x * (1-c) + z*s,    c + y*y * (1-c),     y*z * (1-c) - x*s, 0],
             [z*x * (1-c) - y*s,    z * y * (1-c) + x * s, c + z*z * (1-c), 0],
             [0, 0, 0, 1]];
    return new Matrix(mat);
}

//extract from matrices
function ExtractTranslation(matrix)
{
    var mat = matrix.matrix;
    return new Vector(mat[0][3], mat[1][3], mat[2][3]);
}

function ExtractXAxis(matrix)
{
    var mat = matrix.matrix;
    return new Vector(mat[0][0], mat[1][0], mat[2][0]);
}
function ExtractYAxis(matrix)
{
    var mat = matrix.matrix;
    return new Vector(mat[0][1], mat[1][1], mat[2][1]);
}
function ExtractZAxis(matrix)
{
    var mat = matrix.matrix;
    return new Vector(mat[0][2], mat[1][2], mat[2][2]);
}

//camera stuff
function CreateToScreen(width, height)
{
    var mat = [[width / 2, 0, 0, width / 2],
               [0, height / 2, 0, height / 2],
               [0, 0, 1, 0],
               [0, 0, 0, 1]];
    return new Matrix(mat);
}

function CreateToCanonical(camSize, near, far)
{
    var r = camSize;
    var l = -camSize;
    var b = camSize;
    var t = -camSize;
    var n = near;
    var f = far;
    
    var mat = [[2/(r - l), 0, 0, -(l + r)/(r - l)],
               [0, 2/(t - b), 0, -(b + t)/(t - b)],
               [0, 0, 2/(n - f), -(n + f)/(n - f)],
               [0, 0, 0, 1]];
    return new Matrix(mat);
}

function CreateLookAt (eye, target, up)
{
    var zaxis = normalize(subtr(target, eye));
    var xaxis = normalize(cross(up, zaxis));
    var yaxis = normalize(zaxis, xaxis);
    
    return MatMultiply(CreateTranslation(multiply(-1, eye)), Transpose(CreateFromAxes(xaxis, yaxis, zaxis)));
}

function CreatePerspective(near, far, fov)
{
    var n = near;
    var f = far;
    fov = 120;
    /*var s = 1 / Math.tan((fov / 2) * ( Math.PI / 180));
    var mat = [[s, 0, 0, 0],
               [0, s, 0, 0],
               [0, 0, -(f / (f - n)), ((f * n)/(f - n))],
               [0, 0, -1, 0]];*/
    var s = 1 / Math.tan((fov / 2) * ( Math.PI / 180));
    var mat = [[s, 0, 0, 0],
               [0, s, 0, 0],
               [0, 0, -(n + f), f * n],
               [0, 0, -1, 0]];
    return new Matrix(mat);
}

function CreatePerspectiveCanonical(near, far, camSize)
{
    var r = camSize;
    var l = -camSize;
    var b = camSize;
    var t = -camSize;
    var n = near;
    var f = far;
    
    var A = (r + l) / (l - r);
    var B = (t + b) / (b - l);
    var C = (f + n) / (n - f);
    var D = (2 * f * n) / (f - n);

    var mat = [[(2 * n) / (r - l), 0, A, 0],
               [0, (2 * n) / (t - b), B, 0],
               [0, 0, C, D],
               [0, 0, -1, 0]];
               
    return new Matrix(mat);

}