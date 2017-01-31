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
     * @param  {Object} wikiHtmlData ko.observable in model.
     */
    this.getWikiData = function(searchStr, wikiHtmlData) {
        // JSONP url containing query string
        var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + searchStr + '&format=json&callback=wikiCallback';
        self.articleList = '<ul>';
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
                    }
                    wikiHtmlData('<div id="wiki-div"><h4>Wiki Articles</h4>' +
                        self.articleList +
                        '</ul></div>');
                } else {
                    wikiHtmlData('<div id="wiki-div"><h4>Wiki Articles</h4>None Found</div>');
                }
                console.log('Got Wikipedia articles.  Updating InfoWindow...');
            })
            // If failed, append alert to the Info Window
            .fail(function(jqXHR, textStatus, errorThrown) {
                console.log('Failed to get wikipedia data.<br>' + textStatus + '<br>' + errorThrown);
                wikiHtmlData('<div id="place-div" class="alert alert-danger" role="alert">' +
                    '<strong>ERROR!</strong> Failed to get wikipedia data. ' +
                    '</div>');
            });
    };
};
