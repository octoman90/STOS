module.exports = function TestResult(name, passed, message, details) {
	this.name = name
	this.passed = passed
	this.message = message
	this.details = details
}
