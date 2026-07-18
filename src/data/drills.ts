// Fill-in-the-blanks recall drills. `template` splits on {{blankId}} tokens;
// the client renders inputs in their place. Answers are validated client-side
// with case-insensitive trim + optional `accepts` aliases.

export type Blank = {
  id: string;
  answer: string;
  accepts?: string[];
  hint?: string;
  width?: number; // chars
};

export type DrillLanguage = "C++" | "Java" | "Python";

export type DrillSnippet = {
  language: DrillLanguage;
  template: string;
  blanks: Blank[];
};

export type Drill = {
  id: string;
  title: string;
  snippets: DrillSnippet[];
};

const b = (id: string, answer: string, accepts?: string[], width?: number): Blank => ({
  id,
  answer,
  accepts,
  width,
});

// Sliding window: max sum of size k
const slidingWindowDrill: Drill = {
  id: "max-sum-size-k",
  title: "Max sum of a sub-array of size k",
  snippets: [
    {
      language: "C++",
      template: `int sum = 0, best = 0;
for (int i = 0; i < k; i++) sum += arr[i];
best = sum;
for (int i = k; i < (int)arr.{{a}}; i++) {
  sum += arr[i] {{b}} arr[i - k];
  best = {{c}}(best, sum);
}
return best;`,
      blanks: [b("a", "size()", ["size"], 8), b("b", "-", undefined, 3), b("c", "max", undefined, 5)],
    },
    {
      language: "Java",
      template: `int sum = 0, best = 0;
for (int i = 0; i < k; i++) sum += arr[i];
best = sum;
for (int i = k; i < arr.{{a}}; i++) {
  sum += arr[i] {{b}} arr[i - k];
  best = Math.{{c}}(best, sum);
}
return best;`,
      blanks: [b("a", "length", undefined, 8), b("b", "-", undefined, 3), b("c", "max", undefined, 5)],
    },
    {
      language: "Python",
      template: `s = sum(arr[:k])
best = s
for i in range({{a}}, len(arr)):
    s += arr[i] {{b}} arr[i - k]
    best = {{c}}(best, s)
return best`,
      blanks: [b("a", "k", undefined, 3), b("b", "-", undefined, 3), b("c", "max", undefined, 5)],
    },
  ],
};

// Two pointers: pair sum in sorted array
const twoPointersDrill: Drill = {
  id: "pair-sum-sorted",
  title: "Pair with target sum in a sorted array",
  snippets: [
    {
      language: "C++",
      template: `int l = 0, r = arr.size() - 1;
while (l {{a}} r) {
  int s = arr[l] + arr[r];
  if (s == target) return {true, l, r};
  if (s {{b}} target) l++;
  else {{c}};
}
return {false, -1, -1};`,
      blanks: [b("a", "<"), b("b", "<"), b("c", "r--", ["--r"])],
    },
    {
      language: "Java",
      template: `int l = 0, r = arr.length - 1;
while (l {{a}} r) {
  int s = arr[l] + arr[r];
  if (s == target) return new int[]{l, r};
  if (s {{b}} target) l++;
  else {{c}};
}
return new int[]{-1, -1};`,
      blanks: [b("a", "<"), b("b", "<"), b("c", "r--", ["--r"])],
    },
    {
      language: "Python",
      template: `l, r = 0, len(arr) - 1
while l {{a}} r:
    s = arr[l] + arr[r]
    if s == target: return (l, r)
    if s {{b}} target: l += 1
    else: r {{c}} 1`,
      blanks: [b("a", "<"), b("b", "<"), b("c", "-=")],
    },
  ],
};

// Kadane
const kadaneDrill: Drill = {
  id: "kadane-max-subarray",
  title: "Maximum sub-array sum (Kadane)",
  snippets: [
    {
      language: "C++",
      template: `int cur = arr[0], best = arr[0];
for (int i = 1; i < (int)arr.size(); i++) {
  cur = {{a}}(arr[i], cur + arr[i]);
  best = {{b}}(best, cur);
}
return {{c}};`,
      blanks: [b("a", "max"), b("b", "max"), b("c", "best")],
    },
    {
      language: "Java",
      template: `int cur = arr[0], best = arr[0];
for (int i = 1; i < arr.length; i++) {
  cur = Math.{{a}}(arr[i], cur + arr[i]);
  best = Math.{{b}}(best, cur);
}
return {{c}};`,
      blanks: [b("a", "max"), b("b", "max"), b("c", "best")],
    },
    {
      language: "Python",
      template: `cur = best = arr[0]
for i in range(1, len(arr)):
    cur = {{a}}(arr[i], cur + arr[i])
    best = {{b}}(best, cur)
return {{c}}`,
      blanks: [b("a", "max"), b("b", "max"), b("c", "best")],
    },
  ],
};

// Binary search classic
const binarySearchDrill: Drill = {
  id: "classic-binary-search",
  title: "Classic binary search on a sorted array",
  snippets: [
    {
      language: "C++",
      template: `int l = 0, r = (int)arr.size() - 1;
while (l {{a}} r) {
  int m = l + (r - l) / {{b}};
  if (arr[m] == target) return m;
  if (arr[m] < target) l = m + 1;
  else r = m {{c}} 1;
}
return -1;`,
      blanks: [b("a", "<="), b("b", "2"), b("c", "-")],
    },
    {
      language: "Java",
      template: `int l = 0, r = arr.length - 1;
while (l {{a}} r) {
  int m = l + (r - l) / {{b}};
  if (arr[m] == target) return m;
  if (arr[m] < target) l = m + 1;
  else r = m {{c}} 1;
}
return -1;`,
      blanks: [b("a", "<="), b("b", "2"), b("c", "-")],
    },
    {
      language: "Python",
      template: `l, r = 0, len(arr) - 1
while l {{a}} r:
    m = (l + r) // {{b}}
    if arr[m] == target: return m
    if arr[m] < target: l = m + 1
    else: r = m {{c}} 1`,
      blanks: [b("a", "<="), b("b", "2"), b("c", "-")],
    },
  ],
};

// BFS
const bfsDrill: Drill = {
  id: "graph-bfs",
  title: "Graph BFS from a source node",
  snippets: [
    {
      language: "C++",
      template: `queue<int> q;
q.push(src);
visited[src] = true;
while (!q.{{a}}()) {
  int u = q.front(); q.{{b}}();
  for (int v : adj[u]) if (!visited[v]) {
    visited[v] = true;
    q.{{c}}(v);
  }
}`,
      blanks: [b("a", "empty"), b("b", "pop"), b("c", "push")],
    },
    {
      language: "Java",
      template: `Queue<Integer> q = new ArrayDeque<>();
q.offer(src);
visited[src] = true;
while (!q.{{a}}()) {
  int u = q.{{b}}();
  for (int v : adj.get(u)) if (!visited[v]) {
    visited[v] = true;
    q.{{c}}(v);
  }
}`,
      blanks: [b("a", "isEmpty"), b("b", "poll"), b("c", "offer", ["add"])],
    },
    {
      language: "Python",
      template: `from collections import deque
q = deque([src])
visited[src] = True
while q:
    u = q.{{a}}()
    for v in adj[u]:
        if not visited[v]:
            visited[v] = True
            q.{{b}}(v)`,
      blanks: [b("a", "popleft"), b("b", "append")],
    },
  ],
};

// DFS recursive
const dfsDrill: Drill = {
  id: "graph-dfs-recursive",
  title: "Recursive DFS on a graph",
  snippets: [
    {
      language: "C++",
      template: `void dfs(int u) {
  visited[u] = {{a}};
  for (int v : adj[u]) {
    if (!visited[v]) {{b}}(v);
  }
}`,
      blanks: [b("a", "true"), b("b", "dfs")],
    },
    {
      language: "Java",
      template: `void dfs(int u) {
  visited[u] = {{a}};
  for (int v : adj.get(u)) {
    if (!visited[v]) {{b}}(v);
  }
}`,
      blanks: [b("a", "true"), b("b", "dfs")],
    },
    {
      language: "Python",
      template: `def dfs(u):
    visited[u] = {{a}}
    for v in adj[u]:
        if not visited[v]:
            {{b}}(v)`,
      blanks: [b("a", "True"), b("b", "dfs")],
    },
  ],
};

// Fast & slow (cycle)
const fastSlowDrill: Drill = {
  id: "linked-list-cycle",
  title: "Detect cycle in a linked list (Floyd)",
  snippets: [
    {
      language: "C++",
      template: `ListNode *slow = head, *fast = head;
while (fast && fast->{{a}}) {
  slow = slow->next;
  fast = fast->next->{{b}};
  if (slow == fast) return {{c}};
}
return false;`,
      blanks: [b("a", "next"), b("b", "next"), b("c", "true")],
    },
    {
      language: "Java",
      template: `ListNode slow = head, fast = head;
while (fast != null && fast.{{a}} != null) {
  slow = slow.next;
  fast = fast.next.{{b}};
  if (slow == fast) return {{c}};
}
return false;`,
      blanks: [b("a", "next"), b("b", "next"), b("c", "true")],
    },
    {
      language: "Python",
      template: `slow = fast = head
while fast and fast.{{a}}:
    slow = slow.next
    fast = fast.next.{{b}}
    if slow is fast: return {{c}}
return False`,
      blanks: [b("a", "next"), b("b", "next"), b("c", "True")],
    },
  ],
};

// DP 1-D — climbing stairs / fib
const dp1dDrill: Drill = {
  id: "climb-stairs",
  title: "Climbing stairs (1-D DP)",
  snippets: [
    {
      language: "C++",
      template: `if (n <= 2) return n;
int a = 1, b = 2;
for (int i = 3; i {{a}} n; i++) {
  int c = a + {{b}};
  a = b;
  b = {{c}};
}
return b;`,
      blanks: [b("a", "<="), b("b", "b"), b("c", "c")],
    },
    {
      language: "Java",
      template: `if (n <= 2) return n;
int a = 1, b = 2;
for (int i = 3; i {{a}} n; i++) {
  int c = a + {{b}};
  a = b;
  b = {{c}};
}
return b;`,
      blanks: [b("a", "<="), b("b", "b"), b("c", "c")],
    },
    {
      language: "Python",
      template: `if n <= 2: return n
a, b = 1, 2
for i in range(3, n + 1):
    a, b = {{a}}, a + {{b}}
return {{c}}`,
      blanks: [b("a", "b"), b("b", "b"), b("c", "b")],
    },
  ],
};

// Prefix sum — range sum queries
const prefixSumDrill: Drill = {
  id: "prefix-sum-range",
  title: "Range sum using prefix array",
  snippets: [
    {
      language: "C++",
      template: `vector<int> pre(n + 1, 0);
for (int i = 0; i < n; i++) pre[i + 1] = pre[i] {{a}} arr[i];
// sum of arr[l..r] inclusive:
int ans = pre[r + 1] {{b}} pre[{{c}}];`,
      blanks: [b("a", "+"), b("b", "-"), b("c", "l")],
    },
    {
      language: "Java",
      template: `int[] pre = new int[n + 1];
for (int i = 0; i < n; i++) pre[i + 1] = pre[i] {{a}} arr[i];
int ans = pre[r + 1] {{b}} pre[{{c}}];`,
      blanks: [b("a", "+"), b("b", "-"), b("c", "l")],
    },
    {
      language: "Python",
      template: `pre = [0] * (n + 1)
for i in range(n):
    pre[i + 1] = pre[i] {{a}} arr[i]
ans = pre[r + 1] {{b}} pre[{{c}}]`,
      blanks: [b("a", "+"), b("b", "-"), b("c", "l")],
    },
  ],
};

// Hashmap frequency
const hashmapFreqDrill: Drill = {
  id: "hashmap-frequency",
  title: "Count element frequency with a hash map",
  snippets: [
    {
      language: "C++",
      template: `unordered_map<int,int> freq;
for (int x : arr) freq[x]{{a}};
int best = 0, mode = 0;
for (auto& [k, v] : freq) if (v {{b}} best) { best = v; mode = k; }
return {{c}};`,
      blanks: [b("a", "++"), b("b", ">"), b("c", "mode")],
    },
    {
      language: "Java",
      template: `Map<Integer,Integer> freq = new HashMap<>();
for (int x : arr) freq.merge(x, 1, Integer::{{a}});
int best = 0, mode = 0;
for (var e : freq.entrySet()) if (e.getValue() {{b}} best) { best = e.getValue(); mode = e.getKey(); }
return {{c}};`,
      blanks: [b("a", "sum"), b("b", ">"), b("c", "mode")],
    },
    {
      language: "Python",
      template: `freq = {}
for x in arr:
    freq[x] = freq.{{a}}(x, 0) + 1
mode = max(freq, key=freq.{{b}})
return {{c}}`,
      blanks: [b("a", "get"), b("b", "get"), b("c", "mode")],
    },
  ],
};

// Monotonic stack — next greater element
const monotonicStackDrill: Drill = {
  id: "next-greater-element",
  title: "Next greater element (monotonic stack)",
  snippets: [
    {
      language: "C++",
      template: `stack<int> st;
vector<int> ans(n, -1);
for (int i = 0; i < n; i++) {
  while (!st.empty() && arr[st.top()] {{a}} arr[i]) {
    ans[st.top()] = arr[i];
    st.{{b}}();
  }
  st.{{c}}(i);
}`,
      blanks: [b("a", "<"), b("b", "pop"), b("c", "push")],
    },
    {
      language: "Java",
      template: `Deque<Integer> st = new ArrayDeque<>();
int[] ans = new int[n];
Arrays.fill(ans, -1);
for (int i = 0; i < n; i++) {
  while (!st.isEmpty() && arr[st.peek()] {{a}} arr[i]) {
    ans[st.{{b}}()] = arr[i];
  }
  st.{{c}}(i);
}`,
      blanks: [b("a", "<"), b("b", "pop"), b("c", "push")],
    },
    {
      language: "Python",
      template: `st = []
ans = [-1] * n
for i in range(n):
    while st and arr[st[-1]] {{a}} arr[i]:
        ans[st.{{b}}()] = arr[i]
    st.{{c}}(i)`,
      blanks: [b("a", "<"), b("b", "pop"), b("c", "append")],
    },
  ],
};

// Reverse linked list
const reverseListDrill: Drill = {
  id: "reverse-linked-list",
  title: "Reverse a singly linked list (iterative)",
  snippets: [
    {
      language: "C++",
      template: `ListNode* prev = nullptr, *cur = head;
while (cur) {
  ListNode* nxt = cur->{{a}};
  cur->next = {{b}};
  prev = cur;
  cur = {{c}};
}
return prev;`,
      blanks: [b("a", "next"), b("b", "prev"), b("c", "nxt", ["next"])],
    },
    {
      language: "Java",
      template: `ListNode prev = null, cur = head;
while (cur != null) {
  ListNode nxt = cur.{{a}};
  cur.next = {{b}};
  prev = cur;
  cur = {{c}};
}
return prev;`,
      blanks: [b("a", "next"), b("b", "prev"), b("c", "nxt", ["next"])],
    },
    {
      language: "Python",
      template: `prev, cur = None, head
while cur:
    nxt = cur.{{a}}
    cur.next = {{b}}
    prev = cur
    cur = {{c}}
return prev`,
      blanks: [b("a", "next"), b("b", "prev"), b("c", "nxt", ["next"])],
    },
  ],
};

// Tree DFS (in-order)
const treeDfsDrill: Drill = {
  id: "tree-inorder-dfs",
  title: "Binary tree in-order DFS",
  snippets: [
    {
      language: "C++",
      template: `void dfs(TreeNode* root) {
  if (!root) return;
  dfs(root->{{a}});
  out.push_back(root->val);
  dfs(root->{{b}});
}`,
      blanks: [b("a", "left"), b("b", "right")],
    },
    {
      language: "Java",
      template: `void dfs(TreeNode root) {
  if (root == null) return;
  dfs(root.{{a}});
  out.add(root.val);
  dfs(root.{{b}});
}`,
      blanks: [b("a", "left"), b("b", "right")],
    },
    {
      language: "Python",
      template: `def dfs(root):
    if not root: return
    dfs(root.{{a}})
    out.append(root.val)
    dfs(root.{{b}})`,
      blanks: [b("a", "left"), b("b", "right")],
    },
  ],
};

// Tree BFS (level order)
const treeBfsDrill: Drill = {
  id: "tree-level-order",
  title: "Binary tree level-order traversal",
  snippets: [
    {
      language: "C++",
      template: `queue<TreeNode*> q;
if (root) q.push(root);
while (!q.empty()) {
  TreeNode* n = q.front(); q.{{a}}();
  out.push_back(n->val);
  if (n->left)  q.{{b}}(n->left);
  if (n->{{c}}) q.push(n->right);
}`,
      blanks: [b("a", "pop"), b("b", "push"), b("c", "right")],
    },
    {
      language: "Java",
      template: `Queue<TreeNode> q = new ArrayDeque<>();
if (root != null) q.offer(root);
while (!q.isEmpty()) {
  TreeNode n = q.{{a}}();
  out.add(n.val);
  if (n.left != null)  q.{{b}}(n.left);
  if (n.{{c}} != null) q.offer(n.right);
}`,
      blanks: [b("a", "poll"), b("b", "offer", ["add"]), b("c", "right")],
    },
    {
      language: "Python",
      template: `from collections import deque
q = deque([root]) if root else deque()
while q:
    n = q.{{a}}()
    out.append(n.val)
    if n.left:  q.{{b}}(n.left)
    if n.{{c}}: q.append(n.right)`,
      blanks: [b("a", "popleft"), b("b", "append"), b("c", "right")],
    },
  ],
};

// Topological sort (Kahn's)
const topoSortDrill: Drill = {
  id: "kahn-topo-sort",
  title: "Topological sort (Kahn's BFS)",
  snippets: [
    {
      language: "C++",
      template: `vector<int> indeg(n, 0);
for (auto& e : edges) indeg[e[1]]{{a}};
queue<int> q;
for (int i = 0; i < n; i++) if (indeg[i] == {{b}}) q.push(i);
vector<int> order;
while (!q.empty()) {
  int u = q.front(); q.pop();
  order.push_back(u);
  for (int v : adj[u]) if (--indeg[v] == {{c}}) q.push(v);
}`,
      blanks: [b("a", "++"), b("b", "0"), b("c", "0")],
    },
    {
      language: "Java",
      template: `int[] indeg = new int[n];
for (int[] e : edges) indeg[e[1]]{{a}};
Deque<Integer> q = new ArrayDeque<>();
for (int i = 0; i < n; i++) if (indeg[i] == {{b}}) q.offer(i);
List<Integer> order = new ArrayList<>();
while (!q.isEmpty()) {
  int u = q.poll();
  order.add(u);
  for (int v : adj.get(u)) if (--indeg[v] == {{c}}) q.offer(v);
}`,
      blanks: [b("a", "++"), b("b", "0"), b("c", "0")],
    },
    {
      language: "Python",
      template: `from collections import deque
indeg = [0] * n
for u, v in edges: indeg[v] {{a}} 1
q = deque(i for i in range(n) if indeg[i] == {{b}})
order = []
while q:
    u = q.popleft()
    order.append(u)
    for v in adj[u]:
        indeg[v] -= 1
        if indeg[v] == {{c}}: q.append(v)`,
      blanks: [b("a", "+="), b("b", "0"), b("c", "0")],
    },
  ],
};

// Dijkstra
const dijkstraDrill: Drill = {
  id: "dijkstra-shortest",
  title: "Dijkstra shortest path (min-heap)",
  snippets: [
    {
      language: "C++",
      template: `vector<int> dist(n, INT_MAX);
dist[src] = 0;
priority_queue<pair<int,int>, vector<pair<int,int>>, greater<>> pq;
pq.push({0, src});
while (!pq.empty()) {
  auto [d, u] = pq.{{a}}(); pq.pop();
  if (d > dist[u]) continue;
  for (auto& [v, w] : adj[u]) {
    if (d + w {{b}} dist[v]) {
      dist[v] = d + w;
      pq.push({dist[v], {{c}}});
    }
  }
}`,
      blanks: [b("a", "top"), b("b", "<"), b("c", "v")],
    },
    {
      language: "Java",
      template: `int[] dist = new int[n];
Arrays.fill(dist, Integer.MAX_VALUE);
dist[src] = 0;
PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[0] - b[0]);
pq.offer(new int[]{0, src});
while (!pq.isEmpty()) {
  int[] cur = pq.{{a}}();
  int d = cur[0], u = cur[1];
  if (d > dist[u]) continue;
  for (int[] e : adj.get(u)) {
    int v = e[0], w = e[1];
    if (d + w {{b}} dist[v]) {
      dist[v] = d + w;
      pq.offer(new int[]{dist[v], {{c}}});
    }
  }
}`,
      blanks: [b("a", "poll"), b("b", "<"), b("c", "v")],
    },
    {
      language: "Python",
      template: `import heapq
dist = [float('inf')] * n
dist[src] = 0
pq = [(0, src)]
while pq:
    d, u = heapq.{{a}}(pq)
    if d > dist[u]: continue
    for v, w in adj[u]:
        if d + w {{b}} dist[v]:
            dist[v] = d + w
            heapq.heappush(pq, (dist[v], {{c}}))`,
      blanks: [b("a", "heappop"), b("b", "<"), b("c", "v")],
    },
  ],
};

// Longest Increasing Subsequence — O(n^2)
const lisDrill: Drill = {
  id: "lis-n2",
  title: "Longest Increasing Subsequence (O(n^2) DP)",
  snippets: [
    {
      language: "C++",
      template: `vector<int> dp(n, 1);
for (int i = 1; i < n; i++)
  for (int j = 0; j < i; j++)
    if (arr[j] {{a}} arr[i])
      dp[i] = {{b}}(dp[i], dp[j] + 1);
return *max_element(dp.begin(), dp.{{c}}());`,
      blanks: [b("a", "<"), b("b", "max"), b("c", "end")],
    },
    {
      language: "Java",
      template: `int[] dp = new int[n];
Arrays.fill(dp, 1);
for (int i = 1; i < n; i++)
  for (int j = 0; j < i; j++)
    if (arr[j] {{a}} arr[i])
      dp[i] = Math.{{b}}(dp[i], dp[j] + 1);
int best = 0;
for (int v : dp) best = Math.max(best, {{c}});
return best;`,
      blanks: [b("a", "<"), b("b", "max"), b("c", "v")],
    },
    {
      language: "Python",
      template: `dp = [1] * n
for i in range(1, n):
    for j in range(i):
        if arr[j] {{a}} arr[i]:
            dp[i] = {{b}}(dp[i], dp[j] + 1)
return {{c}}(dp)`,
      blanks: [b("a", "<"), b("b", "max"), b("c", "max")],
    },
  ],
};

// Matrix chain multiplication (interval DP)
const mcmDrill: Drill = {
  id: "matrix-chain",
  title: "Matrix Chain Multiplication (interval DP)",
  snippets: [
    {
      language: "C++",
      template: `for (int len = 2; len < n; len++) {
  for (int i = 1; i + len - 1 < n; i++) {
    int j = i + len - 1;
    dp[i][j] = INT_MAX;
    for (int k = i; k {{a}} j; k++) {
      int cost = dp[i][k] + dp[k + 1][j] + p[i - 1] * p[k] * p[{{b}}];
      dp[i][j] = min(dp[i][j], {{c}});
    }
  }
}`,
      blanks: [b("a", "<"), b("b", "j"), b("c", "cost")],
    },
    {
      language: "Java",
      template: `for (int len = 2; len < n; len++) {
  for (int i = 1; i + len - 1 < n; i++) {
    int j = i + len - 1;
    dp[i][j] = Integer.MAX_VALUE;
    for (int k = i; k {{a}} j; k++) {
      int cost = dp[i][k] + dp[k + 1][j] + p[i - 1] * p[k] * p[{{b}}];
      dp[i][j] = Math.min(dp[i][j], {{c}});
    }
  }
}`,
      blanks: [b("a", "<"), b("b", "j"), b("c", "cost")],
    },
    {
      language: "Python",
      template: `for length in range(2, n):
    for i in range(1, n - length + 1):
        j = i + length - 1
        dp[i][j] = float('inf')
        for k in range(i, {{a}}):
            cost = dp[i][k] + dp[k + 1][j] + p[i - 1] * p[k] * p[{{b}}]
            dp[i][j] = min(dp[i][j], {{c}})`,
      blanks: [b("a", "j"), b("b", "j"), b("c", "cost")],
    },
  ],
};

// Backtracking — subsets
const backtrackingDrill: Drill = {
  id: "subsets-backtrack",
  title: "Generate all subsets (backtracking)",
  snippets: [
    {
      language: "C++",
      template: `void solve(int i, vector<int>& cur) {
  if (i == (int)arr.size()) { ans.push_back(cur); return; }
  solve(i + 1, cur);                 // skip
  cur.push_back(arr[i]);
  solve(i {{a}} 1, cur);              // take
  cur.{{b}}();                        // backtrack
}`,
      blanks: [b("a", "+"), b("b", "pop_back")],
    },
    {
      language: "Java",
      template: `void solve(int i, List<Integer> cur) {
  if (i == arr.length) { ans.add(new ArrayList<>(cur)); return; }
  solve(i + 1, cur);
  cur.add(arr[i]);
  solve(i {{a}} 1, cur);
  cur.remove(cur.size() - {{b}});
}`,
      blanks: [b("a", "+"), b("b", "1")],
    },
    {
      language: "Python",
      template: `def solve(i, cur):
    if i == len(arr):
        ans.append(cur[:])
        return
    solve(i + 1, cur)
    cur.append(arr[i])
    solve(i {{a}} 1, cur)
    cur.{{b}}()`,
      blanks: [b("a", "+"), b("b", "pop")],
    },
  ],
};

// Binary search on answer
const bsAnswerDrill: Drill = {
  id: "bs-on-answer",
  title: "Binary search on the answer",
  snippets: [
    {
      language: "C++",
      template: `int lo = minAns, hi = maxAns, ans = -1;
while (lo {{a}} hi) {
  int mid = lo + (hi - lo) / 2;
  if (feasible(mid)) { ans = mid; hi = mid {{b}} 1; }
  else lo = mid {{c}} 1;
}
return ans;`,
      blanks: [b("a", "<="), b("b", "-"), b("c", "+")],
    },
    {
      language: "Java",
      template: `int lo = minAns, hi = maxAns, ans = -1;
while (lo {{a}} hi) {
  int mid = lo + (hi - lo) / 2;
  if (feasible(mid)) { ans = mid; hi = mid {{b}} 1; }
  else lo = mid {{c}} 1;
}
return ans;`,
      blanks: [b("a", "<="), b("b", "-"), b("c", "+")],
    },
    {
      language: "Python",
      template: `lo, hi, ans = min_ans, max_ans, -1
while lo {{a}} hi:
    mid = (lo + hi) // 2
    if feasible(mid):
        ans = mid
        hi = mid {{b}} 1
    else:
        lo = mid {{c}} 1`,
      blanks: [b("a", "<="), b("b", "-"), b("c", "+")],
    },
  ],
};

// Bit tricks
const bitTricksDrill: Drill = {
  id: "bit-tricks",
  title: "Common bit tricks",
  snippets: [
    {
      language: "C++",
      template: `// check bit i is set
bool setI = (x {{a}} (1 << i)) != 0;
// set bit i
x = x {{b}} (1 << i);
// clear bit i
x = x & ~(1 {{c}} i);`,
      blanks: [b("a", "&"), b("b", "|"), b("c", "<<")],
    },
    {
      language: "Java",
      template: `boolean setI = (x {{a}} (1 << i)) != 0;
x = x {{b}} (1 << i);
x = x & ~(1 {{c}} i);`,
      blanks: [b("a", "&"), b("b", "|"), b("c", "<<")],
    },
    {
      language: "Python",
      template: `set_i = (x {{a}} (1 << i)) != 0
x = x {{b}} (1 << i)
x = x & ~(1 {{c}} i)`,
      blanks: [b("a", "&"), b("b", "|"), b("c", "<<")],
    },
  ],
};

// Number theory basics — GCD (Euclid)
const numberTheoryDrill: Drill = {
  id: "gcd-euclid",
  title: "GCD via Euclid's algorithm",
  snippets: [
    {
      language: "C++",
      template: `int gcd(int a, int b) {
  while (b {{a}} 0) {
    int t = a {{b}} b;
    a = b;
    b = {{c}};
  }
  return a;
}`,
      blanks: [b("a", "!="), b("b", "%"), b("c", "t")],
    },
    {
      language: "Java",
      template: `int gcd(int a, int b) {
  while (b {{a}} 0) {
    int t = a {{b}} b;
    a = b;
    b = {{c}};
  }
  return a;
}`,
      blanks: [b("a", "!="), b("b", "%"), b("c", "t")],
    },
    {
      language: "Python",
      template: `def gcd(a, b):
    while b {{a}} 0:
        a, b = b, a {{b}} {{c}}
    return a`,
      blanks: [b("a", "!="), b("b", "%"), b("c", "b")],
    },
  ],
};

// Pattern printing — right-angle triangle of stars
const patternPrintingDrill: Drill = {
  id: "star-triangle",
  title: "Print a right-angle star triangle",
  snippets: [
    {
      language: "C++",
      template: `for (int i = 1; i {{a}} n; i++) {
  for (int j = 0; j < {{b}}; j++) cout << '*';
  cout << {{c}};
}`,
      blanks: [b("a", "<="), b("b", "i"), b("c", "'\\n'", ["endl", "\"\\n\""])],
    },
    {
      language: "Java",
      template: `for (int i = 1; i {{a}} n; i++) {
  for (int j = 0; j < {{b}}; j++) System.out.print('*');
  System.out.{{c}}();
}`,
      blanks: [b("a", "<="), b("b", "i"), b("c", "println")],
    },
    {
      language: "Python",
      template: `for i in range(1, n + 1):
    for j in range({{a}}):
        print('*', end={{b}})
    {{c}}()`,
      blanks: [b("a", "i"), b("b", "''", ['""']), b("c", "print")],
    },
  ],
};

// String basics — reverse a string
const stringBasicsDrill: Drill = {
  id: "reverse-string",
  title: "Reverse a string in place",
  snippets: [
    {
      language: "C++",
      template: `int l = 0, r = (int)s.size() - 1;
while (l {{a}} r) {
  {{b}}(s[l], s[r]);
  l++;
  r{{c}};
}`,
      blanks: [b("a", "<"), b("b", "swap"), b("c", "--")],
    },
    {
      language: "Java",
      template: `char[] c = s.toCharArray();
int l = 0, r = c.length - 1;
while (l {{a}} r) {
  char t = c[l];
  c[l] = c[r];
  c[r] = {{b}};
  l++;
  r{{c}};
}
return new String(c);`,
      blanks: [b("a", "<"), b("b", "t"), b("c", "--")],
    },
    {
      language: "Python",
      template: `chars = list(s)
l, r = 0, len(chars) - 1
while l {{a}} r:
    chars[l], chars[r] = chars[r], chars[{{b}}]
    l += 1
    r {{c}} 1
return ''.join(chars)`,
      blanks: [b("a", "<"), b("b", "l"), b("c", "-=")],
    },
  ],
};

// Matrix basics — transpose in place
const matrixBasicsDrill: Drill = {
  id: "matrix-transpose",
  title: "Transpose an n x n matrix in place",
  snippets: [
    {
      language: "C++",
      template: `for (int i = 0; i < n; i++) {
  for (int j = i + 1; j {{a}} n; j++) {
    {{b}}(mat[i][j], mat[{{c}}][i]);
  }
}`,
      blanks: [b("a", "<"), b("b", "swap"), b("c", "j")],
    },
    {
      language: "Java",
      template: `for (int i = 0; i < n; i++) {
  for (int j = i + 1; j {{a}} n; j++) {
    int t = mat[i][j];
    mat[i][j] = mat[j][i];
    mat[{{b}}][i] = {{c}};
  }
}`,
      blanks: [b("a", "<"), b("b", "j"), b("c", "t")],
    },
    {
      language: "Python",
      template: `for i in range(n):
    for j in range(i + 1, {{a}}):
        mat[i][j], mat[{{b}}][i] = mat[j][i], mat[i][{{c}}]`,
      blanks: [b("a", "n"), b("b", "j"), b("c", "j")],
    },
  ],
};

// Recursion basics — factorial
const recursionBasicsDrill: Drill = {
  id: "factorial-recursion",
  title: "Factorial via recursion",
  snippets: [
    {
      language: "C++",
      template: `long long fact(int n) {
  if (n {{a}} 1) return 1;
  return (long long)n * fact(n {{b}} {{c}});
}`,
      blanks: [b("a", "<="), b("b", "-"), b("c", "1")],
    },
    {
      language: "Java",
      template: `long fact(int n) {
  if (n {{a}} 1) return 1;
  return (long) n * fact(n {{b}} {{c}});
}`,
      blanks: [b("a", "<="), b("b", "-"), b("c", "1")],
    },
    {
      language: "Python",
      template: `def fact(n):
    if n {{a}} 1:
        return 1
    return n * fact(n {{b}} {{c}})`,
      blanks: [b("a", "<="), b("b", "-"), b("c", "1")],
    },
  ],
};

export const DRILLS: Record<string, Drill[]> = {
  // Arrays
  "two-pointers": [twoPointersDrill],
  kadane: [kadaneDrill],
  "prefix-sum": [prefixSumDrill],
  "sliding-window": [slidingWindowDrill],
  "hashmap-frequency": [hashmapFreqDrill],
  "monotonic-stack": [monotonicStackDrill],
  // Linked list
  "fast-slow": [fastSlowDrill],
  "reverse-list": [reverseListDrill],
  // Trees
  "tree-dfs": [treeDfsDrill],
  "tree-bfs": [treeBfsDrill],
  // Graphs
  "graph-bfs-dfs": [bfsDrill, dfsDrill],
  "topo-sort": [topoSortDrill],
  dijkstra: [dijkstraDrill],
  // DP
  knapsack: [dp1dDrill],
  lis: [lisDrill],
  mcm: [mcmDrill],
  // Backtracking
  backtracking: [backtrackingDrill],
  // Search
  "binary-search": [binarySearchDrill],
  "bs-on-answer": [bsAnswerDrill],
  // Bit / Math
  "bit-tricks": [bitTricksDrill],
  "number-theory-basics": [numberTheoryDrill],
  // Service-company placements
  "pattern-printing": [patternPrintingDrill],
  "string-basics": [stringBasicsDrill],
  "matrix-basics": [matrixBasicsDrill],
  "recursion-basics": [recursionBasicsDrill],
};
