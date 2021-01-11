const { Builder, By, Key, until } = require('selenium-webdriver')
const TestResult = require('./TestResult.js')

module.exports = {
	testLogin: async (username, password) => {
		let driver = await new Builder().forBrowser('chrome').build()

		try {
			await driver.get('http://localhost:80')

			await driver.findElement(By.id('logInModeButton')).click()
			await driver.findElement(By.name('username')).sendKeys(username)
			await driver.findElement(By.name('password')).sendKeys(password)
			await driver.findElement(By.id('formSubmitButton')).click()

			await driver.wait(until.titleIs('STOS Home'), 1000)

			return new TestResult('login', true)
		} catch(err) {
			return new TestResult('login', false, `Couldn't log in using name "${username}" and password "${password}"`, err)
		} finally {
			await driver.quit()
		}
	}
}
