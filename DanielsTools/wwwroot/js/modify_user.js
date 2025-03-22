var modifyUser = {};
function initializeModifyUser() {
    modifyUser = {};
    modifyUser.AvatarId = 0;
    var studentName = "";
    modifyUser.OriginalUsername = studentName;
    modifyUser.Username = studentName;
    modifyUser.Color = "";
    modifyUser.IsNewUser = true;
    modifyUser.Settings = new Settings();
}

function loadCurrentUserIntoUpdateFields() {

    // load current username
    $("#newUsernameTextBox").val(modifyUser.Username);
    $("#currentUserProfileNameSpan").html(modifyUser.Username);

    // load current avatar
    var avatar = EMOJI_DICTIONARY[modifyUser.AvatarId];
    if (!avatar) {
        avatar = "";
    }

    var avatarHTML = "<div class='current_user_avatar'>" + avatar + "</div>";
    $("#currentUserProfileAvatarDiv").html(avatarHTML);

    // load current color
    $("#currentUserProfileColor").css('background-color', modifyUser.Color);
}

function onRefresh() {
    var currentUserId = getCookie(CURRENT_USER_ID_COOKIE_NAME);

    if (currentUserId == "") {
        // if creating new user auto show name modal
        initializeModifyUser();

        $('#chooseNameModal').modal('show');
        modifyUser.IsNewUser = true;
    }
    else {
        loadCurrentUserIntoMemoryFromCookies();
        modifyUser.IsNewUser = false;
    }

    loadCurrentUserIntoUpdateFields();
}

function saveModifiedUserToMemory() {
    if (modifyUser.UserId && modifyUser.UserId != "") {
        // we already have a user id, update the user
        for (var i = 0; i < localUsers.users.length; i++) {
            if (localUsers.users[i].UserId == modifyUser.UserId) {
                localUsers.users[i] = modifyUser;
            }
        }
    }
    else {
        // set id of new user to timestamp
        modifyUser.UserId = getTimeStamp();

        localUsers.users.push(modifyUser);
    }

    setCookie(CURRENT_USER_ID_COOKIE_NAME, newUser.UserId);

    saveUserListToCookie();

    if (modifyUser.Settings.OperationsInitialized == false) {
        // redirect to operations page
        location.href = "ChooseGrade";
    }
    else if (modifyUser.Settings.OperationsInitialized == false) {
        // redirect to operations page
        location.href = "Operations";
    }
    else if (modifyUser.Settings.NumbersInitialized == false) {
        // redirect to numbers page
        location.href = "Numbers";
    }
    else {
        // go back to main page on save
        location.href = 'Main';
    }
}

function searchEmojis() {
    var emojiSearchTerm = $("#emojiSearchBox").val().toUpperCase();
    $('.emoji_button').each(function (i, obj) {
        var currentDesc = $(this).attr('name')
        if (currentDesc.toUpperCase().indexOf(emojiSearchTerm) === -1) {
            // search term, not found, hide
            $(this).hide();
        }
        else {
            $(this).show();
        }
    });
}

function setNewAvatar() {
    if (modifyUser.AvatarId === 0) {
        $("#avatarErrorSpan").html("Choose An Avatar");
        return;
    }
    loadCurrentUserIntoUpdateFields();

    //clear avatar error if exists
    $("#avatarErrorSpan").html("");

    // avatar is good, move on to color
    $('#chooseAvatarModal').modal('hide');

    if (modifyUser.Color == "") {
        // avatar is good, move on to color
        $('#chooseColorModal').modal('show');
    }
}


function setModifyUsername() {
    modifyUser.Username = $("#newUsernameTextBox").val();

    modifyUser.Username = modifyUser.Username.trim();

    if (modifyUser.Username === null || modifyUser.Username.match(/^\s*$/) !== null) {
        errorString = "Please enter a value";
        $("#nameErrorSpan").html(errorString);
        return;
    }

    // only validation we are doing for the name
    if (modifyUser.Username.length > 20) {
        errorString = "Name is too long";
        $("#nameErrorSpan").html(errorString);
        return;
    }

    if (!isStringAlphaNumeric(modifyUser.Username)) {
        errorString = "Only letters and numbers please";
        $("#nameErrorSpan").html(errorString);
        return;
    }

    // clear any name error if it exists
    $("#nameErrorSpan").html("");


    if (modifyUser.OriginalUsername == "") {
        // only set the original username if this is a new user we are creating
        modifyUser.OriginalUsername = modifyUser.Username;
    }

    loadCurrentUserIntoUpdateFields();

    $('#chooseNameModal').modal('hide');

    if (modifyUser.AvatarId == 0) {
        // if they have not chosen an avatar (if it is a new user)
        // automatically show the avatar modal
        $('#chooseAvatarModal').modal('show');
    }
}


function loadEventHandlers() {

    // on emoji search
    $('#emojiSearchBox').on('input', function (e) {
        searchEmojis();
    });

    $('#chooseNameModal').on('shown.bs.modal', function () {
        $(this).find('[autofocus]').focus();
    });

    $("#closeUsernameModalButton").on('click', function (event) {
        if (modifyUser.IsNewUser) {
            // cancel the whole creation process
            // go back to main page
            location.href = 'Main';
        }
        else {
            // cancel just the name modal opening
            $('#chooseNameModal').modal('hide');
        }
    });

    $("#cancelAvatarButton").on('click', function (event) {
        if (modifyUser.IsNewUser) {
            // cancel the whole creation process
            // go back to main page
            location.href = 'Main';
        }
        else {
            // cancel just the name modal opening
            $('#chooseNameModal').modal('hide');
        }
    });

    $("#setNewUsernameButton").on('click', function (event) {
        setModifyUsername();
    });


    // on emoji button clicked
    $(".emoji_button").on('click', function (event) {

        $('.emoji_button').each(function (i, obj) {
            $(this).css('background-color', 'transparent');
        });

        $(this).css('background-color', 'lime');

        // get the id of the clicked element
        var idString = $(this).attr('id')

        // get just the number in the string
        idString = idString.replace(/\D/g, '');
        modifyUser.AvatarId = idString;

        event.stopPropagation();
        event.stopImmediatePropagation();
    });

    // on color button clicked
    $(".color_button").on('click', function (event) {

        $('.color_button').each(function (i, obj) {
            $(this).removeClass("chosen_color_border");
            $(this).addClass("not_chosen_color_border");
        });

        $(this).removeClass("not_chosen_color_border");
        $(this).addClass("chosen_color_border");

        // get the name of the clicked element
        // which contains the color
        modifyUser.Color = $(this).attr('name');
    });


    $("#setAvatarButton").on('click', function () {
        setNewAvatar();
    });

    $("#setColorButton").on('click', function () {
        loadCurrentUserIntoUpdateFields();
    });

    $("#updateUserProfileButton").on('click', function () {
        saveModifiedUserToMemory();
    });

    $("#cancelUserChangesButton").on('click', function () {
        modifyUser = {};

        // go back to main page
        location.href = 'Main';
    });


}// end of event handlers

// document.ready
$(function () {
    onRefresh();

    loadEventHandlers();
});