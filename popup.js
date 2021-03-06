
var message;

function onPopupShow() {
	message = document.getElementById('message');

	var query = { active: true, currentWindow: true };
	chrome.tabs.query(query, processtab);
}

var matchers = [
	matchYoutube,
	matchIqiyi,
	match56,
	matchLetv,
	matchQq,
	matchQq2,
	matchYouku,
	matchSina,
	matchTudou,
	matchSohu,
	matchYoutubePlaylist,
	matchYoutubeChannel,
	match17173
];

function processtab(tabs) {
	var currentTab = tabs[0];
	console.log(currentTab.url);
	if(!currentTab.url) {
		message.innerHTML = 'Put focus on webpage before clicking.'
		return;
	}

	matchCaller(currentTab.url, matchers, matchCallback);
}

function matchCallback(match) {
	if (match === null) {
		console.log('domain not matched');
		message.innerHTML = 'Invalid domain. Can only submit videos of the following websites: youtube, iqiyi, youku, tudou, 56, letv, sohu, qq, sina';
	} else if (match.error) {
		message.innerHTML = 'Matched domain, but couldn\'t add video. ' + match.error.message;
	} else {
		postToForm(match);
	}
}

function matchCaller(url, callbackArray, done) {
	var i = 0;
	matchOne();

	function doneFunction(match) {
		if (match === null) {
			i++;
			matchOne();
		} else {
			done(match);
		}
	}

	function matchOne() {
		if (i >= callbackArray.length) {
			done(null);
		} else {
			callbackArray[i](url, doneFunction);
		}
	}
}

function postToForm(match) {
	var FORM_ID = '1kZ8E6hNBZl7EyCz7SSM2qEU6kDo4nM1F-a7ohIWNC7E';
	var SOURCE_ENTRY = 'entry.407797214';
	var VIDEOID_ENTRY = 'entry.1917016815';

	var xmlhttp = new XMLHttpRequest();

	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == XMLHttpRequest.DONE ) {
			if (xmlhttp.status == 200) {
				var list = xmlhttp.responseXML.getElementsByClassName("error-message");

				if (list.length > 0) {
					message.innerHTML = 'Error submitting form! This is probably a bug. Please contact us.'
				} else {
					message.innerHTML = 'Video successfully sent!';
				}
			} else if (xmlhttp.status == 0 && xmlhttp.readyState == 4) {
				message.innerHTML = 'Strange network error ' + xmlhttp.readyState + ' when submitting entry. Are you behind a firewall?';
			} else {
				message.innerHTML = 'Error ' + xmlhttp.status + ':' + xmlhttp.readyState + ' when submitting entry. Please contact us.';
			}
		}
	}

	xmlhttp.open('POST', 'https://docs.google.com/forms/d/' + FORM_ID + '/formResponse');
	xmlhttp.setRequestHeader('Content-type','application/x-www-form-urlencoded');
	xmlhttp.responseType = "document";
	xmlhttp.send(SOURCE_ENTRY + '=' + match.source + '&' + VIDEOID_ENTRY + '=' + encodeURIComponent(match.videoId));
}

document.addEventListener('DOMContentLoaded', onPopupShow);
