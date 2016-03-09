// Client-side code
/* jshint browser: true, jquery: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, undef: true, unused: true, strict: true, trailing: true */
var main = function () {
    "use strict";

    // TODO:  Create a function to dynamically generate the mdl-list__item
    function createNewActors() {
        // Create a new mdl list item
        var $newListItem = $("<div class=\"mdl-list__item\">").hide();

        // Use ajax load function to load a template into the newly created
        // list item DIV
        $newListItem.load("templates/new_list_item.tmpl", function() {
            // Call back function to update the content
            var $actorId, $actorName, $actorStarred;
            $actorId = $newListItem.find(".data-actorId");
            $actorName = $newListItem.find(".data-actorName");
            $actorStarred = $newListItem.find(".data-actorStarred");
            $actorId.text(999);
            $actorName.text("John Doe");
            $actorStarred.text("star");
        });

        $(".mdl-list").append($newListItem);
        $newListItem.fadeIn();
    }

    $(".container").on("click", ".action-addActor", function() {
        // TODO: coding here

        // TODO: Add entry to JSON server

        // TODO: If added successfull, create a new actor
        createNewActors();
    });

    // Add click event to the star when allow toggle of the star
    $(".container").on("click", ".action-toggleStar", function() {
        // When user click on the star, toggle the star and update the DB
        // The star is an icon child of "this" element
        var $starElement = $(this).children("i.data-actorStarred");
        var actorId= $(this).parent().parent().find("span.data-actorId").text();
        //var actorName = $(this).parent().parent().find("span.actorName").text();
        var updateData = {};

        // Fade it out
        $starElement.hide();
        // Get the toggle base on existing value
        updateData.starred = ($starElement.text() === "star")? false: true;

        // We need to perform AJAX update to the JSON server here
        $.ajax({
            url:"http://localhost:3000/actors/" + actorId,
            type: "json",
            method:"PATCH",
            data: updateData,
            success: function(result) {
                var starValue = (result.starred)? "star":"star_border";
                $starElement.text(starValue);
                $starElement.fadeIn();
            },
            error: function() {
                $starElement.fadeIn();
            }

        });
        // Stop the action to prevent follow link
        return false;
    });
};

$(document).ready(main);
