browser.runtime.onMessage.addListener(message => {
  if (message.command === "crawl") {
    document.querySelectorAll("a").forEach(node => {
      if (node.href.startsWith("https://isis.tu-berlin.de/mod/resource/view.php?id=")) {
        fetch(node.href).then(res => {
          browser.runtime.sendMessage({ command: "download", url: res.url })
        })
      }
    })
  }
})