function listenForClicks() {
  document.addEventListener("click", e => {
    function startCrawler(activeTab) {

      browser.tabs.sendMessage(activeTab.id, {
        command: "crawl",
      })
    }

    function reportError(error) {
      console.error(`Could not crawl: ${error}`)
    }

    if (e.target.id === "crawl-button") {
      browser.tabs
        .query({ active: true, currentWindow: true })
        .then(tabs => startCrawler(tabs[0]))
        .catch(reportError)
    }
  })
}

function reportExecuteScriptError(error) {
  document.querySelector("#popup-content").classList.add("hidden")
  document.querySelector("#error-content").classList.remove("hidden")
  console.error(`Failed to execute crawling script: ${error.message}`)
}

browser.tabs
  .executeScript({ file: "/content_scripts/crawler.js" })
  .then(listenForClicks)
  .catch(reportExecuteScriptError)


