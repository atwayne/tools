/**
 * Created by Wayne on 6/26/2015.
 */
var app = {
    init: function () {
        app.bindUI();
        app.bindEvents();
    },
    bindEvents: function () {
        app.bindClickEventOnButtonsWithTransformAction();
        app.bindClickEventOnUndoButton();
    },
    bindUI: function () {
        app.applyLinedTextareaToContainer();
    },
    bindClickEventOnButtonsWithTransformAction: function () {
        $('.btn-with-transform-action').click(function (event) {
            var $target = $(event.target);
            var action = app.methods[$target.data('transform')];
            if (typeof action === "function")
                app.applyTransform(action);
        });
    },
    bindClickEventOnUndoButton: function () {
        $('#Undo').click(function () {
            var history = $('#content').data('history');
            if (history) {
                var content = history.pop();
                $('#content').val(content);
            }
        });
    },
    applyLinedTextareaToContainer: function () {
        $("#content").linedtextarea();
    },
    applyTransform: function (action) {
        var content = $('#content').val();
        var history = $('#content').data('history');
        if (!history) {
            history = new Array();
        }
        history.push(content);

        if (history.length > 40) {
            history = history.shift();
        }

        $('#content').data('history', history);

        $('#content').val(action(content));
    },
    methods: {
        removeEmptyLine: function (text) {
            return text.replace(/^\s*\n/gm, '');
        },
        createSqlInClause: function (text) {
            var lines = text.split('\n');
            return lines.map(function (element) {
                return "'" + element + "',"
            }).join('\n').replace(/,+$/, "");
        },
        createSqlValuesClause: function (text) {
            var lines = text.split('\n');
            var result = lines.map(function (element) {
                return "('" + element.replace(/\t/gm, "','") + "')";
            }).join('\n');
            return result;
        },
        createSqlSelectClause: function (text) {
            var lines = text.split('\n');
            var result = lines.map(function (element) {
                return '[' + element.replace(/\t/gm, "],[") + ']';
            }).join('\n');
            return result;
        },
        toPrettyJSON: function (text) {
            return JSON.stringify(JSON.parse(text), undefined, 4);
        },
        toPrettyXml: function (text) {
            var pb = new pp();
            return pb.xml(text);
        }
    }
};
(function () {
    $(document).ready(function () {
        app.init();
    });
})();