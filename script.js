let array = [];
let delay = 100;

const container = document.getElementById("arrayContainer");
const arraySizeSlider = document.getElementById("arraySize");
const speedSlider = document.getElementById("speed");

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function generateArray() {
  const size = +arraySizeSlider.value;
  array = Array.from({ length: size }, () => Math.floor(Math.random() * 500 + 10));
  drawArray();
}

function drawArray(highlight = []) {
  container.innerHTML = "";
  const barWidth = container.clientWidth / array.length;
  array.forEach((value, i) => {
    const bar = document.createElement("div");
    bar.style.height = `${value}px`;
    bar.style.width = `${barWidth - 2}px`;
    bar.classList.add("bar");
    if (highlight.includes(i)) {
      bar.classList.add("comparing");
    }
    container.appendChild(bar);
  });
}

async function startSort() {
  delay = 1000 - +speedSlider.value;
  const algorithm = document.getElementById("algorithm").value;
  let generator;

  switch (algorithm) {
    case "bubble":
      generator = bubbleSort();
      break;
    case "selection":
      generator = selectionSort();
      break;
    case "merge":
      generator = mergeSort(); // ✅ called only once now
      break;
    case "quick":
      generator = quickSort(0, array.length - 1);
      break;
  }

  for (let step of generator) {
    drawArray(step);
    await sleep(delay);
  }

  markSorted();
}

function markSorted() {
  const bars = document.querySelectorAll(".bar");
  bars.forEach(bar => {
    bar.classList.remove("comparing");
    bar.classList.add("sorted");
  });
}

function updateArraySizeLabel() {
  document.getElementById("arraySizeValue").textContent = arraySizeSlider.value;
  generateArray();
}

// ---------- Sorting Algorithms ---------- //

function* bubbleSort() {
  const n = array.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      yield [j, j + 1];
      if (array[j] > array[j + 1]) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        yield [j, j + 1];
      }
    }
  }
}

function* selectionSort() {
  const n = array.length;
  for (let i = 0; i < n; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      yield [minIdx, j];
      if (array[j] < array[minIdx]) {
        minIdx = j;
      }
    }
    if (minIdx !== i) {
      [array[i], array[minIdx]] = [array[minIdx], array[i]];
      yield [i, minIdx];
    }
  }
}

function* mergeSort() {
  const n = array.length;
  let currSize, leftStart;

  for (currSize = 1; currSize < n; currSize *= 2) {
    for (leftStart = 0; leftStart < n; leftStart += 2 * currSize) {
      const mid = Math.min(leftStart + currSize - 1, n - 1);
      const rightEnd = Math.min(leftStart + 2 * currSize - 1, n - 1);

      if (mid < rightEnd) {
        yield* mergeIterative(leftStart, mid, rightEnd);
      }
    }
  }
}

function* mergeIterative(left, mid, right) {
  const leftPart = array.slice(left, mid + 1);
  const rightPart = array.slice(mid + 1, right + 1);
  let i = 0, j = 0, k = left;

  while (i < leftPart.length && j < rightPart.length) {
    yield [k];
    if (leftPart[i] <= rightPart[j]) {
      array[k++] = leftPart[i++];
    } else {
      array[k++] = rightPart[j++];
    }
  }

  while (i < leftPart.length) {
    yield [k];
    array[k++] = leftPart[i++];
  }

  while (j < rightPart.length) {
    yield [k];
    array[k++] = rightPart[j++];
  }
}

function* quickSort(start, end) {
  const stack = [];
  stack.push({ start, end });

  while (stack.length > 0) {
    const { start, end } = stack.pop();

    if (start < end) {
      const pivotIndex = yield* partition(start, end);
      stack.push({ start: start, end: pivotIndex - 1 });
      stack.push({ start: pivotIndex + 1, end: end });
    }
  }
}

function* partition(start, end) {
  let pivot = array[end];
  let i = start;

  for (let j = start; j < end; j++) {
    yield [j, end];
    if (array[j] < pivot) {
      [array[i], array[j]] = [array[j], array[i]];
      yield [i, j];
      i++;
    }
  }

  [array[i], array[end]] = [array[end], array[i]];
  yield [i, end];
  return i;
}

// ---------- Init ---------- //

generateArray();
