var qusAlarmName = "questionBeats"

function generateNotitifcationQus(changes) {

    var notNewIndexDict = {};
    var newValues = changes.allQusFeeds.newValue;
    var oldValues = changes.allQusFeeds.oldValue;
    $.each(newValues, function(nKey, nValue) {
        $.each(oldValues, function(oKey, oValue) {
            if (nKey == oKey) {
                $.each(nValue, function(nIndex, nnValue) {
                    $.each(oValue, function(oIndex, ooValue) {
                        if (nnValue[1] == ooValue[1]) {
                            if (typeof notNewIndexDict[nKey] == 'undefined') {
                                notNewIndexDict[nKey] = [nIndex];
                            } else {
                                console.log(nKey);
                                console.log('----------')
                                console.log(notNewIndexDict)

                                console.log('----------')
                                var nowNewIndexDictList = notNewIndexDict[nKey];
                                console.log(nowNewIndexDictList);
                                
                                console.log('----------')
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
            newValues[key].splice(val, 1);
        });

    });

    var updateCount = 0;
    $.each(newValues, function(key, value) {
        createQusNotification(key, value);
        updateCount += value.length;
    });
    updateBadgeDict['q'] = updateCount;
};

function createQusNotification(q, value) {

    chrome.storage.local.get('notificationLimit', function(item) {
        var notificationLimit = parseInt(item.notificationLimit, "10");
        $.each(value, function(index, val) {
            if (index == 0) {
                var nTitle = "Question by " + val[2];
                createNotification(feedType[1], nTitle, val[0], val[1]);
            } else {

                var nTitle = "Answer by " + val[2];
                createNotification(feedType[3], nTitle, val[0], val[1]);

            }

            if (notificationLimit > 0) {
                return index + 1 > notificationLimit;
            };
        })
    });
};

function callQusUrls(rssQuestions) {
    var questions = {}
    $.each(rssQuestions, function(ind, val) {
        var qusUrl = questionUrlGenerator(val);
        var response = callAjax(qusUrl);
        questions[val] = response;

    });

    chrome.storage.local.set({
        "allQusFeeds": questions
    });
}

var questionUrlGenerator = function(question) {
    var q = [question.slice(0, 25), 'feeds/question', question.slice(34)].join('');
    var qList = q.split('/');
    qList.pop();
    if (qList.length > 6) {
        qList = qList.splice(0, 6);
    };
    return qList.join('/');
};

function pullQus(changes) {
    if (changes.hasOwnProperty("rssQuestions")) {
        clearQusAlarm();
        var newQus = changes.rssQuestions.newValue;
        var opt = {
            type: "basic",
            title: "Questions Updated",
            message: "Questions have been updated ",
            iconUrl: "images/setup_icon.png"
        };

        chrome.storage.local.get("yesNotification", function(item) {
            if (item.yesNotification == true) {
                chrome.notifications.create('newQus', opt, function() {});
            };
        });
        if (newQus.length > 0) {


            callQusUrls(newQus);
            createQusAlarm();
        } else {
            chrome.storage.local.set({
                "allQusFeeds": {}
            });
        };
    };
};

function callQusNotiGen(changes) {
    if (changes.hasOwnProperty("allQusFeeds")) {
        generateNotitifcationQus(changes);
    } else {
        return;
    };
};

function createQusAlarm() {
    clearTagAlarm();
    chrome.storage.local.get("rssQuestions", function(item) {
        if (item.rssQuestions.length > 0) {
            createAlarm(qusAlarmName);
        };
    });
};

function clearQusAlarm() {
    chrome.alarms.clear(qusAlarmName);

};

function processQus(changes) {
    pullQus(changes);
    callQusNotiGen(changes);
};
