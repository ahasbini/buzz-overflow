function generateNotificationFTags(changes) {
    var newValues = changes.allFTagFeeds.newValue;
    var oldValues = changes.allFTagFeeds.oldValue;

    $.each(oldValues, function(key, value) {
        if (key in newValues) {
            $.each(value, function(idx, val) {
                $.each(newValues[key], function(idxn, valn) {
                    if (typeof valn == "undefined") {
                        newValues[key].splice(idxn, 1);
                    } else if (val[1] == valn[1]) {
                        newValues[key].splice(idxn, 1);
                    };
                });
            })
        }
    })

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
            if (notificationLimit == -1 || (notificationLimit > 0 && notificationLimit > index)) {
                var nTitle = "Featrued Question by " + val[2] + " in Tag " + capitalizeFirstLetter(tag);
                createNotification(feedType[2], nTitle, val[0], val[1]);
            } else {
                return false
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
    $.each(normalizableChars, function( k, v ) {
        if (tag.indexOf(k) > 0) {
            tag.split(k).join(v);
        }
        
    });
    return "http://stackoverflow.com/feeds/tag?tagnames=" + tag + "&sort=featured"
};

var normalizableChars = {
    '%': '%25',
    '#': '%23',
    '+': '%2B',
    ' ': '%20',
    '$': '%24',
    '&': '%26',
    '`': '%60',
    ':': '%3A',
    '<': '%3C',
    '>': '%3E',
    '[': '%5B',
    ']': '%5D',
    '{': '%7B',
    '}': '%7D',
    '“': '%22',
    '@': '%40',
    '/': '%2F',
    ';': '%3B',
    '=': '%3D',
    '?': '%3F',
    '^': '%5E',
    '|': '%7C',
    '~': '%7E',
    "‘": '%27',
    ',': '%2C' 
};

function callFTagNotiGen(changes) {
    if (changes.hasOwnProperty("allFTagFeeds")) {

        generateNotificationFTags(changes);
    } else {
        return;
    };
};
