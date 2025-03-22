function onRefresh() {
    loadCurrentUserIntoMemoryFromCookies();

    modifyUser = currentUser;
}

function getGradeLevelSettings(grade) {
    var settings = new Settings();

    // clear out all problems
    for (var i = 0; i < settings.FirstNumber.length; i++) {
        settings.FirstNumber[i] = false;
        settings.SecondNumber[i] = false;
    }
    settings.Operations.Add = false;
    settings.Operations.Subtract = false;
    settings.Operations.Multiply = false;
    settings.Operations.Divide = false;
    settings.Operations.SwapNumbers = false;

    switch (grade) {
        case 'K':
            settings.Operations.Add = true;

            for (var i = 0; i <= 5; i++) {
                settings.FirstNumber[i] = true;
                settings.SecondNumber[i] = true;
            }

            break;

        case '1':

            settings.Operations.Add = true;
            settings.Operations.Subtract = true;

            for (var i = 0; i <= 10; i++) {
                settings.FirstNumber[i] = true;
                settings.SecondNumber[i] = true;
            }

            break;
        case '2':

            settings.Operations.Add = true;
            settings.Operations.Subtract = true;

            for (var i = 0; i <= 12; i++) {
                settings.FirstNumber[i] = true;
                settings.SecondNumber[i] = true;
            }

            break;
        case '3':

            settings.Operations.Multiply = true;

            for (var i = 0; i <= 10; i++) {
                settings.FirstNumber[i] = true;
                settings.SecondNumber[i] = true;
            }

            break;
        case '4':

            settings.Operations.Multiply = true;

            for (var i = 0; i <= 12; i++) {
                settings.FirstNumber[i] = true;
                settings.SecondNumber[i] = true;
            }

            break;
        case '5':
            settings.Operations.Multiply = true;
            settings.Operations.Divide = true;

            for (var i = 0; i <= 12; i++) {
                settings.FirstNumber[i] = true;
                settings.SecondNumber[i] = true;
            }

            break;
        case '6':
            settings.Operations.Multiply = true;
            settings.Operations.Divide = true;

            for (var i = 0; i <= 12; i++) {
                settings.FirstNumber[i] = true;
                settings.SecondNumber[i] = true;
            }
            break;
        default:
            settings.Operations.Multiply = true;
            settings.Operations.Divide = true;

            for (var i = 0; i <= 12; i++) {
                settings.FirstNumber[i] = true;
                settings.SecondNumber[i] = true;
            }

            break;
    }

    return settings;
}

// document.ready
$(function () {
    onRefresh();

    // on operation button clicked
    $(".grade_button").on('click', function (event) {
        var buttonId = $(this).attr('id');
        const items = buttonId.split("_");

        var gradeValue = items[2];
        if (gradeValue == "custom") {
            // redirect to the Operations page
            // for custom settigns
            location.href = 'Operations';
            return;
        }

        var settings = getGradeLevelSettings(gradeValue);
        currentUser.Settings = settings;
        saveCurrentUserSettingsIntoCookies();

        // go back to the main page
        location.href = 'Main';
    });
});