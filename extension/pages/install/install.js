document.querySelectorAll(".mb-link").forEach(link => {
  link.addEventListener("click", e => {
    browser.runtime.sendMessage({
      command: "event",
      event: "mb-link-click",
    })
  })
})

document.querySelector("#imprint-link").addEventListener("click", e => {
  browser.tabs.create({
    url: "/pages/legal/legal.html",
  })
})
