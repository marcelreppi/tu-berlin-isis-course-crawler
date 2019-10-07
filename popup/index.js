let activeTab = null
function getActiveTab() {
  return browser.tabs
    .query({ active: true, currentWindow: true })
    .then(tabs => {
      activeTab = tabs[0]
    })
    .catch(showErrorContent)
}

function checkURL() {
  return activeTab.url.startsWith("https://isis.tu-berlin.de/course/view.php?id=")
}

function scanForDocuments() {
  browser.tabs
    .sendMessage(activeTab.id, {
      command: "scan",
    })
    .catch(showErrorContent)
}

function listenForCrawl() {
  document.querySelector("#crawl-button").addEventListener("click", e => {
    if (document.querySelector("#crawl-button").disabled) return

    document.querySelector("#crawl-button").disabled = true

    browser.tabs
      .sendMessage(activeTab.id, {
        command: "crawl",
        useISISFilename: document.querySelector("#isis-filename-check").checked,
        prependCourseToFilename: document.querySelector("#course-filename-check").checked,
        prependCourseShortcutToFilename: document.querySelector("#course-short-filename-check")
          .checked,
      })
      .catch(showErrorContent)
  })
}

function showWrongPageContent() {
  document.querySelector("#popup-content").classList.add("hidden")
  document.querySelector("#wrong-page-content").classList.remove("hidden")
}

function showErrorContent(error) {
  document.querySelector("#popup-content").classList.add("hidden")
  document.querySelector("#wrong-page-content").classList.add("hidden")
  document.querySelector("#error-content").classList.remove("hidden")
  console.error(`Failed to execute crawling script: ${error.message}`)
}

browser.runtime.onMessage.addListener(message => {
  if (message.command === "scan-result") {
    document.querySelector("#resource-info-loading").classList.add("hidden")

    if (message.numberOfResources === 1) {
      document.querySelector("#resource-info-single").classList.remove("hidden")
    } else {
      document.querySelector("#resource-info-number").textContent = message.numberOfResources
      document.querySelector("#resource-info-multiple").classList.remove("hidden")

      if (message.numberOfResources === 0) {
        document.querySelector("#crawl-button").disabled = true
      }
    }
  }
})

document.querySelector(".info-icon").addEventListener("click", e => {
  browser.tabs.create({
    url: "../pages/information/information.html",
  })
})

getActiveTab().then(() => {
  const isISISCourseURL = checkURL()
  if (!isISISCourseURL) {
    showWrongPageContent()
    return
  }

  scanForDocuments()
  listenForCrawl()
})
