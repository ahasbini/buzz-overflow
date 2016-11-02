$(function() {
    chrome.storage.local.get("allTagFeeds", function(items) {
        var newHtml = '<a class="pull-right" href="/templates/options.html"> ' +
          '<span class="glyphicon glyphicon-cog"></span>' +
        '</a>';
        $.each(items.allTagFeeds, function(key, value) {
            var initUl = '<dl><dt> Latest Questions For ' + key.toUpperCase() + '</dt>';
            $.each(value, function(inx, val) {
                var nItem = "<dd class='small'>- <a href='" + val[1] + "'>" +
                    val[0] + "</a></dd>";
                initUl += nItem;
            });
            initUl += '</dl>';
            newHtml += initUl;
        });
        $('#popup-feed').append(newHtml);
    });

    chrome.storage.local.get("allFTagFeeds", function(items) {
        var newHtml = '';
        $.each(items.allFTagFeeds, function(key, value) {
            var initUl = '<dl><dt> Featured Questions For ' + key.toUpperCase() + '</dt>';
            $.each(value, function(inx, val) {
                var nItem = "<dd class='small'>- <a href='" + val[1] + "'>" +
                    val[0] + "</a></dd>";
                initUl += nItem;
            });
            initUl += '</dl>';
            newHtml += initUl;
        });
        $('#popup-feed').append(newHtml);
    });

chrome.storage.local.get("allQusFeeds", function(items) {
        var newHtml = '';
        $.each(items.allQusFeeds, function(key, value) {
            var initUl = '<dl><dt>Question ';
            $.each(value, function(inx, val) {
                if(inx == 0 ) {
                    var nItem = "<a href='" + val[1] + "'>" +
                    val[0] + "</a></dt>";
                } else {
                var nItem = "<dd class='small'>- <a href='" + val[1] + "'>" +
                    val[0] + "</a></dd>";
                    }
                initUl += nItem;
            });
            initUl += '</dl>';
            newHtml += initUl;
        });
        $('#popup-feed').append(newHtml);
    });

    $('body').on('click', 'a', function() {
        chrome.tabs.create({ url: $(this).attr('href') });
        return false;
    });
});
