"use strict"

const
  promisify= require("es6-promisify")

function Method(m){
	const
	  name= m.attributes.name
	  method= promisify(this.service[name])
	return method
}
