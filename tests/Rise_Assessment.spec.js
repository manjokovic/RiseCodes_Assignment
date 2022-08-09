const contextData=require("../data/testData.json")
const {test, expect}=require('@playwright/test')
const {LandingPage} = require('../pages/Landing.page')
const { eventListener } = require("../utilities/common_functions");

test('Rise - 1. Look for the server bladex.js request on hitting sdk url',async({page}) =>
{
    // Instantiate landing page
    const landingPage = new LandingPage(page);
    // Check if sr.bladex.js is included in the response when hitting page url
    const [response] = await Promise.all([
        page.waitForResponse('https://sdk.streamrail.com/blade/sr.bladex.js'),
        // Hitting page url triggers the request
        landingPage.navigateToUrl(contextData.url)
      ]);
    //Assert that the response status is 200
      expect(response.status()).toEqual(200)  
})

test('Rise - 2. Verify that 1 of the players is visible on the page',async({page}) =>
{
    // Instantiate landing page
    const landingPage = new LandingPage(page);
    // Navigate to sdk url - Page navigation verifies that one player is loaded
    await landingPage.navigateToUrl(contextData.url)
    // Verifying that both players are correctly loaded
    expect((await landingPage.verifyLeftPlayersLoaded() &&  await landingPage.verifyRightPlayersLoaded())).toBeTruthy()
})

test('Rise - 3. Verify that the player height & width match with the required dimensions (380 X 250)',async({page}) =>
{
    // Instantiate landing page
    const landingPage = new LandingPage(page);
    // Navigate to sdk url - Page navigation verifies that one player is loaded
    await landingPage.navigateToUrl(contextData.url)
    // Verifying that both players are loaded with dimensions 380px x 250px
    await landingPage.verifyPlayerDimensions("380px","250px")
})

test('Rise - 4a. Verify sticky functionality',async({page}) =>
{
    // Instantiate landing page
    const landingPage = new LandingPage(page);
    // Navigate to sdk url - Page navigation verifies that one player is loaded
    await landingPage.navigateToUrl(contextData.url)
    // Verify sticky behaviour of left player on scrolling
    await landingPage.verifyStickyFunctionality()
})

test('Rise - 4b. Verify stickychange event call ',async({page}) =>
{
    let dialogMessage=""
    // Instantiate landing page
    const landingPage = new LandingPage(page);
    // Navigate to sdk url - Page navigation verifies that one player is loaded
    await landingPage.navigateToUrl(contextData.url)
    // Check page for dialogs, get the dialog message if any and accept the dialog
    page.on('dialog', dialog => {dialogMessage = dialog.message();setTimeout(()=>{dialog.accept()}, 5000)});
    // Add custom listener to throw an alert in case stickychange event is emitted
    await page.evaluate("myPlayer.on('stickychange', function(){alert ('stickychange');})")
    // Verify sticky behaviour of left player on scrolling
    await landingPage.verifyStickyFunctionality(),
    console.log(dialogMessage)
    await expect(dialogMessage).toEqual("stickychange")
})


test('Rise - 5a. Trigger and verify a skip button click when the ad is started ',async({page}) =>
{
    // Instantiate landing page
    const landingPage = new LandingPage(page);
    // Navigate to sdk url - Page navigation verifies that one player is loaded
    await landingPage.navigateToUrl(contextData.url)
    // Wait for an ad to appear on the left player
    await landingPage.waitForAnAd("right-player")
    // Skip the ad once Skip Ad button is active
    await landingPage.skipAd("right-player")
    // await page.pause()
})

test('Rise - 5b. Verify that skipButtonClick event is triggered when skip ad button is clicked',async({page}) =>
{
    let dialogMessage=""
    // Instantiate landing page
    const landingPage = new LandingPage(page);
    // Navigate to sdk url - Page navigation verifies that one player is loaded
    await landingPage.navigateToUrl(contextData.url)
    // Wait for an ad to appear on the left player
    await landingPage.waitForAnAd("left-player")
    // Check page for dialogs, get the dialog message if any and accept the dialog
    page.on('dialog', dialog => {dialogMessage = dialog.message();dialog.accept()});
    // Add custom listener to throw an alert in case skipButtonClicked event is emitted
    await page.evaluate("myPlayer.on('skipButtonClicked', function(){alert ('skipButtonClicked');})")
    // Trigger skipButtonClicked event by clicking on Skip Ad button
    await landingPage.skipAd("left-player"),
    console.log(dialogMessage)
    await expect(dialogMessage).toEqual("skipButtonClicked")
})

test('Rise - 6. Close the sticky player by pressing the close button and track the specific ‘xbc’ event',async({page}) =>
{
    // Instantiate landing page
    const landingPage = new LandingPage(page);
    // Navigate to sdk url - Page navigation verifies that one player is loaded
    await landingPage.navigateToUrl(contextData.url)
    // Check if reporting event with action a:xbc is emitted when sticky player is closed
    const [request] = await Promise.all([
     page.waitForRequest(request => request.url() === 'https://k.streamrail.com/m' && request.method() === 'POST' && request.postData().includes('"a":"xbc"')),
     // Close sticky player
     landingPage.closeStickyPlayer()
      ]);
    let reportResponse=await request.response()
    //Assert that the response status is 204 POST success
    expect(reportResponse.status()).toEqual(204)
})

test('Rise - 7. Verify specific impression (a = ai) event is fired',async({page}) =>
{
    // Instantiate landing page
    const landingPage = new LandingPage(page);
    // Navigate to sdk url - Page navigation verifies that one player is loaded
    await landingPage.navigateToUrl(contextData.url)
    // Check if reporting event with action a:xbc is emitted when sticky player is closed
    const [request] = await Promise.all([
     page.waitForRequest(request => request.url() === 'https://k.streamrail.com/m' && request.method() === 'POST' && request.postData().includes('"a":"ai"')),
     // pause left player  
     landingPage.pausePlayer("left-player"),
     // Wait for ad to load on right player
     landingPage.waitForAnAd("right-player")
     ]);
    let reportResponse=await request.response()
    //Assert that the response status is 204 POST success
    expect(reportResponse.status()).toEqual(204)
})