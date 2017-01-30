/**
 * @description Represents a Wikipedia API instance
 */
var Wiki = function() {
    var self = this;
    this.articleList;


    /**
     * @description Queries Wiki using ajax. When successfull appends data to DOM in
     * #wiki-div inside the Info Window.  If an error is encountered, a Bootstrap alert
     * is appended to #wiki-div.
     * @param  {string} searchStr string to query in Wiki
     */
    this.getWikiData = function(searchStr) {
        // JSONP url containing query string
        var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + searchStr + '&format=json&callback=wikiCallback';
        self.articleList = '';
        // Ajax call to get info
        $.ajax({
                url: wikiUrl,
                dataType: 'jsonp',
                jsonp: 'callback'
            })
            // When successful get data UL and append to Info Window
            .done(function(data, textStatus, jqXHR) {
                var articles = data[1];
                var articleDescs = data[2];
                var articleUrls = data[3];
                if (articles.length > 0) {
                    for (var i = 0;
                        (i < articles.length) && (i !== 3); i++) {
                        self.articleList += '<li><a href="' + articleUrls[i] + '" target="_blank">' + articles[i] + '</a></li>';
                    };
                    $('#wiki-div').html('<h4>Wiki Articles</h4>' + self.articleList);
                } else {
                    $('#wiki-div').html('<h4>Wiki Articles</h4>None Found');
                }
            })
            // If failed, append alert to the Info Window
            .fail(function(jqXHR, textStatus, errorThrown) {
                console.log('Failed to get wikipedia data.<br>' + textStatus + '<br>' + errorThrown);
                $('#wiki-div').attr('role', 'alert').addClass('alert alert-danger').html('' +
                    '<strong>ERROR!</strong> Failed to get wikipedia data. </div>');
            });
    };
};
