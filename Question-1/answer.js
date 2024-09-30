function optimiseBookings(intervals) {
    var points = [];
    for (var _i = 0, intervals_1 = intervals; _i < intervals_1.length; _i++) {
        var interval = intervals_1[_i];
        points.push([interval[0], "x"]);
        points.push([interval[1], "y"]);
    }
    points.sort(function (a, b) {
        if (a[0] === b[0]) {
            return a[1] === "x" ? -1 : 1;
        }
        return a[0] - b[0];
    });
    var res = [];
    var num = 0;
    var currentInterval = [];
    for (var _a = 0, points_1 = points; _a < points_1.length; _a++) {
        var point = points_1[_a];
        if (num === 0) {
            currentInterval.push(point[0]);
        }
        if (point[1] === "x") {
            num++;
        }
        else {
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
var testCase1 = [], ops = 1000;
while (ops--) {
    var start = Math.floor(Math.random() * 20);
    var end = start + Math.floor(Math.random() * 10);
    testCase1.push([start, end]);
}
console.log(testCase1);
// Non-overlapping bookings test case
var testCase2 = [
    [1, 3],
    [15, 18],
    [20, 23],
    [6, 8],
    [11, 13],
];
// Consecutive bookings that just touch each other end-to-start test case
var testCase3 = [
    [1, 3],
    [10, 12],
    [3, 5],
    [7, 10],
    [5, 7],
];
// Bookings that are already merged
var testCase4 = [
    [1, 5],
    [6, 10],
    [11, 15],
    [16, 20],
    [21, 25],
];
// Empty bookings
var testCase5 = [];
// Grouping all test cases together for easy execution
var testCases = [
    { description: "Random 1000 Intervals", intervals: testCase1 },
    { description: "Non-overlapping Intervals", intervals: testCase2 },
    { description: "Consecutive Touching Intervals", intervals: testCase3 },
    { description: "Already Merged Intervals", intervals: testCase4 },
    { description: "Empty Intervals", intervals: testCase5 },
];
// Running all test cases
testCases.forEach(function (test, index) {
    console.log("Test Case ".concat(index + 1, ": ").concat(test.description));
    console.log("INPUT:\n", test.intervals);
    var result = optimiseBookings(test.intervals);
    console.log("OUTPUT:");
    console.log(result, "\n\n");
});
