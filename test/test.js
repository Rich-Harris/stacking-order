/*global process, stackingOrder */
import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';
import Nightmare from 'nightmare';

const lib = fs.readFileSync( 'dist/stacking-order.umd.js' );
const libDataUri = `data:application/javascript;base64,${lib.toString( 'base64' )}`;
const template = fs.readFileSync( 'test/templates/page.html',  'utf-8' ).replace( '__LIB__', libDataUri );

const samples = fs.readdirSync( 'test/samples' )
	.filter( file => file[0] !== '.' )
	.map( file => {
		const title = file.replace( '.html', '' );
		file = path.resolve( 'test/samples', file );

		const html = fs.readFileSync( file, 'utf-8' );

		return { title, file, html };
	});

const nightmare = Nightmare({ show: false });

nightmare.on( 'console', function ( type, ...args ) {
	console[ type ].apply( console, args ); // eslint-disable-line no-console
});

let passed = 0;
let failed = 0;

function runNextTest () {
	const sample = samples.shift();

	if ( !sample ) {
		if ( passed ) {
			console.log( chalk.green( `${passed} passed` ) ); // eslint-disable-line no-console
			process.exit( 0 );
		}

		if ( failed ) {
			console.log( chalk.red( `${failed} failed` ) ); // eslint-disable-line no-console
			process.exit( 1 );
		}
	}

	const html = template.replace( '__MARKUP__', sample.html );
	const url = `data:text/html,${encodeURIComponent(html)}`;


	nightmare
		.goto( url )
		.evaluate( () => {
			// use this block for debugging via console
			/*setTimeout( () => {
				const front = document.querySelector( '[data-front]' );
				const back = document.querySelector( '[data-back]' );

				stackingOrder.compare( front, back );
			});*/

			const front = document.querySelector( '[data-front]' );
			const back = document.querySelector( '[data-back]' );

			return stackingOrder.compare( front, back );
		})
		.run( ( err, order ) => {
			if ( err ) throw err;

			if ( order === 1 ) {
				console.error( `${chalk.green( '✓' )} ${sample.title}` ); // eslint-disable-line no-console
				passed += 1;
			} else {
				console.error( `${chalk.red( '✗' )} ${sample.title}` ); // eslint-disable-line no-console
				failed += 1;
			}

			runNextTest();
		});
}

runNextTest();
