const puppeteer = require('puppeteer');
const sessionFactory = require('./factories/sessionFactory');
const userFactory = require('./factories/userFactory');

let browser, page;
beforeEach(async () => {
    browser =  await puppeteer.launch({
        headless: false
    });
    page = await browser.newPage();
    await page.goto('localhost:3000');
});

afterEach(async () => {
    await browser.close();
});

test('Header must display Logo', async () => {

    const text = await page.$eval('a.brand-logo', el => el.innerHTML);

    expect(text).toEqual('Blogster');
});

test('clicking login starts OAuth flow', async () => {
    await page.click('.right a');

    const url = await page.url();
    expect(url).toMatch(/accounts\.google\.com/);
});

test('When Signin in, Logout Button shows', async () => {
    const user = await userFactory();
    const { session, sig } = sessionFactory(user);
    await page.setCookie({ name: 'session', value: session });
    await page.setCookie({ name: 'session.sig', value: sig });
    await page.goto('localhost:3000');
    await page.waitFor('a[href="/auth/logout"]');
    const logoutText = await page.$eval('a[href="/auth/logout"]', el => el.innerHTML);
    expect(logoutText).toBe('Logout');
});