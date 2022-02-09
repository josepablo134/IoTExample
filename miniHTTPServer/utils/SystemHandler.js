'use strict';

const apikey = [{
    id : 1,
    name : "dev",
    authorization : "c97c4db2def71220c03f3a321d78399740d1c17c",
}];

async function getById( id ){
    return apikey.find( (element) => {
        return (id == element.id);
    });
}
async function getBySha( sha ){
	if( sha ){
        return apikey.find( (element) => {
            return (sha == element.authorization);
        });
	}
	return;
}

module.exports = {
	getBySha,
	getById
};
