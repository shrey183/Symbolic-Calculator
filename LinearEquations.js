$(document).ready(function () {
    // Menu
    $("a[id^='menu']").click(function () {

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

var container = document.getElementById("cont");
var father = document.getElementById("matrix_holder");


// Triger the event click after the user presses enter after filling the number of rows.
document.getElementById("rows").addEventListener("keyup", function (event) {
    event.preventDefault();
    if (event.keyCode == 13) {
        document.getElementById("button").click();
    }
})

/**
* Generates the DOM elements for the linear equations
*/
function make_matrix() {
    // These methods clear off the previous calculations.
    $("#matrix_holder").empty();
    $("#solve_button").remove();
    $("#answer").remove();

    // Get the number of rows, which is also equal to the number of columns.
    var r = parseInt(document.querySelector("#rows").value);

    for (var i = 0; i < r; i++) {

        for (var j = 0, count = 1; j <= r; j++ , count++) {

            var node = document.createElement("input");
            // Creating little input tags to get input from the user.
            node.setAttribute("type", "text");
            node.setAttribute("size", "3");
            node.setAttribute("value", "0");
            node.setAttribute("id", `${i}${j}`);
            var para = document.createElement("a");
            var text = " ";
            var string = String(count);
            if (count == r) {
                // If it is the last input tag element, put an equals sign after it since we also want the answer vector. For instance if we have a system Ax=b, then this
                // line puts the equal sign between Ax and b.
                text = document.createTextNode(`\\(x_{${count}}\\) = `);
            }
            else if (count < r) {
                // Otherwise we will put a plus sign between the elements.
                text = document.createTextNode(`\\(x_{${count}}\\) +`);
            }
            else {
                // To give a little spacing between the input tag elements.
                text = document.createTextNode(" ");
            }
            para.appendChild(node);
            para.appendChild(text);
            // father refers to the div with id matrix_holder.
            father.appendChild(para);
        }
        // Need to give some spacing after each row if filled.
        father.appendChild(document.createElement("br"));
        father.appendChild(document.createElement("br"));
    }
    // This is very important, we need to Typeset the page again since we have new LaTex text.
    MathJax.Hub.Typeset();
    // Creating a div for the solve button
    var new_div = document.createElement("div");
    new_div.setAttribute("id", "solve_button");
    new_div.setAttribute("align", "center");
     // The solve button is created only when the input matrix appears.
    var new_button = document.createElement("button");
    new_button.setAttribute("id", "solve");
    new_button.setAttribute("onclick", "solve_matrix()");
    new_button.textContent = "Solve!";
    new_div.appendChild(new_button);
    // Recall that container refers to the div with id cont.
    container.appendChild(new_div);
}

/**
* Read the system of equations into an array of arrays of coefficients
* @return {Array.<Array<Number>>}
*/
function get_entries() {
    // If we have a system of the form Ax=b then this method will return the matrix A (coefficient matrix) and the vector b (answer matrix).


    var r = parseInt(document.querySelector("#rows").value);
    if (document.querySelector("#solve_button") != null) {
        // Then go ahead and read each input box with id "ij"
        var coeff = [];
        var ans = [];
        var system = [];
        var id = "";
        var nodeValue = "";
        // Recall that each input tag had an id of the form ij where i refered to its row number and j refered to its column number.
        // So we just iterate over all the possible values extract information.
        for (var i = 0; i < r; i++) {
            coeff[i] = [];
            system[i] = [];
;                for (var j = 0; j <= r; j++) {
                id = String(i) + String(j);
                nodeValue = document.getElementById(`${id}`).value;
                system[i].push(parseInt(nodeValue));
            }
        }
        return system;
    }
}

/**
* Perform forward elimination on the system
* @param {Array.<Array<Number>>} system - The system of equations
* @return {Number}
*/
function forwardElimination(system) {
    var mat = system 
    var r = parseInt(document.querySelector("#rows").value);
    for (var k = 0; k < r; k++) {
        // First we want the pivot with the maximum value
        var pivot_index = k;
        var pivot_value = mat[pivot_index][k]
        for (var i = k + 1; i < r; i++) {
            if (Math.abs(mat[i][k]) > pivot_value){
                pivot_index = i;
                pivot_value = mat[i][k];
            }
        }

        // Next we want to check  if the matrix is singular or not.
        if (!mat[k][pivot_index]) {
            return k;
        }

        if (pivot_index != k) {
            // Swap rows 
            for (var i = 0; i <= r; i++) {
                var temp = mat[k][i];
                mat[k][i] = mat[pivot_index][i];
                mat[pivot_index][i] = temp;
            }
            
        }
        for (var i = k + 1; i < r; i++) {
            var scale = mat[i][k] / mat[k][k];
            for (var j = k + 1; j <= r; j++) {
                mat[i][j] -= mat[k][j] * scale;
            }
            mat[i][k] = 0;
        }

    }
    
    return -1;
}

/**
* Perform back substitution on the matrix
* @param {Array.<Array.<Number>>} mat - the matrix
* @return {Array.<Number>}
*/
function backSubsitution(mat) {
    var r = parseInt(document.querySelector("#rows").value);
    var sol = new Array(r);
    // Here we have to build the solution from the last equation, all the way up to the first equation
    for (var i = r - 1; i >= 0; i--) {
        sol[i] = mat[i][r]

        for (var j = i + 1; j < r; j++) {
            sol[i] -= mat[i][j] * sol[j];
        }
        sol[i] /= mat[i][i];

    }
    return sol
}

/**
* Solve the system of equations and append to the DOM
*/
function solve_matrix() {
    // In this function the matrix is resolved using the input given by the user.

    // First remove the previous answer.
    $("#answer").remove();

    var r = parseInt(document.querySelector("#rows").value);
    // Get the coefficient and answer matrix
    var system = get_entries();
    try {

        var answ = forwardElimination(system);
        if (answ != -1) {
            // Then this means that the matrix is singular. 
            throw "given system is singular."
        }
        else {
            // The matrix is not singular and therefore has a solution 
            var sol = backSubsitution(system);
            // Creating an array that contains the answer in the form (x,y,...) instead of [x,y,...].
            var answer_string_array = ["("];
            for (var i = 1; i <= r; i++) {
                var item = sol[i - 1];
                if (i != r) {
                    answer_string_array.push(String(item) + ", ");
                }
                else {
                    answer_string_array.push(String(item) + ").");
                }
            }
            var ans_text = "The answer is " + answer_string_array.join("");
            // A new div is created which will contain the answer.
            var div_ans = document.createElement("div");
            div_ans.setAttribute("id", "answer");
            var text = document.createTextNode(ans_text + " Note that there might some imprecisions due to rounding off errors.");
            div_ans.appendChild(text);
            // Recall that container refers to the div with id cont.
            container.appendChild(div_ans);
        }
    }
    catch (err) {
        var div_ans = document.createElement("div");
        div_ans.setAttribute("id", "answer");
        var text = document.createTextNode("There is no solution to the given system. Reason: " + err);
        div_ans.appendChild(text);
        container.appendChild(div_ans);
    }
}
