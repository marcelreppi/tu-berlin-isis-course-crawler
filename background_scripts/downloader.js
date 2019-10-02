browser.runtime.onMessage.addListener(message => {
  if (message.command === "download") {
    let filename = null

    if (message.ISISFilename) {
      const urlParts = message.url.split("/")
      const originalFilename = urlParts[urlParts.length - 1]
      const filenameParts = originalFilename.split(".")
      const fileType = filenameParts[filenameParts.length - 1]
      filename = `${message.ISISFilename}.${fileType}`
    }

    browser.downloads.download({
      url: message.url,
      filename,
    })
  }
})
