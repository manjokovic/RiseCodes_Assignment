const contextData = require("../data/testData.json");
const { Page, expect } = require("@playwright/test");
const { scroll } = require("../utilities/common_functions");
const columnStyleDimensions="width: 380px; height: 250px;"
const stickyStyleDimensions="width: 399px; height: 225px;"
const columnStylePosition="position: relative;"
const stickyStylePosition="position: fixed;"
exports.LandingPage = class LandingPage {
  // insert your locators and methods here
  constructor(page) {
    this.page = page;
    (this.leftplayer_video = page.locator(
      "//div[@id='left-player']//div[contains(@class,'sr-cc')]"
    )),
    (this.leftplayer_ad = page.locator(
    "//div[@id='left-player']//div[contains(@class,'sr-ac')]"
    )), 
    (this.rightplayer_video = page.locator(
    "//div[@id='right-player']//div[contains(@class,'sr-cc')]"
    )),
    (this.rightplayer_ad = page.locator(
    "//div[@id='right-player']//div[contains(@class,'sr-ac')]"
    )),
    (this.leftplayer = page.locator(
    "//div[@id='left-player']//div[contains(@id,'sr-player')]"
    )),
    (this.rightplayer = page.locator(
    "//div[@id='right-player']//div[contains(@id,'sr-player')]"
    )),
    (this.leftplayer_adStarted = page.locator(
        "//div[@id='left-player']//div[contains(@class,'sr-ac') and contains(@style,'z-index: 1')]"
        )), 
    (this.leftplayer_skipAd = page.locator(
        "//div[@id='left-player']//div[contains(@class,'sr-ac')]//div[contains(@class,'skip-button-active')]"
    ));
    (this.rightplayer_adStarted = page.locator(
        "//div[@id='right-player']//div[contains(@class,'sr-ac') and contains(@style,'z-index: 1')]"
        )), 
    (this.rightplayer_skipAd = page.locator(
        "//div[@id='right-player']//div[contains(@class,'sr-ac')]//div[contains(@class,'skip-button-active')]"
    ));
    (this.stickyPlayer_close = page.locator(
        "//div[@id='left-player']//div[contains(@class,'sticky-close-button')]"
    ));

    
  }

  //--> Method to navigate to sdk url
  //--> Parameters : url  Returns : null
  async navigateToUrl(url) {
    // Navigate to url
    await this.page.goto(url);
    // Wait for one of the player to be loaded
    await this.leftplayer_video.waitFor({ state: "visible" });
  }

  //--> Method to verify that player 1 is loaded correctly in the page
  //--> Parameters : null  Returns : Boolean
  async verifyLeftPlayersLoaded() {
    // Check if both video player and ad player is loaded and return true or false
    return (
      (await this.leftplayer_video.isVisible()) &&
      (await this.leftplayer_ad.isVisible())
    );
  }

  //--> Method to verify that player 2 is loaded correctly in the page
  //--> Parameters : null  Returns : Boolean
  async verifyRightPlayersLoaded() {
    // Check if both video player and ad player is loaded and return true or false
    return (
      (await this.rightplayer_video.isVisible()) &&
      (await this.rightplayer_ad.isVisible())
    );
  }

  //--> Method to verify that all players are loaded with the expected dimensions
  //--> Parameters : width:string,height:string  Returns : Boolean
  async verifyPlayerDimensions(width, height) {
    // Get attribute style from left and right players
    let leftPlayer_dimension = await this.leftplayer.getAttribute("style");
    let rightPlayer_dimension = await this.rightplayer.getAttribute("style");
    // Filter out width and height for left and right player
    let _leftWidth = leftPlayer_dimension.split(";")[1].split(":")[1];
    let _rightWidth = rightPlayer_dimension.split(";")[1].split(":")[1];
    let _leftHeight = leftPlayer_dimension.split(";")[2].split(":")[1];
    let _rightHeight = rightPlayer_dimension.split(";")[2].split(":")[1];
    // Assert that element dimensions are equal to expected dimensions passed
    expect(_leftWidth.trim()).toEqual(width);
    expect(_leftHeight.trim()).toEqual(height);
    expect(_rightWidth.trim()).toEqual(width);
    expect(_rightHeight.trim()).toEqual(height);
  }

  //--> Method to verify sticky functionality for left player
  //--> Parameters : null  Returns : null
  async verifyStickyFunctionality()
  {
    // Wait for one of the player to be loaded
    await this.leftplayer.waitFor({ state: "visible" });
    // create custom locators for player with position as relative and position as fixed
    let leftplayer_fixed = this.page.locator("//div[@id='left-player']//div[contains(@style,'"+columnStyleDimensions+"') and contains(@style,'"+columnStylePosition+"')]")
    let leftplayer_sticky = this.page.locator("//div[@id='left-player']//div[contains(@style,'"+stickyStyleDimensions+"') and contains(@style,'"+stickyStylePosition+"')]")
    // Gradually scroll down to bottom of page
    await this.page.evaluate(scroll, { direction: "down", speed: "slow" });
    // Check if left player with position relative has detached and sticky player is visible
    await leftplayer_fixed.waitFor({ state: "detached" })
    await leftplayer_sticky.waitFor({ state: "visible" })
    // Gradually scroll up to top of page
    await this.page.evaluate(scroll, { direction: "up", speed: "slow" });
    // Check if left player with position relative is visibile and sticky player has detached
    await leftplayer_fixed.waitFor({ state: "visible" })
    await leftplayer_sticky.waitFor({ state: "detached" })
  } 

    //--> Method to wait for an ad in a player
  //--> Parameters : left-player or right-player  Returns : null
  async waitForAnAd(whichPlayer)
  {
    if(whichPlayer==="left-player")
    {
        await this.leftplayer_adStarted.waitFor({ state: "visible" });
    }
    else if(whichPlayer==="right-player")
    {
        await this.rightplayer_adStarted.waitFor({ state: "visible" });  
    }
  }

   //--> Method to click on skip button
  //--> Parameters : left-player or right-player  Returns : null
  async skipAd(whichPlayer)
  {
    if(whichPlayer==="left-player")
    {
        await this.leftplayer_skipAd.waitFor({ state: "visible" });
        await this.leftplayer_skipAd.click({force: true});
    }
    else if(whichPlayer==="right-player")
    {
        await this.rightplayer_skipAd.waitFor({ state: "visible" });
        await this.rightplayer_skipAd.click({force: true});  
    }

  }

   //--> Method to wait for skip ad to be active
  //--> Parameters : left-player or right-player  Returns : null
  async waitForSkipAdActive(whichPlayer)
  {
    if(whichPlayer==="left-player")
    {
        await this.leftplayer_skipAd.waitFor({ state: "visible" });
    }
    else if(whichPlayer==="right-player")
    {
        await this.rightplayer_skipAd.waitFor({ state: "visible" });
    }

  }


   //--> Method to close sticky player
  //--> Parameters : null  Returns : null
  async closeStickyPlayer()
  {
    // Wait for one of the player to be loaded
    await this.leftplayer.waitFor({ state: "visible" });
    // create custom locators for player with position as relative and position as fixed
    let leftplayer_fixed = this.page.locator("//div[@id='left-player']//div[contains(@style,'"+columnStyleDimensions+"') and contains(@style,'"+columnStylePosition+"')]")
    let leftplayer_sticky = this.page.locator("//div[@id='left-player']//div[contains(@style,'"+stickyStyleDimensions+"') and contains(@style,'"+stickyStylePosition+"')]")
    // Gradually scroll down to bottom of page
    await this.page.evaluate(scroll, { direction: "down", speed: "slow" });
    // Check if left player with position relative has detached and sticky player is visible
    await leftplayer_fixed.waitFor({ state: "detached" })
    await leftplayer_sticky.waitFor({ state: "visible" })
    await this.stickyPlayer_close.waitFor({ state: "visible" })
    await this.stickyPlayer_close.click()  
  } 

     //--> Method to pause player
  //--> Parameters : left-player or right-player  Returns : null
  async pausePlayer(whichPlayer)
  {
    let playerToolbar=this.page.locator("//div[@id='"+whichPlayer+"']//div[@class='sr-cc']//div[@class='sr-blade-control-bar']")
    let playerPause=this.page.locator("//div[@id='"+whichPlayer+"']//div[@class='sr-cc']//div[contains(@class,'sr-blade-pause')]")
    await playerToolbar.waitFor({ state: "visible" });
    playerToolbar.focus();
    await playerPause.waitFor({ state: "visible" });
    playerPause.click();
  } 

};
