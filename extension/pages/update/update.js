document.querySelectorAll(".mb-link").forEach(link => {
  link.addEventListener("click", e => {
    browser.runtime.sendMessage({
      command: "event",
      event: "mb-link-click",
    })
  })
})
