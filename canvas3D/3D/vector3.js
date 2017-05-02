//vectors
function Vector(x, y, z)
{
    this.x = x;
    this.y = y;
    this.z = z;
    
    this.Length = function()
    {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }
    
    this.Length2 = function()
    {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }
    
    this.GetVector4 = function(w)
    {
        return new Vector4(this.x, this.y, this.z, w);
    }
}

function UnitX(){
    return new Vector(1, 0, 0);
}
function UnitY(){
    return new Vector(0, 1, 0);
}
function UnitZ(){
    return new Vector(0, 0, 1);
}
function Zero(){
    return new Vector(0, 0, 0);
}
function One(){
    return new Vector(1, 1, 1);
}

function Vector4(x, y, z, w)
{
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
}

function dot4(a, b)
{
    return a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w;
}

function dot(a, b)
{
    return a.x * b.x + a.y * b.y + a.z * b.z;
}
function cross(a, b)
{
    var x, y, z;
    x = a.y * b.z - b.y * a.z;
    y = (a.x * b.z - b.x * a.z) * -1;
    z = a.x * b.y - b.x * a.y;
    
    return new Vector(x, y, z);
}
function add(a, b)
{
    return new Vector(a.x + b.x, a.y + b.y, a.z + b.z)
}
function subtr(a, b)
{
    return new Vector(a.x - b.x, a.y - b.y, a.z - b.z)
}

function mult(a, b)
{
    return new Vector(a.x * b.x, a.y * b.y, a.z * b.z)
}

function multiply(factor, vector)
{
    return new Vector(factor * vector.x, factor * vector.y, factor * vector.z)
}

function normalize(vector)
{
    var length = 1 / vector.Length();
    return new Vector(vector.x * length, vector.y * length, vector.z * length);
}

function reflect(d, n)
{
    return subtr(d, multiply(2 * dot(d, n), n));
}

function lerpTo(a, b, amt)
{
    var d = subtr(b, a);
    d = multiply(amt, d);
    return add(a, d);
}