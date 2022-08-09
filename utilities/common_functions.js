module.exports = {
    // insert your locators and methods here
    fields: {
  
    },
  //--> Method to wait scroll up or down 
  //--> Parameters : args:direction: up or down , speed:fast or slow  Returns : null
    async scroll(args) {
        const {direction, speed} = args;
        const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
        const scrollHeight = () => document.body.scrollHeight;
        const start = direction === "down" ? 0 : scrollHeight();
        const shouldStop = (position) => direction === "down" ? position > scrollHeight() : position < 0;
        const increment = direction === "down" ? 30 : -100;
        const delayTime = speed === "slow" ? 200 : 10;
        console.error(start, shouldStop(start), increment)
        for (let i = start; !shouldStop(i); i += increment) {
            window.scrollTo(0, i);
            await delay(delayTime);
        }
    },

  };