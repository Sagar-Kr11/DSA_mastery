import type { ProblemVideo } from "./topics";

/**
 * Per-problem YouTube walkthroughs, keyed by LeetCode slug.
 *
 * Curation rules:
 * - Only creators already trusted in this app (NeetCode, Striver, Aditya Verma,
 *   CodeHelp/Love Babbar, Apna College, Kunal Kushwaha).
 * - Each pick is a video that solves the *exact* LeetCode problem (not the
 *   general pattern), chosen by scanning top-liked comments for signals of
 *   clarity ("finally understood", "dry run helped") rather than raw views.
 * - Language tags mirror the creator's coding language:
 *     NeetCode (main channel)      → Python
 *     Striver (takeUforward)       → C++ / Java
 *     Aditya Verma                 → pseudocode (tagged all 3 with a note)
 *     CodeHelp / Love Babbar       → C++
 *     Apna College / Kunal         → Java
 *
 * If a problem has no verified pick in a language, that language is omitted.
 * Problems not in this map render with only the LeetCode link (no Video chip).
 */
export const PROBLEM_VIDEOS: Record<string, ProblemVideo[]> = {
  // ==================== ARRAYS: two-pointers ====================
  "two-sum": [
    { lang: "Python", yt: { kind: "video", id: "KLlXCFG5TnA", channel: "NeetCode", title: "Two Sum — NeetCode" } },
  ],
  "3sum": [
    { lang: "Python", yt: { kind: "video", id: "jzZsG8n2R9A", channel: "NeetCode", title: "3Sum — NeetCode" } },
  ],
  "container-with-most-water": [
    { lang: "Python", yt: { kind: "video", id: "UuiTKBwPgAo", channel: "NeetCode", title: "Container With Most Water — NeetCode" } },
  ],
  "trapping-rain-water": [
    { lang: "Python", yt: { kind: "video", id: "ZI2z5pq0TqA", channel: "NeetCode", title: "Trapping Rain Water — NeetCode" } },
  ],
  "remove-duplicates-from-sorted-array": [
    { lang: "Python", yt: { kind: "video", id: "DEJAZBq0FDA", channel: "NeetCode", title: "Remove Duplicates — NeetCode" } },
  ],
  "move-zeroes": [
    { lang: "Python", yt: { kind: "video", id: "aayNRwUN3Do", channel: "NeetCode", title: "Move Zeroes — NeetCode" } },
  ],

  // ==================== ARRAYS: kadane ====================
  "maximum-subarray": [
    { lang: "Python", yt: { kind: "video", id: "5WZl3MMT0Eg", channel: "NeetCode", title: "Maximum Subarray (Kadane) — NeetCode" } },
  ],
  "maximum-product-subarray": [
    { lang: "Python", yt: { kind: "video", id: "lXVy6YWFcRM", channel: "NeetCode", title: "Maximum Product Subarray — NeetCode" } },
  ],
  "best-time-to-buy-and-sell-stock": [
    { lang: "Python", yt: { kind: "video", id: "1pkOgXD63yU", channel: "NeetCode", title: "Best Time to Buy & Sell Stock — NeetCode" } },
  ],

  // ==================== ARRAYS: prefix-sum ====================
  "subarray-sum-equals-k": [
    { lang: "Python", yt: { kind: "video", id: "fFVZt-6sgyo", channel: "NeetCode", title: "Subarray Sum Equals K — NeetCode" } },
  ],
  "contiguous-array": [
    { lang: "Python", yt: { kind: "video", id: "uCXP6HAcXOI", channel: "NeetCode", title: "Contiguous Array — NeetCode" } },
  ],

  // ==================== ARRAYS: sliding-window ====================
  "longest-substring-without-repeating-characters": [
    { lang: "Python", yt: { kind: "video", id: "wiGpQwVHdE0", channel: "NeetCode", title: "Longest Substring w/o Repeating — NeetCode" } },
  ],
  "minimum-window-substring": [
    { lang: "Python", yt: { kind: "video", id: "jSto0O4AJbM", channel: "NeetCode", title: "Minimum Window Substring — NeetCode" } },
  ],
  "longest-repeating-character-replacement": [
    { lang: "Python", yt: { kind: "video", id: "gqXU1UyA8pk", channel: "NeetCode", title: "Longest Repeating Character Replacement — NeetCode" } },
  ],
  "permutation-in-string": [
    { lang: "Python", yt: { kind: "video", id: "UbyhOgBN834", channel: "NeetCode", title: "Permutation in String — NeetCode" } },
  ],
  "sliding-window-maximum": [
    { lang: "Python", yt: { kind: "video", id: "DfljaUwZsOk", channel: "NeetCode", title: "Sliding Window Maximum — NeetCode" } },
  ],
  "minimum-size-subarray-sum": [
    { lang: "Python", yt: { kind: "video", id: "aYqYMIqZx5o", channel: "NeetCode", title: "Minimum Size Subarray Sum — NeetCode" } },
  ],

  // ==================== HASHMAP ====================
  "valid-anagram": [
    { lang: "Python", yt: { kind: "video", id: "9UtInBqnCgA", channel: "NeetCode", title: "Valid Anagram — NeetCode" } },
  ],
  "group-anagrams": [
    { lang: "Python", yt: { kind: "video", id: "vzdNOK2oB2E", channel: "NeetCode", title: "Group Anagrams — NeetCode" } },
  ],
  "top-k-frequent-elements": [
    { lang: "Python", yt: { kind: "video", id: "YPTqKIgVk-k", channel: "NeetCode", title: "Top K Frequent Elements — NeetCode" } },
  ],
  "majority-element": [
    { lang: "Python", yt: { kind: "video", id: "7pnhv842keE", channel: "NeetCode", title: "Majority Element — NeetCode" } },
  ],

  // ==================== STACK / MONOTONIC ====================
  "next-greater-element-i": [
    { lang: "Python", yt: { kind: "video", id: "68a1Dc_qVq4", channel: "NeetCode", title: "Next Greater Element I — NeetCode" } },
  ],
  "daily-temperatures": [
    { lang: "Python", yt: { kind: "video", id: "cTBiBSnjO3c", channel: "NeetCode", title: "Daily Temperatures — NeetCode" } },
  ],
  "largest-rectangle-in-histogram": [
    { lang: "Python", yt: { kind: "video", id: "zx5Sw9130L0", channel: "NeetCode", title: "Largest Rectangle in Histogram — NeetCode" } },
  ],
  "valid-parentheses": [
    { lang: "Python", yt: { kind: "video", id: "WTzjTskDFMg", channel: "NeetCode", title: "Valid Parentheses — NeetCode" } },
  ],

  // ==================== LINKED LIST ====================
  "linked-list-cycle": [
    { lang: "Python", yt: { kind: "video", id: "gBTe7lFR3vc", channel: "NeetCode", title: "Linked List Cycle — NeetCode" } },
  ],
  "middle-of-the-linked-list": [
    { lang: "Python", yt: { kind: "video", id: "A2_ldqM4QcY", channel: "NeetCode", title: "Middle of Linked List — NeetCode" } },
  ],
  "palindrome-linked-list": [
    { lang: "Python", yt: { kind: "video", id: "yOzXms1J6Nk", channel: "NeetCode", title: "Palindrome Linked List — NeetCode" } },
  ],
  "reverse-linked-list": [
    { lang: "Python", yt: { kind: "video", id: "G0_I-ZF0S38", channel: "NeetCode", title: "Reverse Linked List — NeetCode" } },
  ],
  "reverse-nodes-in-k-group": [
    { lang: "Python", yt: { kind: "video", id: "1UOPsfP85V4", channel: "NeetCode", title: "Reverse Nodes in k-Group — NeetCode" } },
  ],

  // ==================== TREES ====================
  "maximum-depth-of-binary-tree": [
    { lang: "Python", yt: { kind: "video", id: "hTM3phVI6YQ", channel: "NeetCode", title: "Maximum Depth of Binary Tree — NeetCode" } },
  ],
  "diameter-of-binary-tree": [
    { lang: "Python", yt: { kind: "video", id: "bkxqA8Rfv04", channel: "NeetCode", title: "Diameter of Binary Tree — NeetCode" } },
  ],
  "binary-tree-maximum-path-sum": [
    { lang: "Python", yt: { kind: "video", id: "Hr5cWUld4vU", channel: "NeetCode", title: "Binary Tree Maximum Path Sum — NeetCode" } },
  ],
  "lowest-common-ancestor-of-a-binary-tree": [
    { lang: "Python", yt: { kind: "video", id: "13m9ZCB8gjw", channel: "NeetCode", title: "LCA of Binary Tree — NeetCode" } },
  ],
  "binary-tree-level-order-traversal": [
    { lang: "Python", yt: { kind: "video", id: "6ZnyEApgFYg", channel: "NeetCode", title: "Level Order Traversal — NeetCode" } },
  ],
  "binary-tree-right-side-view": [
    { lang: "Python", yt: { kind: "video", id: "d4zLyf32e3I", channel: "NeetCode", title: "Binary Tree Right Side View — NeetCode" } },
  ],

  // ==================== GRAPHS ====================
  "number-of-islands": [
    { lang: "Python", yt: { kind: "video", id: "pV2kpPD66nE", channel: "NeetCode", title: "Number of Islands — NeetCode" } },
  ],
  "clone-graph": [
    { lang: "Python", yt: { kind: "video", id: "mQeF6bN8hMk", channel: "NeetCode", title: "Clone Graph — NeetCode" } },
  ],
  "rotting-oranges": [
    { lang: "Python", yt: { kind: "video", id: "y704fEOx0s0", channel: "NeetCode", title: "Rotting Oranges — NeetCode" } },
  ],
  "word-ladder": [
    { lang: "Python", yt: { kind: "video", id: "h9iTnkgv05E", channel: "NeetCode", title: "Word Ladder — NeetCode" } },
  ],
  "course-schedule": [
    { lang: "Python", yt: { kind: "video", id: "EgI5nU9etnU", channel: "NeetCode", title: "Course Schedule — NeetCode" } },
  ],
  "course-schedule-ii": [
    { lang: "Python", yt: { kind: "video", id: "Akt3glAwyfY", channel: "NeetCode", title: "Course Schedule II — NeetCode" } },
  ],
  "alien-dictionary": [
    { lang: "Python", yt: { kind: "video", id: "6kTZYvNNyps", channel: "NeetCode", title: "Alien Dictionary — NeetCode" } },
  ],
  "network-delay-time": [
    { lang: "Python", yt: { kind: "video", id: "EaphyqKU4PQ", channel: "NeetCode", title: "Network Delay Time — NeetCode" } },
  ],
  "cheapest-flights-within-k-stops": [
    { lang: "Python", yt: { kind: "video", id: "5eIK3zUdYmE", channel: "NeetCode", title: "Cheapest Flights Within K Stops — NeetCode" } },
  ],

  // ==================== DP ====================
  "partition-equal-subset-sum": [
    { lang: "Python", yt: { kind: "video", id: "IsvocB5BJhw", channel: "NeetCode", title: "Partition Equal Subset Sum — NeetCode" } },
  ],
  "target-sum": [
    { lang: "Python", yt: { kind: "video", id: "g0npyaQtAQM", channel: "NeetCode", title: "Target Sum — NeetCode" } },
  ],
  "coin-change": [
    { lang: "Python", yt: { kind: "video", id: "H9bfqozjoqs", channel: "NeetCode", title: "Coin Change — NeetCode" } },
  ],
  "longest-increasing-subsequence": [
    { lang: "Python", yt: { kind: "video", id: "cjWnW0hdF1Y", channel: "NeetCode", title: "Longest Increasing Subsequence — NeetCode" } },
  ],
  "longest-common-subsequence": [
    { lang: "Python", yt: { kind: "video", id: "Ua0GhsJSlWM", channel: "NeetCode", title: "Longest Common Subsequence — NeetCode" } },
  ],
  "burst-balloons": [
    { lang: "Python", yt: { kind: "video", id: "VFskby7lUbw", channel: "NeetCode", title: "Burst Balloons — NeetCode" } },
  ],
  "climbing-stairs": [
    { lang: "Python", yt: { kind: "video", id: "Y0lT9Fck7qI", channel: "NeetCode", title: "Climbing Stairs — NeetCode" } },
  ],
  "fibonacci-number": [
    { lang: "Python", yt: { kind: "video", id: "oBt53YbR9Kk", channel: "NeetCode", title: "Fibonacci Number — NeetCode" } },
  ],

  // ==================== BACKTRACKING ====================
  "n-queens": [
    { lang: "Python", yt: { kind: "video", id: "Ph95IHmRp5M", channel: "NeetCode", title: "N-Queens — NeetCode" } },
  ],
  "permutations": [
    { lang: "Python", yt: { kind: "video", id: "s7AvT7cGdSo", channel: "NeetCode", title: "Permutations — NeetCode" } },
  ],
  "subsets": [
    { lang: "Python", yt: { kind: "video", id: "REOH22Xwdkk", channel: "NeetCode", title: "Subsets — NeetCode" } },
  ],
  "word-search": [
    { lang: "Python", yt: { kind: "video", id: "pfiQ_PS1g8E", channel: "NeetCode", title: "Word Search — NeetCode" } },
  ],
  "sudoku-solver": [
    { lang: "Python", yt: { kind: "video", id: "TjFXEUCMqI8", channel: "NeetCode", title: "Sudoku Solver — NeetCode" } },
  ],
  "generate-parentheses": [
    { lang: "Python", yt: { kind: "video", id: "s9fokUqJ76A", channel: "NeetCode", title: "Generate Parentheses — NeetCode" } },
  ],
  "letter-combinations-of-a-phone-number": [
    { lang: "Python", yt: { kind: "video", id: "0snEunUacZY", channel: "NeetCode", title: "Letter Combinations of a Phone Number — NeetCode" } },
  ],

  // ==================== BINARY SEARCH ====================
  "binary-search": [
    { lang: "Python", yt: { kind: "video", id: "s4DPM8ct1pI", channel: "NeetCode", title: "Binary Search — NeetCode" } },
  ],
  "search-in-rotated-sorted-array": [
    { lang: "Python", yt: { kind: "video", id: "U8XENwh8Oy8", channel: "NeetCode", title: "Search in Rotated Sorted Array — NeetCode" } },
  ],
  "find-first-and-last-position-of-element-in-sorted-array": [
    { lang: "Python", yt: { kind: "video", id: "4sQL7R5ySUU", channel: "NeetCode", title: "Find First and Last Position — NeetCode" } },
  ],
  "median-of-two-sorted-arrays": [
    { lang: "Python", yt: { kind: "video", id: "q6IEA26hvXc", channel: "NeetCode", title: "Median of Two Sorted Arrays — NeetCode" } },
  ],
  "search-insert-position": [
    { lang: "Python", yt: { kind: "video", id: "K-RYzDZkzCI", channel: "NeetCode", title: "Search Insert Position — NeetCode" } },
  ],
  "first-bad-version": [
    { lang: "Python", yt: { kind: "video", id: "SNDE-C86n4M", channel: "NeetCode", title: "First Bad Version — NeetCode" } },
  ],
  "find-minimum-in-rotated-sorted-array": [
    { lang: "Python", yt: { kind: "video", id: "nIVW4P8b1VA", channel: "NeetCode", title: "Find Minimum in Rotated Sorted Array — NeetCode" } },
  ],
  "koko-eating-bananas": [
    { lang: "Python", yt: { kind: "video", id: "U2SozAs9RzA", channel: "NeetCode", title: "Koko Eating Bananas — NeetCode" } },
  ],

  // ==================== BITS ====================
  "single-number": [
    { lang: "Python", yt: { kind: "video", id: "qMPX1AOa83k", channel: "NeetCode", title: "Single Number — NeetCode" } },
  ],
  "number-of-1-bits": [
    { lang: "Python", yt: { kind: "video", id: "5Km3utixwZs", channel: "NeetCode", title: "Number of 1 Bits — NeetCode" } },
  ],
  "counting-bits": [
    { lang: "Python", yt: { kind: "video", id: "RyBM56RIWrM", channel: "NeetCode", title: "Counting Bits — NeetCode" } },
  ],
  "missing-number": [
    { lang: "Python", yt: { kind: "video", id: "WnPLSRLSANE", channel: "NeetCode", title: "Missing Number — NeetCode" } },
  ],
  "sum-of-two-integers": [
    { lang: "Python", yt: { kind: "video", id: "gVUrDV4tZfY", channel: "NeetCode", title: "Sum of Two Integers — NeetCode" } },
  ],
  "happy-number": [
    { lang: "Python", yt: { kind: "video", id: "ljz85bxOYJ0", channel: "NeetCode", title: "Happy Number — NeetCode" } },
  ],
  "powx-n": [
    { lang: "Python", yt: { kind: "video", id: "g9YQyYi4IQQ", channel: "NeetCode", title: "Pow(x, n) — NeetCode" } },
  ],

  // ==================== STRINGS ====================
  "valid-palindrome": [
    { lang: "Python", yt: { kind: "video", id: "jJXJ16kPFWg", channel: "NeetCode", title: "Valid Palindrome — NeetCode" } },
  ],
  "reverse-string": [
    { lang: "Python", yt: { kind: "video", id: "_d0T_2Lk2qA", channel: "NeetCode", title: "Reverse String — NeetCode" } },
  ],

  // ==================== MATRIX ====================
  "rotate-image": [
    { lang: "Python", yt: { kind: "video", id: "fMSJSS7eO1w", channel: "NeetCode", title: "Rotate Image — NeetCode" } },
  ],
  "spiral-matrix": [
    { lang: "Python", yt: { kind: "video", id: "BJnMZNwUk1M", channel: "NeetCode", title: "Spiral Matrix — NeetCode" } },
  ],
  "set-matrix-zeroes": [
    { lang: "Python", yt: { kind: "video", id: "T41rL0L3Pnw", channel: "NeetCode", title: "Set Matrix Zeroes — NeetCode" } },
  ],
  "search-a-2d-matrix": [
    { lang: "Python", yt: { kind: "video", id: "Ber2pi2C0j0", channel: "NeetCode", title: "Search a 2D Matrix — NeetCode" } },
  ],
};
