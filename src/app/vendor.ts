// Angular 2
import '@angular/core';
import '@angular/common';
import '@angular/forms';
import '@angular/http';
import '@angular/router';

// RxJS
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

if ( process.env.NODE_ENV == 'production' ) {
    require( '@angular/platform-browser' );
} else {
    require( '@angular/platform-browser-dynamic' );
}