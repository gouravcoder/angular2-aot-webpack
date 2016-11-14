const fs   = require( 'fs' );
const path = require( 'path' );
const zlib = require( 'zlib' );

const gzipSize = require( 'gzip-size' );

const fromRoot = fileName => path.join( __dirname, fileName ); 

const distFolder = fs.readdirSync( './dist/' );
const gzip       = zlib.createGzip();

for ( let i in distFolder ) {
    if ( Math.ceil( gzipSize.sync( fs.readFileSync( fromRoot( `dist/${distFolder[i]}` ) ).toString() ) / 1024 ) >= 102.4 ) {
        if ( !fromRoot( `dist/${distFolder[i]}` ).endsWith( '.gz' ) ) {
console.log( `---------------------------
File : ${distFolder[i]}
---------------------------
Size Before Gzip : ~${Math.ceil( fs.readFileSync( fromRoot( `dist/${distFolder[i]}` ) ).toString().length / 1024 )}-KB
Size After  Gzip : ~${Math.ceil( gzipSize.sync( fs.readFileSync( fromRoot( `dist/${distFolder[i]}` ) ).toString() ) / 1024 )}-KB` );

        
            // fs.createReadStream( fromRoot( `dist/${distFolder[i]}` ) )
            //     .pipe( gzip )
            //     .pipe( fs.createWriteStream( fromRoot( `dist/${distFolder[i]}.gz` ) ) );
        }

    }
}