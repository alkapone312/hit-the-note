<template>
  <div class="score-container" @wheel="zoom" @mousedown="startDrag" @mousemove="onDrag" @mouseup="stopDrag" ref="scale-container">
    <svg class="grid-lines">
      <line v-for="note in noteRange" :key="note" :y1="notePosition(note)" :y2="notePosition(note)" x1="0" x2="100%" stroke="lightgray" stroke-width="1" />
      <text v-for="noteFreq, noteKey in noteRange" :key="`label-${noteFreq}`" :y="notePosition(noteFreq + noteFreq * 0.01)" x="5" fill="gray" font-size="16">
        <tspan class="svg-note-name">{{noteNameAtIndex(noteKey)}}</tspan>: {{ Math.round(noteFreq) }} Hz
      </text>
    </svg>

    <div class="notes">
      <div v-for="(note, index) in notes" :key="index" :style="{ top: notePosition(note.pitch) + 'px', left: timePosition(note.time) + 'px' }" class="note">
        {{ note.name }}
      </div>
    </div>

    <svg class="frequency-path">
      <polyline v-for="(segment, index) in segmentedFrequencyPoints" :key="index" :points="segment" fill="none" stroke="yellow" stroke-width="2" />
      <line 
        :x1="currentTimePosition" 
        :x2="currentTimePosition" 
        y1="0" 
        :y2="getContainerHeight()" 
        stroke="rgb(255, 216, 100)"
        stroke-width="2" 
      />
    </svg>

    <div class="current-frequency" :style="{ top: notePosition(currentFrequency) + 'px', left: currentTimePosition + 'px' }"></div>
  </div>
</template>


<script setup lang="ts">
import { computed, ref, watch, defineProps, useTemplateRef, onMounted } from 'vue';

const noteRange = [
  16.35, 17.32, 18.35, 19.45, 20.60, 21.83, 23.12, 24.50, 25.96, 27.50, 29.14, 30.87,
  32.70, 34.65, 36.71, 38.89, 41.20, 43.65, 46.25, 49.00, 51.91, 55.00, 58.27, 61.74,
  65.41, 69.30, 73.42, 77.78, 82.41, 87.31, 92.50, 98.00, 103.83, 110.00, 116.54, 123.47,
  130.81, 138.59, 146.83, 155.56, 164.81, 174.61, 185.00, 196.00, 207.65, 220.00, 233.08, 246.94,
  261.63, 277.18, 293.66, 311.13, 329.63, 349.23, 369.99, 392.00, 415.30, 440.00, 466.16, 493.88,
  523.25, 554.37, 587.33, 622.25, 659.25, 698.46, 739.99, 783.99, 830.61, 880.00, 932.33, 987.77,
  1046.50, 1108.73, 1174.66, 1244.51, 1318.51, 1396.91, 1479.98, 1567.98
];

const { 
  snapToCurrentTime = true, 
  snapToFrequency = true, 
  currentFrequency, 
  currentTime, 
  notes 
} = defineProps<{
  snapToCurrentTime?: boolean,
  snapToFrequency?: boolean,
  currentFrequency: number,
  currentTime: number,
  notes: { time: number, pitch: number, name: string }[],
}>();

const frequencyPath: { time: number, pitch: number }[] = [];
const frequencyWindow = ref<{ time: number, pitch: number }[]>([]);
let windowLeftIndex = 0;
let windowRightIndex = 0;
const offsetX = ref(0);
const offsetY = ref(0);
let isDragging = false;
let lastMouseX = 0;
let lastMouseY = 0;
let noteScale = 400;
let timeScale = 200;
let container = useTemplateRef('scale-container');
let lazyFollowThreshold = 100;
let followSpeed = 0.02;

frequencyWindow.value.push({ pitch: currentFrequency, time: currentTime });
watch(() => currentTime, () => {
  let i = frequencyPath.length - 1;
  while (i >= 0 && frequencyPath[i].time > currentTime) {
    frequencyPath.pop();
    i--;
  }
  frequencyWindow.value.push({ pitch: currentFrequency, time: currentTime });
  frequencyPath.push({ pitch: currentFrequency, time: currentTime });
  lazyFollowFrequency(currentFrequency);
});


const segmentedFrequencyPoints = computed(() => {
  let segments: string[] = [];
  let currentSegment: string[] = [];
  
  updateWindowIndices();
  frequencyWindow.value = frequencyPath.slice(windowLeftIndex, windowRightIndex);
  frequencyWindow.value.forEach((point, index) => {
    if (point.pitch === 0 || (index > 0 && frequencyWindow.value[index - 1].pitch === 0)) {
      if (currentSegment.length > 0) {
        segments.push(currentSegment.join(' '));
        currentSegment = [];
      }
    }

    if (point.pitch !== 0) {
      currentSegment.push(`${timePosition(point.time)},${notePosition(point.pitch)}`);
    }
  });


  if (currentSegment.length > 0) {
    segments.push(currentSegment.join(' '));
  }

  return segments;
});

const currentTimePosition = computed(() => timePosition(currentTime));

function timePosition(time) {
  if (snapToCurrentTime) {
    centerTimeAtValue(time);
  }
  return time * timeScale + offsetX.value;
}

function notePosition(pitch) {
  if (pitch == 0) return getContainerHeight();
  const offset = getContainerHeight();
  const position = -(Math.log2(pitch) * noteScale - offsetY.value) + offset;
  return position;
}

function updateWindowIndices() {
  if(windowRightIndex > frequencyPath.length) {
    windowLeftIndex = frequencyPath.length;
    windowRightIndex = frequencyPath.length;
  }
  while (windowLeftIndex < frequencyPath.length && timePosition(frequencyPath[windowLeftIndex].time) < 0) {
    windowLeftIndex++;
  }
  while (windowLeftIndex > 0 && timePosition(frequencyPath[windowLeftIndex - 1].time) >= 0) {
    windowLeftIndex--;
  }

  const containerWidth = getContainerWidth();
  while (windowRightIndex < frequencyPath.length && timePosition(frequencyPath[windowRightIndex].time) <= containerWidth) {
    windowRightIndex++;
  }
  while (windowRightIndex > 0 && timePosition(frequencyPath[windowRightIndex - 1].time) > containerWidth) {
    windowRightIndex--;
  }
}


function startDrag(event) {
  isDragging = true;
  lastMouseX = event.clientX;
  lastMouseY = event.clientY;
}

function onDrag(event) {
  if (isDragging) {
    if (offsetX.value + event.clientX - lastMouseX < getContainerWidth() / 3) {
      offsetX.value += event.clientX - lastMouseX;
      lastMouseX = event.clientX;
    }
    if (offsetY.value + event.clientY - lastMouseY > 0) {
      offsetY.value += event.clientY - lastMouseY;
      lastMouseY = event.clientY;
    }
  }
}

function stopDrag() {
  isDragging = false;
}

function zoom(event) {
    noteScale -= event.deltaY * 0.05;
}

function getContainerHeight(): number {
  return container.value?.clientHeight ?? 0;
}

function getContainerWidth(): number {
  return container.value?.clientWidth ?? 0;
}

function centerNoteAtValue(hertz: number) {
  const targetFrequency = hertz;
  const containerHeight = getContainerHeight();
  const middleContainerPosition = containerHeight / 2;

  const positionOfValue = notePosition(targetFrequency);

  offsetY.value = middleContainerPosition - positionOfValue;
}

function centerTimeAtValue(time: number) {
  offsetX.value = getContainerWidth() / 3 - currentTime * timeScale;
}

function lazyFollowFrequency(frequency: number) {
  if(frequency == 0) return;
  const containerHeight = getContainerHeight();
  const middlePositionY = containerHeight / 2;

  if (snapToFrequency) {
    const positionY = -(Math.log2(frequency) * noteScale - offsetY.value) + containerHeight;

    if (Math.abs(positionY - middlePositionY) > lazyFollowThreshold) {
      const directionY = positionY > middlePositionY ? 1 : -1;
      offsetY.value -= directionY * followSpeed * Math.abs(positionY - middlePositionY);
    }
  }
}

function noteNameAtIndex(index: number) {
  const noteIndex = index % 12;
  const scale = ~~(index / 12);

  return [`C${scale}`, `C${scale}#`, `D${scale}`, `D${scale}#`, `E${scale}`, `F${scale}`, `F${scale}#`, `G${scale}`, `G${scale}#`, `A${scale}`, `A${scale}#`, `B${scale}`][noteIndex]
}

onMounted(() => {
  centerNoteAtValue(200);
  lazyFollowThreshold = getContainerHeight() / 4;
  offsetX.value = getContainerWidth() / 3
});
</script>

<style scoped>
.score-container {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  background-color: white;
  cursor: grab;
}

.score-container:active {
  cursor: grabbing;
}

.notes {
  position: absolute;
}

.note {
  position: absolute;
  background-color: lightblue;
  padding: 5px;
  border-radius: 5px;
}

.current-time {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  background-color: red;
}

.current-frequency {
  position: absolute;
  width: 16px;
  height: 16px;
  transform: translate(-50%, -50%);
  background-color: rgb(255, 216, 100);
  border: 2px solid white;
  outline: 2px solid rgb(255, 216, 100);
  border-radius: 50%;
  transition: top 0.05s ease;
}

.frequency-path {
  position: absolute;
  width: 100%;
  height: 100%;
}

.grid-lines {
  position: absolute;
  width: 100%;
  height: 100%;
}

.svg-note-name {
  fill: black;
}
</style>
