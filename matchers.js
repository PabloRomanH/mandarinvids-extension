function genericMatcher(source, re, url) {
    var match = re.exec(url);

    if (match === null) {
        return null;
    } else {
        return { source: source, videoId: match[1] };
    }
}

function matchYoutube(url, done) {
    done(genericMatcher('youtube', /youtube\.com.*\Wv(?:=|\/)([\w\-]+)/, url));
}

function matchYoutubePlaylist(url, done) {
    done(genericMatcher('youtubePlaylist', /youtube\.com\/playlist\?.*list=([\w\-]+)/, url));
}

function matchYoutubeChannel(url, done) {
    done(genericMatcher('youtubeChannel', /youtube\.com\/(?:user|channel)\/([^\?]+)/, url));
}

function match56(url, done) {
    done(genericMatcher('56', /56\.com\/u\d+\/v_([\w]+)\.html/, url));
}

function matchLetv(url, done) {
    done(genericMatcher('letv', /letv\.com\/ptv\/vplay\/([\d]+)\.html/, url));
}

function matchQq(url, done) {
    done(genericMatcher('qq', /v\.qq\.com\/.*\?vid=([\w]+)/, url));
}

function matchQq2(url, done) {
    done(genericMatcher('qq', /v\.qq\.com\/.*\/([\w]+)\.html/, url));
}

function matchYouku(url, done) {
    done(genericMatcher('youku', /youku\.com\/v_show\/id_([\w]+)\.html/, url));
}

function match17173(url, done) {
    done(genericMatcher('17173', /v\.17173\.com\/.*\/([\w]+)\.html/, url));
}

function matchTudou(url, done) {
    var match = genericMatcher('tudou', /tudou\.com\/programs\/view\/([\w\-]+)/, url);

    if (match) {
        match.videoId = 'type=0&code=' + match.videoId;
        done(match);
        return;
    }

    match = /tudou\.com\/listplay\/([\w\-_]+)\/([\w\-_]+).html/.exec(url);

    if (match) {
        done({
            source: 'tudou',
            videoId: 'type=1&code=' + match[2] + '&lcode=' + match[1]
        });
        return;
    }

    match = /tudou\.com\/albumplay\/([\w\-_]+)\/([\w\-_]+).html/.exec(url);

    if (match) {
        done({
            source: 'tudou',
            videoId: 'type=2&code=' + match[2] + '&lcode=' + match[1]
        });
        return;
    }

    done(null);
}

function matchSohu(url, done) {
    if (url.indexOf("sohu.com") == -1) {
        done(null);
        return;
    }

    var match = genericMatcher('mysohu', /my\.tv\.sohu\.com\/us\/\d+\/(\d+)\.shtml/, url);
    console.log('matched mysohu');
    console.log(match);
    if(match !== null) {
        done(match);
        return;
    }

    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == XMLHttpRequest.DONE ) {
            if (xmlhttp.status == 200) {
                var vid, plid;
                var list = xmlhttp.responseXML.getElementsByTagName("script");

                for(var i = 0; i < list.length; i++) {
                    var match1 = /var vid="(\d+)"/.exec(list[i].innerHTML);
                    var match2 = /var playlistId="(\d+)"/.exec(list[i].innerHTML);
                    if(match1 && match2) {
                        vid = match1[1];
                        plid = match2[1];
                        break;
                    }
                }

                if(!vid) {
                    done({ error: { message: 'Error: Sohu changed their website. Please notify us.' }});
                }

                done({ source: 'sohu', videoId: vid + '/v.swf&plid=' + plid });
                return;
            } else {
                done({ error: { message: 'Error ' + xmlhttp.status + ': Failed to download necessary data from Sohu.' }});
                return;
            }
        }
    }

    xmlhttp.open('GET', url);
    xmlhttp.setRequestHeader('Content-type','application/x-www-form-urlencoded');
    xmlhttp.responseType = "document";
    xmlhttp.send();
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

function matchSina(url, done) {
    if (url.indexOf("sina.com.cn") == -1) {
        done(null);
        return;
    }

    if (url.indexOf("video.sina.com.cn") == -1) {
        done({ error: { message: 'Error: Only videos in video.sina.com.cn can be submitted.' }});
        return;
    }

    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == XMLHttpRequest.DONE ) {
            if (xmlhttp.status == 200) {

                var videoId;
                var list = xmlhttp.responseXML.getElementsByTagName("script");

                for(var i = 0; i < list.length; i++) {
                    var match = /videoId:'(\d+)'/.exec(list[i].innerHTML);
                    if(match) {
                        videoId = match[1];
                        break;
                    }
                }

                if(!videoId) {
                    done({ error: { message: 'Error: Sina changed their website. Please notify us.' }});
                }

                done({ source: 'sina', videoId: videoId });
                return;
            }
            else {
                done({ error: { message: 'Error: Failed to download necessary data from sina.' }});
                return;
            }
        }
    }

    xmlhttp.open('GET', url);
    xmlhttp.setRequestHeader('Content-type','application/x-www-form-urlencoded');
    xmlhttp.responseType = "document";
    xmlhttp.send();
}
