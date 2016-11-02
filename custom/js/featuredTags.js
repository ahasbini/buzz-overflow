function generateNotificationFTags(changes) {
    var notNewIndexDict = {};
    var newValues = changes.allFTagFeeds.newValue;
    var oldValues = changes.allFTagFeeds.oldValue;

    $.each(newValues, function(nKey, nValue) {
        $.each(oldValues, function(oKey, oValue) {
            if (nKey == oKey) {

                $.each(nValue, function(nIndex, nnValue) {
                    $.each(oValue, function(oIndex, ooValue) {
                        if (nnValue[1] == ooValue[1]) {
                            if (typeof notNewIndexDict[nKey] == 'undefined') {
                                notNewIndexDict[nKey] = [nIndex];
                            } else {
                                var nowNewIndexDictList = notNewIndexDict[nKey];
                                nowNewIndexDictList.push(nIndex);
                                notNewIndexDict[nKey] = nowNewIndexDictList;
                            };

                        };
                    })
                })
            }
        });
    });

    $.each(notNewIndexDict, function(key, value) {
        $.each(value, function(idx, val) {
            newValues[key] = newValues[key].splice(val, 1);
        });

    });
    var updateCount = 0;
    $.each(newValues, function(key, value) {
        createFTagNotification(key, value);
        updateCount += value.length;
    });
    updateBadgeDict['f'] = updateCount;
};

function createFTagNotification(tag, value) {
    chrome.storage.local.get('notificationLimit', function(item) {
        var notificationLimit = parseInt(item.notificationLimit, "10");
        $.each(value, function(index, val) {
            var nTitle = "Featrued Question by " + val[2] + " in Tag " + tag;
            createNotification(feedType[2], nTitle, val[0], val[1]);
            if (notificationLimit > 0) {

                return index + 1 > notificationLimit;
            };
        })
    });

};

function callFTagUrls(rssTags) {
    var allTags = {};
    chrome.storage.local.get("yesFeaturedQn", function(item) {
        if (item.yesFeaturedQn == true) {

            $.each(rssTags, function(ind, val) {
                var tagUrl = fTagUrlGenerator(val);
                var response = callAjax(tagUrl);
                allTags[val] = response;
            });
            chrome.storage.local.set({
                "allFTagFeeds": allTags
            });

        }
    });
};

var fTagUrlGenerator = function(tag) {
    return "http://stackoverflow.com/feeds/tag?tagnames=" + tag + "&sort=featured"
};

function callFTagNotiGen(changes) {
    if (changes.hasOwnProperty("allFTagFeeds")) {

        generateNotificationFTags(changes);
    } else {
        return;
    };
};
