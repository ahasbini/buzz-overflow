var tagAlarmName = "tagBeats"

function generateNotificationTags(changes) {
    var notNewIndexDict = {};
    var newValues = changes.allTagFeeds.newValue;
    var oldValues = changes.allTagFeeds.oldValue;

    $.each(newValues, function(nKey, nValue) {
        $.each(oldValues, function(oKey, oValue) {
            if (nKey == oKey) {

                $.each(nValue, function(nIndex, nnValue) {
                    $.each(oValue, function(oIndex, ooValue) {
                        if (nnValue[1] == ooValue[1]) {
                            if (typeof notNewIndexDict[nKey] == 'undefined') {
                                notNewIndexDict[nKey] = [nIndex];
                            } else {
                                notNewIndexDict[nKey].push(nIndex);
                                };
                        };
                    })
                })
            }
        });
    });


    $.each(notNewIndexDict, function(key, value) {
        $.each(value, function(idx, val) {
            newValues[key].splice(val, 1);
        });

    });
    var updateCount = 0
    $.each(newValues, function(key, value) {
        createTagNotification(key, value);
        updateCount += value.length;
    });
    updateBadgeDict['t'] = updateCount;

};


function createTagNotification(tag, value) {
    chrome.storage.local.get('notificationLimit', function(item) {
        var notificationLimit = parseInt(item.notificationLimit, "10");
        $.each(value, function(index, val) {
            var nTitle = "Question by " + val[2] + " in Tag " + tag;
            createNotification(feedType[0], nTitle, val[0], val[1]);
            if (notificationLimit > 0) {
                return index + 1 > notificationLimit;
            };
        })
    });

};

function callTagUrls(rssTags) {
    var allTags = {};
    chrome.storage.local.get("yesNewestQn", function(item) {
        if (item.yesNewestQn == true) {

            $.each(rssTags, function(ind, val) {
                var tagUrl = tagUrlGenerator(val);
                var response = callAjax(tagUrl);
                allTags[val] = response;
            });
            chrome.storage.local.set({
                "allTagFeeds": allTags
            });

        }
    });
};

var tagUrlGenerator = function(tag) {
    return "http://stackoverflow.com/feeds/tag?tagnames=" + tag + "&sort=newest"
};

function pullTags(changes) {
    if (changes.hasOwnProperty("rssTags")) {
        clearTagAlarm();
        var newTags = changes.rssTags.newValue;
        var opt = {
            type: "basic",
            title: "Tags Updated",
            message: "Tags have been updated ",
            iconUrl: "images/setup_icon.png"
        };
        chrome.storage.local.get("yesNotification", function(item) {
            if (item.yesNotification == true) {
                chrome.notifications.create('newTags', opt, function() {});
            };
        });

        if (newTags.length > 0) {
            callTagUrls(newTags);
            callFTagUrls(newTags);
            createTagAlarm();
        } else {
            chrome.storage.local.set({
                "allTagFeeds": {}
            });
            return;
        }
    };
};

function callTagNotiGen(changes) {

    if (changes.hasOwnProperty("allTagFeeds")) {
        generateNotificationTags(changes);
    } else {
        return;
    };

};

function clearTagAlarm() {
    chrome.alarms.clear(tagAlarmName);
};

function createTagAlarm() {
    clearTagAlarm();
    createAlarm(tagAlarmName);
};

function processTags(changes) {
    pullTags(changes);
    callTagNotiGen(changes);
    callFTagNotiGen(changes);

};
