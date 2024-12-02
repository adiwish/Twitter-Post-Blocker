document.addEventListener("DOMContentLoaded", function () {
  const inputField = document.getElementById("keywords");
  const doneButton = document.getElementById("save"); 
  const postsBlockedCount = document.getElementById("counter");

  chrome.storage.local.get(["blockedWords"], function (result) {
    if (result.blockedWords) {
      inputField.value = result.blockedWords.join(", ");
    }
  });

  doneButton.addEventListener("click", function () {
    const keywords = inputField.value
      .split(",")
      .map((word) => word.trim())
      .filter((word) => word);
    chrome.storage.local.set({ blockedWords: keywords }, function () {
      showToast("Keywords updated!");
      setTimeout(() => window.close(), 500); 
    });
  });

  chrome.storage.local.get(["blockedCount"], function (result) {
    postsBlockedCount.textContent = `Posts Blocked: ${
      result.blockedCount || 0
    }`;
  });

  function showToast(message) {
    const toast = document.createElement("div");
    toast.textContent = message;
    toast.style.position = "fixed";
    toast.style.bottom = "20px";
    toast.style.left = "50%";
    toast.style.transform = "translateX(-50%)";
    toast.style.backgroundColor = "#333";
    toast.style.color = "#fff";
    toast.style.padding = "10px";
    toast.style.borderRadius = "5px";
    toast.style.zIndex = "10000";
    document.body.appendChild(toast);

    setTimeout(() => toast.remove(), 1500);
  }
});
