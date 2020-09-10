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
});

test('When Logged in can see blog create form', async () => {
    await page.login();
    await page.click('a.btn-floating');
    const label = await page.getContentOf('form label');
    expect(label).toEqual('Blog Title');
});