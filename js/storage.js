$(document).ready(function(){
	// On load, retrieve storage 
	// These functions get items from storage
	// Save what was stored to the object (overwrite if there was anything there somehow)
	// And show them on the screen
	currentStore.retrieveLocal();
	currentStore.retrieveSession();
	currentStore.retrieveCookies();
	currentStore.retrieveIndexed();

	$('#store-form').on('submit', function(event){
		event.preventDefault();
		console.log('event', event);
		let newName = $('#new-name').val();
		let newVal = $('#new-val').val(); 

		currentStore.storeToLocal(newName, newVal);
		currentStore.storeToSession(newName, newVal);
		currentStore.storeCookies(newName, newVal);
		currentStore.storeIndexed(newName, newVal);
		addToScreen({[newName]: newVal}, '.store-items');
		
		$('#new-name, #new-val').val('');

	});

});

const myStorageName = 'mySavedStorageName4';
let currentStore = {
	localStore: {},
	sessStore: {},
	cookieStore: {},
	indexedStore: {},
	storeToLocal: function(newName, newVal){
		this.localStore[newName] = newVal;

		localStorage.setItem(myStorageName, JSON.stringify( this.localStore ));
		return true;
	},

	storeToSession: function(newName, newVal){
		this.sessStore[newName] = newVal;

		sessionStorage.setItem(myStorageName, JSON.stringify( this.sessStore ));
		return true;
	},

	storeCookies: function(newName, newVal){
		this.cookieStore[newName] = newVal;

		let d = new Date();
		d.setDate( d.getDate() + 7 ); // cookie will expire in seven days

		document.cookie = myStorageName + '=' + JSON.stringify( this.cookieStore ) + '; expires=' + d + 'path=/';
		return true;
	},

	retrieveLocal: function(){
		this.localStore = JSON.parse( localStorage.getItem(myStorageName) ) || {};
		addToScreen(this.localStore, '#local-items');
		return this.localStore;
	},

	retrieveSession: function(){
		this.sessStore = JSON.parse( sessionStorage.getItem(myStorageName) ) || {};
		addToScreen(this.sessStore, '#sess-items');
		return this.sessStore;
	},

	retrieveCookies: function(){
		let c = decodeURIComponent( document.cookie ).split(';');
		this.cookieStore = c[myStorageName] || {};
		addToScreen(this.cookieStore, '#cookie-items');
		return this.cookieStore;
	},

	storeIndexed: function(newName, newVal){
		this.indexedStore[newName] = newVal;
		let request = window.indexedDB.open(myStorageName, 1);
		let db;

		request.onsuccess = function(event){
			db = request.result;

			let transxtion = db.transaction([myStorageName], 'readwrite');
			transxtion.oncomplete = (e) => { console.log('transxtion complete', e); };
			transxtion.onerror = (e) => { console.log('transxtion error', e); };

			let objStore = transxtion.objectStore(myStorageName);

			let objReq = objStore.add({name: newName, val: newVal});
			objReq.onsuccess = (e) => console.log('add success', e);
			objReq.onerror = (e) => console.log('add error', e);
		};

		request.onerror = function(err){
			console.log('There was a local storage error: ', err);
		};
	},

	retrieveIndexed: function(){
		window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
		let request = window.indexedDB.open(myStorageName, 1); 
		let db ;

		if(!request){ return false; }
		request.onerror = (e) => console.log('error opening db', e);

		request.onupgradeneeded = function(event){
			console.log('upgrade needed');
			db = event.target.result; 
			db.onerror = (e) => { console.log('error on upgrade'); };

			let objStore = db.createObjectStore(myStorageName, {keyPath: 'name'}); 
			objStore.createIndex('val', 'val' , {unique: false}); 
			console.log('object store created', objStore);
		};

		request.onsuccess = function(event){
			db = request.result;
			console.log('request success, no upgrade needed', db);
			let objStore = db.transaction(myStorageName).objectStore(myStorageName);
			objStore.openCursor().onsuccess = function(event){
				let crsr = event.target.result;
				if(crsr){
					addToScreen({[crsr.value.name] : crsr.value.val} , '#index-items');
					crsr.continue();
				} else {
					console.log('all cursor entries shown');
				}
			};

		};
	}
};

// Adds key/value pair from v to screen at selector s location
function addToScreen(v, s){
	for(let property in v){
		$(s).append(`<p>${property}: ${v[property]}`);
	}
	return true;
}