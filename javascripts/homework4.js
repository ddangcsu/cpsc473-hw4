// Client-side code
/* jshint browser: true, jquery: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, undef: true, unused: true, strict: true, trailing: true */
var main = function () {
    "use strict";
    var restFulWsHost = "http://localhost:3000/actors";

    function statusMessage(type, msg) {
        var $status = $(".statusMessage");
        $status.removeClass("statusError statusSuccess");

        if (type === "success") {
            $status.addClass("statusSuccess");
            $status.text(msg).fadeIn().delay(300).fadeOut();
        } else {
            $status.addClass("statusError");
            $status.text(msg).fadeIn();
        }
    }

    // Create a function to dynamically generate the mdl-list__item
    function createNewActors(data) {

        var $template = $("<div class=\"mdl-list__item\">");
        $template.load("templates/new_list_item.tmpl", function (result, status) {
            if (status === "success") {
                data.forEach(function (item) {
                    // Create a new mdl list item
                    var $newListItem;
                    var starValue = "star_border";

                    if (item.starred) {
                        starValue = "star";
                    }

                    // Clone the template that we loaded
                    $newListItem = $template.clone().hide();
                    // Modify the DOM object
                    $newListItem.find(".data-actorId").text(item.id);
                    $newListItem.find(".data-actorName").text(item.name);
                    $newListItem.find(".data-actorStarred").text(starValue);

                    // Add it to the list and show it
                    $(".mdl-list").append($newListItem);
                    $newListItem.fadeIn();
                });

                statusMessage(status, "success");
            } else { // Encountered error
                statusMessage(status, "Unable to load templates/new_list_item.tmpl");
            }
            //console.log("result is:" + result + " status " + status);
        });
    }

    // Function to initially load the page with data from JSON server
    function initialLoad() {
        // Retrieve data from JSON using ajax
        // We need to perform AJAX add to the JSON server here
        $.ajax({
            url: restFulWsHost,
            type: "json",
            method: "GET",
            success: function (result) {
                // Pull multiple records will create an array of object
                createNewActors(result);
            },
            error: function (result) {
                var errMsg = "Webservices error " + result.status + ":" + restFulWsHost;
                statusMessage(result.status, errMsg);
            }
        });
    }

    // Add click event to add new star
    $(".container").on("click", ".action-addActor", function () {
        var newActor = {};
        if ($("#input-actorName").val() === "") {
            return false;
        }
        // Input has data
        newActor.name = $("#input-actorName").val();
        newActor.starred = false;
        // clear it
        $("#input-actorName").val("");
        // Must reset the parent div of the input to remove is-dirty class
        // to allow the float label to reset
        $("#input-actorName").parent().removeClass("is-dirty");
        
        // We need to perform AJAX add to the JSON server here
        $.ajax({
            url: restFulWsHost,
            type: "json",
            method: "POST",
            data: newActor,
            success: function (result) {
                // Single entry return as Object.  Convert to array
                createNewActors([result]);
            },
            error: function (result) {
                var errMsg = "Webservices error " + result.status + ":" + restFulWsHost;
                statusMessage(result.status, errMsg);
            }
        });

    });

    // Add click event to the star when allow toggle of the star
    $(".container").on("click", ".action-toggleStar", function (event) {
        // When user click on the star, toggle the star and update the DB
        // The star is an icon child of "this" element
        var $currRow = $(event.currentTarget);
        var $starElement = $currRow.children(".data-actorStarred");
        var actorId = $currRow.parent().parent().find(".data-actorId").text();
        var updateData = {};
        var starFlag = true;

        if ($starElement.text() === "star") {
            starFlag = false;
        }
        // Update the data object
        updateData.starred = starFlag;

        // We need to perform AJAX update to the JSON server here
        $.ajax({
            url: restFulWsHost + "/" + actorId,
            type: "json",
            method: "PATCH",
            data: updateData,
            success: function (result, status) {
                $starElement.hide();
                var starValue = "star";
                if (!result.starred) {
                    starValue += "_border";
                }
                $starElement.text(starValue);
                $starElement.fadeIn();
                statusMessage(status, "updated");
            },
            error: function (result) {
                var errMsg = "Webservices error " + result.status + ":" + restFulWsHost;
                statusMessage(result.status, errMsg);

            }
        });
        // Stop the action to prevent follow link
        return false;
    });

    // Run the initial load function here
    initialLoad();
};

$(document).ready(main);
