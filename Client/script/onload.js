var udid = getUniqueStr()
set(udid)
var move_data
setInterval(() => {
	init()
	var video = document.querySelectorAll('.com-a-Video__video > video')[0]
	console.log(video.currentTime)
	const xhr = new XMLHttpRequest()
	xhr.open("POST", "http://icy-akune-8159.fakefur.jp/index.php")
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
				movebtn("block", dict["title"])
				video.pause()
				move_data = dict
			}else{
				var lag = Math.abs(video.currentTime - dict["currentTime"])
				if (lag > 1) {
					video.currentTime = dict["currentTime"]
					console.log("補正: " + lag)
				}
				movebtn("none", "")
				if (dict["paused"]) { video.pause() }
				else{ video.play() }
			}

			document.getElementById("hostbtn").innerHTML = dict["udid"] == udid ? "Hostになリました" : "Hostになる"

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
}, 1000);

function set(udid) {
	const xhr = new XMLHttpRequest()
	xhr.open("POST", "http://icy-akune-8159.fakefur.jp/set.php")
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
	const body = JSON.stringify({
		udid: udid
	});
	xhr.onload = () => {
		console.log(xhr.responseText)
	};
	xhr.send(body)
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

	let text = document.createElement('div')
	text.id = "text"
	status.append(text)

	let hostbtn = document.createElement('div')
	hostbtn.id = "hostbtn"
	hostbtn.innerHTML = "Hostになる"
	hostbtn.style.marginTop = "5px"
	hostbtn.style.padding = "10px"
	hostbtn.style.fontSize = "15px"
	hostbtn.style.textAlign = "center"
	hostbtn.style.backgroundColor = "#202020"
	hostbtn.addEventListener('mousedown', function(e) {
		set(udid)
	})
	status.append(hostbtn)

	let move = document.createElement('div')
	move.id = "move"
	move.innerHTML = "Hostは別の動画を視聴しています。<br>移動する。"
	move.style.display = "none"
	move.style.marginTop = "5px"
	move.style.padding = "10px"
	move.style.fontSize = "15px"
	move.style.textAlign = "center"
	move.style.backgroundColor = "#202020"
	move.addEventListener('mousedown', function(e) {
		move.innerHTML = "移動許可済"
		location.href = move_data["location"]
	})
	status.append(move)
	
	element.prepend(status)
}

function movebtn(display, title) {
	document.getElementById("move").style.display = display
	document.getElementById("move").innerHTML = "Hostは別の動画を視聴しています。<br>移動する。<p style='font-size: 10px;'>" + title + "</p>"
}

function update_status(text) {
	var element = document.getElementById("text")
	element.innerHTML = text
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