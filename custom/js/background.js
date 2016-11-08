var feedType = ['tag', 'question', 'featured', 'answer'];
var updateBadgeDict = {
    't': 0,
    'f': 0,
    'q': 0
}

chrome.runtime.onInstalled.addListener(function() {
    resetEverything();
});

chrome.alarms.onAlarm.addListener(function(alarm) {
    if (alarm.name == tagAlarmName) {
        chrome.storage.local.get("rssTags", function(item) {
            callTagUrls(item.rssTags);
            callFTagUrls(item.rssTags);
        });

    };

    if (alarm.name == qusAlarmName) {
        chrome.storage.local.get("rssQuestions", function(item) {
            callQusUrls(item.rssQuestions);
        });

    }

});

chrome.storage.onChanged.addListener(function(changes) {
    processIntervalTime(changes);
    processTags(changes);
    processQus(changes);
    updateBadge();
});

chrome.notifications.onClicked.addListener(function(notificationId) {
    if (isUrl(notificationId) == true) {
        chrome.tabs.create({ url: notificationId });
    };
});


chrome.runtime.onStartup.addListener(function() {
    createTagAlarm();
    createQusAlarm();

});
