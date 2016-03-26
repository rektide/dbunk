"use strict"

const
  rxjs= require("rxjs")

function Signal(m){
	const
	  name= m.attributes.name
	return rxjs.Observable.create(obs=> {
		this.service.on(name, ()=> {
			obs.onNext(arguments)
		})
	})
}
