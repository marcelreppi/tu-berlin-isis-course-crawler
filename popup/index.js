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
  const { url } = activeTab
  if (!url.startsWith("https://isis.tu-berlin.de/course/view.php?id=")) {
    showWrongPageContent()
  }
}

function scanForDocuments() {
  browser.tabs.sendMessage(activeTab.id, {
    command: "scan",
  })
}

let preventCrawl = false
function listenForCrawl() {
  document.querySelector("#crawl-button").addEventListener("click", e => {
    if (preventCrawl) return

    document.querySelector("#crawl-button").classList.add("disabled")

    browser.tabs.sendMessage(activeTab.id, {
      command: "crawl",
      useISISFilename: document.querySelector("#isis-filename-check").checked,
      prependCourseToFilename: document.querySelector("#course-filename-check").checked,
      prependCourseShortcutToFilename: document.querySelector("#course-short-filename-check")
        .checked,
    })

    preventCrawl = true
  })
}

function showWrongPageContent() {
  document.querySelector("#popup-content").classList.add("hidden")
  document.querySelector("#wrong-page-content").classList.remove("hidden")
}

function showErrorContent(error) {
  document.querySelector("#popup-content").classList.add("hidden")
  document.querySelector("#error-content").classList.remove("hidden")
  console.error(`Failed to execute crawling script: ${error.message}`)
}

getActiveTab().then(() => {
  checkURL()
  scanForDocuments()
  listenForCrawl()
})

browser.runtime.onMessage.addListener(message => {
  if (message.command === "scan-result") {
    document.querySelector("#resource-info-loading").classList.add("hidden")

    if (message.numberOfResources === 1) {
      document.querySelector("#resource-info-single").classList.remove("hidden")
    } else {
      document.querySelector("#resource-info-number").textContent = message.numberOfResources
      document.querySelector("#resource-info-multiple").classList.remove("hidden")

      if (message.numberOfResources === 0) {
        document.querySelector("#crawl-button").classList.add("disabled")
        preventCrawl = true
      }
    }
  }
})
