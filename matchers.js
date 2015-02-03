function matchYoutube(url, done) {
    var re = /youtube\.com.*\Wv(?:=|\/)([\w\-]*)/;
    var match = re.exec(url);
    var videoId;

    if (match === null) {
        done(null);
    } else {
        done({ source: 'youtube', videoId: match[1] });
    }
}

function matchIqiyi(url, done) {
    if (url.indexOf("iqiyi.com") == -1) {
        done(null);
        return;
    }

    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == XMLHttpRequest.DONE ) {
            if (xmlhttp.status == 200) {
                var videoId = xmlhttp.responseXML.getElementById('flashbox').getAttribute('data-player-videoid');
                var tvid = xmlhttp.responseXML.getElementById('flashbox').getAttribute('data-player-tvid');

                var re = /iqiyi\.com\/(.+)\.html/;
                var match = re.exec(url);

                videoId += '/0/0/';
                videoId += match[1] + '.swf';
                videoId += '-albumId=' + tvid;
                videoId += '-tvId=' + tvid;
                videoId += '-isPurchase=0-cnId=25';
                console.log(videoId);

                done({ source: 'iqiyi', videoId: videoId });
                return;
            }
            else {
                done({ error: { message: 'Error: Failed to download necessary data from iqiyi.' }});
                return;
            }
        }
    }

    xmlhttp.open('GET', url);
    xmlhttp.setRequestHeader('Content-type','application/x-www-form-urlencoded');
    xmlhttp.responseType = "document";
    xmlhttp.send();
}

function match56(url, done) {
    var re = /56\.com\/u\d+\/v_([\w_]*)\.html/;
    var match = re.exec(url);
    var videoId;

    if (match === null) {
        done(null);
    } else {
        done({ source: '56', videoId: match[1] });
    }
}

function matchLetv(url, done) {
    var re = /letv\.com\/ptv\/vplay\/([\d]*)\.html/;
    var match = re.exec(url);
    var videoId;

    if (match === null) {
        done(null);
    } else {
        done({ source: 'letv', videoId: match[1] });
    }
}

function matchQq(url, done) {
    var re = /v\.qq\.com\/.*\?vid=([\w]*)/;
    var match = re.exec(url);
    var videoId;

    if (match === null) {
        done(null);
    } else {
        done({ source: 'qq', videoId: match[1] });
    }
}
