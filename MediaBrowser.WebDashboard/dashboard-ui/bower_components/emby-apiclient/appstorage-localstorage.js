define([],function(){"use strict";function updateCache(){cache&&cache.put("data",new Response(JSON.stringify(localData)))}var cache,localData,myStore={};myStore.setItem=function(name,value){if(localStorage.setItem(name,value),localData){var changed=localData[name]!==value;changed&&(localData[name]=value,updateCache())}},myStore.getItem=function(name){return localStorage.getItem(name)},myStore.removeItem=function(name){localStorage.removeItem(name),localData&&(localData[name]=null,delete localData[name],updateCache())};try{self.caches&&caches.open("embydata").then(function(result){cache=result,localData={}})}catch(err){console.log("Error opening cache: "+err)}return myStore});