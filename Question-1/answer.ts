function optimiseBookings(intervals: number[][]): number[][] {
  const points: [number, string][] = [];

  for (const interval of intervals) {
    points.push([interval[0], "x"]);
    points.push([interval[1], "y"]);
  }

  points.sort((a, b) => {
    if (a[0] === b[0]) {
      return a[1] === "x" ? -1 : 1;
    }
    return a[0] - b[0];
  });

  const res: number[][] = [];
  let num = 0;
  let currentInterval: number[] = [];

  for (const point of points) {
    if (num === 0) {
      currentInterval.push(point[0]);
    }

    if (point[1] === "x") {
      num++;
    } else {
      num--;
    }

    if (num === 0) {
      currentInterval.push(point[0]);
      res.push(currentInterval);
      currentInterval = [];
    }
  }

  return res;
}

// Generating random test case
let testCase1 = [],
  ops = 1000;
while (ops--) {
  const start = Math.floor(Math.random() * 20);
  const end = start + Math.floor(Math.random() * 10);
  testCase1.push([start,end])
}

console.log(testCase1);

// Non-overlapping bookings test case
const testCase2 = [
  [1, 3],
  [15, 18],
  [20, 23],
  [6, 8],
  [11, 13],
];

// Consecutive bookings that just touch each other end-to-start test case
const testCase3 = [
  [1, 3],
  [10, 12],
  [3, 5],
  [7, 10],
  [5, 7],
];

// Bookings that are already merged
const testCase4 = [
  [1, 5],
  [6, 10],
  [11, 15],
  [16, 20],
  [21, 25],
];

// Empty bookings
const testCase5: number[][] = [];

// Grouping all test cases together for easy execution
const testCases = [
  { description: "Random 1000 Intervals", intervals: testCase1 },
  { description: "Non-overlapping Intervals", intervals: testCase2 },
  { description: "Consecutive Touching Intervals", intervals: testCase3 },
  { description: "Already Merged Intervals", intervals: testCase4 },
  { description: "Empty Intervals", intervals: testCase5 },
];

// Running all test cases
testCases.forEach((test, index) => {
  console.log(`Test Case ${index + 1}: ${test.description}`);
  console.log("INPUT:\n", test.intervals)
  const result = optimiseBookings(test.intervals);
  console.log("OUTPUT:")
  console.log(result, "\n\n");
});
