"use strict"

let
  DBus= require("dbus-native")
  

function Service(name, bus){
	this._service= bus.getService(name)
}

Service.prototype.introspect= function(){
	return Introspect("/", this)
}
