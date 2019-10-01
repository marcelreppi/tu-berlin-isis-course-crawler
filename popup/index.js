let activeTab = null

function getActiveTab() {
  return browser.tabs
    .query({ active: true, currentWindow: true })
    .then(tabs => {
      activeTab = tabs[0]
    })
    .catch(reportError)
}

function checkURL() {
  const { url } = activeTab
  if (!url.startsWith("https://isis.tu-berlin.de/course/view.php?id=")) {
    reportError(new Error("Not an ISIS course URL"))
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
    })

    preventCrawl = true
  })
}

function reportError(error) {
  document.querySelector("#popup-content").classList.add("hidden")
  document.querySelector("#error-content").classList.remove("hidden")
  console.error(`Failed to execute crawling script: ${error.message}`)
}

browser.tabs
  .executeScript({ file: "/content_scripts/crawler.js" })
  .then(getActiveTab)
  .then(checkURL)
  .then(scanForDocuments)
  .then(listenForCrawl)
  .catch(reportError)

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
