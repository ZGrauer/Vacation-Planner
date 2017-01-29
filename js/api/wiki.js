var Wiki = function() {
    var self = this;
    this.articleList;
    this.getWikiData = function(searchStr) {
        var wikiUrl = "http://en.wikipedia.org/w/api.php?action=opensearch&search=" + searchStr + "&format=json&callback=wikiCallback";
        self.articleList = "";
        $.ajax({
                url: wikiUrl,
                dataType: "jsonp",
                jsonp: "callback"
            })
            .done(function(data, textStatus, jqXHR) {
                var articles = data[1];
                var articleDescs = data[2];
                var articleUrls = data[3];
                if (articles.length > 0) {
                    for (var i = 0;
                        (i < articles.length) && (i !== 3); i++) {
                        self.articleList += '<li><a href="' + articleUrls[i] + '" target="_blank">' + articles[i] + '</a></li>';
                    };
                    $("#wiki-div").html("<h4>Wiki Articles</h4>" + self.articleList);
                } else {
                    $("#wiki-div").html("<h4>Wiki Articles</h4>None Found");
                }
            })
            .fail(function(jqXHR, textStatus, errorThrown) {
                console.log("Failed to get wikipedia data.<br>" + textStatus + "<br>" + errorThrown);
                $("#wiki-div").attr("role", "alert").addClass("alert alert-danger").html('' +
                    '<strong>ERROR!</strong> Failed to get wikipedia data. </div>');
            });
    };
};
