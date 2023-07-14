var udid = getUniqueStr()
set(udid)
var move_data
setInterval(() => {
	init()
	var video = document.querySelectorAll('.com-a-Video__video > video')[0]
	console.log(video.currentTime)

	browser.storage.local.get(["indexUrl"], function(data){
		const xhr = new XMLHttpRequest()
		xhr.open("POST", data.indexUrl)
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
		const body = JSON.stringify({
			udid: udid,
			location: location.href,
			title: document.title,
			paused: video.paused,
			currentTime: video.currentTime
		});
		xhr.onload = () => {
			console.log(xhr.responseText)
			if (xhr.status == 200) {
				var dict = JSON.parse(xhr.responseText)
				
				if (location.href != dict["location"]) {
					movebtn_func("block", dict["title"])
					video.pause()
					move_data = dict
				}else{
					var lag = Math.abs(video.currentTime - dict["currentTime"])
					if (lag > 1) {
						video.currentTime = dict["currentTime"]
						console.log("補正: " + lag)
					}
					movebtn_func("none", "")
					if (dict["paused"]) { video.pause() }
					else{ video.play() }
				}
	
				document.getElementById("hostbtn").innerText = dict["udid"] == udid ? "Hostになリました" : "Hostになる"
	
				update_status(
					"Host_Time: "+
					dict["currentTime"] +
					
					"<br>" +
	
					"Host_UDID: "+
					dict["udid"] +
	
					"<br>" +
	
					"Client_Time: "+
					video.currentTime +
					
					"<br>" +
	
					"Client_UDID: "+
					udid
				);
			} else {
				console.log(`Error: ${xhr.status}`)
			}
		};
		xhr.send(body)
	});
	
	if (document.getElementById("clickButton").checked == true) {
		let clickCancel = document.querySelectorAll("button.com-vod-VODNextProgramInfo__cancel-button")[0];
		clickCancel.click();
	}

	let nextEpisode = document.querySelectorAll(".com-vod-VODNextProgramInfo__next > a")[0].getAttribute("href");
	video.addEventListener('ended', (event) => {
		location.href = "https://abema.tv" + nextEpisode
	});

	
}, 1000);

function set(udid) {
	browser.storage.local.get(["indexUrl"], function(data){
		const xhr = new XMLHttpRequest()
		xhr.open("POST", data.indexUrl+"?set=true")
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
		const body = JSON.stringify({
			udid: udid
		});
		xhr.onload = () => {
			console.log(xhr.responseText)
		};
		xhr.send(body)
	});
}

function init() {
	if (document.querySelectorAll('.com-feature-area-FeatureListSection__title')[0] == undefined) { return } 
	if (document.getElementById("text") != undefined) { return } 
	
	var element = document.querySelectorAll('.com-feature-area-FeatureListSection__title')[0].parentElement
	
	var event_elem = element.querySelectorAll('li')[0]
	event_elem.addEventListener('mousedown', function(e) {
		set(udid)
	})

	let status = document.createElement('div')
	status.id = "status"
	status.style.color = "#fff"
	status.style.fontSize = "20px"
	status.style.userSelect = "none"

	let text = document.createElement('div')
	text.id = "text"
	status.append(text)

	let hostbtn = document.createElement('div')
	hostbtn.id = "hostbtn"
	hostbtn.innerText = "Hostになる"
	hostbtn.style.marginTop = "5px"
	hostbtn.style.cursor = "pointer"
	hostbtn.style.padding = "10px"
	hostbtn.style.fontSize = "15px"
	hostbtn.style.textAlign = "center"
	hostbtn.style.backgroundColor = "#202020"
	hostbtn.addEventListener('mousedown', function(e) {
		set(udid)
	})
	status.append(hostbtn)

	let movebtn = document.createElement('div')
	movebtn.id = "movebtn"
	movebtn.innerText = "Hostは別の動画を視聴しています。<br>移動する。"
	movebtn.style.display = "none"
	movebtn.style.marginTop = "5px"
	movebtn.style.cursor = "pointer"
	movebtn.style.padding = "10px"
	movebtn.style.fontSize = "15px"
	movebtn.style.textAlign = "center"
	movebtn.style.backgroundColor = "#202020"
	movebtn.addEventListener('mousedown', function(e) {
		movebtn.innerText = "移動許可済"
		location.href = move_data["location"]
	})
	status.append(movebtn)

	let clickButton = document.createElement('input');
	clickButton.setAttribute("type", "checkbox");
	clickButton.setAttribute("id", "clickButton");
	clickButton.style.display = "none";
	status.append(clickButton);

	let buttonLabel = document.createElement('label');
	buttonLabel.setAttribute("for", "clickButton");
	buttonLabel.setAttribute("id", "buttonLabel");
	buttonLabel.style.marginTop = "5px"
	buttonLabel.style.padding = "10px"
	buttonLabel.style.fontSize = "15px"
	buttonLabel.style.textAlign = "center"
	buttonLabel.style.backgroundColor = "#202020"
	buttonLabel.style.display = "block";
	status.append(buttonLabel);

	if(localStorage.getItem("clickLocal") == 1){
		clickButton.checked = true;
	}

	if (clickButton.checked == true) {
		buttonLabel.innerText = "スキップをキャンセルします"
	}else{
		buttonLabel.innerText = "次の動画へスキップします(デフォルト)"
	}

	clickButton.addEventListener("change", function(e){
		if (this.checked == true) {
			document.getElementById("buttonLabel").innerText = "スキップをキャンセルします"
			localStorage.setItem("clickLocal", this.checked = 1);
		}else{
			document.getElementById("buttonLabel").innerText = "次の動画へスキップします(デフォルト)"
			localStorage.setItem("clickLocal", this.checked = 0);
		}
		console.log(localStorage.getItem("clickLocal"));
	})

	element.prepend(status)
}

function movebtn_func(display, title) {
	document.getElementById("movebtn").style.display = display
	document.getElementById("movebtn").innerText = "Hostは別の動画を視聴しています。<br>移動する。<p style='font-size: 10px;'>" + title + "</p>"
}

function update_status(text) {
	var element = document.getElementById("text")
	element.innerText = text
}

function getUniqueStr(myStrong){
	var strong = 1000;
	if (myStrong) strong = myStrong;
	return new Date().getTime().toString(16)  + Math.floor(strong*Math.random()).toString(16)
}

var event_elem = document.querySelectorAll('.com-vod-VODRecommendedContentsContainerView__player')[0]
event_elem.addEventListener('mousedown', function(e) {
	set(udid)
})