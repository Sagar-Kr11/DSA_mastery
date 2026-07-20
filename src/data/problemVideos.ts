import type { ProblemVideo } from "./topics";

/**
 * Per-problem YouTube walkthroughs, keyed by LeetCode slug.
 *
 * Language mapping:
 *   Python → NeetCode (main channel)
 *   Java   → Striver / takeUforward (primary). His videos ship Java+C++ side-by-side
 *            and his Java comment threads are the highest-signal in DSA. Where I
 *            don't have a verified single-video pick, the entry points at his
 *            A-Z DSA sheet playlist (PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz) so the
 *            embed still opens on-topic material inside the app.
 *   C++    → left to the pattern-level VideoPicker (Striver / CodeHelp / Aditya Verma).
 *
 * Problems not in this map render with only the LeetCode link (no Video chip).
 */

const STRIVER_AZ = "PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz"; // takeUforward — Strivers A2Z DSA Course/Sheet

const striverPlaylist = (title: string): ProblemVideo => ({
  lang: "Java",
  yt: { kind: "playlist", id: STRIVER_AZ, channel: "Striver", title: `${title} — Striver A-Z DSA (Java)` },
});

const striverVideo = (id: string, title: string): ProblemVideo => ({
  lang: "Java",
  yt: { kind: "video", id, channel: "Striver", title: `${title} — Striver (Java + C++)` },
});

const neet = (id: string, title: string): ProblemVideo => ({
  lang: "Python",
  yt: { kind: "video", id, channel: "NeetCode", title: `${title} — NeetCode` },
});

export const PROBLEM_VIDEOS: Record<string, ProblemVideo[]> = {
  // ==================== ARRAYS: two-pointers ====================
  "two-sum": [neet("KLlXCFG5TnA", "Two Sum"), striverVideo("UXDSeD9mN-k", "Two Sum")],
  "3sum": [neet("jzZsG8n2R9A", "3Sum"), striverVideo("DhFh8Kw7ymk", "3Sum")],
  "container-with-most-water": [neet("UuiTKBwPgAo", "Container With Most Water"), striverPlaylist("Container With Most Water")],
  "trapping-rain-water": [neet("ZI2z5pq0TqA", "Trapping Rain Water"), striverVideo("m18Hntz4go8", "Trapping Rainwater")],
  "remove-duplicates-from-sorted-array": [neet("DEJAZBq0FDA", "Remove Duplicates"), striverVideo("Yod7dh5e-4A", "Remove Duplicates from Sorted Array")],
  "move-zeroes": [neet("aayNRwUN3Do", "Move Zeroes"), striverVideo("hLoFuT9UMDs", "Move Zeroes to End")],

  // ==================== ARRAYS: kadane ====================
  "maximum-subarray": [neet("5WZl3MMT0Eg", "Maximum Subarray (Kadane)"), striverVideo("AHZpyENo7k4", "Kadane's Algorithm — Maximum Subarray Sum")],
  "maximum-product-subarray": [neet("lXVy6YWFcRM", "Maximum Product Subarray"), striverVideo("hnswaLJvr6g", "Maximum Product Subarray")],
  "best-time-to-buy-and-sell-stock": [neet("1pkOgXD63yU", "Best Time to Buy & Sell Stock"), striverVideo("excAOvwF_Wk", "Best Time to Buy and Sell Stock")],

  // ==================== ARRAYS: prefix-sum ====================
  "subarray-sum-equals-k": [neet("fFVZt-6sgyo", "Subarray Sum Equals K"), striverVideo("xvNwoz-ufXA", "Subarray Sum Equals K")],
  "contiguous-array": [neet("uCXP6HAcXOI", "Contiguous Array"), striverPlaylist("Contiguous Array")],

  // ==================== ARRAYS: sliding-window ====================
  "longest-substring-without-repeating-characters": [neet("wiGpQwVHdE0", "Longest Substring w/o Repeating"), striverVideo("-zSxTJkcdAo", "Longest Substring Without Repeating Characters")],
  "minimum-window-substring": [neet("jSto0O4AJbM", "Minimum Window Substring"), striverVideo("WJaij9ffOIY", "Minimum Window Substring")],
  "longest-repeating-character-replacement": [neet("gqXU1UyA8pk", "Longest Repeating Character Replacement"), striverVideo("_eNhaDCr6P0", "Longest Repeating Character Replacement")],
  "permutation-in-string": [neet("UbyhOgBN834", "Permutation in String"), striverPlaylist("Permutation in String")],
  "sliding-window-maximum": [neet("DfljaUwZsOk", "Sliding Window Maximum"), striverVideo("CZQGRp93K4k", "Sliding Window Maximum")],
  "minimum-size-subarray-sum": [neet("aYqYMIqZx5o", "Minimum Size Subarray Sum"), striverPlaylist("Minimum Size Subarray Sum")],

  // ==================== HASHMAP ====================
  "valid-anagram": [neet("9UtInBqnCgA", "Valid Anagram"), striverVideo("cM0aiTz4hpk", "Valid Anagram")],
  "group-anagrams": [neet("vzdNOK2oB2E", "Group Anagrams"), striverPlaylist("Group Anagrams")],
  "top-k-frequent-elements": [neet("YPTqKIgVk-k", "Top K Frequent Elements"), striverVideo("EQKOX7BbvxU", "Top K Frequent Elements")],
  "majority-element": [neet("7pnhv842keE", "Majority Element"), striverVideo("nP_ns3uSh80", "Majority Element (Moore's Voting)")],

  // ==================== STACK / MONOTONIC ====================
  "next-greater-element-i": [neet("68a1Dc_qVq4", "Next Greater Element I"), striverVideo("Du881K7Jtk8", "Next Greater Element")],
  "daily-temperatures": [neet("cTBiBSnjO3c", "Daily Temperatures"), striverPlaylist("Daily Temperatures")],
  "largest-rectangle-in-histogram": [neet("zx5Sw9130L0", "Largest Rectangle in Histogram"), striverVideo("X0X6G-eWgQ8", "Largest Rectangle in Histogram")],
  "valid-parentheses": [neet("WTzjTskDFMg", "Valid Parentheses"), striverVideo("wkDfsKijrZ8", "Valid Parentheses")],

  // ==================== LINKED LIST ====================
  "linked-list-cycle": [neet("gBTe7lFR3vc", "Linked List Cycle"), striverVideo("354J83hX7RI", "Detect a Cycle in Linked List")],
  "middle-of-the-linked-list": [neet("A2_ldqM4QcY", "Middle of Linked List"), striverVideo("7LjQ57RqgEc", "Middle of the Linked List")],
  "palindrome-linked-list": [neet("yOzXms1J6Nk", "Palindrome Linked List"), striverVideo("YZ4ux2b_9c8", "Palindrome Linked List")],
  "reverse-linked-list": [neet("G0_I-ZF0S38", "Reverse Linked List"), striverVideo("D2vI2DNJGd8", "Reverse a Linked List")],
  "reverse-nodes-in-k-group": [neet("1UOPsfP85V4", "Reverse Nodes in k-Group"), striverVideo("lIar1skcQYI", "Reverse Nodes in K-Group")],

  // ==================== TREES ====================
  "maximum-depth-of-binary-tree": [neet("hTM3phVI6YQ", "Maximum Depth of Binary Tree"), striverVideo("eD3tmO66aBA", "Maximum Depth of Binary Tree")],
  "diameter-of-binary-tree": [neet("bkxqA8Rfv04", "Diameter of Binary Tree"), striverVideo("Rezetez59Nk", "Diameter of Binary Tree")],
  "binary-tree-maximum-path-sum": [neet("Hr5cWUld4vU", "Binary Tree Maximum Path Sum"), striverVideo("WszrfSwMz58", "Maximum Path Sum in Binary Tree")],
  "lowest-common-ancestor-of-a-binary-tree": [neet("13m9ZCB8gjw", "LCA of Binary Tree"), striverVideo("_-QHfMDde90", "LCA of Binary Tree")],
  "binary-tree-level-order-traversal": [neet("6ZnyEApgFYg", "Level Order Traversal"), striverVideo("EoAsWbO7sqg", "Level Order Traversal of Binary Tree")],
  "binary-tree-right-side-view": [neet("d4zLyf32e3I", "Binary Tree Right Side View"), striverPlaylist("Binary Tree Right Side View")],

  // ==================== GRAPHS ====================
  "number-of-islands": [neet("pV2kpPD66nE", "Number of Islands"), striverVideo("muncqlKJrH0", "Number of Islands (BFS)")],
  "clone-graph": [neet("mQeF6bN8hMk", "Clone Graph"), striverPlaylist("Clone Graph")],
  "rotting-oranges": [neet("y704fEOx0s0", "Rotting Oranges"), striverVideo("yf3oUhkvqA0", "Rotten Oranges — BFS")],
  "word-ladder": [neet("h9iTnkgv05E", "Word Ladder"), striverVideo("tRPda0rcf8E", "Word Ladder I")],
  "course-schedule": [neet("EgI5nU9etnU", "Course Schedule"), striverVideo("78t_yHuGg-0", "Course Schedule — Topological Sort")],
  "course-schedule-ii": [neet("Akt3glAwyfY", "Course Schedule II"), striverVideo("WAOfKpxYHR8", "Course Schedule II — Topological Sort")],
  "alien-dictionary": [neet("6kTZYvNNyps", "Alien Dictionary"), striverVideo("U3N_je7tWAs", "Alien Dictionary")],
  "network-delay-time": [neet("EaphyqKU4PQ", "Network Delay Time"), striverPlaylist("Network Delay Time — Dijkstra")],
  "cheapest-flights-within-k-stops": [neet("5eIK3zUdYmE", "Cheapest Flights Within K Stops"), striverVideo("9XybHVqTHcQ", "Cheapest Flights Within K Stops")],

  // ==================== DP ====================
  "partition-equal-subset-sum": [neet("IsvocB5BJhw", "Partition Equal Subset Sum"), striverVideo("fWX9xDmIzRI", "Partition Equal Subset Sum")],
  "target-sum": [neet("g0npyaQtAQM", "Target Sum"), striverVideo("fFAWq3TAWk8", "Target Sum")],
  "coin-change": [neet("H9bfqozjoqs", "Coin Change"), striverVideo("I-l6PBeERuc", "Coin Change — Minimum Coins")],
  "longest-increasing-subsequence": [neet("cjWnW0hdF1Y", "Longest Increasing Subsequence"), striverVideo("mouCn3CFpgg", "Longest Increasing Subsequence")],
  "longest-common-subsequence": [neet("Ua0GhsJSlWM", "Longest Common Subsequence"), striverVideo("NPZn9jBrX8U", "Longest Common Subsequence")],
  "burst-balloons": [neet("VFskby7lUbw", "Burst Balloons"), striverVideo("Yz4LlDSlkns", "Burst Balloons — MCM DP")],
  "climbing-stairs": [neet("Y0lT9Fck7qI", "Climbing Stairs"), striverVideo("mLfjzJsN8us", "Climbing Stairs")],
  "fibonacci-number": [neet("oBt53YbR9Kk", "Fibonacci Number"), striverVideo("tyB0ztf_bXs", "Fibonacci — Intro to DP")],

  // ==================== BACKTRACKING ====================
  "n-queens": [neet("Ph95IHmRp5M", "N-Queens"), striverVideo("i05Ju7AftcM", "N Queens Problem")],
  "permutations": [neet("s7AvT7cGdSo", "Permutations"), striverVideo("YK78FU5Ffjw", "Permutations of a String/Array")],
  "subsets": [neet("REOH22Xwdkk", "Subsets"), striverVideo("Yg5a2FxU4Fo", "Print All Subsets / Power Set")],
  "word-search": [neet("pfiQ_PS1g8E", "Word Search"), striverPlaylist("Word Search")],
  "sudoku-solver": [neet("TjFXEUCMqI8", "Sudoku Solver"), striverVideo("FWAIf_EVUKE", "Sudoku Solver")],
  "generate-parentheses": [neet("s9fokUqJ76A", "Generate Parentheses"), striverPlaylist("Generate Parentheses")],
  "letter-combinations-of-a-phone-number": [neet("0snEunUacZY", "Letter Combinations of a Phone Number"), striverPlaylist("Letter Combinations of a Phone Number")],

  // ==================== BINARY SEARCH ====================
  "binary-search": [neet("s4DPM8ct1pI", "Binary Search"), striverVideo("MHf6awe89xw", "Binary Search — Introduction")],
  "search-in-rotated-sorted-array": [neet("U8XENwh8Oy8", "Search in Rotated Sorted Array"), striverVideo("5qGrJbHhqFs", "Search in Rotated Sorted Array")],
  "find-first-and-last-position-of-element-in-sorted-array": [neet("4sQL7R5ySUU", "Find First and Last Position"), striverVideo("hjR1IYVx9lY", "First and Last Occurrence — Binary Search")],
  "median-of-two-sorted-arrays": [neet("q6IEA26hvXc", "Median of Two Sorted Arrays"), striverVideo("F9c7LpRZWVQ", "Median of Two Sorted Arrays")],
  "search-insert-position": [neet("K-RYzDZkzCI", "Search Insert Position"), striverPlaylist("Search Insert Position")],
  "first-bad-version": [neet("SNDE-C86n4M", "First Bad Version"), striverPlaylist("First Bad Version")],
  "find-minimum-in-rotated-sorted-array": [neet("nIVW4P8b1VA", "Find Minimum in Rotated Sorted Array"), striverVideo("nhEMDKMB44g", "Minimum in Rotated Sorted Array")],
  "koko-eating-bananas": [neet("U2SozAs9RzA", "Koko Eating Bananas"), striverVideo("Y-fXk7dqAsw", "Koko Eating Bananas — BS on Answer")],

  // ==================== BITS ====================
  "single-number": [neet("qMPX1AOa83k", "Single Number"), striverVideo("nB_wsGyc5eA", "Single Number — XOR")],
  "number-of-1-bits": [neet("5Km3utixwZs", "Number of 1 Bits"), striverPlaylist("Number of 1 Bits")],
  "counting-bits": [neet("RyBM56RIWrM", "Counting Bits"), striverPlaylist("Counting Bits")],
  "missing-number": [neet("WnPLSRLSANE", "Missing Number"), striverPlaylist("Missing Number")],
  "sum-of-two-integers": [neet("gVUrDV4tZfY", "Sum of Two Integers"), striverPlaylist("Sum of Two Integers")],
  "happy-number": [neet("ljz85bxOYJ0", "Happy Number"), striverPlaylist("Happy Number")],
  "powx-n": [neet("g9YQyYi4IQQ", "Pow(x, n)"), striverVideo("hFWckDXE-K8", "Pow(x, n)")],

  // ==================== STRINGS ====================
  "valid-palindrome": [neet("jJXJ16kPFWg", "Valid Palindrome"), striverPlaylist("Valid Palindrome")],
  "reverse-string": [neet("_d0T_2Lk2qA", "Reverse String"), striverPlaylist("Reverse String")],

  // ==================== MATRIX ====================
  "rotate-image": [neet("fMSJSS7eO1w", "Rotate Image"), striverVideo("Y72QeX0efxQ", "Rotate Matrix by 90°")],
  "spiral-matrix": [neet("BJnMZNwUk1M", "Spiral Matrix"), striverVideo("3Zv-s9UUrFM", "Spiral Traversal of Matrix")],
  "set-matrix-zeroes": [neet("T41rL0L3Pnw", "Set Matrix Zeroes"), striverVideo("N0MgLvceX7M", "Set Matrix Zeroes")],
  "search-a-2d-matrix": [neet("Ber2pi2C0j0", "Search a 2D Matrix"), striverVideo("JXU4Akft7yk", "Search in 2D Matrix")],
};
