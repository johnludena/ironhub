// get GitHub access token if on  local machine
try {
	var token = GLOBAL_TOKEN
}
catch (e) {
	var token = ''
}



// Setting variables for urls
var myApiUrl = "https://api.github.com/users/johnludena"
var myRepoApiUrl = "https://api.github.com/users/johnludena/repos"
var params = {
	access_token: token,
}

// building full urls for loading initial profile when page loads
var genParamString = function(paramObject) {
    var outputString = '?'
    for (var key in paramObject) {
     	outputString += key + '=' + paramObject[key] + '&'
    }
    return outputString.substr(0,outputString.length - 1)
}

var myFullUserApiUrl = myApiUrl + genParamString(params)
var myFullRepoApiUrl = myRepoApiUrl + genParamString(params)


// Adding user search functionality
var searchNode = document.querySelector("#search")

var searchUser = function(eventObj) {
	if (eventObj.keyCode === 13) {
		var usernameValue = eventObj.target.value
		console.log(usernameValue)
		
		var searchUserBase = "https://api.github.com/users/"
		var searchUserFullUrl = searchUserBase + usernameValue + genParamString(params)
		var searchRepoFullUrl = searchUserBase + usernameValue + "/repos" + genParamString(params)
		
		var userSearchPromise = $.getJSON(searchUserFullUrl)
		var searchRepoPromise = $.getJSON(searchRepoFullUrl)

		userSearchPromise.then(handleUserData)
		searchRepoPromise.then(handleRepoData)

		eventObj.target.value = ""

	}
}

searchNode.addEventListener("keydown", searchUser)




// Elapsed time function for repo "Last updated" dates
var elapsedTime = function(repoUpdateTime) {

	var timeNow = new Date()
	var timeThen = new Date(repoUpdateTime)
	var timeDiff = timeNow - timeThen
    
    var seconds = Math.floor(timeDiff/1000) + " second"
    var minutes = Math.floor(timeDiff/(1000 * 60)) + " minute"
    var hours = Math.floor(timeDiff/(1000 * 60 * 60)) + " hour"
    var days = Math.floor(timeDiff/(1000 * 60 * 60 * 24)) + " day"
   	var months = Math.floor(timeDiff/(1000 * 60 * 60 * 24 * 30)) + " month"
    var years = Math.floor(timeDiff/(1000 * 60 * 60 * 24 * 30 * 12)) + " year"
    
    var timeArray = [years, months, days, hours, minutes, seconds]

    for(var i = 0; i < timeArray.length; i++) {
    	if (parseInt(timeArray[i]) !== 0) {
            
            if(parseInt(timeArray[i]) >= 2) {
            	return "Updated about " + timeArray[i] + "s ago"
            }
            else if (parseInt(timeArray[i]) < 2) {
                return "Updated about " + timeArray[i] + " ago"
            }
        }
        
    }
       
}



// Building user promise
var userPromise = $.getJSON(myFullUserApiUrl)

var handleUserData = function(userResponse) {
	console.log(userResponse)
	var name = userResponse.name
	var blog = userResponse.blog
	var location = userResponse.location
	var email = userResponse.email
	var avatarUrl = userResponse.avatar_url
	var followers = userResponse.followers
	var followersUrl = userResponse.followers_url
	var following = userResponse.following
	var followingUrl = userResponse.following_url


	var userHTML = ""

	// If data is not empty or private, display it on left column
	if (avatarUrl !== null) {
		userHTML += '<img class="avatar" src="' + avatarUrl + '" />'
	}

	userHTML += '<h1>' + name + '</h1>'
	
	if (location !== null) {
		userHTML += '<p class="location">' + location + '</p>'
	}

	if (blog !== null) {
		userHTML += '<p class="blog"><a href="' + blog + '">' + blog + '</a></p>'
	}

	if (email !== null) {
		userHTML += '<p class="email"><a href="mailto:' + email + '">' + email + '</a></p>'
	}
	
	userHTML += '<div class="social">'
	userHTML += 	'<div class="followers"><p class="number">' + followers + '</p>'
	userHTML += 	'<p class="text">Follower(s)</p></div>'
	userHTML += 	'<div class="following"><p class="number">' + following + '</p>'
	userHTML +=		'<p class="text">Following</p></div>'
	userHTML += '</div>'

	

	var leftColNode = document.querySelector("#left-col")
	leftColNode.innerHTML = userHTML

}

userPromise.then(handleUserData) 



// Building repo promise
var repoPromise = $.getJSON(myFullRepoApiUrl)

var handleRepoData = function(repoResponse) {
	var repoHTML = ""
	for (var i =0; i < repoResponse.length; i++) {
		var repoName = repoResponse[i].name
		var repoLastUpdate = repoResponse[i].updated_at
		var repoUrl = repoResponse[i].html_url
		var repoLang = repoResponse[i].language

		repoHTML += '<div class="repo-row">'
		repoHTML += 	'<div class="repo-info">'
		repoHTML += 		'<a class="repo-name" href="' + repoUrl + '">' + repoName + '</a>'
		repoHTML += 		'<p class="repo-date">' + elapsedTime(repoLastUpdate) + '</p>'
		repoHTML += 	'</div>'
		repoHTML +=		'<div class="repo-meta">'
		repoHTML +=			'<span>' + repoLang + '</span>'
		repoHTML +=		'</div>'
		repoHTML += '</div>'
	}

	var rightColNode = document.querySelector("#right-col")
	rightColNode.innerHTML = repoHTML

}

repoPromise.then(handleRepoData) 




