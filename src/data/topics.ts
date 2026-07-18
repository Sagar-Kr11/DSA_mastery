export type Difficulty = "Easy" | "Medium" | "Hard";
export type Channel =
  | "Striver"
  | "AdityaVerma"
  | "AbdulBari"
  | "Kunal"
  | "ApnaCollege"
  | "CodeHelp"
  | "NeetCode"
  | "TusharRoy"
  | "WilliamFiset"
  | "Errichto"
  | "freeCodeCamp"
  | "MIT";

export type YouTubeRef =
  | { kind: "video"; id: string; channel: Channel; title: string; languages?: ("C++" | "Java" | "Python")[] }
  | { kind: "playlist"; id: string; channel: Channel; title: string; languages?: ("C++" | "Java" | "Python")[] };

export type ResourceKind = "article" | "visualizer" | "book" | "cheatsheet" | "docs";
export type Resource = {
  label: string;
  url: string;
  kind: ResourceKind;
  source: string; // e.g. "GeeksforGeeks", "CP-Algorithms"
};

export type FlowStep = { id: string; label: string; next?: string[] };

export type Problem = {
  slug: string; // leetcode slug
  title: string;
  difficulty: Difficulty;
};

export type Pattern = {
  id: string;
  topicId: string;
  name: string;
  logicType: string;
  companies: string[];
  youtube: YouTubeRef; // primary (kept for backward compat)
  extraVideos?: YouTubeRef[]; // additional creators for the same pattern
  resources?: Resource[]; // articles, visualizers, docs
  flow: FlowStep[];
  problems: Problem[];
};

export type Topic = {
  id: string;
  name: string;
  emoji: string;
  blurb: string;
  patternIds: string[];
};

/**
 * YouTube references are curated to the creator best known for each pattern:
 * - Sliding Window / DP → Aditya Verma
 * - Graphs / Trees / Binary Search / LL / Arrays (A-Z DSA) → Striver (takeUforward)
 * - Fundamentals & Bit Manipulation → Abdul Bari
 *
 * For maximum stability we reference each creator's canonical PLAYLIST for the
 * topic (playlists are long-lived; individual video IDs occasionally get
 * re-uploaded). The playlist embed plays inline and always stays on that
 * creator's series — no redirect to youtube.com.
 */

export const PATTERNS: Pattern[] = [
  // ==================== ARRAYS ====================
  {
    id: "two-pointers",
    topicId: "arrays",
    name: "Two Pointers",
    logicType: "Move two indices from opposite ends (or same end) to shrink search space in O(n).",
    companies: ["Amazon", "Google", "Microsoft", "Meta", "Adobe"],
    youtube: { kind: "playlist", id: "PLgUwDviBIf0rENwdL0nEH0uGom9no0nyB", channel: "Striver", title: "Striver — Arrays (A-Z DSA)" },
    flow: [
      { id: "s1", label: "Sort array (if needed)", next: ["s2"] },
      { id: "s2", label: "left = 0, right = n-1", next: ["s3"] },
      { id: "s3", label: "While left < right", next: ["s4"] },
      { id: "s4", label: "Check condition on a[left] + a[right]", next: ["s5", "s6", "s7"] },
      { id: "s5", label: "Match → record answer, move both" },
      { id: "s6", label: "Sum too small → left++" },
      { id: "s7", label: "Sum too large → right--" },
    ],
    problems: [
      { slug: "two-sum", title: "Two Sum", difficulty: "Easy" },
      { slug: "3sum", title: "3Sum", difficulty: "Medium" },
      { slug: "container-with-most-water", title: "Container With Most Water", difficulty: "Medium" },
      { slug: "trapping-rain-water", title: "Trapping Rain Water", difficulty: "Hard" },
      { slug: "remove-duplicates-from-sorted-array", title: "Remove Duplicates from Sorted Array", difficulty: "Easy" },
    ],
  },
  {
    id: "kadane",
    topicId: "arrays",
    name: "Kadane's Algorithm",
    logicType: "Track running maximum subarray sum; reset when running sum drops below 0.",
    companies: ["Amazon", "Microsoft", "Bloomberg", "JPMorgan"],
    youtube: { kind: "playlist", id: "PLgUwDviBIf0rENwdL0nEH0uGom9no0nyB", channel: "Striver", title: "Striver — Arrays series" },
    flow: [
      { id: "k1", label: "curSum = 0, maxSum = -∞", next: ["k2"] },
      { id: "k2", label: "For each x in array", next: ["k3"] },
      { id: "k3", label: "curSum = max(x, curSum + x)", next: ["k4"] },
      { id: "k4", label: "maxSum = max(maxSum, curSum)", next: ["k5"] },
      { id: "k5", label: "Return maxSum" },
    ],
    problems: [
      { slug: "maximum-subarray", title: "Maximum Subarray", difficulty: "Medium" },
      { slug: "maximum-product-subarray", title: "Maximum Product Subarray", difficulty: "Medium" },
      { slug: "maximum-sum-circular-subarray", title: "Maximum Sum Circular Subarray", difficulty: "Medium" },
    ],
  },
  {
    id: "prefix-sum",
    topicId: "arrays",
    name: "Prefix Sum",
    logicType: "Precompute cumulative sums to answer range-sum queries in O(1).",
    companies: ["Amazon", "Google", "Uber", "Stripe"],
    youtube: { kind: "playlist", id: "PLgUwDviBIf0rENwdL0nEH0uGom9no0nyB", channel: "Striver", title: "Striver — Arrays series" },
    flow: [
      { id: "p1", label: "pre[0] = a[0]", next: ["p2"] },
      { id: "p2", label: "pre[i] = pre[i-1] + a[i]", next: ["p3"] },
      { id: "p3", label: "Range(l..r) = pre[r] − pre[l-1]", next: ["p4"] },
      { id: "p4", label: "Use hashmap of prefix→index for subarray-sum-equals-k" },
    ],
    problems: [
      { slug: "subarray-sum-equals-k", title: "Subarray Sum Equals K", difficulty: "Medium" },
      { slug: "range-sum-query-immutable", title: "Range Sum Query - Immutable", difficulty: "Easy" },
      { slug: "contiguous-array", title: "Contiguous Array", difficulty: "Medium" },
    ],
  },

  // ==================== STRINGS ====================
  {
    id: "sliding-window",
    topicId: "strings",
    name: "Sliding Window",
    logicType: "Maintain a window [l, r]; expand r, shrink l while condition breaks.",
    companies: ["Amazon", "Google", "Microsoft", "Meta", "TikTok"],
    youtube: { kind: "playlist", id: "PL_z_8CaSLPWeM8BDJmIYDaoQ5zuwyxnfj", channel: "AdityaVerma", title: "Aditya Verma — Sliding Window" },
    flow: [
      { id: "sw1", label: "l = 0, r = 0, state = {}", next: ["sw2"] },
      { id: "sw2", label: "Expand: include a[r] in state", next: ["sw3"] },
      { id: "sw3", label: "While window invalid → shrink from l", next: ["sw4"] },
      { id: "sw4", label: "Record answer using (r − l + 1)", next: ["sw5"] },
      { id: "sw5", label: "r++ until r = n" },
    ],
    problems: [
      { slug: "longest-substring-without-repeating-characters", title: "Longest Substring Without Repeating Characters", difficulty: "Medium" },
      { slug: "minimum-window-substring", title: "Minimum Window Substring", difficulty: "Hard" },
      { slug: "longest-repeating-character-replacement", title: "Longest Repeating Character Replacement", difficulty: "Medium" },
      { slug: "permutation-in-string", title: "Permutation in String", difficulty: "Medium" },
      { slug: "sliding-window-maximum", title: "Sliding Window Maximum", difficulty: "Hard" },
    ],
  },

  // ==================== HASHMAP ====================
  {
    id: "hashmap-frequency",
    topicId: "hashmap",
    name: "Frequency Counting",
    logicType: "Use a hashmap to count occurrences; then reason about anagrams, majorities, or complements.",
    companies: ["Amazon", "Google", "Microsoft", "Adobe"],
    youtube: { kind: "playlist", id: "PLgUwDviBIf0rENwdL0nEH0uGom9no0nyB", channel: "Striver", title: "Striver — Arrays / Hashing" },
    flow: [
      { id: "h1", label: "Iterate items", next: ["h2"] },
      { id: "h2", label: "map[item] = (map[item] || 0) + 1", next: ["h3"] },
      { id: "h3", label: "Second pass: apply predicate over map" },
    ],
    problems: [
      { slug: "valid-anagram", title: "Valid Anagram", difficulty: "Easy" },
      { slug: "group-anagrams", title: "Group Anagrams", difficulty: "Medium" },
      { slug: "top-k-frequent-elements", title: "Top K Frequent Elements", difficulty: "Medium" },
      { slug: "majority-element", title: "Majority Element", difficulty: "Easy" },
    ],
  },

  // ==================== STACK / QUEUE ====================
  {
    id: "monotonic-stack",
    topicId: "stack-queue",
    name: "Monotonic Stack",
    logicType: "Keep a stack whose elements are strictly increasing/decreasing — pops give next-greater/smaller answers.",
    companies: ["Amazon", "Google", "Microsoft", "Bloomberg"],
    youtube: { kind: "playlist", id: "PL_z_8CaSLPWdeOezg68SKkeLN4-T_jNHd", channel: "AdityaVerma", title: "Aditya Verma — Stack" },
    flow: [
      { id: "m1", label: "Empty stack", next: ["m2"] },
      { id: "m2", label: "For each a[i]", next: ["m3"] },
      { id: "m3", label: "While stack.top violates monotonicity → pop and record answer", next: ["m4"] },
      { id: "m4", label: "Push i onto stack", next: ["m5"] },
      { id: "m5", label: "Leftover stack items → default answer (−1 or n)" },
    ],
    problems: [
      { slug: "next-greater-element-i", title: "Next Greater Element I", difficulty: "Easy" },
      { slug: "daily-temperatures", title: "Daily Temperatures", difficulty: "Medium" },
      { slug: "largest-rectangle-in-histogram", title: "Largest Rectangle in Histogram", difficulty: "Hard" },
      { slug: "trapping-rain-water", title: "Trapping Rain Water", difficulty: "Hard" },
    ],
  },

  // ==================== LINKED LIST ====================
  {
    id: "fast-slow",
    topicId: "linked-list",
    name: "Fast & Slow Pointers",
    logicType: "Move one pointer 2× the speed of another — detects cycles and finds midpoints in O(n).",
    companies: ["Amazon", "Microsoft", "Google", "Meta"],
    youtube: { kind: "playlist", id: "PLgUwDviBIf0rAuz8tVcM0AymmhTRsfaLU", channel: "Striver", title: "Striver — Linked List" },
    flow: [
      { id: "f1", label: "slow = head, fast = head", next: ["f2"] },
      { id: "f2", label: "While fast && fast.next", next: ["f3"] },
      { id: "f3", label: "slow = slow.next; fast = fast.next.next", next: ["f4"] },
      { id: "f4", label: "If slow == fast → cycle found", next: ["f5"] },
      { id: "f5", label: "Else fast = null → slow is midpoint" },
    ],
    problems: [
      { slug: "linked-list-cycle", title: "Linked List Cycle", difficulty: "Easy" },
      { slug: "linked-list-cycle-ii", title: "Linked List Cycle II", difficulty: "Medium" },
      { slug: "middle-of-the-linked-list", title: "Middle of the Linked List", difficulty: "Easy" },
      { slug: "palindrome-linked-list", title: "Palindrome Linked List", difficulty: "Easy" },
    ],
  },
  {
    id: "reverse-list",
    topicId: "linked-list",
    name: "Reverse a Linked List",
    logicType: "Iterative prev/curr/next rewiring — the base primitive behind K-group and palindrome checks.",
    companies: ["Amazon", "Microsoft", "Google", "Apple"],
    youtube: { kind: "playlist", id: "PLgUwDviBIf0rAuz8tVcM0AymmhTRsfaLU", channel: "Striver", title: "Striver — Linked List" },
    flow: [
      { id: "r1", label: "prev = null, curr = head", next: ["r2"] },
      { id: "r2", label: "While curr", next: ["r3"] },
      { id: "r3", label: "next = curr.next", next: ["r4"] },
      { id: "r4", label: "curr.next = prev", next: ["r5"] },
      { id: "r5", label: "prev = curr; curr = next", next: ["r6"] },
      { id: "r6", label: "Return prev" },
    ],
    problems: [
      { slug: "reverse-linked-list", title: "Reverse Linked List", difficulty: "Easy" },
      { slug: "reverse-linked-list-ii", title: "Reverse Linked List II", difficulty: "Medium" },
      { slug: "reverse-nodes-in-k-group", title: "Reverse Nodes in k-Group", difficulty: "Hard" },
    ],
  },

  // ==================== TREES ====================
  {
    id: "tree-dfs",
    topicId: "trees",
    name: "DFS Traversals",
    logicType: "Recursively visit left → node → right (or variants) to answer path/height/aggregate questions.",
    companies: ["Amazon", "Google", "Microsoft", "Meta"],
    youtube: { kind: "playlist", id: "PLgUwDviBIf0q8Hkd7bK2Bpryj2xVJk8Vk", channel: "Striver", title: "Striver — Trees" },
    flow: [
      { id: "d1", label: "dfs(node):", next: ["d2"] },
      { id: "d2", label: "If node == null → return base", next: ["d3"] },
      { id: "d3", label: "left = dfs(node.left)", next: ["d4"] },
      { id: "d4", label: "right = dfs(node.right)", next: ["d5"] },
      { id: "d5", label: "Combine left, right, node.val → return" },
    ],
    problems: [
      { slug: "maximum-depth-of-binary-tree", title: "Maximum Depth of Binary Tree", difficulty: "Easy" },
      { slug: "diameter-of-binary-tree", title: "Diameter of Binary Tree", difficulty: "Easy" },
      { slug: "binary-tree-maximum-path-sum", title: "Binary Tree Maximum Path Sum", difficulty: "Hard" },
      { slug: "lowest-common-ancestor-of-a-binary-tree", title: "Lowest Common Ancestor", difficulty: "Medium" },
    ],
  },
  {
    id: "tree-bfs",
    topicId: "trees",
    name: "BFS / Level Order",
    logicType: "Queue-based level traversal — powers level-sums, right-side view, and shortest-path variants.",
    companies: ["Amazon", "Google", "Uber", "LinkedIn"],
    youtube: { kind: "playlist", id: "PLgUwDviBIf0q8Hkd7bK2Bpryj2xVJk8Vk", channel: "Striver", title: "Striver — Trees" },
    flow: [
      { id: "b1", label: "queue = [root]", next: ["b2"] },
      { id: "b2", label: "While queue not empty", next: ["b3"] },
      { id: "b3", label: "size = queue.length; level = []", next: ["b4"] },
      { id: "b4", label: "Repeat size times: pop, add to level, push children", next: ["b5"] },
      { id: "b5", label: "Append level to result" },
    ],
    problems: [
      { slug: "binary-tree-level-order-traversal", title: "Binary Tree Level Order Traversal", difficulty: "Medium" },
      { slug: "binary-tree-right-side-view", title: "Binary Tree Right Side View", difficulty: "Medium" },
      { slug: "binary-tree-zigzag-level-order-traversal", title: "Zigzag Level Order", difficulty: "Medium" },
    ],
  },

  // ==================== GRAPHS ====================
  {
    id: "graph-bfs-dfs",
    topicId: "graphs",
    name: "Graph BFS / DFS",
    logicType: "Explore connected components, count islands, detect reachability — with a visited set.",
    companies: ["Amazon", "Google", "Microsoft", "Meta"],
    youtube: { kind: "playlist", id: "PLgUwDviBIf0oE3gA41TKO2H5bHpPd7fzn", channel: "Striver", title: "Striver — Graph Series" },
    flow: [
      { id: "g1", label: "visited = Set()", next: ["g2"] },
      { id: "g2", label: "For each unvisited node → dfs/bfs from it", next: ["g3"] },
      { id: "g3", label: "Mark visited, recurse/enqueue neighbours", next: ["g4"] },
      { id: "g4", label: "Count/collect at each start" },
    ],
    problems: [
      { slug: "number-of-islands", title: "Number of Islands", difficulty: "Medium" },
      { slug: "clone-graph", title: "Clone Graph", difficulty: "Medium" },
      { slug: "rotting-oranges", title: "Rotting Oranges", difficulty: "Medium" },
      { slug: "word-ladder", title: "Word Ladder", difficulty: "Hard" },
    ],
  },
  {
    id: "topo-sort",
    topicId: "graphs",
    name: "Topological Sort",
    logicType: "Kahn's BFS (in-degree = 0) or DFS post-order — required for course-schedule and build-order.",
    companies: ["Amazon", "Google", "Uber", "Airbnb"],
    youtube: { kind: "playlist", id: "PLgUwDviBIf0oE3gA41TKO2H5bHpPd7fzn", channel: "Striver", title: "Striver — Graph Series" },
    flow: [
      { id: "t1", label: "Compute in-degree of every node", next: ["t2"] },
      { id: "t2", label: "Queue all nodes with in-degree 0", next: ["t3"] },
      { id: "t3", label: "Pop node → add to order → decrement neighbours", next: ["t4"] },
      { id: "t4", label: "Enqueue neighbours whose in-degree hits 0", next: ["t5"] },
      { id: "t5", label: "If order.length < N → cycle exists" },
    ],
    problems: [
      { slug: "course-schedule", title: "Course Schedule", difficulty: "Medium" },
      { slug: "course-schedule-ii", title: "Course Schedule II", difficulty: "Medium" },
      { slug: "alien-dictionary", title: "Alien Dictionary", difficulty: "Hard" },
    ],
  },
  {
    id: "dijkstra",
    topicId: "graphs",
    name: "Dijkstra's Shortest Path",
    logicType: "Min-heap of (dist, node); relax edges greedily — works when all weights ≥ 0.",
    companies: ["Google", "Uber", "Amazon", "Meta"],
    youtube: { kind: "playlist", id: "PLgUwDviBIf0oE3gA41TKO2H5bHpPd7fzn", channel: "Striver", title: "Striver — Graph Series" },
    flow: [
      { id: "dj1", label: "dist[src] = 0, others = ∞", next: ["dj2"] },
      { id: "dj2", label: "Push (0, src) to min-heap", next: ["dj3"] },
      { id: "dj3", label: "Pop (d, u). If d > dist[u], skip", next: ["dj4"] },
      { id: "dj4", label: "For (v, w) in adj[u]: if dist[u] + w < dist[v] → update, push", next: ["dj5"] },
      { id: "dj5", label: "Repeat until heap empty" },
    ],
    problems: [
      { slug: "network-delay-time", title: "Network Delay Time", difficulty: "Medium" },
      { slug: "cheapest-flights-within-k-stops", title: "Cheapest Flights Within K Stops", difficulty: "Medium" },
      { slug: "path-with-minimum-effort", title: "Path With Minimum Effort", difficulty: "Medium" },
    ],
  },

  // ==================== DP ====================
  {
    id: "knapsack",
    topicId: "dp",
    name: "0/1 Knapsack",
    logicType: "For each item choose take/skip; state = (index, capacity). Base of subset-sum, target-sum, partition.",
    companies: ["Amazon", "Google", "Microsoft", "JPMorgan"],
    youtube: { kind: "playlist", id: "PL_z_8CaSLPWekqhdCPmFohncHwz8TY2Go", channel: "AdityaVerma", title: "Aditya Verma — DP" },
    flow: [
      { id: "kn1", label: "dp[i][w] = best using first i items with capacity w", next: ["kn2"] },
      { id: "kn2", label: "If w[i] > w → dp[i][w] = dp[i-1][w]", next: ["kn3"] },
      { id: "kn3", label: "Else dp[i][w] = max(dp[i-1][w], dp[i-1][w-w[i]] + v[i])", next: ["kn4"] },
      { id: "kn4", label: "Answer = dp[n][W]" },
    ],
    problems: [
      { slug: "partition-equal-subset-sum", title: "Partition Equal Subset Sum", difficulty: "Medium" },
      { slug: "target-sum", title: "Target Sum", difficulty: "Medium" },
      { slug: "coin-change", title: "Coin Change", difficulty: "Medium" },
      { slug: "ones-and-zeroes", title: "Ones and Zeroes", difficulty: "Medium" },
    ],
  },
  {
    id: "lis",
    topicId: "dp",
    name: "Longest Increasing Subsequence",
    logicType: "dp[i] = 1 + max(dp[j]) for j<i where a[j]<a[i]. O(n log n) via patience sorting.",
    companies: ["Amazon", "Google", "Microsoft"],
    youtube: { kind: "playlist", id: "PL_z_8CaSLPWekqhdCPmFohncHwz8TY2Go", channel: "AdityaVerma", title: "Aditya Verma — DP" },
    flow: [
      { id: "l1", label: "dp[i] = 1 for all i", next: ["l2"] },
      { id: "l2", label: "For i in 1..n-1", next: ["l3"] },
      { id: "l3", label: "For j in 0..i-1", next: ["l4"] },
      { id: "l4", label: "If a[j] < a[i]: dp[i] = max(dp[i], dp[j] + 1)", next: ["l5"] },
      { id: "l5", label: "Answer = max(dp)" },
    ],
    problems: [
      { slug: "longest-increasing-subsequence", title: "Longest Increasing Subsequence", difficulty: "Medium" },
      { slug: "russian-doll-envelopes", title: "Russian Doll Envelopes", difficulty: "Hard" },
      { slug: "longest-common-subsequence", title: "Longest Common Subsequence", difficulty: "Medium" },
    ],
  },
  {
    id: "mcm",
    topicId: "dp",
    name: "Matrix Chain / Partition DP",
    logicType: "Try every split point k in (i, j); combine subresults. Base of MCM, palindrome partitioning, burst balloons.",
    companies: ["Google", "Amazon", "Meta"],
    youtube: { kind: "playlist", id: "PL_z_8CaSLPWekqhdCPmFohncHwz8TY2Go", channel: "AdityaVerma", title: "Aditya Verma — DP" },
    flow: [
      { id: "mc1", label: "solve(i, j)", next: ["mc2"] },
      { id: "mc2", label: "If i >= j → return 0", next: ["mc3"] },
      { id: "mc3", label: "For k in i..j-1", next: ["mc4"] },
      { id: "mc4", label: "cost = solve(i,k) + solve(k+1,j) + combine(i,k,j)", next: ["mc5"] },
      { id: "mc5", label: "Return min/max over all k" },
    ],
    problems: [
      { slug: "burst-balloons", title: "Burst Balloons", difficulty: "Hard" },
      { slug: "palindrome-partitioning-ii", title: "Palindrome Partitioning II", difficulty: "Hard" },
      { slug: "minimum-cost-to-cut-a-stick", title: "Minimum Cost to Cut a Stick", difficulty: "Hard" },
    ],
  },

  // ==================== GREEDY / BACKTRACKING ====================
  {
    id: "backtracking",
    topicId: "greedy-backtracking",
    name: "Backtracking",
    logicType: "Choose → recurse → un-choose. Generates all valid configurations under constraints.",
    companies: ["Amazon", "Google", "Microsoft", "Meta"],
    youtube: { kind: "playlist", id: "PLgUwDviBIf0rGEWe64KWas0Nryn7SCRWw", channel: "Striver", title: "Striver — Recursion & Backtracking" },
    flow: [
      { id: "bt1", label: "backtrack(state)", next: ["bt2"] },
      { id: "bt2", label: "If state is goal → record", next: ["bt3"] },
      { id: "bt3", label: "For each choice c", next: ["bt4"] },
      { id: "bt4", label: "If valid(state, c): apply(c); backtrack(state); undo(c)" },
    ],
    problems: [
      { slug: "n-queens", title: "N-Queens", difficulty: "Hard" },
      { slug: "permutations", title: "Permutations", difficulty: "Medium" },
      { slug: "subsets", title: "Subsets", difficulty: "Medium" },
      { slug: "word-search", title: "Word Search", difficulty: "Medium" },
      { slug: "sudoku-solver", title: "Sudoku Solver", difficulty: "Hard" },
    ],
  },

  // ==================== BINARY SEARCH ====================
  {
    id: "binary-search",
    topicId: "binary-search",
    name: "Classic Binary Search",
    logicType: "Halve the search space on each step; requires a monotonic predicate.",
    companies: ["Amazon", "Google", "Microsoft", "Apple"],
    youtube: { kind: "playlist", id: "PLgUwDviBIf0pMFMWuuvDNMAkoQFi-h0ZF", channel: "Striver", title: "Striver — Binary Search" },
    flow: [
      { id: "bs1", label: "lo = 0, hi = n - 1", next: ["bs2"] },
      { id: "bs2", label: "While lo <= hi", next: ["bs3"] },
      { id: "bs3", label: "mid = lo + (hi - lo) / 2", next: ["bs4"] },
      { id: "bs4", label: "Compare a[mid] to target → shrink half", next: ["bs5"] },
      { id: "bs5", label: "Return index or −1" },
    ],
    problems: [
      { slug: "binary-search", title: "Binary Search", difficulty: "Easy" },
      { slug: "search-in-rotated-sorted-array", title: "Search in Rotated Sorted Array", difficulty: "Medium" },
      { slug: "find-first-and-last-position-of-element-in-sorted-array", title: "Find First and Last Position", difficulty: "Medium" },
      { slug: "median-of-two-sorted-arrays", title: "Median of Two Sorted Arrays", difficulty: "Hard" },
    ],
  },
  {
    id: "bs-on-answer",
    topicId: "binary-search",
    name: "Binary Search on Answer",
    logicType: "Binary-search over the answer value with a feasibility check — great for capacity/time problems.",
    companies: ["Google", "Amazon", "Uber", "Meta"],
    youtube: { kind: "playlist", id: "PLgUwDviBIf0pMFMWuuvDNMAkoQFi-h0ZF", channel: "Striver", title: "Striver — Binary Search" },
    flow: [
      { id: "ba1", label: "lo, hi = min-possible, max-possible answer", next: ["ba2"] },
      { id: "ba2", label: "While lo < hi", next: ["ba3"] },
      { id: "ba3", label: "mid = (lo + hi) / 2", next: ["ba4"] },
      { id: "ba4", label: "If feasible(mid) → hi = mid else lo = mid + 1", next: ["ba5"] },
      { id: "ba5", label: "Return lo" },
    ],
    problems: [
      { slug: "koko-eating-bananas", title: "Koko Eating Bananas", difficulty: "Medium" },
      { slug: "capacity-to-ship-packages-within-d-days", title: "Capacity to Ship Packages", difficulty: "Medium" },
      { slug: "split-array-largest-sum", title: "Split Array Largest Sum", difficulty: "Hard" },
    ],
  },

  // ==================== BIT MANIPULATION ====================
  {
    id: "bit-tricks",
    topicId: "bits",
    name: "Bit Manipulation Tricks",
    logicType: "XOR pairs cancel, n & (n-1) drops lowest set bit — classic OA staples.",
    companies: ["Amazon", "Microsoft", "Google", "Apple"],
    youtube: { kind: "playlist", id: "PLDN4rrl48XKpZkf03iYFl-O29szjTrs_O", channel: "AbdulBari", title: "Abdul Bari — Algorithms (bit / basics)" },
    flow: [
      { id: "bi1", label: "XOR of x with itself = 0", next: ["bi2"] },
      { id: "bi2", label: "n & (n-1) clears lowest set bit", next: ["bi3"] },
      { id: "bi3", label: "(x >> k) & 1 → k-th bit of x", next: ["bi4"] },
      { id: "bi4", label: "Iterate bit-by-bit for popcount / masks" },
    ],
    problems: [
      { slug: "single-number", title: "Single Number", difficulty: "Easy" },
      { slug: "number-of-1-bits", title: "Number of 1 Bits", difficulty: "Easy" },
      { slug: "counting-bits", title: "Counting Bits", difficulty: "Easy" },
      { slug: "missing-number", title: "Missing Number", difficulty: "Easy" },
      { slug: "sum-of-two-integers", title: "Sum of Two Integers", difficulty: "Medium" },
    ],
  },

  // ==================== SERVICE-COMPANY PLACEMENTS (TCS NQT / HackwithInfy / EPAM / Accenture / Deloitte) ====================
  {
    id: "number-theory-basics",
    topicId: "placements",
    name: "Number Theory & Math",
    logicType: "GCD/LCM, prime checks (√n, Sieve of Eratosthenes), factorials, Armstrong / palindrome numbers — bread-and-butter of every Indian OA.",
    companies: ["TCS NQT", "Infosys HackwithInfy", "Accenture", "Wipro", "Cognizant"],
    youtube: { kind: "playlist", id: "PLfqMhTWNBTe3LtFWcvwpqTkUSlB32kJop", channel: "ApnaCollege", title: "Apna College — Complete Java+DSA (Numbers & Math)" },
    flow: [
      { id: "n1", label: "Read number n", next: ["n2"] },
      { id: "n2", label: "GCD → while(b) {a,b = b, a%b}", next: ["n3"] },
      { id: "n3", label: "Prime → loop i=2..√n, check n%i", next: ["n4"] },
      { id: "n4", label: "Sieve → mark multiples of every prime false", next: ["n5"] },
      { id: "n5", label: "Return result / list" },
    ],
    problems: [
      { slug: "count-primes", title: "Count Primes", difficulty: "Medium" },
      { slug: "happy-number", title: "Happy Number", difficulty: "Easy" },
      { slug: "palindrome-number", title: "Palindrome Number", difficulty: "Easy" },
      { slug: "power-of-two", title: "Power of Two", difficulty: "Easy" },
      { slug: "factorial-trailing-zeroes", title: "Factorial Trailing Zeroes", difficulty: "Medium" },
      { slug: "greatest-common-divisor-of-strings", title: "Greatest Common Divisor of Strings", difficulty: "Easy" },
    ],
  },
  {
    id: "pattern-printing",
    topicId: "placements",
    name: "Pattern Printing (Stars / Pyramids)",
    logicType: "Nested for-loops driven by row index — the #1 warm-up in TCS NQT and Wipro Elite coding rounds.",
    companies: ["TCS NQT", "Wipro NLTH", "Cognizant GenC", "Capgemini", "Infosys"],
    youtube: { kind: "playlist", id: "PLfqMhTWNBTe0b2nM6JHVCLbpX_R2qL1UW", channel: "ApnaCollege", title: "Apna College — Placement Pattern Printing" },
    flow: [
      { id: "pp1", label: "for i = 1..n (rows)", next: ["pp2"] },
      { id: "pp2", label: "for j = 1..spaces → print ' '", next: ["pp3"] },
      { id: "pp3", label: "for k = 1..stars(i) → print '*'", next: ["pp4"] },
      { id: "pp4", label: "println() and continue", next: ["pp5"] },
      { id: "pp5", label: "Mirror for inverted / diamond variants" },
    ],
    problems: [
      { slug: "pascals-triangle", title: "Pascal's Triangle", difficulty: "Easy" },
      { slug: "pascals-triangle-ii", title: "Pascal's Triangle II", difficulty: "Easy" },
      { slug: "spiral-matrix", title: "Spiral Matrix (traversal pattern)", difficulty: "Medium" },
      { slug: "print-in-order", title: "Print in Order", difficulty: "Easy" },
    ],
  },
  {
    id: "string-basics",
    topicId: "placements",
    name: "String Manipulation Basics",
    logicType: "Reverse, palindrome check, anagram check, vowel/consonant counts, substring searches — Infosys HackwithInfy & Deloitte favourites.",
    companies: ["Infosys HackwithInfy", "TCS Digital", "Deloitte", "EPAM", "Accenture"],
    youtube: { kind: "playlist", id: "PLgUwDviBIf0ovIT8CcCi7-tprT2xdgpZo", channel: "Striver", title: "Striver — Strings series" },
    flow: [
      { id: "st1", label: "Normalize (lowercase, trim)", next: ["st2"] },
      { id: "st2", label: "Two pointers l=0, r=n-1 for palindrome", next: ["st3"] },
      { id: "st3", label: "Freq array [26] for anagram / duplicate char", next: ["st4"] },
      { id: "st4", label: "Sliding window for longest-unique / substring", next: ["st5"] },
      { id: "st5", label: "Return count / boolean / substring" },
    ],
    problems: [
      { slug: "valid-palindrome", title: "Valid Palindrome", difficulty: "Easy" },
      { slug: "reverse-string", title: "Reverse String", difficulty: "Easy" },
      { slug: "reverse-words-in-a-string", title: "Reverse Words in a String", difficulty: "Medium" },
      { slug: "first-unique-character-in-a-string", title: "First Unique Character in a String", difficulty: "Easy" },
      { slug: "string-compression", title: "String Compression", difficulty: "Medium" },
      { slug: "roman-to-integer", title: "Roman to Integer", difficulty: "Easy" },
    ],
  },
  {
    id: "matrix-basics",
    topicId: "placements",
    name: "Matrix / 2-D Array Problems",
    logicType: "Rotate, transpose, spiral, search in sorted matrix — asked heavily in EPAM, Accenture, and Deloitte online rounds.",
    companies: ["EPAM", "Accenture", "Deloitte", "TCS Digital", "Infosys"],
    youtube: { kind: "playlist", id: "PLgUwDviBIf0rENwdL0nEH0uGom9no0nyB", channel: "Striver", title: "Striver — Arrays (2-D Matrix problems)" },
    flow: [
      { id: "mt1", label: "Check bounds n × m", next: ["mt2"] },
      { id: "mt2", label: "Transpose: swap a[i][j] ↔ a[j][i]", next: ["mt3"] },
      { id: "mt3", label: "Reverse each row → 90° rotation", next: ["mt4"] },
      { id: "mt4", label: "Spiral → 4 pointers (top, bottom, left, right)", next: ["mt5"] },
      { id: "mt5", label: "Search sorted matrix → start top-right, move ←/↓" },
    ],
    problems: [
      { slug: "rotate-image", title: "Rotate Image (90°)", difficulty: "Medium" },
      { slug: "spiral-matrix", title: "Spiral Matrix", difficulty: "Medium" },
      { slug: "set-matrix-zeroes", title: "Set Matrix Zeroes", difficulty: "Medium" },
      { slug: "search-a-2d-matrix", title: "Search a 2D Matrix", difficulty: "Medium" },
      { slug: "search-a-2d-matrix-ii", title: "Search a 2D Matrix II", difficulty: "Medium" },
      { slug: "transpose-matrix", title: "Transpose Matrix", difficulty: "Easy" },
    ],
  },
  {
    id: "recursion-basics",
    topicId: "placements",
    name: "Recursion Fundamentals",
    logicType: "Factorial, Fibonacci, power(x,n), sum of digits, printing subsequences — HackwithInfy R1 staples & EPAM technical MCQs.",
    companies: ["Infosys HackwithInfy", "EPAM", "TCS CodeVita", "Accenture", "Deloitte"],
    youtube: { kind: "playlist", id: "PLgUwDviBIf0rGEWe64KWas0Nryn7SCRWw", channel: "Striver", title: "Striver — Recursion & Backtracking" },
    flow: [
      { id: "rc1", label: "Define base case (n==0 / n==1)", next: ["rc2"] },
      { id: "rc2", label: "Trust the recursion for (n-1)", next: ["rc3"] },
      { id: "rc3", label: "Combine result with current n", next: ["rc4"] },
      { id: "rc4", label: "Handle even/odd split for fast power O(log n)", next: ["rc5"] },
      { id: "rc5", label: "Return accumulated answer" },
    ],
    problems: [
      { slug: "fibonacci-number", title: "Fibonacci Number", difficulty: "Easy" },
      { slug: "climbing-stairs", title: "Climbing Stairs", difficulty: "Easy" },
      { slug: "powx-n", title: "Pow(x, n)", difficulty: "Medium" },
      { slug: "sum-of-digits-of-string-after-convert", title: "Sum of Digits of String After Convert", difficulty: "Easy" },
      { slug: "subsets", title: "Subsets (print all subsequences)", difficulty: "Medium" },
      { slug: "letter-combinations-of-a-phone-number", title: "Letter Combinations of a Phone Number", difficulty: "Medium" },
    ],
  },
];

export const TOPICS: Topic[] = [
  { id: "arrays", name: "Arrays", emoji: "▦", blurb: "Two pointers, prefix sums, Kadane — the foundation of every OA.", patternIds: ["two-pointers", "kadane", "prefix-sum"] },
  { id: "strings", name: "Strings", emoji: "𝒮", blurb: "Sliding windows and string DP — anagrams, substrings, matches.", patternIds: ["sliding-window"] },
  { id: "hashmap", name: "HashMap", emoji: "#", blurb: "Frequency counts, complements, group-by keys, and prefix-sum lookups — the go-to pattern for turning O(n²) brute force into O(n) with a hash table.", patternIds: ["hashmap-frequency"] },
  { id: "stack-queue", name: "Stack / Queue", emoji: "⊟", blurb: "Monotonic stacks and queues answer nearest-greater/smaller in O(n).", patternIds: ["monotonic-stack"] },
  { id: "linked-list", name: "Linked List", emoji: "↦", blurb: "Fast/slow pointers, in-place reversal, K-group rewires.", patternIds: ["fast-slow", "reverse-list"] },
  { id: "trees", name: "Trees", emoji: "🌳", blurb: "DFS combines subresults; BFS explores level-by-level.", patternIds: ["tree-dfs", "tree-bfs"] },
  { id: "graphs", name: "Graphs", emoji: "◈", blurb: "BFS/DFS, topological order, Dijkstra — the heavy hitters.", patternIds: ["graph-bfs-dfs", "topo-sort", "dijkstra"] },
  { id: "dp", name: "Dynamic Programming", emoji: "∑", blurb: "Knapsack, LIS, partition DP — memoize overlapping subproblems.", patternIds: ["knapsack", "lis", "mcm"] },
  { id: "greedy-backtracking", name: "Greedy / Backtracking", emoji: "⟳", blurb: "Choose-recurse-undo when brute force is only slightly too slow.", patternIds: ["backtracking"] },
  { id: "binary-search", name: "Binary Search", emoji: "⌕", blurb: "Halve the search space — over indices or over the answer itself.", patternIds: ["binary-search", "bs-on-answer"] },
  { id: "bits", name: "Bit Manipulation", emoji: "⚡", blurb: "XOR magic, popcount, masks — one-liners in interviews.", patternIds: ["bit-tricks"] },
  { id: "placements", name: "Service-Company Placements", emoji: "🇮🇳", blurb: "TCS NQT · HackwithInfy · EPAM · Accenture · Deloitte — the patterns that actually appear on Indian OAs.", patternIds: ["number-theory-basics", "pattern-printing", "string-basics", "matrix-basics", "recursion-basics"] },
];


export const CHANNEL_LABELS: Record<Channel, string> = {
  Striver: "Striver (takeUforward)",
  AdityaVerma: "Aditya Verma",
  AbdulBari: "Abdul Bari",
  Kunal: "Kunal Kushwaha",
  ApnaCollege: "Apna College",
  CodeHelp: "CodeHelp — Love Babbar",
  NeetCode: "NeetCode",
  TusharRoy: "Tushar Roy",
  WilliamFiset: "WilliamFiset",
  Errichto: "Errichto Algorithms",
  freeCodeCamp: "freeCodeCamp",
  MIT: "MIT OpenCourseWare",
};

export type Language = "C++" | "Java" | "Python";
export const LANGUAGES: Language[] = ["C++", "Java", "Python"];

/**
 * Default primary languages used by each creator in their pattern videos.
 * Most Indian-placement creators code in C++; NeetCode/MIT lean Python;
 * WilliamFiset/Tushar Roy/Kunal lean Java. freeCodeCamp is mixed.
 */
export const CHANNEL_LANGUAGES: Record<Channel, Language[]> = {
  Striver: ["C++", "Java"],
  AdityaVerma: ["C++"],
  AbdulBari: ["C++"],
  Kunal: ["Java"],
  ApnaCollege: ["C++", "Java"],
  CodeHelp: ["C++"],
  NeetCode: ["Python", "Java"],
  TusharRoy: ["Java"],
  WilliamFiset: ["Java"],
  Errichto: ["C++"],
  freeCodeCamp: ["Python", "Java", "C++"],
  MIT: ["Python"],
};

export function videoLanguages(v: YouTubeRef): Language[] {
  return CHANNEL_LANGUAGES[v.channel] ?? [];
}

/**
 * Additional creator walkthroughs and credible external resources per pattern.
 * Verified against each creator's own channel — links stay inside the app via
 * the inline embed player (videos) or open in a new tab (articles/visualizers).
 */
const EXTRAS: Record<string, { extraVideos?: YouTubeRef[]; resources?: Resource[] }> = {
  "two-pointers": {
    extraVideos: [
      { kind: "video", id: "On03HWe2tZM", channel: "NeetCode", title: "NeetCode — Two Sum II (Two Pointers)" },
      { kind: "playlist", id: "PLot-Xpze53leF0FeHz2X0aG3zd0mr1AW_", channel: "NeetCode", title: "NeetCode — Two Pointers playlist" },
    ],
    resources: [
      { label: "Two Pointers Technique", url: "https://www.geeksforgeeks.org/two-pointers-technique/", kind: "article", source: "GeeksforGeeks" },
      { label: "Two Pointers pattern guide", url: "https://leetcode.com/discuss/study-guide/1688903/Solved-all-two-pointers-problems-in-100-days", kind: "cheatsheet", source: "LeetCode discuss" },
    ],
  },
  kadane: {
    extraVideos: [
      { kind: "video", id: "5WZl3MMT0Eg", channel: "NeetCode", title: "NeetCode — Maximum Subarray (Kadane)" },
      { kind: "video", id: "AHZpyENo7k4", channel: "TusharRoy", title: "Tushar Roy — Kadane's Algorithm" },
    ],
    resources: [
      { label: "Kadane's Algorithm", url: "https://cp-algorithms.com/others/maximum_average_segment.html", kind: "article", source: "CP-Algorithms" },
      { label: "Largest Sum Contiguous Subarray", url: "https://www.geeksforgeeks.org/largest-sum-contiguous-subarray/", kind: "article", source: "GeeksforGeeks" },
    ],
  },
  "prefix-sum": {
    extraVideos: [
      { kind: "video", id: "fFVZt-6sgyo", channel: "NeetCode", title: "NeetCode — Subarray Sum Equals K" },
    ],
    resources: [
      { label: "Prefix Sum Array", url: "https://www.geeksforgeeks.org/prefix-sum-array-implementation-applications-competitive-programming/", kind: "article", source: "GeeksforGeeks" },
      { label: "USACO Guide — Prefix Sums", url: "https://usaco.guide/silver/prefix-sums", kind: "article", source: "USACO Guide" },
    ],
  },
  "sliding-window": {
    extraVideos: [
      { kind: "playlist", id: "PLot-Xpze53ldVwtstag2TL4HQhAnC8ATf", channel: "NeetCode", title: "NeetCode — Sliding Window playlist" },
      { kind: "video", id: "MK-NZ4hN7rs", channel: "Striver", title: "Striver — Sliding Window & Two Pointer Concept" },
    ],
    resources: [
      { label: "Sliding Window Technique", url: "https://www.geeksforgeeks.org/window-sliding-technique/", kind: "article", source: "GeeksforGeeks" },
      { label: "Sliding Window master template", url: "https://leetcode.com/discuss/study-guide/657507/Sliding-Window-for-Beginners-Problems-or-Template-or-Sample-Solutions", kind: "cheatsheet", source: "LeetCode discuss" },
    ],
  },
  "hashmap-frequency": {
    extraVideos: [
      { kind: "playlist", id: "PLot-Xpze53lfxD6l5pAGvCD4nPvWKU8Qo", channel: "NeetCode", title: "NeetCode — Arrays & Hashing playlist" },
    ],
    resources: [
      { label: "Hashing Data Structure", url: "https://www.geeksforgeeks.org/hashing-data-structure/", kind: "article", source: "GeeksforGeeks" },
      { label: "CP-Algorithms — Hashing", url: "https://cp-algorithms.com/string/string-hashing.html", kind: "article", source: "CP-Algorithms" },
    ],
  },
  "monotonic-stack": {
    extraVideos: [
      { kind: "playlist", id: "PLot-Xpze53leOBgcVsJBEGrHPd_7x_koV", channel: "NeetCode", title: "NeetCode — Stack playlist" },
      { kind: "video", id: "68a1Dc_qVq4", channel: "NeetCode", title: "NeetCode — Daily Temperatures (Monotonic Stack)" },
    ],
    resources: [
      { label: "Monotonic Stack template & problems", url: "https://leetcode.com/discuss/study-guide/2347639/A-comprehensive-guide-and-template-for-monotonic-stack-based-problems", kind: "cheatsheet", source: "LeetCode discuss" },
      { label: "Next Greater Element", url: "https://www.geeksforgeeks.org/next-greater-element/", kind: "article", source: "GeeksforGeeks" },
    ],
  },
  "fast-slow": {
    extraVideos: [
      { kind: "playlist", id: "PLot-Xpze53ldBT_7QA8NVot7wjsuAHGq3", channel: "NeetCode", title: "NeetCode — Linked List playlist" },
      { kind: "video", id: "gBTe7lFR3vc", channel: "NeetCode", title: "NeetCode — Linked List Cycle (Floyd's)" },
    ],
    resources: [
      { label: "Floyd's Cycle Detection", url: "https://www.geeksforgeeks.org/detect-loop-in-a-linked-list/", kind: "article", source: "GeeksforGeeks" },
      { label: "Cycle detection visualizer", url: "https://visualgo.net/en/list", kind: "visualizer", source: "VisuAlgo" },
    ],
  },
  "reverse-list": {
    extraVideos: [
      { kind: "video", id: "G0_I-ZF0S38", channel: "NeetCode", title: "NeetCode — Reverse Linked List" },
    ],
    resources: [
      { label: "Reverse a Linked List", url: "https://www.geeksforgeeks.org/reverse-a-linked-list/", kind: "article", source: "GeeksforGeeks" },
      { label: "Linked List visualizer", url: "https://visualgo.net/en/list", kind: "visualizer", source: "VisuAlgo" },
    ],
  },
  "tree-dfs": {
    extraVideos: [
      { kind: "playlist", id: "PLot-Xpze53leF-vjHe5DFvbmBj0rvXjXk", channel: "NeetCode", title: "NeetCode — Trees playlist" },
      { kind: "video", id: "hTM3phVI6YQ", channel: "NeetCode", title: "NeetCode — Maximum Depth of Binary Tree (DFS)" },
    ],
    resources: [
      { label: "Tree Traversals", url: "https://www.geeksforgeeks.org/tree-traversals-inorder-preorder-and-postorder/", kind: "article", source: "GeeksforGeeks" },
      { label: "Binary Tree visualizer", url: "https://visualgo.net/en/bst", kind: "visualizer", source: "VisuAlgo" },
    ],
  },
  "tree-bfs": {
    extraVideos: [
      { kind: "video", id: "6ZnyEApgFYg", channel: "NeetCode", title: "NeetCode — Binary Tree Level Order Traversal" },
    ],
    resources: [
      { label: "Level Order Traversal", url: "https://www.geeksforgeeks.org/level-order-tree-traversal/", kind: "article", source: "GeeksforGeeks" },
    ],
  },
  "graph-bfs-dfs": {
    extraVideos: [
      { kind: "playlist", id: "PLot-Xpze53leAtnwDp2K7SykFYWfaOZ_r", channel: "NeetCode", title: "NeetCode — Graphs playlist" },
      { kind: "playlist", id: "PLDV1Zeh2NRsDGO4--qE8yH72HFL1Km93P", channel: "WilliamFiset", title: "WilliamFiset — Graph Theory" },
    ],
    resources: [
      { label: "Graph Data Structure", url: "https://www.geeksforgeeks.org/graph-data-structure-and-algorithms/", kind: "article", source: "GeeksforGeeks" },
      { label: "CP-Algorithms — Graph traversal", url: "https://cp-algorithms.com/graph/breadth-first-search.html", kind: "article", source: "CP-Algorithms" },
      { label: "Graph visualizer", url: "https://visualgo.net/en/dfsbfs", kind: "visualizer", source: "VisuAlgo" },
    ],
  },
  "topo-sort": {
    extraVideos: [
      { kind: "video", id: "cIBFEhD77b4", channel: "WilliamFiset", title: "WilliamFiset — Topological Sort" },
      { kind: "video", id: "EgI5nU9etnU", channel: "NeetCode", title: "NeetCode — Course Schedule (Topo Sort)" },
    ],
    resources: [
      { label: "Topological Sorting", url: "https://www.geeksforgeeks.org/topological-sorting/", kind: "article", source: "GeeksforGeeks" },
      { label: "CP-Algorithms — Topological Sort", url: "https://cp-algorithms.com/graph/topological-sort.html", kind: "article", source: "CP-Algorithms" },
    ],
  },
  dijkstra: {
    extraVideos: [
      { kind: "video", id: "pSqmAO-m7Lk", channel: "WilliamFiset", title: "WilliamFiset — Dijkstra's Shortest Path" },
      { kind: "video", id: "EFg3u_E6eHU", channel: "NeetCode", title: "NeetCode — Network Delay Time (Dijkstra)" },
    ],
    resources: [
      { label: "Dijkstra's Algorithm", url: "https://cp-algorithms.com/graph/dijkstra.html", kind: "article", source: "CP-Algorithms" },
      { label: "Dijkstra visualizer", url: "https://visualgo.net/en/sssp", kind: "visualizer", source: "VisuAlgo" },
    ],
  },
  knapsack: {
    extraVideos: [
      { kind: "playlist", id: "PLot-Xpze53ldBT_7QA8NVot7wjsuAHGq3", channel: "NeetCode", title: "NeetCode — DP playlist" },
      { kind: "video", id: "8LusJS5-AGo", channel: "TusharRoy", title: "Tushar Roy — 0/1 Knapsack" },
    ],
    resources: [
      { label: "0/1 Knapsack Problem", url: "https://www.geeksforgeeks.org/0-1-knapsack-problem-dp-10/", kind: "article", source: "GeeksforGeeks" },
      { label: "CP-Algorithms — Knapsack", url: "https://cp-algorithms.com/dynamic_programming/knapsack.html", kind: "article", source: "CP-Algorithms" },
    ],
  },
  lis: {
    extraVideos: [
      { kind: "video", id: "cjWnW0hdF1Y", channel: "NeetCode", title: "NeetCode — Longest Increasing Subsequence" },
      { kind: "video", id: "S9oUiVYEq7E", channel: "TusharRoy", title: "Tushar Roy — Longest Increasing Subsequence O(n log n)" },
    ],
    resources: [
      { label: "Longest Increasing Subsequence", url: "https://cp-algorithms.com/sequences/longest_increasing_subsequence.html", kind: "article", source: "CP-Algorithms" },
      { label: "LIS with patience sorting", url: "https://www.geeksforgeeks.org/longest-increasing-subsequence-dp-3/", kind: "article", source: "GeeksforGeeks" },
    ],
  },
  mcm: {
    extraVideos: [
      { kind: "video", id: "prx1psByp7U", channel: "TusharRoy", title: "Tushar Roy — Matrix Chain Multiplication" },
    ],
    resources: [
      { label: "Matrix Chain Multiplication", url: "https://www.geeksforgeeks.org/matrix-chain-multiplication-dp-8/", kind: "article", source: "GeeksforGeeks" },
      { label: "Partition DP guide", url: "https://leetcode.com/discuss/study-guide/1490065/Interval-DP-Study-Guide", kind: "cheatsheet", source: "LeetCode discuss" },
    ],
  },
  backtracking: {
    extraVideos: [
      { kind: "playlist", id: "PLot-Xpze53lf5C3HSjCnyFghlW0G1HHXo", channel: "NeetCode", title: "NeetCode — Backtracking playlist" },
    ],
    resources: [
      { label: "Backtracking Algorithms", url: "https://www.geeksforgeeks.org/backtracking-algorithms/", kind: "article", source: "GeeksforGeeks" },
      { label: "Backtracking master template", url: "https://leetcode.com/discuss/study-guide/1405817/Backtracking-algorithm-%2B-problems-to-practice", kind: "cheatsheet", source: "LeetCode discuss" },
    ],
  },
  "binary-search": {
    extraVideos: [
      { kind: "playlist", id: "PLot-Xpze53lcvx_tjrr_m2lgD2NsRHlNO", channel: "NeetCode", title: "NeetCode — Binary Search playlist" },
    ],
    resources: [
      { label: "Binary Search", url: "https://cp-algorithms.com/num_methods/binary_search.html", kind: "article", source: "CP-Algorithms" },
      { label: "Binary Search 101", url: "https://leetcode.com/discuss/study-guide/786126/Python-Powerful-Ultimate-Binary-Search-Template.-Solved-many-problems", kind: "cheatsheet", source: "LeetCode discuss" },
    ],
  },
  "bs-on-answer": {
    extraVideos: [
      { kind: "video", id: "U-tKk6mFA1Y", channel: "NeetCode", title: "NeetCode — Koko Eating Bananas" },
    ],
    resources: [
      { label: "Binary Search on Answer", url: "https://usaco.guide/silver/binary-search", kind: "article", source: "USACO Guide" },
    ],
  },
  "bit-tricks": {
    extraVideos: [
      { kind: "playlist", id: "PLot-Xpze53lfQmTEztbgdp8ALEoydvnRQ", channel: "NeetCode", title: "NeetCode — Bit Manipulation playlist" },
      { kind: "video", id: "7jkIUgLC29I", channel: "Errichto", title: "Errichto — Bitwise operations (part 1)" },
    ],
    resources: [
      { label: "Bit Manipulation", url: "https://cp-algorithms.com/algebra/bit-manipulation.html", kind: "article", source: "CP-Algorithms" },
      { label: "Bit tricks for competitive programming", url: "https://www.geeksforgeeks.org/bits-manipulation-important-tactics/", kind: "article", source: "GeeksforGeeks" },
    ],
  },
  "number-theory-basics": {
    extraVideos: [
      { kind: "playlist", id: "PLu0W_9lII9agICnT8t4iYVSZ3eykIAOME", channel: "Kunal", title: "Kunal Kushwaha — DSA Bootcamp (Maths & Number Theory)" },
      { kind: "video", id: "5LMkddl2NCk", channel: "AbdulBari", title: "Abdul Bari — Euclid's GCD Algorithm" },
    ],
    resources: [
      { label: "TCS NQT Coding Questions", url: "https://www.geeksforgeeks.org/tcs-nqt-coding-sheet/", kind: "cheatsheet", source: "GeeksforGeeks" },
      { label: "Sieve of Eratosthenes", url: "https://cp-algorithms.com/algebra/sieve-of-eratosthenes.html", kind: "article", source: "CP-Algorithms" },
      { label: "Number Theory for OA", url: "https://www.geeksforgeeks.org/number-theory-competitive-programming/", kind: "article", source: "GeeksforGeeks" },
    ],
  },
  "pattern-printing": {
    extraVideos: [
      { kind: "playlist", id: "PLDzeHZWIZsTryvtXdMr6rPh4IDexB5NIA", channel: "ApnaCollege", title: "Apna College — Star Pattern Programs (Java)" },
    ],
    resources: [
      { label: "Programs for printing pyramid patterns", url: "https://www.geeksforgeeks.org/programs-printing-pyramid-patterns-python/", kind: "article", source: "GeeksforGeeks" },
      { label: "TCS NQT Pattern Questions", url: "https://www.geeksforgeeks.org/tcs-coding-questions-nqt/", kind: "cheatsheet", source: "GeeksforGeeks" },
      { label: "Wipro NLTH previous questions", url: "https://www.geeksforgeeks.org/wipro-nlth-previous-year-coding-questions/", kind: "cheatsheet", source: "GeeksforGeeks" },
    ],
  },
  "string-basics": {
    extraVideos: [
      { kind: "playlist", id: "PLot-Xpze53lfxD6l5pAGvCD4nPvWKU8Qo", channel: "NeetCode", title: "NeetCode — Arrays & Hashing (string subset)" },
      { kind: "playlist", id: "PLu0W_9lII9agsLYolh1Jjmrl5RhBz1yTa", channel: "Kunal", title: "Kunal Kushwaha — Strings deep-dive" },
    ],
    resources: [
      { label: "HackwithInfy previous questions", url: "https://www.geeksforgeeks.org/infosys-hackwithinfy-coding-questions/", kind: "cheatsheet", source: "GeeksforGeeks" },
      { label: "Deloitte interview experience", url: "https://www.geeksforgeeks.org/deloitte-interview-experience/", kind: "article", source: "GeeksforGeeks" },
      { label: "String algorithms reference", url: "https://cp-algorithms.com/string/basic_string_processing.html", kind: "article", source: "CP-Algorithms" },
    ],
  },
  "matrix-basics": {
    extraVideos: [
      { kind: "video", id: "SA867FvqHrM", channel: "NeetCode", title: "NeetCode — Rotate Image" },
      { kind: "video", id: "BJnMZNwUk1M", channel: "NeetCode", title: "NeetCode — Spiral Matrix" },
    ],
    resources: [
      { label: "EPAM interview questions", url: "https://www.geeksforgeeks.org/epam-systems-interview-experience/", kind: "article", source: "GeeksforGeeks" },
      { label: "Accenture coding questions", url: "https://www.geeksforgeeks.org/accenture-coding-questions/", kind: "cheatsheet", source: "GeeksforGeeks" },
      { label: "Matrix problems (top 20)", url: "https://www.geeksforgeeks.org/top-20-interview-questions-on-matrix/", kind: "cheatsheet", source: "GeeksforGeeks" },
    ],
  },
  "recursion-basics": {
    extraVideos: [
      { kind: "playlist", id: "PLot-Xpze53lf5C3HSjCnyFghlW0G1HHXo", channel: "NeetCode", title: "NeetCode — Backtracking (recursion foundation)" },
      { kind: "playlist", id: "PLu0W_9lII9ahIappRPN0MCAgtOu3lQjQi", channel: "Kunal", title: "Kunal Kushwaha — Recursion series" },
    ],
    resources: [
      { label: "HackwithInfy sample problems", url: "https://www.geeksforgeeks.org/infosys-hackwithinfy-coding-questions/", kind: "cheatsheet", source: "GeeksforGeeks" },
      { label: "TCS CodeVita question bank", url: "https://www.geeksforgeeks.org/tcs-codevita-questions/", kind: "cheatsheet", source: "GeeksforGeeks" },
      { label: "Recursion — a way of thinking", url: "https://leetcode.com/discuss/study-guide/1733447/Become-Master-In-Recursion", kind: "cheatsheet", source: "LeetCode discuss" },
    ],
  },
};

// CodeHelp (Love Babbar) — verified playlists from the CodeHelp YouTube channel.
// Mapped to whichever playlist he treats as canonical for that pattern.
const CODEHELP: Record<string, YouTubeRef> = {
  "two-pointers":        { kind: "playlist", id: "PLDzeHZWIZsTryvtXdMr6rPh4IDexB5NIA", channel: "CodeHelp", title: "CodeHelp — Complete C++ Placement DSA (Arrays)" },
  kadane:                { kind: "playlist", id: "PLDzeHZWIZsTryvtXdMr6rPh4IDexB5NIA", channel: "CodeHelp", title: "CodeHelp — Complete C++ Placement DSA (Arrays / Kadane)" },
  "prefix-sum":          { kind: "playlist", id: "PLDzeHZWIZsTryvtXdMr6rPh4IDexB5NIA", channel: "CodeHelp", title: "CodeHelp — Complete C++ Placement DSA (Prefix Sum)" },
  "sliding-window":      { kind: "playlist", id: "PLDzeHZWIZsTryvtXdMr6rPh4IDexB5NIA", channel: "CodeHelp", title: "CodeHelp — Complete C++ Placement DSA (Sliding Window)" },
  "hashmap-frequency":   { kind: "playlist", id: "PLDzeHZWIZsTryvtXdMr6rPh4IDexB5NIA", channel: "CodeHelp", title: "CodeHelp — Complete C++ Placement DSA (Hashing)" },
  "monotonic-stack":     { kind: "playlist", id: "PLDzeHZWIZsTrhXYYtx4z8-u8zA-DzuVsj", channel: "CodeHelp", title: "CodeHelp — Stack & Queue by Love Babbar" },
  "fast-slow":           { kind: "playlist", id: "PLDzeHZWIZsTr54_TH_NK4ibFojS4mmQA6", channel: "CodeHelp", title: "CodeHelp — Linked List by Love Babbar" },
  "reverse-list":        { kind: "playlist", id: "PLDzeHZWIZsTr54_TH_NK4ibFojS4mmQA6", channel: "CodeHelp", title: "CodeHelp — Linked List by Love Babbar" },
  "tree-dfs":            { kind: "playlist", id: "PLDzeHZWIZsTo87y1ytEAqp7wYlEP3nner", channel: "CodeHelp", title: "CodeHelp — Binary Trees by Love Babbar" },
  "tree-bfs":            { kind: "playlist", id: "PLDzeHZWIZsTo87y1ytEAqp7wYlEP3nner", channel: "CodeHelp", title: "CodeHelp — Binary Trees by Love Babbar" },
  "graph-bfs-dfs":       { kind: "playlist", id: "PLDzeHZWIZsTobi35C3I-tKB3tRDX6YxuA", channel: "CodeHelp", title: "CodeHelp — Graph Series by Love Babbar" },
  "topo-sort":           { kind: "playlist", id: "PLDzeHZWIZsTobi35C3I-tKB3tRDX6YxuA", channel: "CodeHelp", title: "CodeHelp — Graph Series by Love Babbar" },
  dijkstra:              { kind: "playlist", id: "PLDzeHZWIZsTobi35C3I-tKB3tRDX6YxuA", channel: "CodeHelp", title: "CodeHelp — Graph Series (Dijkstra)" },
  knapsack:              { kind: "playlist", id: "PLDzeHZWIZsTomOPnCiU3J95WufjE36wsb", channel: "CodeHelp", title: "CodeHelp — DP Series by Babbar" },
  lis:                   { kind: "playlist", id: "PLDzeHZWIZsTomOPnCiU3J95WufjE36wsb", channel: "CodeHelp", title: "CodeHelp — DP Series (LIS)" },
  mcm:                   { kind: "playlist", id: "PLDzeHZWIZsTomOPnCiU3J95WufjE36wsb", channel: "CodeHelp", title: "CodeHelp — DP Series (MCM / Partition DP)" },
  backtracking:          { kind: "playlist", id: "PLDzeHZWIZsTq8KwpV5ipe5-ncApOTEL9k", channel: "CodeHelp", title: "CodeHelp — Backtracking by Love Babbar" },
  "binary-search":       { kind: "playlist", id: "PLDzeHZWIZsTp4pb_WBRahP1tnipLuX9qM", channel: "CodeHelp", title: "CodeHelp — Searching & Sorting by Love Babbar" },
  "bs-on-answer":        { kind: "playlist", id: "PLDzeHZWIZsTp4pb_WBRahP1tnipLuX9qM", channel: "CodeHelp", title: "CodeHelp — Searching & Sorting (BS on Answer)" },
  "bit-tricks":          { kind: "playlist", id: "PLDzeHZWIZsTryvtXdMr6rPh4IDexB5NIA", channel: "CodeHelp", title: "CodeHelp — Complete C++ Placement DSA (Bit Manipulation)" },
  "number-theory-basics":{ kind: "playlist", id: "PLDzeHZWIZsTryvtXdMr6rPh4IDexB5NIA", channel: "CodeHelp", title: "CodeHelp — Complete C++ Placement DSA (Maths)" },
  "pattern-printing":    { kind: "playlist", id: "PLDzeHZWIZsTryvtXdMr6rPh4IDexB5NIA", channel: "CodeHelp", title: "CodeHelp — Complete C++ Placement DSA (Patterns)" },
  "string-basics":       { kind: "playlist", id: "PLDzeHZWIZsTryvtXdMr6rPh4IDexB5NIA", channel: "CodeHelp", title: "CodeHelp — Complete C++ Placement DSA (Strings)" },
  "matrix-basics":       { kind: "playlist", id: "PLDzeHZWIZsTryvtXdMr6rPh4IDexB5NIA", channel: "CodeHelp", title: "CodeHelp — Complete C++ Placement DSA (2-D Arrays)" },
  "recursion-basics":    { kind: "playlist", id: "PLDzeHZWIZsTqBmRGnsCOGNDG5FY0G04Td", channel: "CodeHelp", title: "CodeHelp — Recursion Series by Love Babbar" },
};

// Merge extras onto every pattern (kept side-by-side so the base list above stays readable)
for (const p of PATTERNS) {
  const extra = EXTRAS[p.id];
  const codehelp = CODEHELP[p.id];
  const extraVideos: YouTubeRef[] = [];
  if (extra?.extraVideos) extraVideos.push(...extra.extraVideos);
  if (codehelp) extraVideos.push(codehelp);
  if (extraVideos.length) p.extraVideos = extraVideos;
  if (extra?.resources) p.resources = extra.resources;
}

export const PATTERNS_BY_ID: Record<string, Pattern> = Object.fromEntries(PATTERNS.map((p) => [p.id, p]));
export const TOPICS_BY_ID: Record<string, Topic> = Object.fromEntries(TOPICS.map((t) => [t.id, t]));

export const ALL_PROBLEM_SLUGS: string[] = Array.from(
  new Set(PATTERNS.flatMap((p) => p.problems.map((q) => q.slug))),
);

