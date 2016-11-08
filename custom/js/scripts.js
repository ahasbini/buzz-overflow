function resetEverything() {
    chrome.storage.local.set({ "rssFeedTime": 10 });
    chrome.storage.local.set({ "notificationTime": 10 });
    chrome.storage.local.set({ "notificationLimit": -1 });
    chrome.storage.local.set({ "yesNotification": true });
    chrome.storage.local.set({ "rssQuestions": [] });
    chrome.storage.local.set({ "rssTags": [] });
    chrome.storage.local.set({ "allFTagFeeds": {} });
    chrome.storage.local.set({ "allTagFeeds": {} });
    chrome.storage.local.set({ "allQusFeeds": {} });
    chrome.storage.local.set({ "yesFeaturedQn": false });
    chrome.storage.local.set({ "yesNewestQn": true });
}

function callAjax(rssUrl) {
    var responseList = [];
    try {
        var response = $.ajax({
            type: 'GET',
            url: rssUrl,
            dataType: 'xml',
            async: false

        }).responseText;

        var xmlParse = function(xml) {
            $(xml).find("entry").each(function() {
                var title = $(this).find("title").text();
                var link = $(this).find("link").attr("href");
                var author = $(this).find("author").find("name").text();
                responseList.push([title, link, author]);

            });
        };
        xmlParse(response);
    } catch (err) {
        console.log(err);

    };
    return responseList;
};

function createAlarm(alarmName) {
    chrome.storage.local.get("yesNotification", function(items) {
        if (items.yesNotification == true) {
            chrome.storage.local.get("rssFeedTime", function(item) {
                var periodInMinutez = parseInt(item.rssFeedTime);
                if (periodInMinutez > 0) {
                    var alarmObj = {
                        delayInMinutes: 1,
                        periodInMinutes: periodInMinutez
                    }
                    chrome.alarms.create(alarmName, alarmObj);
                };

            });

        };
    });
};

function stopAlarm() {
    chrome.alarms.clearAll();
};

function createNotification(type, title, message, link) {

    chrome.storage.local.get("yesNotification", function(item) {
        if (item.yesNotification == true) {
            var opt = {
                type: "basic",
                title: title,
                message: message,
                iconUrl: "images/notification_" + type + "_icon.png"
            };
            chrome.notifications.create(link, opt, function() {});
        };
    })
};

function processIntervalTime(changes) {
    if (changes.hasOwnProperty("rssFeedTime") == true) {
        clearAllAlarms();
        createNewAlarm();
        intervalUpdatedNoti(changes);
    };
};

function clearAllAlarms() {
    clearTagAlarm();
    clearQusAlarm();
}

function createNewAlarm() {
    createTagAlarm();
    createQusAlarm();
}

function intervalUpdatedNoti(changes) {
    if (changes.hasOwnProperty("rssFeedTime") == true) {
        var opt = {
            type: "basic",
            title: "Pull Interval Time Updated",
            message: "Pull Iterval Time have been updated to "+ changes.rssFeedTime.newValue.toString() + " minute(s)",
            iconUrl: "images/setup_icon.png"
        };

        chrome.storage.local.get("yesNotification", function(item) {
            if (item.yesNotification == true) {
                chrome.notifications.create('checkInt', opt, function() {});
            };
        });

    }

};

function updateBadge() {

    var updatedList = [];
    $.each(updateBadgeDict, function(key, value) {
        updatedList.push(value.toString());
    })

    chrome.browserAction.setBadgeText({ text: updatedList.join(',') });
};

function checkHasSO(val) {
    if (val.toLowerCase().indexOf("stackoverflow") > 0) {
        return true;
    } else {
        return false
    };
};

function isSOQuestion(val) {
    if (checkHasSO(val) == true && val.toLowerCase().indexOf("questions") > 0) {
        return true;
    } else {
        return false;
    };
};

function isUrl(val) {
    var urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
    return urlregex.test(val);
};

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
