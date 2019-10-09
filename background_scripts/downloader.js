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

function sendEvent(event) {
  const now = new Date()
  const isFirefox = typeof InstallTrigger !== "undefined"
  fetch(
    "https://e3hfofu2w1.execute-api.eu-central-1.amazonaws.com/default/tu-berlin-isis-course-crawler-event-tracker",
    {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify({
        event,
        date: now.toLocaleDateString("de-DE"),
        time: now.toLocaleTimeString("de-DE"),
        browser: isFirefox ? "firefox" : "chrome",
      }),
    }
  )
}

browser.runtime.onInstalled.addListener(details => {
  switch (details.reason) {
    case "install":
      sendEvent("install")
      break
    case "update":
      sendEvent("update")
      break
    default:
      break
  }
})
