document.getElementById('cleanupButton').addEventListener('click', () => {
  const cleanupButton = document.getElementById('cleanupButton');
  cleanupButton.textContent = "Cleaning up...";
  cleanupButton.disabled = true;

  chrome.runtime.sendMessage({msg: "cleanup"}, function(response) {
    document.getElementById('total').textContent = response.totalTabsRemoved;
    document.getElementById('cleanupMessage').textContent = `Removed ${response.numTabsClosed} duplicate tab(s)!`;
  });
});

window.onload = function() {
  chrome.storage.sync.get('totalTabsRemoved', function(data) {
    document.getElementById('total').textContent = data.totalTabsRemoved || 0;
  });
}
