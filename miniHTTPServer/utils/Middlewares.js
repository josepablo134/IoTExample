'use strict';

///	In order to minimize queries to database for apikey authorization
//	a software cache is implemented.
console.log("======== CLEAN CACHE FOR APIKEY ==============");
let apikeyCache = {
	maxMapBuffer : 10,
	actualCached : 0,
	authShaMap : new Map()
};

///	Extract JWT or BasicAuth
function Auth( req, res , next ){
	///
	///	Try to extract the authorization data from headers
	///
	let auth;
	if( req.headers.hasOwnProperty( "authorization" ) ){
		auth = req.headers.authorization;
		auth = auth.split(" ")[1];
		if( !auth ){ console.log( "NO HEADER AUTH available" ); return next(); }
		//console.log( auth );
		///	Try	BasicAuth {
		try{
			let ba =  Buffer.from(  auth , 'base64' ).toString() 
			//const [user,pass] = ba.split(':');
			ba = ba.split(':');
			if( ba.length == 2 ){
				//console.log( "BasicAuth", ba[0] , ba[1] );
				req.basicAuth = { user : ba[0] , password : ba[1] };
			}
		}catch(error){
				console.log("MIDDLEWARE_AUTH_ERR_BA",error);
		}
		///	Try	BasicAuth }
	}else if( req.query.access_token ){
		auth = req.query.access_token;
		if( !auth ){ console.log( "NO QUERY AUTH available" ); return next(); }
	}
	if( auth ){
		///	Try JWT	{
		try{
			let jwt = auth.split(".");
			if( jwt.length == 3 ){
					req.JWT = {};
					req.JWT.head = JSON.parse( Buffer.from( jwt[0] , 'base64' ).toString() );
					req.JWT.payload = JSON.parse( Buffer.from( jwt[1] , 'base64' ).toString() );
					req.JWT.payload.iat = new Date( Date.parse( req.JWT.payload.iat ) );
					req.JWT.payload.exp = new Date( Date.parse( req.JWT.payload.exp ) );
					req.JWT.checksum = Buffer.from( jwt[2] , 'base64' ).toString();
					//console.log( "JWT" , req.JWT );
			}
		}catch( error ){
			console.log("MIDDLEWARE_AUTH_ERR_JWT",error);
		}
		///	Try JWT	}
	}
	next();
}

function errorJSON( error , request , response , next ){
	console.log(error);
	if( error !== null ){
		///	For body-parser errors
		if( error instanceof SyntaxError && error.status === 400 && 'body' in error ){
			return response.status(400).json({ error : 'Invalid json' , code : 400  });
		}
		///	For any error
		return response.status(500).send( { error: "Internal server error" , code : 500 } );
	}else{
		return next();
	}
}

function error404( request , response , next ){
	return response.status(404).send( { error : "Page not found", code : 404 } );
}

const SystemHandler = require('./SystemHandler.js');
function apiKey( request , response , next ){
	let apikey = request.query.apikey;
	if( typeof( apikey ) !== 'string' ){
		return response.status(404).send( { error : "apikey error", code : 404 } );
	}
	if( apikey ){
		try{
			if( apikeyCache.authShaMap.has( request.query.apikey ) ){
				console.log("CACHE APIKEY :" , apikeyCache.authShaMap.get(apikey));
				return next();
			}else{
				SystemHandler.getBySha( apikey ).then(
					(apiEntry) => {
						if( apiEntry ){
							//console.log( "VALID APIKEY : " , out[0].name );
							///	If there's enough space in cache system, save apikey
							if( apikeyCache.actualCached < apikeyCache.maxMapBuffer ){
								apikeyCache.authShaMap.set( apikey , apiEntry.name );
								apikeyCache.actualCached++;
							}else{
								console.log("============ CACHE MEMORY IS FULL ================");
							}
							next();
						}else{
							response.status(401).send(
							{
								error: "API key has expired or is invalid",
								code: 401
							}
						);
						}
					}
				);
			}
		}catch(error){
			console.log( "=============== MIDDLE ERROR : APIKEY ==============" );
			console.log( error );
			response.status(500).send({
				error: "Internal server error",
				code: 500 
			});
			next();
		}
	}else{
		response.status(401).send(
			{
				error: "API key has expired or is invalid",
				code: 401
			}
		);
	}
}

module.exports = {
	Auth,
	errorJSON,
	error404,
	apiKey,
};
