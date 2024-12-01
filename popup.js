document.getElementById("save").addEventListener("click", () => {
  const newKeywords = document
    .getElementById("keywords")
    .value.split(",")
    .map((word) => word.trim());

  // Fetch existing keywords and append new ones
  chrome.storage.sync.get("blockedWords", ({ blockedWords }) => {
    const updatedKeywords = blockedWords
      ? [...new Set([...blockedWords, ...newKeywords])] // Combine and remove duplicates
      : newKeywords;

    chrome.storage.sync.set({ blockedWords: updatedKeywords }, () => {
      console.log("Updated Keywords Saved:", updatedKeywords); // Log updated list
      alert("Keywords updated!");
    });
  });
});
