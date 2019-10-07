browser.runtime.onMessage.addListener(message => {
  if (message.command === "download") {
    const urlParts = message.url.split("/")
    let filename = urlParts[urlParts.length - 1]
    const filenameParts = filename.split(".")
    const fileType = filenameParts[filenameParts.length - 1]

    if (message.useISISFilename) {
      filename = `${message.ISISFilename}.${fileType}`
    }

    if (message.prependCourseToFilename) {
      filename = `${message.courseName}_${filename}`
    }

    if (message.prependCourseShortcutToFilename) {
      filename = `${message.courseShortcut}_${filename}`
    }

    browser.downloads.download({
      url: message.url,
      filename,
    })
    return
  }

  if (message.command === "download-folder") {
    let filename = `${message.folderName}.zip`

    if (message.prependCourseToFilename) {
      filename = `${message.courseName}_${filename}`
    }

    if (message.prependCourseShortcutToFilename) {
      filename = `${message.courseShortcut}_${filename}`
    }

    browser.downloads.download({
      url: message.url,
      filename,
    })
    return
  }
})
