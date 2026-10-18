let progressStartTime = null;
let progressPausedTime = null;
let progressDuration = null;
let progressRequest = null;
let imageStoryTimeout = null;

// 進行バーを動かす
function animateProgressBar(timestamp) {
  if (progressStartTime === null) {
    progressStartTime = timestamp;
  }

  const elapsed = timestamp - progressStartTime;
  const activeBar = document.querySelector(".story-progress-fill.active");

  if (!activeBar || !progressDuration) return;

  const progress = Math.min(elapsed / progressDuration, 1);
  activeBar.style.width = `${progress * 100}%`;

  if (progress < 1) {
    progressRequest = requestAnimationFrame(animateProgressBar);
  }
}

// 進行バーを開始
function startProgress(duration) {
  cancelAnimationFrame(progressRequest);

  progressDuration = duration;
  progressStartTime = null;
  progressPausedTime = null;

  const activeBar = document.querySelector(".story-progress-fill.active");

  if (activeBar) {
    activeBar.style.width = "0%";
  }

  progressRequest = requestAnimationFrame(animateProgressBar);
}

// 進行バーを一時停止
function pauseProgress() {
  cancelAnimationFrame(progressRequest);
  progressPausedTime = performance.now();
}

// 進行バーを再開
function resumeProgress() {
  if (progressPausedTime === null || progressStartTime === null) return;

  const now = performance.now();
  const pauseDuration = now - progressPausedTime;

  progressStartTime += pauseDuration;
  progressPausedTime = null;

  progressRequest = requestAnimationFrame(animateProgressBar);
}

// ストーリー移動時にタイマーを停止
function navigateStory(url) {
  if (!url) return;

  clearTimeout(imageStoryTimeout);
  cancelAnimationFrame(progressRequest);

  Turbo.visit(url);
}

// 画像ストーリー
function handleImageStory() {
  const img = document.querySelector(".story-show-image");
  if (!img) return;

  const duration = Number(img.dataset.duration || 3000);
  const nextUrl = img.dataset.next;

  startProgress(duration);

  clearTimeout(imageStoryTimeout);

  imageStoryTimeout = setTimeout(() => {
    if (nextUrl) {
      navigateStory(nextUrl);
    }
  }, duration);
}

// 動画ストーリー
function handleVideoStory() {
  const video = document.getElementById("storyVideo");
  if (!video) return;

  const nextUrl = video.dataset.next;

  video.addEventListener("loadedmetadata", () => {
    if (Number.isFinite(video.duration) && video.duration > 0) {
      startProgress(video.duration * 1000);
    }
  });

  video.addEventListener("ended", () => {
    if (nextUrl) {
      navigateStory(nextUrl);
    }
  });

  video.addEventListener("pause", () => {
    pauseProgress();
  });

  video.addEventListener("play", () => {
    resumeProgress();
  });

  video.addEventListener("click", () => {
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  });
}

// 左右タップ
function setupTapNavigation() {
  const nav = document.getElementById("storyNavigation");
  if (!nav) return;

  const nextUrl = nav.dataset.next;
  const prevUrl = nav.dataset.prev;

  const left = document.getElementById("tapLeft");
  const right = document.getElementById("tapRight");

  // 左側：前のストーリーへ
  if (left) {
    left.addEventListener("click", () => {
      if (prevUrl) {
        navigateStory(prevUrl);
      }
    });
  }

  // 右側：次のストーリーへ
  if (right) {
    right.addEventListener("click", () => {
      if (nextUrl) {
        navigateStory(nextUrl);
      }
    });
  }
}

// スマホ：下スワイプで閉じる
function setupSwipeToClose() {
  const container = document.querySelector(".story-show-container");
  if (!container) return;

  let startY = 0;
  let currentY = 0;
  let isDragging = false;

  container.addEventListener("touchstart", (e) => {
    startY = e.touches[0].clientY;
    currentY = startY;
    isDragging = true;
  });

  container.addEventListener("touchmove", (e) => {
    if (!isDragging) return;

    currentY = e.touches[0].clientY;

    const diff = currentY - startY;

    if (diff > 0) {
      container.style.transform = `translateY(${diff}px)`;
      container.style.transition = "none";
    }
  });

  container.addEventListener("touchend", () => {
    if (!isDragging) return;

    isDragging = false;

    const diff = currentY - startY;

    if (diff > 120) {
      navigateStory("/dashboard");
    } else {
      container.style.transition = "transform 0.2s ease";
      container.style.transform = "translateY(0)";
    }
  });
}

// PC：ESCキーで閉じる
function setupEscClose() {
  document.addEventListener("keydown", handleEscClose);
}

function handleEscClose(e) {
  if (e.key === "Escape") {
    navigateStory("/dashboard");
  }
}

// Turboで画面が読み込まれたとき
document.addEventListener("turbo:load", () => {
  handleImageStory();
  handleVideoStory();
  setupTapNavigation();
  setupSwipeToClose();
  setupEscClose();
});

// Turboで画面を離れるときにタイマーを停止
document.addEventListener("turbo:before-cache", () => {
  clearTimeout(imageStoryTimeout);
  cancelAnimationFrame(progressRequest);

  document.removeEventListener("keydown", handleEscClose);
});