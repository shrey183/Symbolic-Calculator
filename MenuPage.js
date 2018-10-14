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
            try {
                var node1 = document.createTextNode("$"+math.eval(exp)+"$");
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
