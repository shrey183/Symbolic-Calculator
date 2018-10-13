// This script is included here because we want the grid lines to appear initially when there is no graph on the canvas.
var c = document.getElementById("output1");
var ctx = c.getContext("2d");
//X-axis
var delta = 0; // This was initially put here because there was some overflow in the graph. To avoid that we could shrink the graph in the canvas by a factor of delta.
var push_x = 2;
var push_y = 15;
ctx.beginPath();
ctx.moveTo(delta, c.height / 2);
var x_pos = delta;
var y_pos = c.height / 2;
var step = (c.width - 2 * delta) / 20;
var tick = c.height / 2 - delta;
var k = -10;
ctx.fillStyle = "white";
ctx.font = "bold 12px sans-serif";
ctx.fillText(k.toString(), x_pos + push_x, y_pos + push_y);

while (x_pos != 20 * step + delta) {

    k += 1;
    //First move up
    ctx.lineTo(x_pos, y_pos - tick);
    ctx.moveTo(x_pos, y_pos);

    //Then move down
    ctx.lineTo(x_pos, y_pos + tick);

    ctx.moveTo(x_pos, y_pos);
    x_pos = x_pos + step;
    if (k == 0) {
        push_x = 5;
    }
    if (k > 0) {
        push_x = -13;
    }
    ctx.fillStyle = "white";
    ctx.font = "bold 12px sans-serif";
    ctx.fillText(k.toString(), x_pos + push_x, y_pos + push_y);
    //Finally move right
    ctx.lineTo(x_pos, y_pos);
}
//Final Tick mark
//First move up
ctx.lineTo(x_pos, y_pos - tick);
//Then move down
ctx.lineTo(x_pos, y_pos + tick);
ctx.lineWidth = 1;
ctx.strokeStyle = "white";
ctx.stroke();

//Y-axis
tick = c.width / 2 - delta;
ctx.beginPath();
ctx.moveTo(c.width / 2, delta);
var x_pos = c.width / 2;
var y_pos = delta;
step = (c.height - 2 * delta) / 20;
k = 10;
push_x = -15;
push_y = 10;
ctx.fillStyle = "white";
ctx.font = "bold 12px sans-serif";
ctx.fillText(k.toString(), x_pos + push_x, y_pos + push_y);

while (y_pos != 20 * step + delta) {
    if (k < 1) {
        push_y = -3;
        push_x = -18;
    }
    // Skip zero since it has already been made earlier.
    if (k != 0) {
        //First move right
        ctx.lineTo(x_pos + tick, y_pos);
        ctx.moveTo(x_pos, y_pos);
        //Then move left
        ctx.lineTo(x_pos - tick, y_pos);
    }
    k -= 1;


    ctx.moveTo(x_pos, y_pos);
    y_pos = y_pos + step;
    //Finally move right
    ctx.lineTo(x_pos, y_pos);

    if (k == 0) {
        continue;
    }
    else {
        ctx.fillStyle = "white";
        ctx.font = "bold 12px sans-serif";
        ctx.fillText(k.toString(), x_pos + push_x, y_pos + push_y);
    }
}
//Final Tick
//First move up
ctx.lineTo(x_pos + tick, y_pos);
//Then move down
ctx.lineTo(x_pos - tick, y_pos);
ctx.lineWidth = 1;
ctx.strokeStyle = "white";
ctx.stroke();
