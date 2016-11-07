const fs   = require( 'fs' );
const path = require( 'path' );

const gzipSize = require( 'gzip-size' );

const fromRoot = fileName => path.join( __dirname, fileName ); 

const distFolder = fs.readdirSync( './dist/' );

for ( let i in distFolder ) {
console.log( `---------------------------
File : ${distFolder[i]}
---------------------------
File Size Before Gzip : ~${Math.ceil( fs.readFileSync( fromRoot( `dist/${distFolder[i]}` ) ).toString().length / 1024 )}-KB
File Size After  Gzip : ~${Math.ceil( gzipSize.sync( fs.readFileSync( fromRoot( `dist/${distFolder[i]}` ) ).toString() ) / 1024 )}-KB` );
}
