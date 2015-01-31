
function onPopupShow() {

	var query = { active: true, currentWindow: true };

	chrome.tabs.query(query, processtab);
}

function processtab(tabs) {
	var currentTab = tabs[0];
	console.log(currentTab.url);
	console.log(currentTab);

	var re = /youtube\.com.*\Wv(?:=|\/)([\w\-]*)/;
	var match = re.exec(currentTab.url);
	var videoId;
	if(match === null) {
		console.log('domain not matched');
		return;
	} else {
		console.log('YoutubeId: ' + match[1]);
		videoId = match[1];
	}

	var xmlhttp = new XMLHttpRequest();

	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == XMLHttpRequest.DONE ) {
			if(xmlhttp.status == 200){
				console.log('video sent successfully');
			}
			else if(xmlhttp.status == 400) {
				alert('There was an error 400')
			}
			else {
				alert('something else other than 200 was returned: ' + xmlhttp.status);
			}
		}
	}

	xmlhttp.open("POST", "https://docs.google.com/forms/d/1kZ8E6hNBZl7EyCz7SSM2qEU6kDo4nM1F-a7ohIWNC7E/formResponse", true);
	xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xmlhttp.send("entry.407797214=youtube&entry.1917016815=" + videoId);
}

document.addEventListener('DOMContentLoaded', onPopupShow);
