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
* @return {Array.<Array.<Number>>}
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
                for (var j = 0; j <= r; j++) {
                id = String(i) + String(j);
                nodeValue = document.getElementById(`${id}`).value;
                system[i].push(parseInt(nodeValue));
            }
        }
        return system;
    }
}

/**
* Get the coefficient matrix from the system matrix
* @param {Array.<Array.<Number>>} system - full system matrix
* @return {Array.<Array.<Number>>}
*/
function get_coefficients(system) {
    var coefficients = [];
    system.forEach(function(line) {
        var temp = [];
        for(var i = 0; i < line.length -1; i++){
            temp.push(line[i]);
        }
        coefficients.push(temp);
    });

    return coefficients;
}

/**
* Get the solutions from the system matrix
* @param {Array.<Array.<Number>>} system - full system matrix
* @return {<Array.<Number>>}
*/
function get_solutions(system) {
    var solutions = [];
    system.forEach(function(line){
        solutions.push(line[line.length - 1]);
    });

    return solutions;
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
    var sys_coefficients = get_coefficients(system);
    var sys_solutions = get_solutions(system);
    try {

        var answer_string_array = math.usolve(sys_coefficients, sys_solutions);

        var ans_text = "The answer is (" + answer_string_array.join(",") + ")";
        // A new div is created which will contain the answer.
        var div_ans = document.createElement("div");
        div_ans.setAttribute("id", "answer");
        var text = document.createTextNode(ans_text + " Note that there might some imprecisions due to rounding off errors.");
        div_ans.appendChild(text);
        // Recall that container refers to the div with id cont.
        container.appendChild(div_ans);
    }
    catch (err) {
        var div_ans = document.createElement("div");
        div_ans.setAttribute("id", "answer");
        var text = document.createTextNode("There is no solution to the given system. Reason: " + err);
        div_ans.appendChild(text);
        container.appendChild(div_ans);
    }
}
