console.log("Starting application");

// Graceful fallback for old browsers
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js");
}

// Fetch and render stories
const fetchLatestStoriesAndRender = async () => {
  const response = await window.fetch(
    "https://hacker-news.firebaseio.com/v0/topstories.json"
  );

  if (!response.ok) {
    document.getElementById(
      "hn-list"
    ).innerHTML = `<div>Could not fetch stories</div>`;
    throw new Error("Could not fetch top story ids.");
  } else {
    const storyIdList = await response.json();
    const firstTen = storyIdList.slice(0, 10);
    const results = await Promise.all(firstTen.map((id) => fetchStoryById(id)));
    const items = results
      .map((res) => {
        return `
        <div>
          <p><a href="${res.url}">${res.title}</a></p>
        </div>
      `;
      })
      .join("");

    if (!navigator.onLine) {
      showOfflineMessage();
    }

    document.getElementById("hn-list").innerHTML = items;
  }
};

const fetchStoryById = async (id) => {
  const response = await window.fetch(
    `https://hacker-news.firebaseio.com/v0/item/${id}.json`
  );

  if (!response.ok) {
    throw new Error(`Could not fetch story with id: ${id}`);
  } else {
    const story = await response.json();
    return story;
  }
};

const showOfflineMessage = () => {
  document.getElementById(
    "toast-container"
  ).innerHTML = `<div style="background-color: yellow; padding: 10px;">You're offline at the moment</div>`;
};

const hideOfflineMessage = () => {
  document.getElementById("toast-container").innerHTML = "";
};

// tell user when we're offline/online
window.addEventListener("offline", function (e) {
  showOfflineMessage();
});

window.addEventListener("online", function (e) {
  hideOfflineMessage();
});

fetchLatestStoriesAndRender();
