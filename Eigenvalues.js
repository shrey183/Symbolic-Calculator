$("#matrix_holder1").hide();
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
var father = document.getElementById("matrix_holder1");


// Triger the event click after the user presses enter after filling the number of rows.
document.getElementById("size").addEventListener("keyup", function (event) {
    event.preventDefault();
    if (event.keyCode == 13) {
        document.getElementById("button").click();
    }
})

/**
* Generate the matrix input in the DOM
*/
function make_matrix() {
    // These methods clear of the previous calculations.
    $("#matrix_holder1").empty();
    $("#solve_button").remove();
    $("#answer").remove();

    // Show the brackets around the matrix
    $("#matrix_holder1").show();

    // Get the number of rows.
    var r = parseInt(document.querySelector("#size").value);
    for (var i = 0; i < r; i++) {

        for (var j = 0; j < r; j++) {
            // We create an input type node to get the a[i][j] entry of the matrix
            var node = document.createElement("input");
            node.setAttribute("type", "text");
            node.setAttribute("size", "2");
            node.setAttribute("value", "0");
            node.setAttribute("id", `${i}${j}`);

            // Add a little space after the input box
            var text = document.createTextNode("  ");
            var para = document.createElement("a");
            para.appendChild(node);
            para.appendChild(text);
            father.appendChild(para);
        }
        // Add newline after each row.
        father.appendChild(document.createElement("br"));
        father.appendChild(document.createElement("br"));
    }

    //Need to typeset the webpage again if needed.
    MathJax.Hub.Typeset();
    //Create the button that will allow the user to compute eigenvalues
    var new_div = document.createElement("div");
    new_div.setAttribute("id", "solve_button");
    new_div.setAttribute("align", "center");

    var new_button = document.createElement("button");
    new_button.setAttribute("id", "solve");
    new_button.setAttribute("onclick", "find_eig()");
    new_button.textContent = "Find Eigenvalues/Eigenvectors!";
    new_div.appendChild(new_button);
    //Append this to the div with id = "container"
    container.appendChild(new_div);

}

/**
* Converts input matrix values into a 2D array of input values
* @return {Array.<Array.<Number>>}
*/
function get_entries() {
    // If we have a system of the form Ax=b then this method will return the matrix A (coefficient matrix) and the vector b (answer matrix).
    var r = parseInt(document.querySelector("#size").value);
    if (document.querySelector("#solve_button") != null) {
        // Then go ahead and read each input box with id "ij"
        var coeff = [];
        var id = "";
        var nodeValue = "";
        // Recall that each input tag had an id of the form ij where i refered to its row number and j refered to its column number.
        // So we just iterate over all the possible values extract information.
        for (var i = 0; i < r; i++) {
            coeff[i] = [];
            for (var j = 0; j < r; j++) {
                id = String(i) + String(j);
                nodeValue = document.getElementById(`${id}`).value;
                coeff[i][j] = (parseInt(nodeValue));
            }
        }

        return coeff;
    }
}

/**
* Calculate the eigenvalues and output to the DOM
*/
function find_eig() {
    // This method will print the result to the user.

    // Remove the previous answer.

    $("#answer").remove();

    var matrix = get_entries();
    try {
        // sol is an array of the eigenvalues
        var sol = numeric.eig(matrix).lambda.x;
        var ans_text = "The answer is " + "(" + sol.join(",") + ").";
        var div_ans = document.createElement("div");
        div_ans.setAttribute("id", "answer");
        var text = document.createTextNode(ans_text + " Note that there might some imprecisions due to rounding off errors.");
        div_ans.appendChild(text);
        container.appendChild(div_ans);
    }
    catch (err) {
        var div_ans = document.createElement("div");
        div_ans.setAttribute("id", "answer");
        var text = document.createTextNode("Sorry, could not find Eigenvalue for the given system.");
        div_ans.appendChild(text);
        container.appendChild(div_ans);
    }
}
