const fs = require('fs');
const path = require('path');

function safeGet(obj, pathStr) {
	return pathStr.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);
}

function pickAudit(r, id) {
	const a = r.audits && r.audits[id];
	if (!a) return null;
	const items = a.details && Array.isArray(a.details.items)
		? a.details.items.slice(0, 10).map((it) => ({
			url: it.url || (it.source && (it.source.url || it.source)) || (it.request && it.request.url) || it.entity || it.name,
			entity: it.entity || it.entityName,
			wastedMs: it.wastedMs,
			blockingDuration: it.blockingDuration,
			totalBytes: it.totalBytes,
			transferSize: it.transferSize,
			wastedBytes: it.wastedBytes,
			mainThreadTime: it.mainThreadTime,
		}))
		: undefined;
	return {
		id,
		title: a.title,
		score: a.score,
		numericValue: a.numericValue,
		displayValue: a.displayValue,
		items,
		scoreDisplayMode: a.scoreDisplayMode,
	};
}

function main() {
	const inputPath = path.resolve('.next/lighthouse-desktop.json');
	if (!fs.existsSync(inputPath)) {
		console.error('Missing Lighthouse JSON at', inputPath);
		process.exit(2);
	}
	const raw = fs.readFileSync(inputPath, 'utf8');
	const report = JSON.parse(raw);

	const categories = report.categories || {};
	const score = (k) => (categories[k] && typeof categories[k].score === 'number' ? Math.round(categories[k].score * 100) : null);

	const metrics = {
		FCP: pickAudit(report, 'first-contentful-paint'),
		LCP: pickAudit(report, 'largest-contentful-paint'),
		CLS: pickAudit(report, 'cumulative-layout-shift'),
		TBT: pickAudit(report, 'total-blocking-time'),
		SI: pickAudit(report, 'speed-index'),
		TTI: pickAudit(report, 'interactive'),
	};

	const audits = {
		unusedJS: pickAudit(report, 'unused-javascript'),
		renderBlocking: pickAudit(report, 'render-blocking-resources'),
		optimizedImages: pickAudit(report, 'uses-optimized-images'),
		modernFormats: pickAudit(report, 'modern-image-formats'),
		responsiveImages: pickAudit(report, 'uses-responsive-images'),
		offscreenImages: pickAudit(report, 'offscreen-images'),
		fontDisplay: pickAudit(report, 'font-display'),
		thirdParty: pickAudit(report, 'third-party-summary'),
		textCompression: pickAudit(report, 'uses-text-compression'),
		serverResponse: pickAudit(report, 'server-response-time'),
		bootupTime: pickAudit(report, 'bootup-time'),
		domSize: pickAudit(report, 'dom-size'),
		http2: pickAudit(report, 'uses-http2'),
		preconnect: pickAudit(report, 'uses-rel-preconnect'),
		longTasks: pickAudit(report, 'mainthread-work-breakdown'),
		networkRequests: pickAudit(report, 'network-requests'),
	};

	const out = {
		requestedUrl: report.requestedUrl,
		finalUrl: report.finalUrl,
		fetchTime: report.fetchTime,
		environment: safeGet(report, 'environment.settings.formFactor') || 'desktop',
		categories: {
			performance: score('performance'),
			accessibility: score('accessibility'),
			'best-practices': score('best-practices'),
			seo: score('seo'),
		},
		metrics,
		audits,
	};

	const outPath = path.resolve('.next/lh-summary.json');
	fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
	console.log(outPath);
}

main();

