<template>
  <div class="app" :class="{ chrome: !isFirefox }">
    <div class="title">
      TU Berlin ISIS Course Crawler
      <img class="title-icon" :src="MoodleIcon" alt="logo" />
    </div>

    <div id="popup-content">
      <StartingPageView
        v-if="showStartingPageView"
        :activeTab="activeTab"
        :options="options"
      ></StartingPageView>
      <CourseView v-if="showCourseView" :activeTab="activeTab" :options="options"></CourseView>
      <NoMoodle v-if="showNoMoodle"></NoMoodle>
    </div>

    <div class="footer">
      <div class="mb-row footer-row">
        <span>
          Please consider switching to
          <span
            class="link"
            @click="() => navigateTo('/pages/information/information.html')"
          >
            Moodle Buddy
          </span>
        </span>
        <span>
          More info
          <span class="link" @click="onInfoClick">here</span>
        </span>
      </div>
      <div class="footer-row">
        <span>
          Inofficial Plugin by
          <span class="link" @click="() => navigateTo('https://twitter.com/marcelreppi')">
            marcelreppi
          </span>
        </span>
        <span>
          <div class="link" @click="onDonateClick">Donate</div>
        </span>
        <span class="footer-right-section">
          <div
            class="link"
            @click="
              () => navigateTo('https://github.com/marcelreppi/tu-berlin-isis-course-crawler')
            "
          >
            GitHub
          </div>
          <img class="info-icon" :src="InfoIcon" alt="info" @click="onInfoClick" />
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { sendEvent, getActiveTab, validURLRegex, isFirefox } from "../shared/helpers.js"
import StartingPageView from "./views/StartingPageView.vue"
import CourseView from "./views/CourseView.vue"
import NoMoodle from "./views/NoMoodle.vue"

import MoodleIcon from "../icons/icon48.png"
import InfoIcon from "./static/images/information.png"

const startingPageRegex = new RegExp(validURLRegex + /\/my\//.source, "gi")
const coursePageRegex = new RegExp(validURLRegex + /\/course\/view\.php\?id=[0-9]*/.source, "gi")

export default {
  components: {
    StartingPageView,
    CourseView,
    NoMoodle,
  },
  data: function() {
    return {
      activeTab: null,
      InfoIcon,
      MoodleIcon,
      currentURL: "",
      options: null,
    }
  },
  computed: {
    isFirefox,
    showStartingPageView: function() {
      return false // No start page for ISIS crawler

      if (this.activeTab && this.activeTab.url.match(startingPageRegex)) {
        sendEvent("view-start-page")
        return true
      } else {
        return false
      }
    },
    showCourseView: function() {
      if (this.activeTab && this.activeTab.url.match(coursePageRegex)) {
        // sendEvent("view-course-page")
        sendEvent("pageview")
        return true
      } else {
        return false
      }
    },
    showNoMoodle: function() {
      return !this.showStartingPageView && !this.showCourseView
    },
  },
  methods: {
    onInfoClick: function() {
      browser.tabs.create({
        url: "../pages/information/information.html",
      })
      sendEvent("info-click")
      window.close()
    },
    onDonateClick: function() {
      this.navigateTo("https://paypal.me/marcelreppi")
      sendEvent("donate")
    },
    navigateTo: function(link) {
      browser.tabs.create({
        url: link,
      })
      window.close()
    },
  },
  created: function() {
    browser.storage.local
      .get("options")
      .then(({ options }) => (this.options = options ? options : null))
      .then(getActiveTab)
      .then(tab => (this.activeTab = tab))
  },
}
</script>

<style>
.app {
  font-weight: 300;
  font-size: 16px;
  padding: 25px 10px 5px 10px;
}

.chrome {
  padding-right: 25px;
}

.title {
  font-size: 24px;
  text-align: center;
  margin-bottom: 20px;
}

.title-icon {
  width: 20px;
  height: 20px;
  margin: 0px 5px;
}

.content-container {
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.link {
  color: blue;
  text-decoration: underline;
}

.link:hover {
  cursor: pointer;
}

.footer {
  margin-top: 30px;
  font-size: 12px;
  font-weight: 500;
  color: #8f8f8f;
}

.mb-row {
  text-align: center;
  margin-bottom: 10px;
  font-size: 13px;
}

.footer-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-right-section {
  display: flex;
  align-items: center;
}

.info-icon {
  width: 16px;
  height: 16px;
  margin-left: 10px;
}

.info-icon:hover {
  cursor: pointer;
}
</style>
