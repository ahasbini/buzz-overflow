var feedType = ['tag', 'question', 'featured', 'answer'];
var updateBadgeDict = {
    't': 0,
    'f': 0,
    'q': 0
}

chrome.runtime.onInstalled.addListener(function() {
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
