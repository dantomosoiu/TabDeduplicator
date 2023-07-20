document.getElementById('cleanupButton').addEventListener('click', () => {
  const cleanupButton = document.getElementById('cleanupButton');
  cleanupButton.textContent = "Cleaning up...";
  cleanupButton.disabled = true;

  chrome.runtime.sendMessage({ msg: "cleanup" }, function (response) {
    document.getElementById('total').textContent = response.totalTabsRemoved;
    document.getElementById('cleanupMessage').textContent = `Removed ${response.numTabsClosed} duplicate tab(s)!`;
  });
});

document.getElementById('advancedToggle').addEventListener('change', function () {
  const advancedSection = document.getElementById('advancedSection');
  if (this.checked) {
    advancedSection.style.display = "block";
  } else {
    advancedSection.style.display = "none";
  }
  chrome.storage.sync.set({ advancedToggle: this.checked });
});

document.getElementById('ignoreQuery').addEventListener('change', function () {
  chrome.storage.sync.set({ ignoreQuery: this.checked });
});

document.getElementById('ignoreFragment').addEventListener('change', function () {
  chrome.storage.sync.set({ ignoreFragment: this.checked });
});

window.onload = function () {
  chrome.storage.sync.get(['totalTabsRemoved', 'advancedToggle', 'ignoreQuery', 'ignoreFragment'], function (data) {
    document.getElementById('total').textContent = data.totalTabsRemoved || 0;
    document.getElementById('ignoreQuery').checked = (data.ignoreQuery !== undefined) ? data.ignoreQuery : true;
    document.getElementById('ignoreFragment').checked = (data.ignoreFragment !== undefined) ? data.ignoreFragment : true;

    const advancedToggle = document.getElementById('advancedToggle');
    advancedToggle.checked = data.advancedToggle || false;
    if (advancedToggle.checked) {
      document.getElementById('advancedSection').style.display = "block";
    }
  });
}
