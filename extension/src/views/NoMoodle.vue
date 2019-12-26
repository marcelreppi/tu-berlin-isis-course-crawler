<template>
  <div class="content-container">
    <p>Can't download resources here...</p>
    <div>Make sure you...</div>
    <ul>
      <li>
        are on the
        <span class="link" @click="() => onLinkClick('https://isis.tu-berlin.de/')">
          TU Berlin ISIS Page
        </span>
      </li>
      <li>are logged in</li>
      <li>have the course page open in this tab</li>
    </ul>
  </div>
</template>

<script>
export default {
  methods: {
    onLinkClick(link) {
      browser.tabs.create({
        url: link,
      })
      window.close()
    },
  },
}
</script>

<style>
.link {
  color: blue;
  text-decoration: underline;
}

.link:hover {
  cursor: pointer;
}
</style>
