//Press enter to evaluate the expression
$(document).ready(function () {
    document.getElementById("data").addEventListener("keyup", function (event) {
        event.preventDefault();
        if (event.keyCode == 13) {
            evaluate();
        }
    })
    
    //To clear the output div when backspace is pressed
    var output = document.getElementById("output1");
    data.addEventListener("keydown", function (event) {
        if (event.keyCode == 8) {
            $(document).ready(function () {
                $('#output1').empty();
                $()
            });
        }
    })
    
    /**
    * Draw the graph axis on the DOM
    */
    function draw_axis() {
        var c = document.getElementById("output1");
        var ctx = c.getContext("2d");
        //X-axis
        var delta = 0;
        var push_x = 2;
        var push_y = 15;
        ctx.beginPath();
        ctx.moveTo(delta, c.height / 2);
        var x_pos = delta;
        var y_pos = c.height / 2;
        var step = (c.width - 2 * delta) / 20; // Need a margin of 5 pixels.
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
        //Final Tick
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

    }

    /**
    * Convert LaTeX string to CAS string
    * @param {string} - LaTex string
    * @return {string}
    */
    function convertfromLatex(latex_string) {
        console.log(latex_string)
        // Latex Dictionary 
        // Nautral log and log base 10 are treated the same. So for instance enter log(x)/log(2) to plot log_2(x).
        var dict = {
            //Standard Functions
            '\\arccos': 'arccos',
            '\\cos': 'cos',
            '\\sin': 'sin',
            '\\csc': 'cosec',
            '\\exp': 'exp',
            '\\sinh': 'sinh',
            '\\arcsin': 'arcsin',
            '\\cosh': 'cosh',
            '\\arctan': 'arctan',
            '\\cot': 'cot',
            '\\log': 'log',
            '\\tanh': 'tanh',
            '\\max': 'max', // One can try to plot max(f(x),g(x))!
            '\\tan': 'tan',
            '\\sec': 'sec',
            '\\ln': 'log',
            '\\lg': 'log',
            '\\min': 'min',
            // Simple Operators
            '\\cdot': '*',
            '\\sqrt':'sqrt',
            '\\times': '*',
            '\wedge': '^',
            '\\left': '',
            '\\right': '',
            '{': '(',
            '}': ')',
            '\\frac':''
        }
        var result = latex_string;
        //Dealing with $\frac{}{}$ is tricky. 
        var start = latex_string.indexOf('\\frac');
        if (start != -1) {
            // Since atleast one \\frac{}{} element exists we try to defractify the input.
            result = defractify(latex_string, '\\frac');
            console.log("After Defractify"+`${result}`);
        }
        // A method to replace all appearances of one substring by another substring.
        String.prototype.replaceAll = function (target, replacement) {
            return this.split(target).join(replacement);
        };
       

        // Here we convert the standard functions into a form that can be understood by math.js for evaluation
        // by replacing all occurrences of the latex text. 
        for (const [key, value] of Object.entries(dict)) {
            if (result.indexOf(key) != -1) {
                //Replace all occurences of that string in the latex_string
                result = result.replaceAll(key, value);
            }
        }

        return result;
    }
    
    /**
    * Remove fraction from input string
    * @param {string} - LaTeX string
    * @param {string} - LaTeX fraction keyword
    * @return {string}
    */
    function defractify(latex_string, target) {
         // This part concludes with a list which contains the indices where the \\frac{}{} element is located
        var index_list = [];
        for (i = 0; i < latex_string.length; ++i) {
            if (latex_string.substring(i, i + target.length) == target) {
                index_list.push(i);
            }
        }
        // Now we want to replace all the \\frac{}{} elements given that we know there indides.
        var result = latex_string;
        var frac_list = [];
        for (var i = 0; i < index_list.length; i++) {
            // Exp1 is the numerator or the element in the first bracket
            var exp1 = get_fraction(latex_string, index_list[i])[0];
            // Exp2 is the denominator or the element in the second bracket
            var exp2 = get_fraction(latex_string, index_list[i])[1];
            // We want to replace the \\frac{}{} expression with...
            var x = "\\frac{" + exp1.toString() + "}{" + exp2.toString() + "}";
            // with something of the form a/b which can be understood by math.js for evaluation
            var y = "(" + exp1.toString() + ")" + "/" + "(" + exp2.toString() + ")";
            result = result.replace(x, y);
        }
        return result;
    }

    /**
    * This method will return the numerator and the denominator given the index of the \\frac{}{} element and the latex_string
    * @param {String} - LaTeX string
    * @param {Number} - numerator/denominator 
    * @return {Array.<String>}
    */
    function get_fraction(latex_string, index) {
        // First we work to find the numerator
        // If we have \\frac{ax+b}{cx+d} the start corresponds to the string: 'a' 
        var start = index + 6;
        var exp1 = "";
        // Flag has an important role as it keeps on alternating everytime a bracket is encountered.
        var flag = 0;
        // Need the position of the last_bracket in order to find the denominator. 
        var last_bracket = 0
        for (var i = start; i < latex_string.length; i++) {
            // Keep on alternating the flag between 0 and 1 as we encounter a bracket
            if (latex_string[i] == '{' || latex_string[i] == '}') {
                flag = 1 - flag;
            }
            // If we encounter a closing bracket with flag = 1 it means that it is enclosing bracket and so we end our algorithm.
            if (latex_string[i] == '}' && flag == 1) {
                exp1 = latex_string.substring(start, i);
                last_bracket = i
                break;
            }
        }
        // If we have \\frac{ax+b}{cx+d} the start corresponds to the string: 'c' 
        start = last_bracket + 2;
        var exp2 = ""
        flag = 0;
        // We repeat the same process here too. 
        for (var j = start; j < latex_string.length; j++) {
            if (latex_string[j] == '{' || latex_string[j] == '}') {
                flag = 1 - flag;
            }
            if (latex_string[j] == '}' && flag == 1) {
                exp2 = latex_string.substring(start, j);
                break;
            }
        }
        // For debugging purpose: console.log("Expression returned ", exp1, " ", exp2);
        return [exp1, exp2];
    }

    /**
    * Graph the function to the DOM
    */
    function evaluate() {
        // Clear the previous output
        $('#output').empty();
        // Clear the latex input
        $('#MathJax-Element-32-Frame').empty();

        var data = document.querySelector("#contents");
        var latex_string = $('#contents').text();
        var exp = convertfromLatex(latex_string);
        // If there is an answer then child1 will say that the answer equals...
        var child1 = document.createTextNode("$" + `${exp}` + "$ = ");
        // If there is no answer then child2 will say that it cannot solve the expression. 
        var child2 = document.createTextNode("$" + `${exp}` + ".$");
        

        // The plot command takes a function f(x) and plots the curve. It is of the form plot(f(x),[-10,10])
        // First we will remove the two divs rendered_input and output.
        // We will replace them with a big div containing a canvas which will show the graph.

            try {
                var eqn = exp;
                var x_min = -10;
                var x_max = 10;
                var y_min = -10;
                var y_max = 10;
                var element = document.getElementById('output1');
                var ctx = element.getContext('2d');
                // Clear the canvas for redrawing.
                ctx.clearRect(0, 0, element.width, element.height);
                // Draw the axis again. 
                draw_axis();
                ctx.beginPath();
                var n = 2000;
                for (var i = 0; i < n; i++) {
                    var m_x = (i / (n - 1)) * (x_max - x_min) + x_min;
                    var scope = {
                        x: m_x
                    };
                    var m_y = math.eval(eqn, scope);
                    var x = delta + (i / (n - 1)) * (element.width - 2 * delta);
                    var y = (element.height-delta) - ((m_y - y_min) / (y_max - y_min)) * (element.height-2*delta);
                    ctx.lineTo(x, y);
                }
                ctx.lineWidth = 1;
                ctx.strokeStyle = "red";
                ctx.stroke();
            }
            catch (err) {
               // For debugging: console.log('Something went bad. Here is the error message  ' + `${err.message}`);
                $(document).ready(function() {
                    $("#data").effect("shake", "slow");
                });
            }
    }

    // Menu
    $("a[id^='menu']").click(function(){

        var ul = $(this).next("ul");

        if (ul.css('display') == 'none') {
            ul.fadeIn('3000').show();
            $(this).find("i").removeClass("right").addClass("down");
        } else {
            ul.hide();
            $(this).find("i").removeClass("down").addClass("right");
        }
    });

});
