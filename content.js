function blockTweets() {
  chrome.storage.sync.get("blockedWords", ({ blockedWords }) => {
    console.log("Blocked Words in content.js:", blockedWords); // Debugging

    if (!blockedWords || blockedWords.length === 0) return;

    const tweets = document.querySelectorAll("article"); // Select all tweets
    tweets.forEach((tweet) => {
      const tweetText = tweet.innerText.toLowerCase();
      const containsBlockedWord = blockedWords.some((word) =>
        tweetText.includes(word.toLowerCase())
      );

      if (containsBlockedWord) {
        console.log("Blocking Tweet:", tweetText); // Log blocked tweets

        // Clear the tweet content
        tweet.innerHTML = `
          <div style="text-align: center; color: gray; font-style: italic; margin: 10px 0;">
            This post was removed by Twitter Post Blocker
          </div>
        `;
        tweet.style.backgroundColor = "#f5f5f5"; // Optional: Light background for visibility
      }
    });
  });
}

// Observe dynamic changes in the feed
const observer = new MutationObserver(() => blockTweets());
observer.observe(document.body, { childList: true, subtree: true });

// Initial run
blockTweets();
