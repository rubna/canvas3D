function clamp(x, min, max)
{
    return Math.max(Math.min(max, x), min);
}

function distance(x1, y1, x2, y2)
{
    x2 -= x1;
    y2 -= y1;
    return Math.sqrt(x2 * x2 + y2 * y2);
}

function distance2(x1, y1, x2, y2)
{
    x2 -= x1;
    y2 -= y1;
    return x2 * x2 + y2 * y2;
}