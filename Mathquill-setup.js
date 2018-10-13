// This is standard use of MathQuill as discussed on their website.
var mathFieldSpan = document.getElementById('data');
var contentsSpan = document.getElementById('contents');
var MQ = MathQuill.getInterface(2);
var mathField = MQ.MathField(mathFieldSpan, {
    spaceBehavesLikeTab: true,
    handlers: {
        edit: function (MathField) {
            // Even though the span with id contents is hidden, it contains the input converted into latex which will be parsed and evaluated.
            const contents = MathField.latex();
            contentsSpan.innerText = contents;
        }
    }
});
