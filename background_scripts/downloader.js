browser.runtime.onMessage.addListener(message => {
  if (message.command === "download") {
    browser.downloads.download({
      url: message.url
    })
  }
})