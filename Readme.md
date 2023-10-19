# yt-ad-script
Youtube is now hard blocking the video when logged in user is watching with adBlocker (uBlockOrigin).
There is an script which checks all of that. They push recent updates and change the script id.

this API is based upon a reddit comment who wanted to create an website where you can see the latest ids.

this API is based upon express.js. it fetches youtube html page checks for certain script elements and return the scirpt element source.

## requirements
- to host this api yourself u need to install node.js
    - node js enables you to run javascript code without an browser

## howto run
- rename .env.example to .env 
- edit .env file to your needs
- edit selectors.json file to add or remove elements you want to track
- run `npm i ` inside this folder to install dependencies
- run `npm run start` to start api

## API Routes
- http://localhost:42012/
    - returns hello world string to check the api health
- http://localhost:42012/getScriptId
    - returns scriptIds from the specified selectors
    - this route fetches https://www.youtube.com and analyses html code for scripts
    - you can specifey a cache duration so not every hit on this api is an fetch to youtube
        - default CACHE_DURATION is 60 seconds
- http://localhost:42012/getTrackedIds
    - return all tracked ids 

## API returns
/
```json
{
	"status": 200,
	"msg": "hey i am alive"
}
```
/getScriptId
```json
{
	"status": 200,
	"foundElements": [
		{
			"id": 0,
			"selector": "script#base-js",
			"scriptSrc": "https://www.youtube.com/s/desktop/7a13cbe7/jsbin/desktop_polymer_enable_wil_icons.vflset/desktop_polymer_enable_wil_icons.js",
			"scriptId": "7a13cbe7",
			"timestamp": 1697713675298
		},
		{
			"id": 1,
			"selector": "script[src*='desktop_polymer_enable_wil_icons']",
			"scriptSrc": "https://www.youtube.com/s/desktop/7a13cbe7/jsbin/desktop_polymer_enable_wil_icons.vflset/desktop_polymer_enable_wil_icons.js",
			"scriptId": "7a13cbe7",
			"timestamp": 1697713675299
		}
	],
	"scriptIds": [
		"7a13cbe7",
		"7a13cbe7"
	],
	"fetchTimestamp": 1697713675299
}
```
/getTrackedIds
```json
{
	"status": 200,
	"trackedIds": [
		{
			"id": 0,
			"selector": "script#base-js",
			"scriptSrc": "https://www.youtube.com/s/desktop/7a13cbe2/jsbin/desktop_polymer_enable_wil_icons.vflset/desktop_polymer_enable_wil_icons.js",
			"scriptId": "7a13cbe7",
			"timestamp": 1697713675298
		}
	]
}
```
