console.log("Content.js is running");

function blockTweets() {
  chrome.storage.sync.get("blockedWords", ({ blockedWords }) => {
    console.log("Blocked Words in content.js:", blockedWords); // Debugging: Ensure keywords are retrieved

    if (!blockedWords || blockedWords.length === 0) return;

    const tweets = document.querySelectorAll("article"); // Select all tweets
    tweets.forEach((tweet) => {
      const tweetText = tweet.innerText.toLowerCase();
      console.log("Tweet Text:", tweetText); // Debugging: Check each tweet's content

      const containsBlockedWord = blockedWords.some((word) =>
        tweetText.includes(word.toLowerCase())
      );
      if (containsBlockedWord) {
        console.log("Blocking Tweet:", tweetText); // Debugging: Log blocked tweets
        tweet.style.display = "none"; // Hide the tweet
      }
    });
  });
}

// Observe dynamic changes in the feed
const observer = new MutationObserver(() => blockTweets());
observer.observe(document.body, { childList: true, subtree: true });

// Initial run
blockTweets();
