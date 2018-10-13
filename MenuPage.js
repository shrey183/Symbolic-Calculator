$(document).ready(function () {   
    // Press enter to evaluate the expression
    document.getElementById("data").addEventListener("keyup", function (event) {
        event.preventDefault();
        if (event.keyCode == 13) {
            evaluate();
        }
    });
    
    // To show the input on the div with id output as it is being typed. 
    var data = document.getElementById('data');
    data.onkeyup = function () {
        document.getElementById('rendered_input').innerHTML = `$${data.value}$`;
        // For debugging
        // console.log(data.value);
        MathJax.Hub.Typeset();
    };

    // To clear the output div when backspace is pressed
    var output = document.getElementById("output");
    data.addEventListener("keydown", function (event) {
        if (event.keyCode == 8) {
            $(document).ready(function () {
                $('#output').empty();
            });
        }
    });


    /**
    * Replaces symbols with evaluable expressions
    * @param {string} expression - The expression to be converted
    * @return {string} The evaluable expression
    */
    function convert(expression){
        // Part 1) Arithmetic Expressions. These expressions will involve the following symbols: (,),%,*,/,+,^ and -.
        //         These will be evaluated using the eval function. The only problem is with the the symbol $^$. We need to convert $**$ to $^$
        if (expression.indexOf('^') != -1) {
            expression = expression.replace('^', '**');
        }
        // Part 2) Exponential, Trig and Hyperbolic functions. These expression will involve the following symbols:
        //         exp, Currently no support for complex numbers (i)
        //         pi, sin, cos, tan, arcsin, arccos, arctan,
        //         sinh, cosh, tanh, arcsinh, arccosh, arctanh
        //If there is an exponential
        if (expression.indexOf('e') != -1) {
            expression = expression.replace('e', 'Math.E');
        }
        if (expression.indexOf('exp') != -1) {
            expression = expression.replace('exp', 'Math.E');
        }
        // If there is a Pi
        if (expression.indexOf('pi') != -1) {
            expression = expression.replace('pi', 'Math.PI');
        }
        // If there are trig functions
        if (expression.indexOf('sin') != -1) {
            expression = expression.replace('sin', 'Math.sin');
        }
        if (expression.indexOf('cos') != -1) {
            expression = expression.replace('cos', 'Math.cos');
        }
        if (expression.indexOf('tan') != -1) {
            expression = expression.replace('tan', 'Math.tan');
        }
        if (expression.indexOf('arcsin') != -1) {
            expression = expression.replace('csrcc', 'Math.asin');
        }
        if (expression.indexOf('arccos') != -1) {
            expression = expression.replace('sin', 'Math.acos');
        }
        if (expression.indexOf('arctan') != -1) {
            expression = expression.replace('sin', 'Math.atan');
        }
        if (expression.indexOf('sinh') != -1) {
            expression = expression.replace('sin', 'Math.sinh');
        }
        if (expression.indexOf('cosh') != -1) {
            expression = expression.replace('sin', 'Math.cosh');
        }
        if (expression.indexOf('tanh') != -1) {
            expression = expression.replace('sin', 'Math.tanh');
        }
        if (expression.indexOf('arcsinh') != -1) {
            expression = expression.replace('sin', 'Math.asinh');
        }
        if (expression.indexOf('arccosh') != -1) {
            expression = expression.replace('sin', 'Math.acosh');
        }
        if (expression.indexOf('arctanh') != -1) {
            expression = expression.replace('sin', 'Math.atanh');
        }
        // Part 3) Logarithms:
        // Natural log as ln and log base 10 as log
        if (expression.indexOf('log') != -1) {
            expression = expression.replace('log', 'Math.log10');
        }
        if (expression.indexOf('ln') != -1) {
            expression = expression.replace('ln', 'Math.log');
        }
        //Part 4) Special functions:
        // sqrt, max, min, abs
        if (expression.indexOf('sqrt') != -1) {
            expression = expression.replace('sqrt', 'Math.sqrt');
        }
        if (expression.indexOf('max') != -1) {
            expression = expression.replace('max', 'Math.max');
        }
        if (expression.indexOf('min') != -1) {
            expression = expression.replace('min', 'Math.min');
        }
        if (expression.indexOf('abs') != -1) {
            expression = expression.replace('abs', 'Math.abs');
        }
        
        return expression;
    };

    /**
    * Evalueate the expression
    */
    function evaluate() {
        // Clear the previous output
        $('#output').empty();
        // Clear the latex input
        $('#MathJax-Element-32-Frame').empty();

        var data = document.querySelector("#data");
        var exp = data.value;
        // If there is an answer then child1 will say that the answer equals...
        var child1 = document.createTextNode("$" + `${exp}` + "$ = ");
        // If there is no answer then child2 will say that it cannot solve the expression. 
        var child2 = document.createTextNode("$" + `${exp}` + ".$");

        var para = document.createElement("p");

        // Check if there are special commands.
        // diff(exp) for differentiating expression
        // x will be treated as a variable and all other alphabets will be treated as constants.
        
        if (exp.indexOf("d/dx") != -1)
        {
            try{
                var start = exp.indexOf('(');
                var end = exp.lastIndexOf(')');
                if (start == -1 || end == -1){
                    throw "Missing Brackets ";
                }
                else{
                var eqn = exp.substring(start+1,end);
                var ans = math.derivative(eqn,'x');
                var node1 = document.createTextNode("$"+ans+"$.");
                para.appendChild(child1);
                para.appendChild(node1);
                }

            }
            catch (err) {
                $("#data").effect("shake", "slow");
                var node2 = document.createTextNode(`${err}`);
                para.appendChild(node2);
                para.appendChild(child2);
            }
        }
        // Here algebraic expressions can be simplified. Like $5x+10x = 11x.$
        else if (exp.indexOf('simp')!=-1)
        {
            try{
                var start = exp.indexOf('(');
                var end = exp.lastIndexOf(')');
                if (start == -1 || end == -1){
                    throw "Missing Brackets ";
                }
                else{
                var eqn = exp.substring(start+1,end);
                console.log(eqn);
                var ans = math.simplify(eqn);
                var node1 = document.createTextNode("$"+ans+"$.");
                para.appendChild(child1);
                para.appendChild(node1);
                }
            }
            catch (err) {

                $("#data").effect("shake", "slow");
                var node2 = document.createTextNode(`${err}`);
                para.appendChild(node2);
                para.appendChild(child2);
            }
        }

        // Otherwise the expression will be converted and evaluated using eval method in Javascript
        else{
            expression = convert(exp);
        try {
            var node1 = document.createTextNode("$"+eval(expression)+"$");
            para.appendChild(child1);
            para.appendChild(node1);
        }
        catch (err) {
            $("#data").effect("shake", "slow");
            var node2 = document.createTextNode("I can't solve ");
            para.appendChild(node2);
            para.appendChild(child2);
        }
        }
        var element = document.getElementById("output");
        element.appendChild(para);        
    }

    /**
    * Returns true if n is prime
    * @param {Number} n - Number to check if prime
    * @return {Boolean}
    */
    function isPrime(n) {
        if (n < 1) return false;
        if (n === 2) return true;
        if (n === 3) return false;
        if (n % 2 == 0) return false;
        if (n % 3 == 0) return false;

        var i = 5
            w = 2;

        while (i * i <= n) {
            if (n % i == 0) return false;
            i += w;
            w = 6 - w;
      }

        return true;
    };

    /**
    * Toggles the menu
    */
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
