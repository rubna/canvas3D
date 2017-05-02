function Node()
{
    this.localTransform = CreateIdentity();
    this.model;
    this.parent = null;
    this.flipModel = false;
    
    this.GlobalPosition = function()
    {
        return ExtractTranslation(this.GetTransform());
    }
    this.LocalPosition = function()
    {
        return ExtractTranslation(this.localTransform);
    }

    this.GetTransform = function()
    {
        if (this.parent != null)
            return MatMultiply(this.localTransform, this.parent.GetTransform());
        else
            return this.localTransform;
    }
    
    this.draw = function()
    {
        if (this.model != null)
        {
            this.model.draw(this.GetTransform(), this.flipModel);
        }
    }

    this.Scale = function(vector)
    {
        var oldPos = this.LocalPosition();
        this.Translate(multiply(-1, oldPos));
        this.localTransform= MatMultiply(this.localTransform, CreateScale(vector));
        this.Translate(oldPos);
    }

    this.Translate = function(vector)
    {
        this.localTransform= MatMultiply(this.localTransform, CreateTranslation(vector));
    }

    this.Rotate = function(axis, angle)
    {
        var oldPos = this.LocalPosition();
        this.Translate(multiply(-1, oldPos));
        this.localTransform= MatMultiply(this.localTransform, CreateAxisAngle(axis, angle));
        this.Translate(oldPos);
    }

    this.FlipX = function()
    {
        this.flipModel = !this.flipModel;
        this.Scale(new Vector(-1, 1, 1));
    }

    this.Forward = function()
    {
        return ExtractZAxis(this.GetTransform());
    }
    this.Left = function()
    {
        return ExtractXAxis(this.GetTransform());
    }
    this.Up = function()
    {
        return ExtractYAxis(this.GetTransform());
    }
}