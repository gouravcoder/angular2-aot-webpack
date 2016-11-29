const fs   = require( 'fs' );
const path = require( 'path' );
const sass = require( 'node-sass' );

function findFile( startPath, filter, callback ){

	if ( !fs.existsSync( startPath ) ){
		console.log( 'no dir ', startPath );
		return;
	}

	const files = fs.readdirSync( startPath );
	for( let i = 0; i < files.length; i++ ){
		const filename = path.join( startPath,files[i] );
		const stat = fs.lstatSync( filename );
		if ( stat.isDirectory() ){
			findFile( filename, filter, callback ); //recurse
		} else if ( filter.test( filename ) ) {
			callback( filename );
		}
	};
};

function compileSass ( file ) {
	const result = sass.renderSync({
		file,
		// includePaths: [ 'lib/', 'mod/' ], // include sass deps.
		outputStyle: 'compressed'
	});
	fs.writeFileSync( file.replace( '.scss', '.css' ), result.css, 'utf8' );
}

function replaceStyleExtTo( ext, repExt, componentFile ){

	let data = fs.readFileSync( componentFile, 'utf8' );
	
	if ( data.includes( ext ) ) {
		fs.writeFileSync( componentFile, data.replace( ext, repExt ), 'utf8' );
	} else {
		console.log('no need to change style extension %s to %s', ext, repExt, 'in file', componentFile);
	}
}

if ( process.env.NODE_ENV == 'production' ) {
	// in production compile sass files and change style extension to css
	findFile( './src', /\.scss$/, compileSass.bind( this ) );
	findFile( './src', /\.component.ts$/, fileName => replaceStyleExtTo( '.scss', '.css', fileName ) );
} else {
	// otherwise change style extension to scss
	findFile( './src', /\.component.ts$/, fileName => replaceStyleExtTo( '.css', '.scss', fileName ) );
}