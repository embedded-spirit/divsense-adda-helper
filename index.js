// ADDA Helpers
//

var props = function( obj ){
	return Object.keys( obj ).reduce(function(m,a){
		m.push( [ a, obj[ a ] ] );
		return m;
	}, []);
}

var makeNode = function( id, text, u, k ){

	return function(set){

		set = set || {};

		var s = set[ id ] = {};

		if( text ) s.t = text;

		if( u ) s.u = props( u );

		if( k ) s.k = props( k );

		return set;
	}
}

var setChildNodes = function( parentId, cids, branchName ){

	return function(set){

		branchName = branchName || "children-mmap";

		var node = set[ parentId ];

		node.c = node.c || [];

		node.c.push( [ branchName, cids] );

		cids.forEach( function(id){ set[id].p = parentId });

		return set;
	}
}

var setChild = function( parentId, childId, branchName ){

	return function(set){

		branchName = branchName || "children-mmap";

		var node = set[ parentId ];

		node.c = node.c || [];

		if( !node.c.length ){
			node.c.push( [ branchName, []] );
		}

		node.c = node.c.map(function(a){
			if( a[0] === branchName )
			a[1].push( childId );
		return a;
		});

		set[ childId ].p = parentId;

		return set;
	}
}

var init = makeNode("__root__");

var toArray = function( set, id, array ){

	var node = set[ id ];
	node.id = id;
	delete node.p;

	array.push( node );

	return (node.c || []).reduce(function(acc,branch){

		acc = branch[1].reduce(function(m,a){
			m = toArray( set, a, m );
			return m;
		}, acc );

		return acc;

	}, array );
}

exports.makeNode = makeNode;
exports.setChildNodes = setChildNodes;
exports.setChild = setChild;
exports.init = init;

exports.toArray = function( set ){
	return toArray( set, "__root__", [] );
}

