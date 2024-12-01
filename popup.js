// Load existing keywords into the input field on popup load
document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.sync.get("blockedWords", ({ blockedWords }) => {
    if (blockedWords && blockedWords.length > 0) {
      document.getElementById("keywords").value = blockedWords.join(", ");
    }
  });
});

// Save updated keywords when "Done" is clicked
document.getElementById("save").addEventListener("click", () => {
  const keywords = document
    .getElementById("keywords")
    .value.split(",")
    .map((word) => word.trim())
    .filter((word) => word.length > 0); // Remove empty entries

  chrome.storage.sync.set({ blockedWords: keywords }, () => {
    console.log("Updated Keywords Saved:", keywords); // Log updated list
    alert("Keywords updated!");
  });
});
