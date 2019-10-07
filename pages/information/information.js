document.querySelectorAll(".legal-link").forEach(node => {
  node.addEventListener("click", e => {
    browser.tabs.create({
      url: "../legal-shit/legal-shit.html",
    })
  })
})
