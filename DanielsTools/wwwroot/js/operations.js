var modifyUser = {};

function turnOnOffOperationButtonsBasedOnSettings() {
    $("#add_operation_button").removeClass("operation_button_on");
    $("#add_operation_button").removeClass("operation_button_off");
    $("#add_current_toggle").removeClass("bi-toggle-on");
    $("#add_current_toggle").removeClass("bi-toggle-off");

    if (modifyUser.Settings.Operations.Add) {
        $("#add_operation_button").addClass("operation_button_on");
        $("#add_current_toggle").addClass("bi-toggle-on");
        $("#onoff_add").text("ON");

    }
    else {
        $("#add_operation_button").addClass("operation_button_off");
        $("#add_current_toggle").addClass("bi-toggle-off");
        $("#onoff_add").text("OFF");
    }

    $("#subtract_operation_button").removeClass("operation_button_on");
    $("#subtract_operation_button").removeClass("operation_button_off");
    $("#subtract_current_toggle").removeClass("bi-toggle-on");
    $("#subtract_current_toggle").removeClass("bi-toggle-off");

    if (modifyUser.Settings.Operations.Subtract) {
        $("#subtract_operation_button").addClass("operation_button_on");
        $("#subtract_current_toggle").addClass("bi-toggle-on");
        $("#onoff_sub").text("ON");

    }
    else {
        $("#subtract_operation_button").addClass("operation_button_off");
        $("#subtract_current_toggle").addClass("bi-toggle-off");
        $("#onoff_sub").text("OFF");
    }

    $("#multiply_operation_button").removeClass("operation_button_on");
    $("#multiply_operation_button").removeClass("operation_button_off");
    $("#multiply_current_toggle").removeClass("bi-toggle-on");
    $("#multiply_current_toggle").removeClass("bi-toggle-off");

    if (modifyUser.Settings.Operations.Multiply) {
        $("#multiply_operation_button").addClass("operation_button_on");
        $("#multiply_current_toggle").addClass("bi-toggle-on");
        $("#onoff_mult").text("ON");

    }
    else {
        $("#multiply_operation_button").addClass("operation_button_off");
        $("#multiply_current_toggle").addClass("bi-toggle-off");
        $("#onoff_mult").text("OFF");

    }

    $("#divide_operation_button").removeClass("operation_button_on");
    $("#divide_operation_button").removeClass("operation_button_off");
    $("#divide_current_toggle").removeClass("bi-toggle-on");
    $("#divide_current_toggle").removeClass("bi-toggle-off");

    if (modifyUser.Settings.Operations.Divide) {
        $("#divide_operation_button").addClass("operation_button_on");
        $("#divide_current_toggle").addClass("bi-toggle-on");
        $("#onoff_divide").text("ON");

    }
    else {
        $("#divide_operation_button").addClass("operation_button_off");
        $("#divide_current_toggle").addClass("bi-toggle-off");
        $("#onoff_divide").text("OFF");

    }

    $("#swap_operation_button").removeClass("operation_button_on");
    $("#swap_operation_button").removeClass("operation_button_off");

    $("#swap_current_toggle").removeClass("bi-toggle-on");
    $("#swap_current_toggle").removeClass("bi-toggle-off");


    if (modifyUser.Settings.Operations.SwapNumbers) {
        $("#swap_operation_button").addClass("operation_button_on");
        $("#swap_current_toggle").addClass("bi-toggle-on");
        $("#onoff_swap").text("ON");


    }
    else {
        $("#swap_operation_button").addClass("operation_button_off");
        $("#swap_current_toggle").addClass("bi-toggle-off");
        $("#onoff_swap").text("OFF");
    }
}

function turnOperationOnOff(buttonId) {
    const items = buttonId.split("_");

    var operationType = items[0];
    if (operationType == "add") {
        modifyUser.Settings.Operations.Add = !modifyUser.Settings.Operations.Add;
    }
    else if (operationType == "subtract") {
        modifyUser.Settings.Operations.Subtract = !modifyUser.Settings.Operations.Subtract;
    }
    else if (operationType == "multiply") {
        modifyUser.Settings.Operations.Multiply = !modifyUser.Settings.Operations.Multiply;
    }
    else if (operationType == "divide") {
        modifyUser.Settings.Operations.Divide = !modifyUser.Settings.Operations.Divide;
    }
    else if (operationType == "swap") {
        modifyUser.Settings.Operations.SwapNumbers = !modifyUser.Settings.Operations.SwapNumbers;
        showMessageModal(false, "Swap Setting", "This setting will sometimes swap the first and second numbers in addition and multiplication facts.")
    }

    saveCurrentUserSettingsIntoCookies();

    turnOnOffOperationButtonsBasedOnSettings();
}

function onRefresh() {
    loadUsersIntoMemoryFromCookies();
    var currentUserId = getCookie(CURRENT_USER_ID_COOKIE_NAME);

    // is existing user
    for (var i = 0; i < localUsers.users.length; i++) {
        var currentUserInList = localUsers.users[i];
        if (currentUserInList.UserId == currentUserId) {
            modifyUser = currentUserInList;

            // to do - find out where this would go
            //turnOnOffNumberButtonsBasedOnSettings();
            //turnOnOffOperationButtonsBasedOnSettings();

            //setCookie(CURRENT_USER_ID_COOKIE_NAME, currentUserId);
            break;
        }
    }
}

// document.ready
$(function () {
    onRefresh();

    turnOnOffOperationButtonsBasedOnSettings();
    // on operation button clicked
    $(".operation_button").on('click', function (event) {
        var buttonId = $(this).attr('id');
        turnOperationOnOff(buttonId)
    });
});