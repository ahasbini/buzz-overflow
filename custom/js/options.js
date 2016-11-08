$(function() {
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

    function storeQus() {
        var rssInput = $("#rssQuestions").val().toString();
        var rssQus = [];

        if (rssInput.length > 0) {

            rssInput = rssInput.split(';')

            $.each(rssInput, function(ind, val) {
                val = val.replace(/ /g, '')

                if (isUrl(val) == true && isSOQuestion(val) == true) {
                    rssQus.push(val)
                } else if (isUrl('http://' + val) == true && val.length > 0 && isSOQuestion(val) == true) {
                    rssQus.push('http://' + val);
                } else {
                    alert("Invalid URL:" + val + ". Please enter a valid Question URL.");
                    return;
                };
                chrome.storage.local.set({ "rssQuestions": rssQus });

            });

        } else if (rssInput.length == 0) {
            chrome.storage.local.get("rssQuestions", function(items) {
                if (items.rssQuestions.length > 0) {
                    chrome.storage.local.set({ "rssQuestions": [] });
                };
            });
        };
    };

    function storeTags() {
        var rssTags = $("#rssTags").val();
        if (rssTags.length > 0) {
            rssTags = rssTags.replace(/ /g, '').split(';')
            chrome.storage.local.set({ "rssTags": rssTags });
        } else if (rssTags.length == 0) {
            chrome.storage.local.get("rssTags", function(items) {
                if (items.rssTags.length > 0) {
                    chrome.storage.local.set({ "rssTags": [] });
                };
            });

        };
    };

    function storeRestOptions() {
        chrome.storage.local.set({ "notificationLimit": $("#notificationLimit").val() });
        chrome.storage.local.set({ "rssFeedTime": $("#rssFeedTime").val() });

        if ($("#yesNotification").is(":checked")) {
            chrome.storage.local.set({
                "yesNotification": true
            });
        } else {
            chrome.storage.local.set({
                "yesNotification": false
            });
        };

        if ($("#yesFeaturedQn").is(":checked")) {
            chrome.storage.local.set({
                "yesFeaturedQn": true
            });
        } else {
            chrome.storage.local.set({
                "yesFeaturedQn": false
            });
        };

        if ($("#yesNewestQn").is(":checked")) {
            chrome.storage.local.set({
                "yesNewestQn": true
            });
        } else {
            chrome.storage.local.set({
                "yesNewestQn": false
            });
        };
    };

    chrome.storage.local.get("rssQuestions", function(items) {
        if (items.rssQuestions != null) {
            $("#rssQuestions").val(items.rssQuestions.join(';'));
        };

    });

    chrome.storage.local.get("rssTags", function(items) {
        if (items.rssTags != null) {
            $("#rssTags").val(items.rssTags.join(';'));
        };
    });

    chrome.storage.local.get("notificationLimit", function(items) {
        $("#notificationLimit").val(items.notificationLimit);
    });

    chrome.storage.local.get("rssFeedTime", function(items) {
        $("#rssFeedTime").val(items.rssFeedTime);
    });

    chrome.storage.local.get("yesNotification", function(items) {
        if (items.yesNotification == true) {
            $("#yesNotification").prop('checked', true);
        }
    });

    chrome.storage.local.get("yesFeaturedQn", function(items) {
        if (items.yesFeaturedQn == true) {
            $("#yesFeaturedQn").prop('checked', true);
        }
    });

    chrome.storage.local.get("yesNewestQn", function(items) {
        if (items.yesNewestQn == true) {
            $("#yesNewestQn").prop('checked', true);
        }
    });

    $(".submit-rss").click(function() {
        storeQus();
        storeTags();
        storeRestOptions();
    });

    $(".submit-reset").click(function() {
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
        chrome.alarams.clear('tagBeats');
        chrome.alarams.clear('questionBeats');

    });

});
