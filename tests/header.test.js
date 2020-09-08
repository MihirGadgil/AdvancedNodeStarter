const Page = require('./helper/page');
const mongoose = require('mongoose');

let page;
beforeEach(async () => {
    page = await Page.build();
    await page.goto('localhost:3000');
});

afterEach(async () => {
    await page.close();
});

afterAll(async () => {
    mongoose.disconnect();
})

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
    await page.login();
    const logoutText = await page.getContentOf('a[href="/auth/logout"]');
    expect(logoutText).toBe('Logout');
});