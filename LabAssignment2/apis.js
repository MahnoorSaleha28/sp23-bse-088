function displayStories() {
    $.ajax({
        url: "https://usmanlive.com/wp-json/api/stories",
        method: "GET",
        dataType: "json",
        success: handleResponse,
        error: function (error) { console.error("Error fetching stories:", error); }
    });
}
function handleResponse(data) {
    var storiesList = $("#storiesList");
    storiesList.empty();
    $.each(data, function (index, story) {
        storiesList.append(`
            <div class="mb-3">
                <h5>${story.title}</h5>
                <div>${story.content}</div>
                <div>
                    <button class="btn btn-edit" data-id="${story.id}">Edit</button>
                    <button class="btn" data-id="${story.id}">Delete</button>
                </div>
            </div><hr />
        `);
    });
}
function deleteStory() {
    let storyId = $(this).attr("data-id");
    $.ajax({
        url: "https://usmanlive.com/wp-json/api/stories/" + storyId,
        method: "DELETE",
        success: function () { displayStories(); },
        error: function (error) { console.error("Error deleting story:", error); }
    });
}
function handleFormSubmission(event) {
    event.preventDefault();
    let storyId = $("#createBtn").attr("data-id");
    var title = $("#createTitle").val();
    var content = $("#createContent").val();
    if (storyId) {
        $.ajax({
            url: "https://usmanlive.com/wp-json/api/stories/" + storyId,
            method: "PUT",
            data: { title, content },
            success: function () { displayStories(); resetForm(); },
            error: function (error) { console.error("Error updating story:", error); }
        });
    } else {
        $.ajax({
            url: "https://usmanlive.com/wp-json/api/stories",
            method: "POST",
            data: { title, content },
            success: function () { displayStories(); resetForm(); },
            error: function (error) { console.error("Error creating story:", error); }
        });
    }
}
function editBtnClicked(event) {
    event.preventDefault();
    let storyId = $(this).attr("data-id");
    $.ajax({
        url: "https://usmanlive.com/wp-json/api/stories/" + storyId,
        method: "GET",
        success: function (data) {
            $("#clearBtn").show();
            $("#createTitle").val(data.title);
            $("#createContent").val(data.content);
            $("#createBtn").html("Update").attr("data-id", data.id);
        },
        error: function (error) { console.error("Error fetching story:", error); }
    });
}
function resetForm() {
    $("#createTitle").val("");
    $("#createContent").val("");
    $("#createBtn").html("Create").removeAttr("data-id");
    $("#clearBtn").hide();
}
$(document).ready(function () {
    displayStories();
    $(document).on("click", ".btn-del", deleteStory);
    $(document).on("click", ".btn-edit", editBtnClicked);
    $("#createForm").submit(handleFormSubmission);
    $("#clearBtn").on("click", function (e) {
        e.preventDefault();
        resetForm();
    });
});
