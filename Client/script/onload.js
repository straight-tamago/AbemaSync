var move_data
const udid = getUniqueStr()
hostRequest(udid)
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
			if (xhr.status == 200) {
				var dict = JSON.parse(xhr.responseText)
				
				if (location.href != dict["location"]) {
					move_data = dict
					video.pause()
					movebtn_func("block", dict["title"])
				}else{
					var lag = Math.abs(video.currentTime - dict["currentTime"])
					if (lag > 1) {
						video.currentTime = dict["currentTime"]
						console.log("補正: " + lag)
					}
					dict["paused"] ? video.pause() : video.play();
					movebtn_func("none", "")
				}
	
				document.getElementById("hostbtn").innerText = dict["udid"] == udid ? "Hostになリました" : "Hostになる"
				document.getElementById("text").innerText = (
					"Host_Time: "+
					dict["currentTime"] +
					
					"\n" +

					"Host_UDID: "+
					dict["udid"] +

					"\n" +

					"Client_Time: "+
					video.currentTime +
					
					"\n" +

					"Client_UDID: "+
					udid
				)

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

function hostRequest(udid) {
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
	hostbtn.addEventListener('click', function(e) {
		hostRequest(udid)
	})
	status.append(hostbtn)

	let movebtn = document.createElement('div')
	movebtn.id = "movebtn"
	movebtn.style.display = "none"
	movebtn.style.marginTop = "5px"
	movebtn.style.cursor = "pointer"
	movebtn.style.padding = "10px"
	movebtn.style.fontSize = "15px"
	movebtn.style.textAlign = "center"
	movebtn.style.backgroundColor = "#202020"
	movebtn.addEventListener('click', function(e) {
		movebtn.innerText = "移動許可済"
		location.href = move_data["location"]
	})
	status.append(movebtn)

	let move_label = document.createElement('p');
	move_label.setAttribute("id", "move_label");
	move_label.innerText = "Hostは別の動画を視聴しています。\n移動する。"
	movebtn.append(move_label);
	let move_title = document.createElement('p');
	move_title.setAttribute("id", "move_title");
	move_title.style.fontSize = "10px"
	movebtn.append(move_title);

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
			localStorage.setItem("clickLocal", 1);
		}else{
			document.getElementById("buttonLabel").innerText = "次の動画へスキップします(デフォルト)"
			localStorage.setItem("clickLocal", 0);
		}
		console.log(localStorage.getItem("clickLocal"));
	})

	var elem = document.querySelectorAll('.com-vod-VODRecommendedContentsContainerView__player')[0]
	elem.addEventListener('mousedown', function(e) {
		hostRequest(udid)
	})

	var elem_parent = document.querySelectorAll('.com-feature-area-FeatureListSection__title')[0].parentElement
	var elem = elem_parent.querySelectorAll('li')[0]
	elem.addEventListener('mousedown', function(e) {
		hostRequest(udid)
	})

	elem_parent.prepend(status)
}

function movebtn_func(display, title) {
	document.getElementById("movebtn").style.display = display
	document.getElementById("move_title").innerText = title
}

function getUniqueStr(myStrong){
	var strong = 1000;
	if (myStrong) strong = myStrong;
	return new Date().getTime().toString(16)  + Math.floor(strong*Math.random()).toString(16)
}

browser.storage.local.get(["indexUrl"], function(data){
	if (data.indexUrl == undefined) {
		alert("AbemaSync: 設定画面からサーバーURLを指定する必要があります。")
		location.href = "about:addons"
	}
})