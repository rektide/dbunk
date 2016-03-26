"use strict"

function Method(m){
	const
	  name= m.attributes.name
	  method= promisify(this.service[name])
	return method
}
