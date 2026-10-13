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

  // 再生・停止に合わせて進行バーも同期
  video.addEventListener("pause", () => pauseProgress());
  video.addEventListener("play", () => resumeProgress());

  // 動画クリックで pause/play
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

document.addEventListener("turbo:load", () => {
  handleImageStory();
  handleVideoStory();
  setupTapNavigation();
});


