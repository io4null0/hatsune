// Tone.jsのシンセサイザー設定
const synth = new Tone.Synth().toDestination();
Tone.Transport.bpm.value = 120;

// 音階とグリッドのセットアップ
const notes = ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"];
const grid = [];
const pianoRoll = document.getElementById("piano-roll");

// ピアノロールグリッドの作成
notes.forEach((note, rowIndex) => {
    grid[rowIndex] = [];
    for (let colIndex = 0; colIndex < 16; colIndex++) {
        const cell = document.createElement("div");
        cell.classList.add("note");
        cell.dataset.note = note;
        cell.dataset.time = `${colIndex * 0.25}`;
        cell.onclick = () => toggleNoteActive(cell, rowIndex, colIndex);
        pianoRoll.appendChild(cell);
        grid[rowIndex][colIndex] = false;
    }
});

// 音符のオンオフ切り替え
function toggleNoteActive(cell, rowIndex, colIndex) {
    const isActive = grid[rowIndex][colIndex];
    grid[rowIndex][colIndex] = !isActive;
    cell.classList.toggle("active", !isActive);
}

// シーケンサー設定
let part;
function createSequence() {
    const events = [];
    grid.forEach((row, rowIndex) => {
        row.forEach((isActive, colIndex) => {
            if (isActive) {
                const time = `${colIndex * 0.25}`;
                events.push({ time, note: notes[rowIndex], duration: "8n" });
            }
        });
    });
    if (part) part.dispose(); // 既存のシーケンスを削除
    part = new Tone.Part((time, note) => {
        synth.triggerAttackRelease(note.note, note.duration, time);
    }, events).start(0);
    part.loop = true;
    part.loopEnd = "4m"; // ループ長さ
}

function playSequence() {
    createSequence();
    Tone.Transport.start();
}

function stopSequence() {
    Tone.Transport.stop();
}

function updateTempo(newTempo) {
    Tone.Transport.bpm.value = newTempo;
}
