import fs from 'fs';
import c from 'kleur';
import { chromium } from 'playwright';

const lib = `data:application/javascript;base64,${fs.readFileSync('src/index.js', 'base64')}`;
const template = fs.readFileSync('test/templates/page.html', 'utf-8').replace('__LIB__', lib);

const browser = await chromium.launch();
const page = await browser.newPage();

let passed = 0;
let failed = 0;

for (const file of fs.readdirSync('test/samples')) {
	if (file[0] === '.') continue;

	const title = file.replace('.html', '');
	const html = template.replace('__MARKUP__', fs.readFileSync(`test/samples/${file}`, 'utf-8'));

	await page.goto(`data:text/html,${encodeURIComponent(html)}`);

	const order = await page.evaluate(() => {
		const front =
			document.querySelector('[data-front]') ||
			document.querySelector('shadow-host').shadowRoot.querySelector('[data-front]');
		const back = document.querySelector('[data-back]');

		return compare(front, back);
	});

	if (order === 1) {
		console.error(`${c.green('✓')} ${title}`);
		passed += 1;
	} else {
		console.error(`${c.red('✗')} ${title}`);
		failed += 1;
	}
}

if (passed) {
	console.log(c.green(`${passed} passed`));
	process.exit(0);
}

if (failed) {
	console.log(c.red(`${failed} failed`));
	process.exit(1);
}
