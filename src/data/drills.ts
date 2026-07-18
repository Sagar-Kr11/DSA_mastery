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

export const DRILLS: Record<string, Drill[]> = {
  "sliding-window": [slidingWindowDrill],
  "two-pointers": [twoPointersDrill],
  kadane: [kadaneDrill],
  "binary-search": [binarySearchDrill],
  "graph-bfs-dfs": [bfsDrill, dfsDrill],
  "tree-dfs": [dfsDrill],
  "fast-slow": [fastSlowDrill],
  knapsack: [dp1dDrill],
};
