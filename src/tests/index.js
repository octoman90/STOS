const { testLogin } = require('./login.js')

function printResults(results) {
	let failed = results.filter(r => !r.passed)

	console.log(`Tests run: ${results.length}`)
	console.log(`Tests passed: ${results.length - failed.length}`)

	failed.forEach(r => {
		console.log(`Test "${r.name}" failed: ${r.message}`)
		console.log(r.details)
	})
}

async function testAll() {
	const results = []

	results.push(await testLogin('demoUser', 'password'))

	return results
}

testAll().then(printResults)
