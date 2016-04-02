"use strict"

const
  Dbus= require( "dbus-native"),
  EventEmitter= require("events").EventEmitter,
  xos= require( "xml-object-stream-sax")()
const
  Method= require("./Method"),
  Signal= require("./Signal")

function Introspection(opath, service){
	let
	  xml= invokeIntrospect(opath, service._service),
	  interfaces= xml.then(buildInterfaces(opath, service)),
	  nodes= xml.then(buildNodes(opath, service)),
	  allNodes= Promise.all([nodes])
	return Promise.all([interfaces, allNodes])
}

function invokeIntrospect(opath, service){
	return new Promise(function(resolve, reject){
		service.getInterface(opath, "org.freedesktop.DBus.Introspectable", function(err, introspection){
			if(err){
				reject(err)
			}else{
				introspection.Introspect(function(err, xml){
					resolve(xml)
				})
			}
		})
	})
}

function buildInterfaces(o, opath){
	return function(xml){
		const interfaces= xos(xml, "/node/interface").then(interfaces=> {
			for(var iface of interfaces){
				const
				  p= o[opath]|| (o[opath]= {}),
				  ifname= iface.attributes.name,
				  i= p[ifname]|| (p[ifname]= {})
				Object.defineProperty(i, "name", {value: ifname})
				Object.defineProperty(i, "service", {value: service})
				for(let member of iface.children){
					const
					  method= this.tagName == "method" && Method(member),
					  signal= this.tagName == "signal" && Signal(member),
					  mname= member.attributes.name,
					  m= method|| signal
					i[mname]= m
				}
			}
			return this
		})
	}
}

function buildNodes(o, opath){
	return function(xml){
		const nodes= xos(xml, "/node/node").then(nodes => {
			const
			  opaths= nodes.map(node => opath + "/" + node.attribute.name),
			  intros= opaths.map(opath=> Introspection(opath, this.service))
			return Promise.all(intros)
		})
	}
}

module.exports= Introspection
