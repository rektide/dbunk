"use strict"

const
  Dbus= require( "dbus-native"),
  EventEmitter= require("events").EventEmitter
  xos= require( "xml-object-stream-sax")()

function Introspection(xml, opt){
	if(!opt && xml.xml){
		opt= xml
		xml= opt.xml
	}
	if(!(this instanceof Introspection)){
		return new Inrospection(xml, opt)
	}
	return this.done= xos(xml, "//node/interface").then(nodes => {
		for(let iface of nodes.children){
			const
			  iName= iface.attributes.name,
			  i= this[iName]= {}
			Object.defineProperty(i, "name", {value: iName})
			for(let member of iface.children){
				const
				  method= this.tagName == "method" && Method(member, i),
				  signal= this.tagName == "signal" && Signal(member, i),
				  mName= member.attributes.name,
				  m= method|| signal
				i[mName]= m
			}
			
		}
		return this
	})
	return this
}

function Method(m, i){
	return function(){
		
	}
}

function Signal(m, i){
	var ee= new EventEmitter()
	return ee
}
