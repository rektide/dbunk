"use strict"

const
  Dbus= require( "dbus-native"),
  EventEmitter= require("events").EventEmitter
  xos= require( "xml-object-stream-sax")()

function Introspection(path, service){
	let
	  xml= invokeIntrospection(path, service._service),
	  interfaces= xml.then(buildInterfaces(path, service),
	  nodes= xml.then(buildNodes(path, service),
	  allNodes= Promise.all(nodes)
	return Promise.all([interfaces, allNodes])
}

function invokeIntrospect(path, service){
	return new Promsie(function(resolve){
		service.getInterface(path, "org.freedesktop.DBus.Introspection", function(err, introspection){
			introspection.Introspect(function(err, xml){
				resolve(xml)
			})
		})
	}
}

function buildInterfaces(o, path){
	return function(xml){
		const interfaces= xos(xml, "/node/interface").then(interfaces=> {
			for(var iface of interfaces){
				const
				  p= o[path]|| (o[path]= {}),
				  ifname= iface.attributes.name,
				  i= p[ifname]|| (p[ifname]= {})
				for(let member of iface.children){
					const
					  method= this.tagName == "method" && Method(member, i),
					  signal= this.tagName == "signal" && Signal(member, i),
					  mname= member.attributes.name,
					  m= method|| signal
					i[mname]= m
				}
			}
			return this
		})
	}
}

function buildNodes(o, path){
	return function(xml){
		const nodes= xos(xml, "/node/node").then(nodes => {
			return nodes.map(node => path + "." + node.attribute.name)
		})
	}
}

function Method(m, i){
	return function(){
		
	}
}

function Signal(m, i){
	var ee= new EventEmitter()
}
