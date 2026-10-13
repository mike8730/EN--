let progressStartTime = null;
let progressPausedTime = null;
let progressDuration = null;
let progressRequest = null;

function animateProgressBar(timestamp) {
  if (!progressStartTime) progressStartTime = timestamp;

  const elapsed = timestamp - progressStartTime;
  const activeBar = document.querySelector(".story-progress-fill.active");
  if (!activeBar) return;

  const progress = Math.min(elapsed / progressDuration, 1);
  activeBar.style.width = `${progress * 100}%`;

  if (progress < 1) {
    progressRequest = requestAnimationFrame(animateProgressBar);
  }
}

function startProgress(duration) {
  progressDuration = duration;
  progressStartTime = null;
  progressPausedTime = null;

  const activeBar = document.querySelector(".story-progress-fill.active");
  if (activeBar) activeBar.style.width = "0%";

  progressRequest = requestAnimationFrame(animateProgressBar);
}

function pauseProgress() {
  cancelAnimationFrame(progressRequest);
  progressPausedTime = performance.now();
}

function resumeProgress() {
  if (!progressPausedTime) return;

  const now = performance.now();
  const pauseDuration = now - progressPausedTime;
  progressStartTime += pauseDuration;

  progressRequest = requestAnimationFrame(animateProgressBar);
}

// 画像ストーリー
function handleImageStory() {
  const img = document.querySelector(".story-show-image");
  if (!img) return;

  const duration = Number(img.dataset.duration || 3000);
  startProgress(duration);

  const nextUrl = document.getElementById("storyNavigation").dataset.next;

  setTimeout(() => {
    if (nextUrl) Turbo.visit(nextUrl);
  }, duration);
}

// 動画ストーリー
function handleVideoStory() {
  const video = document.getElementById("storyVideo");
  if (!video) return;

  const nextUrl = video.dataset.next;

  video.addEventListener("loadedmetadata", () => {
    startProgress(video.duration * 1000);
  });

  video.addEventListener("ended", () => {
    if (nextUrl) Turbo.visit(nextUrl);
  });

  video.addEventListener("pause", () => pauseProgress());
  video.addEventListener("play", () => resumeProgress());

  video.addEventListener("click", () => {
    video.paused ? video.play() : video.pause();
  });
}

// 左右タップ
function setupTapNavigation() {
  const nav = document.getElementById("storyNavigation");
  const nextUrl = nav.dataset.next;
  const prevUrl = nav.dataset.prev;

  const left = document.getElementById("tapLeft");
  const right = document.getElementById("tapRight");

  if (left) left.addEventListener("click", () => prevUrl && Turbo.visit(prevUrl));
  if (right) right.addEventListener("click", () => nextUrl && Turbo.visit(nextUrl));
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
      Turbo.visit("/dashboard");
    } else {
      container.style.transition = "transform 0.2s ease";
      container.style.transform = "translateY(0)";
    }
  });
}

// PC：ESCキーで閉じる
function setupEscClose() {
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      Turbo.visit("/dashboard");
    }
  });
}

document.addEventListener("turbo:load", () => {
  handleImageStory();
  handleVideoStory();
  setupTapNavigation();
  setupSwipeToClose();
  setupEscClose();
});
