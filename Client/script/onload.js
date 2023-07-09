var udid = getUniqueStr()
set(udid)
var move_data
setInterval(() => {
	init()
	var video = document.querySelectorAll('.com-a-Video__video > video')[0]
	console.log(video.currentTime)
	const xhr = new XMLHttpRequest()
	xhr.open("POST", "http://.../index.php")
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
	const body = JSON.stringify({
		udid: udid,
		location: location.href,
		paused: video.paused,
		currentTime: video.currentTime
	});
	xhr.onload = () => {
		console.log(xhr.responseText)
		if (xhr.status == 200) {
			var dict = JSON.parse(xhr.responseText)
			
			if (location.href != dict["location"]) {
				document.getElementById("move").style.display = "block"
				video.pause()
				move_data = dict
			}else{
				var lag = Math.abs(video.currentTime - dict["currentTime"])
				if (lag > 1) {
					video.currentTime = dict["currentTime"]
					console.log("補正: " + lag)
				}
				document.getElementById("move").style.display = "none"
				if (dict["paused"]) { video.pause() }
				else{ video.play() }
			}

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
	if (document.getElementById("log") != undefined) { return } 
	var element = document.querySelectorAll('.com-feature-area-FeatureOrganizationPlanBannerContainerView')[0]
	element.innerHTML = ""
	element.style.color = "#fff"
	element.style.fontSize = "20px"

	let log = document.createElement('div')
	log.setAttribute('id','log')
	element.appendChild(log)

	let move = document.createElement('div')
	move.setAttribute('id','move')
	move.innerHTML = "移動を許可"
	move.style.color = "#fff"
	move.style.display = "none"
	move.style.padding = "20px"
	move.style.fontSize = "15px"
	move.style.backgroundColor = "#202020"
	move.addEventListener('mousedown', function(e) {
		move.innerHTML = "移動許可済"
		location.href = move_data["location"]
	})
	element.appendChild(move)
}

function update_status(text) {
	var element = document.getElementById("log")
	element.innerHTML = text
}

function getUniqueStr(myStrong){
	var strong = 1000;
	if (myStrong) strong = myStrong;
	return new Date().getTime().toString(16)  + Math.floor(strong*Math.random()).toString(16)
}

document.body.addEventListener('mousedown', function(e) {
	set(udid)
})