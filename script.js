/* === quick things you edit ===

1. ICONS: list your star/planet icon filenames (in /assets/icons)
2. WORKS: your portfolio items (title/desc/link/thumb)
3. PLAYLIST: your audio files (in /assets/music)
*/

const ICONS = [
"star1.png","star2.png","star3.png",
"planet1.png","planet2.png","planet3.png",
"star4.png","star5.png","planet4.png","planet5.png"
// add as many as you like; they’ll be randomly assigned
];

const WORKS = [
{
title: "Sample Project A",
desc: "Short description about your project. Replace with your real case.",
link: "[https://example.com](https://example.com/)",
thumb: "./assets/thumbs/sample1.jpg"
},
{
title: "Sample Project B",
desc: "Another example. Add as many as you need.",
link: "[https://example.com](https://example.com/)",
thumb: "./assets/thumbs/sample1.jpg"
},
// TIP: keep adding. If stars > works, we’ll cycle through.
];

const PLAYLIST = [
{ title: "Track 01", src: "./assets/music/track1.mp3" },
{ title: "Track 02", src: "./assets/music/track2.mp3" },
{ title: "Track 03", src: "./assets/music/track3.mp3" }
];

// === constants ===
const STAR_COUNT = 60; // >= 50 as requested
const layerEl = document.getElementById("stars-layer");
const modal = document.getElementById("workModal");
const closeModalBtn = document.getElementById("closeModal");

const workTitle = document.getElementById("workTitle");
const workDesc  = document.getElementById("workDesc");
const workLink  = document.getElementById("workLink");
const workThumb = document.getElementById("workThumb");

const musicBtn   = document.getElementById("musicBtn");
const musicPanel = document.getElementById("musicPanel");
const musicClose = document.getElementById("musicClose");
const player     = document.getElementById("player");
const playlistEl = document.getElementById("playlist");

// === build starfield ===
function rand(min, max){ return Math.random() * (max - min) + min; }

// spawn N clickable nodes at random positions with parallax depth
function buildField(){
for (let i = 0; i < STAR_COUNT; i++){
const node = document.createElement("button");
node.className = "node";
node.type = "button";
node.setAttribute("aria-label", "Open work item");
// depth: 0(front) 1(mid) 2(back)
const depth = Math.floor(rand(0,3));
node.dataset.depth = String(depth);

```
// random position within viewport (percent)
const x = rand(5, 95);
const y = rand(8, 92);
node.style.left = x + "vw";
node.style.top  = y + "vh";

// random icon from your assets
const icon = ICONS[Math.floor(Math.random() * ICONS.length)];
node.style.backgroundImage = `url('./assets/icons/${icon}')`;

// map to a work item (cycle if fewer works than stars)
const workIndex = i % Math.max(WORKS.length, 1);
node.dataset.workIndex = workIndex;

node.addEventListener("click", () => openWork(workIndex));
node.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " "){ e.preventDefault(); openWork(workIndex); }
});

layerEl.appendChild(node);

```

}
}

// === work modal ===
function openWork(idx){
const item = WORKS[idx] || {
title: "Work in Progress",
desc: "Add more items to WORKS[] in script.js to populate every star.",
link: "#",
thumb: ""
};
workTitle.textContent = item.title;
workDesc.textContent  = item.desc;
workLink.href = item.link || "#";
workLink.style.display = item.link ? "inline-block" : "none";

if (item.thumb){
workThumb.src = item.thumb;
workThumb.alt = item.title;
workThumb.style.display = "block";
} else {
workThumb.removeAttribute("src");
workThumb.alt = "";
workThumb.style.display = "none";
}

if (typeof modal.showModal === "function"){ modal.showModal(); }
else { modal.setAttribute("open",""); } // fallback
}

closeModalBtn.addEventListener("click", () => modal.close());
modal.addEventListener("click", (e) => {
// click-outside close
const rect = modal.getBoundingClientRect();
if (e.clientY < rect.top || e.clientY > rect.bottom || e.clientX < rect.left || e.clientX > rect.right){
modal.close();
}
});

// === parallax on pointer ===
const universe = document.getElementById("universe");
universe.addEventListener("pointermove", (e) => {
const { innerWidth:w, innerHeight:h } = window;
const x = (e.clientX / w - 0.5);
const y = (e.clientY / h - 0.5);

// move each node slightly based on depth
for (const node of layerEl.children){
const d = Number(node.dataset.depth || 1) + 1; // 1..3
node.style.transform = `translate(calc(-50% + ${x * d * 6}px), calc(-50% + ${y * d * 6}px))`;
}
});

// === music panel + playlist ===
function buildPlaylist(){
playlistEl.innerHTML = "";
PLAYLIST.forEach((track, idx) => {
const li = document.createElement("li");
li.textContent = track.title || `Track ${idx+1}`;
li.addEventListener("click", () => playTrack(idx));
playlistEl.appendChild(li);
});
}

function playTrack(i){
// update active state
[...playlistEl.children].forEach((li, idx) => {
li.classList.toggle("active", i === idx);
});
const track = PLAYLIST[i];
if (!track) return;
player.src = track.src;
player.play().catch(()=>{ /* autoplay might be blocked until user interacts */ });
}

function toggleMusicPanel(show){
const expanded = show ?? musicPanel.getAttribute("aria-hidden") === "true";
musicPanel.setAttribute("aria-hidden", expanded ? "false" : "true");
musicBtn.setAttribute("aria-expanded", expanded ? "true" : "false");
}

musicBtn.addEventListener("click", () => toggleMusicPanel());
musicClose.addEventListener("click", () => toggleMusicPanel(false));

window.addEventListener("keydown", (e) => {
if (e.key.toLowerCase() === "m") toggleMusicPanel(); // quick keyboard shortcut
});

// === init ===
buildField();
buildPlaylist();
// optionally autoplay first track after user interacts somewhere:
document.addEventListener("click", function once(){
if (PLAYLIST.length){ playTrack(0); }
document.removeEventListener("click", once);
});
