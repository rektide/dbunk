var
  _u31= Math.pow(2,31),
  _random= ()=> Math.floor( _u31* Math.random())

/**
  Messenger is an reply-response helper for the dbus-native low level messaging interfaces.
  @param bus the low level DBus bus connection
  @returns a function to send a message, returning a promise for the message reply.
*/
function Messenger( bus){
	var pending= {}
	bus.on( "message", function(msg){
		if( !msg.replySerial) return
		var resolve= pending[ msg.replySerial]
		if( !resolve) return
		resolve( msg)
	})

	return function message( m){
		if( !m.serial){
			var serial= _random()
			m.serial= serial
			pending[ serial]= Promise.defer()
		}
		conn.message( m)
		return m.serial.promise
	}
}

module.exports= Messenger
