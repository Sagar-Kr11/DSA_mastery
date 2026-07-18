// Fill-in-the-blanks recall drills — one authored drill PER PROBLEM.
// `template` splits on {{blankId}} tokens; the client renders inputs in place.
// Answers are validated client-side (case-insensitive trim + optional aliases).

export type Blank = {
  id: string;
  answer: string;
  accepts?: string[];
  hint?: string;
  width?: number;
};

export type DrillLanguage = "C++" | "Java" | "Python";

export type DrillSnippet = {
  language: DrillLanguage;
  template: string;
  blanks: Blank[];
};

export type Drill = {
  id: string; // = problem slug
  title: string;
  url?: string; // problem link (LeetCode by default)
  snippets: DrillSnippet[];
};

const b = (id: string, answer: string, accepts?: string[], width?: number): Blank => ({
  id,
  answer,
  accepts,
  width,
});

const lc = (slug: string) => `https://leetcode.com/problems/${slug}/`;

// Small helper so every drill is one call: d(slug, title, [cpp, java, py])
type SnippetInit = { c: string; b: Blank[] };
function d(slug: string, title: string, cpp: SnippetInit, java: SnippetInit, py: SnippetInit, url = lc(slug)): Drill {
  return {
    id: slug,
    title,
    url,
    snippets: [
      { language: "C++", template: cpp.c, blanks: cpp.b },
      { language: "Java", template: java.c, blanks: java.b },
      { language: "Python", template: py.c, blanks: py.b },
    ],
  };
}

// =====================================================================
// TWO POINTERS
// =====================================================================
const twoPointers: Drill[] = [
  d(
    "two-sum",
    "Two Sum (hash complement)",
    {
      c: `unordered_map<int,int> seen;
for (int i = 0; i < (int)nums.size(); i++) {
  int need = target {{a}} nums[i];
  if (seen.count({{b}})) return {seen[need], {{c}}};
  seen[nums[i]] = i;
}
return {};`,
      b: [b("a", "-"), b("b", "need"), b("c", "i")],
    },
    {
      c: `Map<Integer,Integer> seen = new HashMap<>();
for (int i = 0; i < nums.length; i++) {
  int need = target {{a}} nums[i];
  if (seen.containsKey({{b}})) return new int[]{seen.get(need), {{c}}};
  seen.put(nums[i], i);
}
return new int[]{-1,-1};`,
      b: [b("a", "-"), b("b", "need"), b("c", "i")],
    },
    {
      c: `seen = {}
for i, x in enumerate(nums):
    need = target {{a}} x
    if need in {{b}}:
        return [seen[need], {{c}}]
    seen[x] = i`,
      b: [b("a", "-"), b("b", "seen"), b("c", "i")],
    },
  ),
  d(
    "3sum",
    "3Sum (sort + two pointers)",
    {
      c: `sort(nums.begin(), nums.end());
for (int i = 0; i < (int)nums.size(); i++) {
  if (i > 0 && nums[i] == nums[i - 1]) continue;
  int l = i + 1, r = (int)nums.size() - 1;
  while (l {{a}} r) {
    int s = nums[i] + nums[l] + nums[r];
    if (s == {{b}}) { ans.push_back({nums[i],nums[l],nums[r]}); l++; r--;
      while (l < r && nums[l]==nums[l-1]) l++;
    } else if (s < 0) l++;
    else {{c}};
  }
}`,
      b: [b("a", "<"), b("b", "0"), b("c", "r--", ["--r"])],
    },
    {
      c: `Arrays.sort(nums);
for (int i = 0; i < nums.length; i++) {
  if (i > 0 && nums[i] == nums[i - 1]) continue;
  int l = i + 1, r = nums.length - 1;
  while (l {{a}} r) {
    int s = nums[i] + nums[l] + nums[r];
    if (s == {{b}}) { ans.add(List.of(nums[i],nums[l],nums[r])); l++; r--;
      while (l < r && nums[l]==nums[l-1]) l++;
    } else if (s < 0) l++;
    else {{c}};
  }
}`,
      b: [b("a", "<"), b("b", "0"), b("c", "r--", ["--r"])],
    },
    {
      c: `nums.sort()
for i in range(len(nums)):
    if i and nums[i] == nums[i-1]: continue
    l, r = i + 1, len(nums) - 1
    while l {{a}} r:
        s = nums[i] + nums[l] + nums[r]
        if s == {{b}}:
            ans.append([nums[i], nums[l], nums[r]])
            l += 1; r -= 1
            while l < r and nums[l] == nums[l-1]: l += 1
        elif s < 0: l += 1
        else: r {{c}} 1`,
      b: [b("a", "<"), b("b", "0"), b("c", "-=")],
    },
  ),
  d(
    "container-with-most-water",
    "Container With Most Water",
    {
      c: `int l = 0, r = (int)h.size() - 1, best = 0;
while (l < r) {
  int area = {{a}}(h[l], h[r]) * (r - l);
  best = max(best, area);
  if (h[l] < h[r]) l{{b}};
  else {{c}};
}
return best;`,
      b: [b("a", "min"), b("b", "++"), b("c", "r--", ["--r"])],
    },
    {
      c: `int l = 0, r = h.length - 1, best = 0;
while (l < r) {
  int area = Math.{{a}}(h[l], h[r]) * (r - l);
  best = Math.max(best, area);
  if (h[l] < h[r]) l{{b}};
  else {{c}};
}
return best;`,
      b: [b("a", "min"), b("b", "++"), b("c", "r--", ["--r"])],
    },
    {
      c: `l, r, best = 0, len(h) - 1, 0
while l < r:
    best = max(best, {{a}}(h[l], h[r]) * (r - l))
    if h[l] < h[r]: l {{b}} 1
    else: r {{c}} 1`,
      b: [b("a", "min"), b("b", "+="), b("c", "-=")],
    },
  ),
  d(
    "trapping-rain-water",
    "Trapping Rain Water (two pointers)",
    {
      c: `int l = 0, r = (int)h.size() - 1, lmax = 0, rmax = 0, water = 0;
while (l < r) {
  if (h[l] < h[r]) {
    lmax = max(lmax, h[l]);
    water += lmax {{a}} h[l];
    l++;
  } else {
    rmax = {{b}}(rmax, h[r]);
    water += rmax - h[r];
    {{c}}--;
  }
}
return water;`,
      b: [b("a", "-"), b("b", "max"), b("c", "r")],
    },
    {
      c: `int l = 0, r = h.length - 1, lmax = 0, rmax = 0, water = 0;
while (l < r) {
  if (h[l] < h[r]) {
    lmax = Math.max(lmax, h[l]);
    water += lmax {{a}} h[l];
    l++;
  } else {
    rmax = Math.{{b}}(rmax, h[r]);
    water += rmax - h[r];
    {{c}}--;
  }
}
return water;`,
      b: [b("a", "-"), b("b", "max"), b("c", "r")],
    },
    {
      c: `l, r, lmax, rmax, water = 0, len(h) - 1, 0, 0, 0
while l < r:
    if h[l] < h[r]:
        lmax = max(lmax, h[l])
        water += lmax {{a}} h[l]
        l += 1
    else:
        rmax = {{b}}(rmax, h[r])
        water += rmax - h[r]
        {{c}} -= 1
return water`,
      b: [b("a", "-"), b("b", "max"), b("c", "r")],
    },
  ),
  d(
    "remove-duplicates-from-sorted-array",
    "Remove Duplicates from Sorted Array",
    {
      c: `if (nums.empty()) return 0;
int k = {{a}};
for (int i = 1; i < (int)nums.size(); i++) {
  if (nums[i] != nums[{{b}}]) {
    nums[k] = nums[i];
    k{{c}};
  }
}
return k;`,
      b: [b("a", "1"), b("b", "k - 1", ["i-1"]), b("c", "++")],
    },
    {
      c: `if (nums.length == 0) return 0;
int k = {{a}};
for (int i = 1; i < nums.length; i++) {
  if (nums[i] != nums[{{b}}]) {
    nums[k] = nums[i];
    k{{c}};
  }
}
return k;`,
      b: [b("a", "1"), b("b", "k - 1", ["i-1"]), b("c", "++")],
    },
    {
      c: `if not nums: return 0
k = {{a}}
for i in range(1, len(nums)):
    if nums[i] != nums[{{b}}]:
        nums[k] = nums[i]
        k {{c}} 1
return k`,
      b: [b("a", "1"), b("b", "k - 1", ["i-1"]), b("c", "+=")],
    },
  ),
];

// =====================================================================
// KADANE
// =====================================================================
const kadane: Drill[] = [
  d(
    "maximum-subarray",
    "Maximum Subarray (Kadane)",
    {
      c: `int cur = nums[0], best = nums[0];
for (int i = 1; i < (int)nums.size(); i++) {
  cur = {{a}}(nums[i], cur + nums[i]);
  best = max(best, {{b}});
}
return {{c}};`,
      b: [b("a", "max"), b("b", "cur"), b("c", "best")],
    },
    {
      c: `int cur = nums[0], best = nums[0];
for (int i = 1; i < nums.length; i++) {
  cur = Math.{{a}}(nums[i], cur + nums[i]);
  best = Math.max(best, {{b}});
}
return {{c}};`,
      b: [b("a", "max"), b("b", "cur"), b("c", "best")],
    },
    {
      c: `cur = best = nums[0]
for x in nums[1:]:
    cur = {{a}}(x, cur + x)
    best = max(best, {{b}})
return {{c}}`,
      b: [b("a", "max"), b("b", "cur"), b("c", "best")],
    },
  ),
  d(
    "maximum-product-subarray",
    "Maximum Product Subarray (track min & max)",
    {
      c: `int hi = nums[0], lo = nums[0], best = nums[0];
for (int i = 1; i < (int)nums.size(); i++) {
  int a = nums[i], b1 = hi * a, b2 = lo * a;
  hi = max({a, max({{a}}, b2)});
  lo = min({a, min(b1, {{b}})});
  best = max(best, {{c}});
}
return best;`,
      b: [b("a", "b1"), b("b", "b2"), b("c", "hi")],
    },
    {
      c: `int hi = nums[0], lo = nums[0], best = nums[0];
for (int i = 1; i < nums.length; i++) {
  int a = nums[i], b1 = hi * a, b2 = lo * a;
  hi = Math.max(a, Math.max({{a}}, b2));
  lo = Math.min(a, Math.min(b1, {{b}}));
  best = Math.max(best, {{c}});
}
return best;`,
      b: [b("a", "b1"), b("b", "b2"), b("c", "hi")],
    },
    {
      c: `hi = lo = best = nums[0]
for x in nums[1:]:
    b1, b2 = hi * x, lo * x
    hi = max(x, {{a}}, b2)
    lo = min(x, b1, {{b}})
    best = max(best, {{c}})
return best`,
      b: [b("a", "b1"), b("b", "b2"), b("c", "hi")],
    },
  ),
  d(
    "maximum-sum-circular-subarray",
    "Maximum Sum Circular Subarray",
    {
      c: `int total = 0, curMax = nums[0], bestMax = nums[0], curMin = nums[0], bestMin = nums[0];
for (int i = 0; i < (int)nums.size(); i++) {
  int x = nums[i];
  total += x;
  curMax = max(x, curMax + x);
  bestMax = max(bestMax, curMax);
  curMin = min(x, curMin + x);
  bestMin = {{a}}(bestMin, curMin);
}
if (bestMax < 0) return {{b}};
return max(bestMax, total {{c}} bestMin);`,
      b: [b("a", "min"), b("b", "bestMax"), b("c", "-")],
    },
    {
      c: `int total=0, curMax=nums[0], bestMax=nums[0], curMin=nums[0], bestMin=nums[0];
for (int i = 0; i < nums.length; i++) {
  int x = nums[i];
  total += x;
  curMax = Math.max(x, curMax + x); bestMax = Math.max(bestMax, curMax);
  curMin = Math.min(x, curMin + x); bestMin = Math.{{a}}(bestMin, curMin);
}
if (bestMax < 0) return {{b}};
return Math.max(bestMax, total {{c}} bestMin);`,
      b: [b("a", "min"), b("b", "bestMax"), b("c", "-")],
    },
    {
      c: `total = 0
cur_max = best_max = cur_min = best_min = nums[0]
for i, x in enumerate(nums):
    total += x
    if i:
        cur_max = max(x, cur_max + x); best_max = max(best_max, cur_max)
        cur_min = min(x, cur_min + x); best_min = {{a}}(best_min, cur_min)
if best_max < 0: return {{b}}
return max(best_max, total {{c}} best_min)`,
      b: [b("a", "min"), b("b", "best_max"), b("c", "-")],
    },
  ),
];

// =====================================================================
// PREFIX SUM
// =====================================================================
const prefixSum: Drill[] = [
  d(
    "subarray-sum-equals-k",
    "Subarray Sum Equals K",
    {
      c: `unordered_map<int,int> seen{{ {0, 1} }};
int sum = 0, ans = 0;
for (int x : nums) {
  sum += x;
  if (seen.count(sum {{a}} k)) ans += seen[sum - k];
  seen[{{b}}]{{c}};
}
return ans;`,
      b: [b("a", "-"), b("b", "sum"), b("c", "++")],
    },
    {
      c: `Map<Integer,Integer> seen = new HashMap<>();
seen.put(0, 1);
int sum = 0, ans = 0;
for (int x : nums) {
  sum += x;
  if (seen.containsKey(sum {{a}} k)) ans += seen.get(sum - k);
  seen.merge({{b}}, 1, Integer::{{c}});
}
return ans;`,
      b: [b("a", "-"), b("b", "sum"), b("c", "sum")],
    },
    {
      c: `seen = {0: 1}
s = ans = 0
for x in nums:
    s += x
    if s {{a}} k in seen:
        ans += seen[s - k]
    seen[{{b}}] = seen.get(s, 0) {{c}} 1
return ans`,
      b: [b("a", "-"), b("b", "s"), b("c", "+")],
    },
  ),
  d(
    "range-sum-query-immutable",
    "Range Sum Query — Immutable",
    {
      c: `// constructor
pre.assign(nums.size() + 1, 0);
for (int i = 0; i < (int)nums.size(); i++)
  pre[i + 1] = pre[i] {{a}} nums[i];
// sumRange(l, r):
return pre[r {{b}} 1] - pre[{{c}}];`,
      b: [b("a", "+"), b("b", "+"), b("c", "l")],
    },
    {
      c: `pre = new int[nums.length + 1];
for (int i = 0; i < nums.length; i++)
  pre[i + 1] = pre[i] {{a}} nums[i];
// sumRange(l, r):
return pre[r {{b}} 1] - pre[{{c}}];`,
      b: [b("a", "+"), b("b", "+"), b("c", "l")],
    },
    {
      c: `self.pre = [0] * (len(nums) + 1)
for i, x in enumerate(nums):
    self.pre[i + 1] = self.pre[i] {{a}} x
# sumRange(l, r):
return self.pre[r {{b}} 1] - self.pre[{{c}}]`,
      b: [b("a", "+"), b("b", "+"), b("c", "l")],
    },
  ),
  d(
    "contiguous-array",
    "Contiguous Array (0/1 → ±1 prefix)",
    {
      c: `unordered_map<int,int> first{{ {0, -1} }};
int sum = 0, best = 0;
for (int i = 0; i < (int)nums.size(); i++) {
  sum += (nums[i] == 1) ? 1 : {{a}};
  if (first.count(sum)) best = max(best, i {{b}} first[sum]);
  else first[sum] = {{c}};
}
return best;`,
      b: [b("a", "-1"), b("b", "-"), b("c", "i")],
    },
    {
      c: `Map<Integer,Integer> first = new HashMap<>();
first.put(0, -1);
int sum = 0, best = 0;
for (int i = 0; i < nums.length; i++) {
  sum += (nums[i] == 1) ? 1 : {{a}};
  if (first.containsKey(sum)) best = Math.max(best, i {{b}} first.get(sum));
  else first.put(sum, {{c}});
}
return best;`,
      b: [b("a", "-1"), b("b", "-"), b("c", "i")],
    },
    {
      c: `first = {0: -1}
s = best = 0
for i, x in enumerate(nums):
    s += 1 if x == 1 else {{a}}
    if s in first:
        best = max(best, i {{b}} first[s])
    else:
        first[s] = {{c}}
return best`,
      b: [b("a", "-1"), b("b", "-"), b("c", "i")],
    },
  ),
];

// =====================================================================
// SLIDING WINDOW
// =====================================================================
const slidingWindow: Drill[] = [
  d(
    "longest-substring-without-repeating-characters",
    "Longest Substring Without Repeating Characters",
    {
      c: `unordered_map<char,int> last;
int l = 0, best = 0;
for (int r = 0; r < (int)s.size(); r++) {
  if (last.count(s[r]) && last[s[r]] >= l)
    l = last[s[r]] {{a}} 1;
  last[s[r]] = {{b}};
  best = max(best, r - l {{c}} 1);
}
return best;`,
      b: [b("a", "+"), b("b", "r"), b("c", "+")],
    },
    {
      c: `Map<Character,Integer> last = new HashMap<>();
int l = 0, best = 0;
for (int r = 0; r < s.length(); r++) {
  char c = s.charAt(r);
  if (last.containsKey(c) && last.get(c) >= l)
    l = last.get(c) {{a}} 1;
  last.put(c, {{b}});
  best = Math.max(best, r - l {{c}} 1);
}
return best;`,
      b: [b("a", "+"), b("b", "r"), b("c", "+")],
    },
    {
      c: `last = {}
l = best = 0
for r, c in enumerate(s):
    if c in last and last[c] >= l:
        l = last[c] {{a}} 1
    last[c] = {{b}}
    best = max(best, r - l {{c}} 1)
return best`,
      b: [b("a", "+"), b("b", "r"), b("c", "+")],
    },
  ),
  d(
    "minimum-window-substring",
    "Minimum Window Substring",
    {
      c: `unordered_map<char,int> need, have;
for (char c : t) need[c]++;
int required = need.size(), formed = 0, l = 0, bestLen = INT_MAX, bestL = 0;
for (int r = 0; r < (int)s.size(); r++) {
  have[s[r]]++;
  if (need.count(s[r]) && have[s[r]] == need[s[r]]) formed{{a}};
  while (formed == required) {
    if (r - l + 1 < bestLen) { bestLen = r - l + 1; bestL = l; }
    have[s[l]]--;
    if (need.count(s[l]) && have[s[l]] < need[s[l]]) formed{{b}};
    l++;
  }
}
return bestLen == INT_MAX ? "" : s.substr(bestL, {{c}});`,
      b: [b("a", "++"), b("b", "--"), b("c", "bestLen")],
    },
    {
      c: `Map<Character,Integer> need = new HashMap<>(), have = new HashMap<>();
for (char c : t.toCharArray()) need.merge(c, 1, Integer::sum);
int required = need.size(), formed = 0, l = 0, bestLen = Integer.MAX_VALUE, bestL = 0;
for (int r = 0; r < s.length(); r++) {
  char c = s.charAt(r);
  have.merge(c, 1, Integer::sum);
  if (need.containsKey(c) && have.get(c).intValue() == need.get(c).intValue()) formed{{a}};
  while (formed == required) {
    if (r - l + 1 < bestLen) { bestLen = r - l + 1; bestL = l; }
    char lc = s.charAt(l);
    have.merge(lc, -1, Integer::sum);
    if (need.containsKey(lc) && have.get(lc) < need.get(lc)) formed{{b}};
    l++;
  }
}
return bestLen == Integer.MAX_VALUE ? "" : s.substring(bestL, bestL + {{c}});`,
      b: [b("a", "++"), b("b", "--"), b("c", "bestLen")],
    },
    {
      c: `from collections import Counter
need = Counter(t); have = {}
required, formed = len(need), 0
l, best = 0, (float('inf'), 0, 0)
for r, c in enumerate(s):
    have[c] = have.get(c, 0) + 1
    if c in need and have[c] == need[c]: formed {{a}} 1
    while formed == required:
        if r - l + 1 < best[0]: best = (r - l + 1, l, r)
        have[s[l]] -= 1
        if s[l] in need and have[s[l]] < need[s[l]]: formed {{b}} 1
        l += 1
return "" if best[0] == float('inf') else s[best[1]:best[{{c}}] + 1]`,
      b: [b("a", "+="), b("b", "-="), b("c", "2")],
    },
  ),
  d(
    "longest-repeating-character-replacement",
    "Longest Repeating Character Replacement",
    {
      c: `int cnt[26] = {}, l = 0, maxFreq = 0, best = 0;
for (int r = 0; r < (int)s.size(); r++) {
  maxFreq = max(maxFreq, ++cnt[s[r] - 'A']);
  while ((r - l + 1) - maxFreq {{a}} k) {
    cnt[s[l] - 'A']--;
    l{{b}};
  }
  best = max(best, r - l {{c}} 1);
}
return best;`,
      b: [b("a", ">"), b("b", "++"), b("c", "+")],
    },
    {
      c: `int[] cnt = new int[26];
int l = 0, maxFreq = 0, best = 0;
for (int r = 0; r < s.length(); r++) {
  maxFreq = Math.max(maxFreq, ++cnt[s.charAt(r) - 'A']);
  while ((r - l + 1) - maxFreq {{a}} k) {
    cnt[s.charAt(l) - 'A']--;
    l{{b}};
  }
  best = Math.max(best, r - l {{c}} 1);
}
return best;`,
      b: [b("a", ">"), b("b", "++"), b("c", "+")],
    },
    {
      c: `cnt = {}
l = max_freq = best = 0
for r, c in enumerate(s):
    cnt[c] = cnt.get(c, 0) + 1
    max_freq = max(max_freq, cnt[c])
    while (r - l + 1) - max_freq {{a}} k:
        cnt[s[l]] -= 1
        l {{b}} 1
    best = max(best, r - l {{c}} 1)
return best`,
      b: [b("a", ">"), b("b", "+="), b("c", "+")],
    },
  ),
  d(
    "permutation-in-string",
    "Permutation in String",
    {
      c: `if (s1.size() > s2.size()) return false;
int a[26]={}, b[26]={};
for (int i = 0; i < (int)s1.size(); i++) { a[s1[i]-'a']++; b[s2[i]-'a']++; }
int matches = 0;
for (int i = 0; i < 26; i++) if (a[i] == b[i]) matches{{a}};
for (int i = (int)s1.size(); i < (int)s2.size(); i++) {
  if (matches == {{b}}) return true;
  int idx = s2[i]-'a'; b[idx]++;
  if (b[idx] == a[idx]) matches++;
  else if (b[idx] == a[idx] + 1) matches--;
  idx = s2[i - (int)s1.size()]-'a'; b[idx]--;
  if (b[idx] == a[idx]) matches++;
  else if (b[idx] == a[idx] - 1) matches{{c}};
}
return matches == 26;`,
      b: [b("a", "++"), b("b", "26"), b("c", "--")],
    },
    {
      c: `if (s1.length() > s2.length()) return false;
int[] a = new int[26], b = new int[26];
for (int i = 0; i < s1.length(); i++) { a[s1.charAt(i)-'a']++; b[s2.charAt(i)-'a']++; }
int matches = 0;
for (int i = 0; i < 26; i++) if (a[i] == b[i]) matches{{a}};
for (int i = s1.length(); i < s2.length(); i++) {
  if (matches == {{b}}) return true;
  int idx = s2.charAt(i)-'a'; b[idx]++;
  if (b[idx] == a[idx]) matches++;
  else if (b[idx] == a[idx] + 1) matches--;
  idx = s2.charAt(i - s1.length())-'a'; b[idx]--;
  if (b[idx] == a[idx]) matches++;
  else if (b[idx] == a[idx] - 1) matches{{c}};
}
return matches == 26;`,
      b: [b("a", "++"), b("b", "26"), b("c", "--")],
    },
    {
      c: `from collections import Counter
if len(s1) > len(s2): return False
a = Counter(s1); b = Counter(s2[:len(s1)])
if a == b: return {{a}}
for i in range(len(s1), len(s2)):
    b[s2[i]] = b.get(s2[i], 0) + 1
    b[s2[i - len(s1)]] {{b}} 1
    if b[s2[i - len(s1)]] == 0: del b[s2[i - len(s1)]]
    if a == {{c}}: return True
return False`,
      b: [b("a", "True"), b("b", "-="), b("c", "b")],
    },
  ),
  d(
    "sliding-window-maximum",
    "Sliding Window Maximum (monotonic deque)",
    {
      c: `deque<int> dq;
vector<int> ans;
for (int i = 0; i < (int)nums.size(); i++) {
  if (!dq.empty() && dq.front() <= i - k) dq.{{a}}();
  while (!dq.empty() && nums[dq.back()] < nums[i]) dq.{{b}}();
  dq.push_back(i);
  if (i >= k - 1) ans.push_back(nums[dq.{{c}}()]);
}
return ans;`,
      b: [b("a", "pop_front"), b("b", "pop_back"), b("c", "front")],
    },
    {
      c: `Deque<Integer> dq = new ArrayDeque<>();
int[] ans = new int[nums.length - k + 1];
for (int i = 0; i < nums.length; i++) {
  if (!dq.isEmpty() && dq.peekFirst() <= i - k) dq.{{a}}();
  while (!dq.isEmpty() && nums[dq.peekLast()] < nums[i]) dq.{{b}}();
  dq.offerLast(i);
  if (i >= k - 1) ans[i - k + 1] = nums[dq.{{c}}()];
}
return ans;`,
      b: [b("a", "pollFirst"), b("b", "pollLast"), b("c", "peekFirst")],
    },
    {
      c: `from collections import deque
dq, ans = deque(), []
for i, x in enumerate(nums):
    if dq and dq[0] <= i - k: dq.{{a}}()
    while dq and nums[dq[-1]] < x: dq.{{b}}()
    dq.append(i)
    if i >= k - 1: ans.append(nums[dq[{{c}}]])
return ans`,
      b: [b("a", "popleft"), b("b", "pop"), b("c", "0")],
    },
  ),
];

// =====================================================================
// HASHMAP FREQUENCY
// =====================================================================
const hashmapFreq: Drill[] = [
  d(
    "valid-anagram",
    "Valid Anagram",
    {
      c: `if (s.size() != t.size()) return false;
int cnt[26] = {};
for (char c : s) cnt[c - 'a']{{a}};
for (char c : t) cnt[c - 'a']{{b}};
for (int v : cnt) if (v != {{c}}) return false;
return true;`,
      b: [b("a", "++"), b("b", "--"), b("c", "0")],
    },
    {
      c: `if (s.length() != t.length()) return false;
int[] cnt = new int[26];
for (char c : s.toCharArray()) cnt[c - 'a']{{a}};
for (char c : t.toCharArray()) cnt[c - 'a']{{b}};
for (int v : cnt) if (v != {{c}}) return false;
return true;`,
      b: [b("a", "++"), b("b", "--"), b("c", "0")],
    },
    {
      c: `from collections import Counter
return Counter(s) {{a}} Counter({{b}}) if len(s) == len({{c}}) else False`,
      b: [b("a", "=="), b("b", "t"), b("c", "t")],
    },
  ),
  d(
    "group-anagrams",
    "Group Anagrams",
    {
      c: `unordered_map<string, vector<string>> g;
for (auto& s : strs) {
  string key = s;
  {{a}}(key.begin(), key.end());
  g[{{b}}].push_back(s);
}
vector<vector<string>> ans;
for (auto& [_, v] : g) ans.push_back({{c}});
return ans;`,
      b: [b("a", "sort"), b("b", "key"), b("c", "v")],
    },
    {
      c: `Map<String, List<String>> g = new HashMap<>();
for (String s : strs) {
  char[] k = s.toCharArray();
  Arrays.{{a}}(k);
  g.computeIfAbsent(new String({{b}}), z -> new ArrayList<>()).add(s);
}
return new ArrayList<>({{c}}.values());`,
      b: [b("a", "sort"), b("b", "k"), b("c", "g")],
    },
    {
      c: `from collections import defaultdict
g = defaultdict(list)
for s in strs:
    key = ''.join({{a}}(s))
    g[{{b}}].append(s)
return list(g.{{c}}())`,
      b: [b("a", "sorted"), b("b", "key"), b("c", "values")],
    },
  ),
  d(
    "top-k-frequent-elements",
    "Top K Frequent Elements (bucket sort)",
    {
      c: `unordered_map<int,int> freq;
for (int x : nums) freq[x]++;
vector<vector<int>> bucket(nums.size() + 1);
for (auto& [k, v] : freq) bucket[{{a}}].push_back(k);
vector<int> ans;
for (int i = (int)bucket.size() - 1; i >= 0 && (int)ans.size() < k; i{{b}})
  for (int x : bucket[i]) { ans.push_back(x); if ((int)ans.size() == {{c}}) break; }
return ans;`,
      b: [b("a", "v"), b("b", "--"), b("c", "k")],
    },
    {
      c: `Map<Integer,Integer> freq = new HashMap<>();
for (int x : nums) freq.merge(x, 1, Integer::sum);
List<Integer>[] bucket = new List[nums.length + 1];
for (var e : freq.entrySet()) {
  int v = e.getValue();
  if (bucket[v] == null) bucket[v] = new ArrayList<>();
  bucket[{{a}}].add(e.getKey());
}
int[] ans = new int[k]; int idx = 0;
for (int i = bucket.length - 1; i >= 0 && idx < k; i{{b}})
  if (bucket[i] != null)
    for (int x : bucket[i]) { if (idx == {{c}}) break; ans[idx++] = x; }
return ans;`,
      b: [b("a", "v"), b("b", "--"), b("c", "k")],
    },
    {
      c: `from collections import Counter
freq = Counter(nums)
bucket = [[] for _ in range(len(nums) + 1)]
for x, v in freq.items():
    bucket[{{a}}].append(x)
ans = []
for i in range(len(bucket) - 1, -1, {{b}}):
    for x in bucket[i]:
        ans.append(x)
        if len(ans) == {{c}}: return ans
return ans`,
      b: [b("a", "v"), b("b", "-1"), b("c", "k")],
    },
  ),
  d(
    "majority-element",
    "Majority Element (Boyer-Moore)",
    {
      c: `int cand = 0, count = 0;
for (int x : nums) {
  if (count == 0) cand = {{a}};
  count += (x == cand) ? 1 : {{b}};
}
return {{c}};`,
      b: [b("a", "x"), b("b", "-1"), b("c", "cand")],
    },
    {
      c: `int cand = 0, count = 0;
for (int x : nums) {
  if (count == 0) cand = {{a}};
  count += (x == cand) ? 1 : {{b}};
}
return {{c}};`,
      b: [b("a", "x"), b("b", "-1"), b("c", "cand")],
    },
    {
      c: `cand = count = 0
for x in nums:
    if count == 0: cand = {{a}}
    count += 1 if x == cand else {{b}}
return {{c}}`,
      b: [b("a", "x"), b("b", "-1"), b("c", "cand")],
    },
  ),
];

// =====================================================================
// MONOTONIC STACK
// =====================================================================
const monotonicStack: Drill[] = [
  d(
    "next-greater-element-i",
    "Next Greater Element I",
    {
      c: `unordered_map<int,int> nge;
stack<int> st;
for (int x : nums2) {
  while (!st.empty() && st.top() {{a}} x) { nge[st.top()] = x; st.pop(); }
  st.{{b}}(x);
}
vector<int> ans;
for (int q : nums1) ans.push_back(nge.count(q) ? nge[q] : {{c}});
return ans;`,
      b: [b("a", "<"), b("b", "push"), b("c", "-1")],
    },
    {
      c: `Map<Integer,Integer> nge = new HashMap<>();
Deque<Integer> st = new ArrayDeque<>();
for (int x : nums2) {
  while (!st.isEmpty() && st.peek() {{a}} x) nge.put(st.{{b}}(), x);
  st.push(x);
}
int[] ans = new int[nums1.length];
for (int i = 0; i < nums1.length; i++) ans[i] = nge.getOrDefault(nums1[i], {{c}});
return ans;`,
      b: [b("a", "<"), b("b", "pop"), b("c", "-1")],
    },
    {
      c: `nge, st = {}, []
for x in nums2:
    while st and st[-1] {{a}} x:
        nge[st.pop()] = x
    st.{{b}}(x)
return [nge.get(q, {{c}}) for q in nums1]`,
      b: [b("a", "<"), b("b", "append"), b("c", "-1")],
    },
  ),
  d(
    "daily-temperatures",
    "Daily Temperatures",
    {
      c: `int n = t.size();
vector<int> ans(n, 0);
stack<int> st;
for (int i = 0; i < n; i++) {
  while (!st.empty() && t[st.top()] {{a}} t[i]) {
    int j = st.top(); st.pop();
    ans[j] = i {{b}} j;
  }
  st.push({{c}});
}
return ans;`,
      b: [b("a", "<"), b("b", "-"), b("c", "i")],
    },
    {
      c: `int n = t.length;
int[] ans = new int[n];
Deque<Integer> st = new ArrayDeque<>();
for (int i = 0; i < n; i++) {
  while (!st.isEmpty() && t[st.peek()] {{a}} t[i]) {
    int j = st.pop();
    ans[j] = i {{b}} j;
  }
  st.push({{c}});
}
return ans;`,
      b: [b("a", "<"), b("b", "-"), b("c", "i")],
    },
    {
      c: `n = len(t)
ans = [0] * n
st = []
for i, x in enumerate(t):
    while st and t[st[-1]] {{a}} x:
        j = st.pop()
        ans[j] = i {{b}} j
    st.append({{c}})
return ans`,
      b: [b("a", "<"), b("b", "-"), b("c", "i")],
    },
  ),
  d(
    "largest-rectangle-in-histogram",
    "Largest Rectangle in Histogram",
    {
      c: `stack<int> st;
int best = 0, n = h.size();
for (int i = 0; i <= n; i++) {
  int cur = (i == n) ? 0 : h[i];
  while (!st.empty() && h[st.top()] {{a}} cur) {
    int top = st.top(); st.pop();
    int width = st.empty() ? i : i - st.top() {{b}} 1;
    best = max(best, h[top] * {{c}});
  }
  st.push(i);
}
return best;`,
      b: [b("a", ">"), b("b", "-"), b("c", "width")],
    },
    {
      c: `Deque<Integer> st = new ArrayDeque<>();
int best = 0, n = h.length;
for (int i = 0; i <= n; i++) {
  int cur = (i == n) ? 0 : h[i];
  while (!st.isEmpty() && h[st.peek()] {{a}} cur) {
    int top = st.pop();
    int width = st.isEmpty() ? i : i - st.peek() {{b}} 1;
    best = Math.max(best, h[top] * {{c}});
  }
  st.push(i);
}
return best;`,
      b: [b("a", ">"), b("b", "-"), b("c", "width")],
    },
    {
      c: `st, best, n = [], 0, len(h)
for i in range(n + 1):
    cur = 0 if i == n else h[i]
    while st and h[st[-1]] {{a}} cur:
        top = st.pop()
        width = i if not st else i - st[-1] {{b}} 1
        best = max(best, h[top] * {{c}})
    st.append(i)
return best`,
      b: [b("a", ">"), b("b", "-"), b("c", "width")],
    },
  ),
  {
    id: "trapping-rain-water-stack",
    title: "Trapping Rain Water (monotonic stack)",
    url: lc("trapping-rain-water"),
    snippets: [
      {
        language: "C++",
        template: `stack<int> st;
int water = 0;
for (int i = 0; i < (int)h.size(); i++) {
  while (!st.empty() && h[i] {{a}} h[st.top()]) {
    int mid = st.top(); st.pop();
    if (st.empty()) break;
    int width = i - st.top() {{b}} 1;
    int height = min(h[i], h[st.top()]) - h[mid];
    water += width * {{c}};
  }
  st.push(i);
}
return water;`,
        blanks: [b("a", ">"), b("b", "-"), b("c", "height")],
      },
      {
        language: "Java",
        template: `Deque<Integer> st = new ArrayDeque<>();
int water = 0;
for (int i = 0; i < h.length; i++) {
  while (!st.isEmpty() && h[i] {{a}} h[st.peek()]) {
    int mid = st.pop();
    if (st.isEmpty()) break;
    int width = i - st.peek() {{b}} 1;
    int height = Math.min(h[i], h[st.peek()]) - h[mid];
    water += width * {{c}};
  }
  st.push(i);
}
return water;`,
        blanks: [b("a", ">"), b("b", "-"), b("c", "height")],
      },
      {
        language: "Python",
        template: `st, water = [], 0
for i, x in enumerate(h):
    while st and x {{a}} h[st[-1]]:
        mid = st.pop()
        if not st: break
        width = i - st[-1] {{b}} 1
        height = min(x, h[st[-1]]) - h[mid]
        water += width * {{c}}
    st.append(i)
return water`,
        blanks: [b("a", ">"), b("b", "-"), b("c", "height")],
      },
    ],
  },
];

// =====================================================================
// FAST / SLOW POINTERS
// =====================================================================
const fastSlow: Drill[] = [
  d(
    "linked-list-cycle",
    "Linked List Cycle (Floyd's)",
    {
      c: `ListNode *slow = head, *fast = head;
while (fast && fast->{{a}}) {
  slow = slow->next;
  fast = fast->next->{{b}};
  if (slow == fast) return {{c}};
}
return false;`,
      b: [b("a", "next"), b("b", "next"), b("c", "true")],
    },
    {
      c: `ListNode slow = head, fast = head;
while (fast != null && fast.{{a}} != null) {
  slow = slow.next;
  fast = fast.next.{{b}};
  if (slow == fast) return {{c}};
}
return false;`,
      b: [b("a", "next"), b("b", "next"), b("c", "true")],
    },
    {
      c: `slow = fast = head
while fast and fast.{{a}}:
    slow = slow.next
    fast = fast.next.{{b}}
    if slow is fast: return {{c}}
return False`,
      b: [b("a", "next"), b("b", "next"), b("c", "True")],
    },
  ),
  d(
    "linked-list-cycle-ii",
    "Linked List Cycle II (entry node)",
    {
      c: `ListNode *slow = head, *fast = head;
while (fast && fast->next) {
  slow = slow->next; fast = fast->next->next;
  if (slow == fast) {
    ListNode* p = {{a}};
    while (p != slow) { p = p->next; slow = slow->{{b}}; }
    return {{c}};
  }
}
return nullptr;`,
      b: [b("a", "head"), b("b", "next"), b("c", "p")],
    },
    {
      c: `ListNode slow = head, fast = head;
while (fast != null && fast.next != null) {
  slow = slow.next; fast = fast.next.next;
  if (slow == fast) {
    ListNode p = {{a}};
    while (p != slow) { p = p.next; slow = slow.{{b}}; }
    return {{c}};
  }
}
return null;`,
      b: [b("a", "head"), b("b", "next"), b("c", "p")],
    },
    {
      c: `slow = fast = head
while fast and fast.next:
    slow, fast = slow.next, fast.next.next
    if slow is fast:
        p = {{a}}
        while p is not slow:
            p, slow = p.next, slow.{{b}}
        return {{c}}
return None`,
      b: [b("a", "head"), b("b", "next"), b("c", "p")],
    },
  ),
  d(
    "middle-of-the-linked-list",
    "Middle of the Linked List",
    {
      c: `ListNode *slow = head, *fast = head;
while (fast && fast->{{a}}) {
  slow = slow->{{b}};
  fast = fast->next->next;
}
return {{c}};`,
      b: [b("a", "next"), b("b", "next"), b("c", "slow")],
    },
    {
      c: `ListNode slow = head, fast = head;
while (fast != null && fast.{{a}} != null) {
  slow = slow.{{b}};
  fast = fast.next.next;
}
return {{c}};`,
      b: [b("a", "next"), b("b", "next"), b("c", "slow")],
    },
    {
      c: `slow = fast = head
while fast and fast.{{a}}:
    slow = slow.{{b}}
    fast = fast.next.next
return {{c}}`,
      b: [b("a", "next"), b("b", "next"), b("c", "slow")],
    },
  ),
  d(
    "palindrome-linked-list",
    "Palindrome Linked List (find mid + reverse)",
    {
      c: `ListNode *slow = head, *fast = head;
while (fast && fast->next) { slow = slow->next; fast = fast->next->next; }
ListNode *prev = nullptr, *cur = slow;
while (cur) { auto n = cur->next; cur->next = {{a}}; prev = cur; cur = n; }
ListNode *l = head, *r = prev;
while (r) {
  if (l->val != r->val) return {{b}};
  l = l->next; r = r->{{c}};
}
return true;`,
      b: [b("a", "prev"), b("b", "false"), b("c", "next")],
    },
    {
      c: `ListNode slow = head, fast = head;
while (fast != null && fast.next != null) { slow = slow.next; fast = fast.next.next; }
ListNode prev = null, cur = slow;
while (cur != null) { ListNode n = cur.next; cur.next = {{a}}; prev = cur; cur = n; }
ListNode l = head, r = prev;
while (r != null) {
  if (l.val != r.val) return {{b}};
  l = l.next; r = r.{{c}};
}
return true;`,
      b: [b("a", "prev"), b("b", "false"), b("c", "next")],
    },
    {
      c: `slow = fast = head
while fast and fast.next:
    slow, fast = slow.next, fast.next.next
prev, cur = None, slow
while cur:
    nxt = cur.next
    cur.next = {{a}}
    prev, cur = cur, nxt
l, r = head, prev
while r:
    if l.val != r.val: return {{b}}
    l, r = l.next, r.{{c}}
return True`,
      b: [b("a", "prev"), b("b", "False"), b("c", "next")],
    },
  ),
];

// =====================================================================
// REVERSE LIST
// =====================================================================
const reverseList: Drill[] = [
  d(
    "reverse-linked-list",
    "Reverse Linked List (iterative)",
    {
      c: `ListNode *prev = nullptr, *cur = head;
while (cur) {
  ListNode* nxt = cur->{{a}};
  cur->next = {{b}};
  prev = cur;
  cur = {{c}};
}
return prev;`,
      b: [b("a", "next"), b("b", "prev"), b("c", "nxt", ["next"])],
    },
    {
      c: `ListNode prev = null, cur = head;
while (cur != null) {
  ListNode nxt = cur.{{a}};
  cur.next = {{b}};
  prev = cur;
  cur = {{c}};
}
return prev;`,
      b: [b("a", "next"), b("b", "prev"), b("c", "nxt", ["next"])],
    },
    {
      c: `prev, cur = None, head
while cur:
    nxt = cur.{{a}}
    cur.next = {{b}}
    prev, cur = cur, {{c}}
return prev`,
      b: [b("a", "next"), b("b", "prev"), b("c", "nxt", ["next"])],
    },
  ),
  d(
    "reverse-linked-list-ii",
    "Reverse Linked List II [left..right]",
    {
      c: `ListNode dummy(0, head), *pre = &dummy;
for (int i = 1; i < left; i++) pre = pre->next;
ListNode* cur = pre->{{a}};
for (int i = 0; i < right - left; i++) {
  ListNode* nxt = cur->next;
  cur->next = nxt->next;
  nxt->next = pre->{{b}};
  pre->next = {{c}};
}
return dummy.next;`,
      b: [b("a", "next"), b("b", "next"), b("c", "nxt", ["next"])],
    },
    {
      c: `ListNode dummy = new ListNode(0, head), pre = dummy;
for (int i = 1; i < left; i++) pre = pre.next;
ListNode cur = pre.{{a}};
for (int i = 0; i < right - left; i++) {
  ListNode nxt = cur.next;
  cur.next = nxt.next;
  nxt.next = pre.{{b}};
  pre.next = {{c}};
}
return dummy.next;`,
      b: [b("a", "next"), b("b", "next"), b("c", "nxt", ["next"])],
    },
    {
      c: `dummy = ListNode(0, head); pre = dummy
for _ in range(left - 1): pre = pre.next
cur = pre.{{a}}
for _ in range(right - left):
    nxt = cur.next
    cur.next = nxt.next
    nxt.next = pre.{{b}}
    pre.next = {{c}}
return dummy.next`,
      b: [b("a", "next"), b("b", "next"), b("c", "nxt", ["next"])],
    },
  ),
  d(
    "reverse-nodes-in-k-group",
    "Reverse Nodes in k-Group",
    {
      c: `auto count = [](ListNode* n) { int c = 0; while (n) { c++; n = n->next; } return c; };
ListNode dummy(0, head), *pre = &dummy;
int n = count(head);
while (n >= {{a}}) {
  ListNode* cur = pre->next;
  for (int i = 0; i < k - 1; i++) {
    ListNode* nxt = cur->next;
    cur->next = nxt->next;
    nxt->next = pre->{{b}};
    pre->next = nxt;
  }
  pre = {{c}};
  n -= k;
}
return dummy.next;`,
      b: [b("a", "k"), b("b", "next"), b("c", "cur")],
    },
    {
      c: `int n = 0; for (ListNode t = head; t != null; t = t.next) n++;
ListNode dummy = new ListNode(0, head), pre = dummy;
while (n >= {{a}}) {
  ListNode cur = pre.next;
  for (int i = 0; i < k - 1; i++) {
    ListNode nxt = cur.next;
    cur.next = nxt.next;
    nxt.next = pre.{{b}};
    pre.next = nxt;
  }
  pre = {{c}};
  n -= k;
}
return dummy.next;`,
      b: [b("a", "k"), b("b", "next"), b("c", "cur")],
    },
    {
      c: `n, t = 0, head
while t: n += 1; t = t.next
dummy = ListNode(0, head); pre = dummy
while n >= {{a}}:
    cur = pre.next
    for _ in range(k - 1):
        nxt = cur.next
        cur.next = nxt.next
        nxt.next = pre.{{b}}
        pre.next = nxt
    pre = {{c}}
    n -= k
return dummy.next`,
      b: [b("a", "k"), b("b", "next"), b("c", "cur")],
    },
  ),
];

// =====================================================================
// TREE DFS
// =====================================================================
const treeDfs: Drill[] = [
  d(
    "maximum-depth-of-binary-tree",
    "Maximum Depth of Binary Tree",
    {
      c: `int depth(TreeNode* r) {
  if (!r) return {{a}};
  return 1 + max(depth(r->{{b}}), depth(r->{{c}}));
}`,
      b: [b("a", "0"), b("b", "left"), b("c", "right")],
    },
    {
      c: `int depth(TreeNode r) {
  if (r == null) return {{a}};
  return 1 + Math.max(depth(r.{{b}}), depth(r.{{c}}));
}`,
      b: [b("a", "0"), b("b", "left"), b("c", "right")],
    },
    {
      c: `def depth(r):
    if not r: return {{a}}
    return 1 + max(depth(r.{{b}}), depth(r.{{c}}))`,
      b: [b("a", "0"), b("b", "left"), b("c", "right")],
    },
  ),
  d(
    "diameter-of-binary-tree",
    "Diameter of Binary Tree",
    {
      c: `int best = 0;
int depth(TreeNode* r) {
  if (!r) return 0;
  int l = depth(r->left), rr = depth(r->right);
  best = max(best, l {{a}} rr);
  return 1 + max(l, {{b}});
}
// call depth(root) then return {{c}};`,
      b: [b("a", "+"), b("b", "rr"), b("c", "best")],
    },
    {
      c: `int best = 0;
int depth(TreeNode r) {
  if (r == null) return 0;
  int l = depth(r.left), rr = depth(r.right);
  best = Math.max(best, l {{a}} rr);
  return 1 + Math.max(l, {{b}});
}
// after depth(root) return {{c}};`,
      b: [b("a", "+"), b("b", "rr"), b("c", "best")],
    },
    {
      c: `self.best = 0
def depth(r):
    if not r: return 0
    l, rr = depth(r.left), depth(r.right)
    self.best = max(self.best, l {{a}} rr)
    return 1 + max(l, {{b}})
depth(root)
return self.{{c}}`,
      b: [b("a", "+"), b("b", "rr"), b("c", "best")],
    },
  ),
  d(
    "binary-tree-maximum-path-sum",
    "Binary Tree Maximum Path Sum",
    {
      c: `int best = INT_MIN;
int gain(TreeNode* r) {
  if (!r) return 0;
  int l = max(0, gain(r->left));
  int rr = max({{a}}, gain(r->right));
  best = max(best, r->val + l {{b}} rr);
  return r->val + max(l, {{c}});
}`,
      b: [b("a", "0"), b("b", "+"), b("c", "rr")],
    },
    {
      c: `int best = Integer.MIN_VALUE;
int gain(TreeNode r) {
  if (r == null) return 0;
  int l = Math.max(0, gain(r.left));
  int rr = Math.max({{a}}, gain(r.right));
  best = Math.max(best, r.val + l {{b}} rr);
  return r.val + Math.max(l, {{c}});
}`,
      b: [b("a", "0"), b("b", "+"), b("c", "rr")],
    },
    {
      c: `self.best = float('-inf')
def gain(r):
    if not r: return 0
    l = max(0, gain(r.left))
    rr = max({{a}}, gain(r.right))
    self.best = max(self.best, r.val + l {{b}} rr)
    return r.val + max(l, {{c}})`,
      b: [b("a", "0"), b("b", "+"), b("c", "rr")],
    },
  ),
  d(
    "lowest-common-ancestor-of-a-binary-tree",
    "Lowest Common Ancestor",
    {
      c: `TreeNode* lca(TreeNode* r, TreeNode* p, TreeNode* q) {
  if (!r || r == p || r == q) return {{a}};
  auto l = lca(r->left, p, q);
  auto rr = lca(r->right, p, q);
  if (l && rr) return {{b}};
  return l ? l : {{c}};
}`,
      b: [b("a", "r"), b("b", "r"), b("c", "rr")],
    },
    {
      c: `TreeNode lca(TreeNode r, TreeNode p, TreeNode q) {
  if (r == null || r == p || r == q) return {{a}};
  TreeNode l = lca(r.left, p, q), rr = lca(r.right, p, q);
  if (l != null && rr != null) return {{b}};
  return l != null ? l : {{c}};
}`,
      b: [b("a", "r"), b("b", "r"), b("c", "rr")],
    },
    {
      c: `def lca(r, p, q):
    if not r or r is p or r is q: return {{a}}
    l = lca(r.left, p, q)
    rr = lca(r.right, p, q)
    if l and rr: return {{b}}
    return l or {{c}}`,
      b: [b("a", "r"), b("b", "r"), b("c", "rr")],
    },
  ),
];

// =====================================================================
// TREE BFS
// =====================================================================
const treeBfs: Drill[] = [
  d(
    "binary-tree-level-order-traversal",
    "Binary Tree Level Order",
    {
      c: `vector<vector<int>> ans;
if (!root) return ans;
queue<TreeNode*> q; q.push(root);
while (!q.empty()) {
  int sz = q.size();
  vector<int> level;
  for (int i = 0; i < {{a}}; i++) {
    TreeNode* n = q.front(); q.pop();
    level.push_back(n->val);
    if (n->left)  q.push(n->{{b}});
    if (n->right) q.push(n->right);
  }
  ans.push_back({{c}});
}
return ans;`,
      b: [b("a", "sz"), b("b", "left"), b("c", "level")],
    },
    {
      c: `List<List<Integer>> ans = new ArrayList<>();
if (root == null) return ans;
Queue<TreeNode> q = new ArrayDeque<>(); q.offer(root);
while (!q.isEmpty()) {
  int sz = q.size();
  List<Integer> level = new ArrayList<>();
  for (int i = 0; i < {{a}}; i++) {
    TreeNode n = q.poll();
    level.add(n.val);
    if (n.left != null)  q.offer(n.{{b}});
    if (n.right != null) q.offer(n.right);
  }
  ans.add({{c}});
}
return ans;`,
      b: [b("a", "sz"), b("b", "left"), b("c", "level")],
    },
    {
      c: `from collections import deque
ans = []
if not root: return ans
q = deque([root])
while q:
    sz = len(q)
    level = []
    for _ in range({{a}}):
        n = q.popleft()
        level.append(n.val)
        if n.left:  q.append(n.{{b}})
        if n.right: q.append(n.right)
    ans.append({{c}})
return ans`,
      b: [b("a", "sz"), b("b", "left"), b("c", "level")],
    },
  ),
  d(
    "binary-tree-right-side-view",
    "Binary Tree Right Side View",
    {
      c: `vector<int> ans;
if (!root) return ans;
queue<TreeNode*> q; q.push(root);
while (!q.empty()) {
  int sz = q.size();
  for (int i = 0; i < sz; i++) {
    TreeNode* n = q.front(); q.pop();
    if (i == sz {{a}} 1) ans.push_back(n->{{b}});
    if (n->left)  q.push(n->left);
    if (n->right) q.push(n->{{c}});
  }
}
return ans;`,
      b: [b("a", "-"), b("b", "val"), b("c", "right")],
    },
    {
      c: `List<Integer> ans = new ArrayList<>();
if (root == null) return ans;
Queue<TreeNode> q = new ArrayDeque<>(); q.offer(root);
while (!q.isEmpty()) {
  int sz = q.size();
  for (int i = 0; i < sz; i++) {
    TreeNode n = q.poll();
    if (i == sz {{a}} 1) ans.add(n.{{b}});
    if (n.left != null)  q.offer(n.left);
    if (n.right != null) q.offer(n.{{c}});
  }
}
return ans;`,
      b: [b("a", "-"), b("b", "val"), b("c", "right")],
    },
    {
      c: `from collections import deque
ans = []
if not root: return ans
q = deque([root])
while q:
    sz = len(q)
    for i in range(sz):
        n = q.popleft()
        if i == sz {{a}} 1: ans.append(n.{{b}})
        if n.left: q.append(n.left)
        if n.right: q.append(n.{{c}})
return ans`,
      b: [b("a", "-"), b("b", "val"), b("c", "right")],
    },
  ),
  d(
    "binary-tree-zigzag-level-order-traversal",
    "Zigzag Level Order",
    {
      c: `vector<vector<int>> ans;
if (!root) return ans;
queue<TreeNode*> q; q.push(root);
bool ltr = true;
while (!q.empty()) {
  int sz = q.size();
  vector<int> level(sz);
  for (int i = 0; i < sz; i++) {
    TreeNode* n = q.front(); q.pop();
    int idx = ltr ? i : sz - 1 {{a}} i;
    level[idx] = n->val;
    if (n->left)  q.push(n->left);
    if (n->right) q.push(n->right);
  }
  ans.push_back(level);
  ltr = {{b}};
}
return {{c}};`,
      b: [b("a", "-"), b("b", "!ltr", ["not ltr"]), b("c", "ans")],
    },
    {
      c: `List<List<Integer>> ans = new ArrayList<>();
if (root == null) return ans;
Queue<TreeNode> q = new ArrayDeque<>(); q.offer(root);
boolean ltr = true;
while (!q.isEmpty()) {
  int sz = q.size();
  Integer[] level = new Integer[sz];
  for (int i = 0; i < sz; i++) {
    TreeNode n = q.poll();
    int idx = ltr ? i : sz - 1 {{a}} i;
    level[idx] = n.val;
    if (n.left != null)  q.offer(n.left);
    if (n.right != null) q.offer(n.right);
  }
  ans.add(Arrays.asList(level));
  ltr = {{b}};
}
return {{c}};`,
      b: [b("a", "-"), b("b", "!ltr"), b("c", "ans")],
    },
    {
      c: `from collections import deque
ans = []
if not root: return ans
q, ltr = deque([root]), True
while q:
    sz = len(q)
    level = [0] * sz
    for i in range(sz):
        n = q.popleft()
        idx = i if ltr else sz - 1 {{a}} i
        level[idx] = n.val
        if n.left: q.append(n.left)
        if n.right: q.append(n.right)
    ans.append(level)
    ltr = {{b}} ltr
return {{c}}`,
      b: [b("a", "-"), b("b", "not"), b("c", "ans")],
    },
  ),
];

// =====================================================================
// GRAPH BFS/DFS
// =====================================================================
const graphBfsDfs: Drill[] = [
  d(
    "number-of-islands",
    "Number of Islands (grid DFS)",
    {
      c: `int m = g.size(), n = g[0].size(), ans = 0;
function<void(int,int)> dfs = [&](int r, int c) {
  if (r < 0 || c < 0 || r >= m || c >= n || g[r][c] != '1') return;
  g[r][c] = {{a}};
  dfs(r + 1, c); dfs(r - 1, c);
  dfs(r, c + 1); dfs(r, c {{b}} 1);
};
for (int r = 0; r < m; r++)
  for (int c = 0; c < n; c++)
    if (g[r][c] == '1') { ans++; dfs(r, {{c}}); }
return ans;`,
      b: [b("a", "'0'", ['"0"']), b("b", "-"), b("c", "c")],
    },
    {
      c: `int m = g.length, n = g[0].length, ans = 0;
for (int r = 0; r < m; r++)
  for (int c = 0; c < n; c++)
    if (g[r][c] == '1') { ans++; dfs(g, r, {{c}}); }
return ans;
// void dfs(char[][] g, int r, int c) {
//   if (r<0||c<0||r>=g.length||c>=g[0].length||g[r][c]!='1') return;
//   g[r][c] = {{a}};
//   dfs(g,r+1,c); dfs(g,r-1,c); dfs(g,r,c+1); dfs(g,r,c {{b}} 1);
// }`,
      b: [b("a", "'0'"), b("b", "-"), b("c", "c")],
    },
    {
      c: `m, n, ans = len(g), len(g[0]), 0
def dfs(r, c):
    if r < 0 or c < 0 or r >= m or c >= n or g[r][c] != '1': return
    g[r][c] = {{a}}
    dfs(r+1, c); dfs(r-1, c); dfs(r, c+1); dfs(r, c {{b}} 1)
for r in range(m):
    for c in range(n):
        if g[r][c] == '1':
            ans += 1
            dfs(r, {{c}})
return ans`,
      b: [b("a", "'0'", ['"0"']), b("b", "-"), b("c", "c")],
    },
  ),
  d(
    "clone-graph",
    "Clone Graph (BFS)",
    {
      c: `if (!node) return nullptr;
unordered_map<Node*, Node*> mp;
queue<Node*> q; q.push(node);
mp[node] = new Node(node->val);
while (!q.empty()) {
  Node* u = q.front(); q.pop();
  for (Node* v : u->neighbors) {
    if (!mp.count(v)) { mp[v] = new Node(v->{{a}}); q.push(v); }
    mp[u]->neighbors.push_back(mp[{{b}}]);
  }
}
return mp[{{c}}];`,
      b: [b("a", "val"), b("b", "v"), b("c", "node")],
    },
    {
      c: `if (node == null) return null;
Map<Node,Node> mp = new HashMap<>();
Queue<Node> q = new ArrayDeque<>(); q.offer(node);
mp.put(node, new Node(node.val));
while (!q.isEmpty()) {
  Node u = q.poll();
  for (Node v : u.neighbors) {
    if (!mp.containsKey(v)) { mp.put(v, new Node(v.{{a}})); q.offer(v); }
    mp.get(u).neighbors.add(mp.get({{b}}));
  }
}
return mp.get({{c}});`,
      b: [b("a", "val"), b("b", "v"), b("c", "node")],
    },
    {
      c: `if not node: return None
from collections import deque
mp = {node: Node(node.val)}
q = deque([node])
while q:
    u = q.popleft()
    for v in u.neighbors:
        if v not in mp:
            mp[v] = Node(v.{{a}})
            q.append(v)
        mp[u].neighbors.append(mp[{{b}}])
return mp[{{c}}]`,
      b: [b("a", "val"), b("b", "v"), b("c", "node")],
    },
  ),
  d(
    "rotting-oranges",
    "Rotting Oranges (multi-source BFS)",
    {
      c: `int m = g.size(), n = g[0].size(), fresh = 0, mins = 0;
queue<pair<int,int>> q;
for (int i = 0; i < m; i++) for (int j = 0; j < n; j++) {
  if (g[i][j] == 2) q.push({i, j});
  else if (g[i][j] == 1) fresh{{a}};
}
int dr[] = {1,-1,0,0}, dc[] = {0,0,1,-1};
while (!q.empty() && fresh > 0) {
  int sz = q.size();
  for (int k = 0; k < sz; k++) {
    auto [r, c] = q.front(); q.pop();
    for (int d = 0; d < 4; d++) {
      int nr = r + dr[d], nc = c + dc[d];
      if (nr < 0 || nc < 0 || nr >= m || nc >= n || g[nr][nc] != 1) continue;
      g[nr][nc] = 2; fresh{{b}}; q.push({nr, nc});
    }
  }
  mins++;
}
return fresh == 0 ? mins : {{c}};`,
      b: [b("a", "++"), b("b", "--"), b("c", "-1")],
    },
    {
      c: `int m = g.length, n = g[0].length, fresh = 0, mins = 0;
Queue<int[]> q = new ArrayDeque<>();
for (int i=0;i<m;i++) for (int j=0;j<n;j++) {
  if (g[i][j]==2) q.offer(new int[]{i,j});
  else if (g[i][j]==1) fresh{{a}};
}
int[] dr={1,-1,0,0}, dc={0,0,1,-1};
while (!q.isEmpty() && fresh > 0) {
  int sz = q.size();
  for (int k=0;k<sz;k++) {
    int[] cur = q.poll();
    for (int d=0; d<4; d++) {
      int nr = cur[0]+dr[d], nc = cur[1]+dc[d];
      if (nr<0||nc<0||nr>=m||nc>=n||g[nr][nc]!=1) continue;
      g[nr][nc]=2; fresh{{b}}; q.offer(new int[]{nr,nc});
    }
  }
  mins++;
}
return fresh == 0 ? mins : {{c}};`,
      b: [b("a", "++"), b("b", "--"), b("c", "-1")],
    },
    {
      c: `from collections import deque
m, n = len(g), len(g[0])
fresh, mins = 0, 0
q = deque()
for i in range(m):
    for j in range(n):
        if g[i][j] == 2: q.append((i,j))
        elif g[i][j] == 1: fresh {{a}} 1
while q and fresh > 0:
    for _ in range(len(q)):
        r, c = q.popleft()
        for dr, dc in ((1,0),(-1,0),(0,1),(0,-1)):
            nr, nc = r+dr, c+dc
            if 0<=nr<m and 0<=nc<n and g[nr][nc]==1:
                g[nr][nc] = 2; fresh {{b}} 1
                q.append((nr,nc))
    mins += 1
return mins if fresh == 0 else {{c}}`,
      b: [b("a", "+="), b("b", "-="), b("c", "-1")],
    },
  ),
  d(
    "word-ladder",
    "Word Ladder (BFS on patterns)",
    {
      c: `unordered_set<string> dict(wordList.begin(), wordList.end());
if (!dict.count(endWord)) return 0;
queue<string> q; q.push(beginWord);
int steps = 1;
while (!q.empty()) {
  int sz = q.size();
  for (int k = 0; k < sz; k++) {
    string w = q.front(); q.pop();
    if (w == endWord) return {{a}};
    for (int i = 0; i < (int)w.size(); i++) {
      char orig = w[i];
      for (char c = 'a'; c <= 'z'; c++) {
        w[i] = c;
        if (dict.count(w)) { q.push(w); dict.{{b}}(w); }
      }
      w[i] = orig;
    }
  }
  steps{{c}};
}
return 0;`,
      b: [b("a", "steps"), b("b", "erase"), b("c", "++")],
    },
    {
      c: `Set<String> dict = new HashSet<>(wordList);
if (!dict.contains(endWord)) return 0;
Queue<String> q = new ArrayDeque<>(); q.offer(beginWord);
int steps = 1;
while (!q.isEmpty()) {
  int sz = q.size();
  for (int k = 0; k < sz; k++) {
    String w = q.poll();
    if (w.equals(endWord)) return {{a}};
    char[] arr = w.toCharArray();
    for (int i = 0; i < arr.length; i++) {
      char orig = arr[i];
      for (char c = 'a'; c <= 'z'; c++) {
        arr[i] = c;
        String nw = new String(arr);
        if (dict.contains(nw)) { q.offer(nw); dict.{{b}}(nw); }
      }
      arr[i] = orig;
    }
  }
  steps{{c}};
}
return 0;`,
      b: [b("a", "steps"), b("b", "remove"), b("c", "++")],
    },
    {
      c: `from collections import deque
d = set(wordList)
if endWord not in d: return 0
q, steps = deque([beginWord]), 1
while q:
    for _ in range(len(q)):
        w = q.popleft()
        if w == endWord: return {{a}}
        for i in range(len(w)):
            for c in 'abcdefghijklmnopqrstuvwxyz':
                nw = w[:i] + c + w[i+1:]
                if nw in d:
                    q.append(nw); d.{{b}}(nw)
    steps {{c}} 1
return 0`,
      b: [b("a", "steps"), b("b", "discard", ["remove"]), b("c", "+=")],
    },
  ),
];

// =====================================================================
// TOPO SORT (Kahn)
// =====================================================================
const topoSort: Drill[] = [
  d(
    "course-schedule",
    "Course Schedule (cycle detection)",
    {
      c: `vector<vector<int>> adj(n);
vector<int> indeg(n, 0);
for (auto& p : pre) { adj[p[1]].push_back(p[0]); indeg[p[0]]{{a}}; }
queue<int> q;
for (int i = 0; i < n; i++) if (indeg[i] == {{b}}) q.push(i);
int done = 0;
while (!q.empty()) {
  int u = q.front(); q.pop(); done++;
  for (int v : adj[u]) if (--indeg[v] == 0) q.push(v);
}
return done == {{c}};`,
      b: [b("a", "++"), b("b", "0"), b("c", "n")],
    },
    {
      c: `List<List<Integer>> adj = new ArrayList<>();
for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
int[] indeg = new int[n];
for (int[] p : pre) { adj.get(p[1]).add(p[0]); indeg[p[0]]{{a}}; }
Deque<Integer> q = new ArrayDeque<>();
for (int i = 0; i < n; i++) if (indeg[i] == {{b}}) q.offer(i);
int done = 0;
while (!q.isEmpty()) {
  int u = q.poll(); done++;
  for (int v : adj.get(u)) if (--indeg[v] == 0) q.offer(v);
}
return done == {{c}};`,
      b: [b("a", "++"), b("b", "0"), b("c", "n")],
    },
    {
      c: `from collections import deque
adj = [[] for _ in range(n)]
indeg = [0] * n
for a, b_ in pre:
    adj[b_].append(a)
    indeg[a] {{a}} 1
q = deque(i for i in range(n) if indeg[i] == {{b}})
done = 0
while q:
    u = q.popleft(); done += 1
    for v in adj[u]:
        indeg[v] -= 1
        if indeg[v] == 0: q.append(v)
return done == {{c}}`,
      b: [b("a", "+="), b("b", "0"), b("c", "n")],
    },
  ),
  d(
    "course-schedule-ii",
    "Course Schedule II (return order)",
    {
      c: `vector<vector<int>> adj(n);
vector<int> indeg(n, 0), order;
for (auto& p : pre) { adj[p[1]].push_back(p[0]); indeg[p[0]]++; }
queue<int> q;
for (int i = 0; i < n; i++) if (indeg[i] == 0) q.push(i);
while (!q.empty()) {
  int u = q.front(); q.pop();
  order.{{a}}(u);
  for (int v : adj[u]) if (--indeg[v] == {{b}}) q.push(v);
}
return (int)order.size() == n ? order : vector<int>{{c}};`,
      b: [b("a", "push_back"), b("b", "0"), b("c", "{}", ["()"])],
    },
    {
      c: `List<List<Integer>> adj = new ArrayList<>();
for (int i=0;i<n;i++) adj.add(new ArrayList<>());
int[] indeg = new int[n];
for (int[] p : pre) { adj.get(p[1]).add(p[0]); indeg[p[0]]++; }
Deque<Integer> q = new ArrayDeque<>();
for (int i=0;i<n;i++) if (indeg[i]==0) q.offer(i);
int[] order = new int[n]; int idx = 0;
while (!q.isEmpty()) {
  int u = q.poll();
  order[idx++] = u;
  for (int v : adj.get(u)) if (--indeg[v] == {{a}}) q.offer(v);
}
return idx == {{b}} ? order : new int[]{{c}};`,
      b: [b("a", "0"), b("b", "n"), b("c", "{}")],
    },
    {
      c: `from collections import deque
adj = [[] for _ in range(n)]
indeg = [0]*n
for a, b_ in pre:
    adj[b_].append(a); indeg[a] += 1
q = deque(i for i in range(n) if indeg[i]==0)
order = []
while q:
    u = q.popleft()
    order.{{a}}(u)
    for v in adj[u]:
        indeg[v] -= 1
        if indeg[v] == {{b}}: q.append(v)
return order if len(order) == n else {{c}}`,
      b: [b("a", "append"), b("b", "0"), b("c", "[]")],
    },
  ),
  d(
    "alien-dictionary",
    "Alien Dictionary (topo on letters)",
    {
      c: `unordered_map<char, unordered_set<char>> adj;
unordered_map<char, int> indeg;
for (auto& w : words) for (char c : w) indeg[c] = 0;
for (int i = 0; i + 1 < (int)words.size(); i++) {
  auto& a = words[i]; auto& b1 = words[i+1];
  int m = min(a.size(), b1.size()), j = 0;
  while (j < m && a[j] == b1[j]) j++;
  if (j < (int)a.size() && j == (int)b1.size()) return "";
  if (j < m && !adj[a[j]].count(b1[j])) { adj[a[j]].insert(b1[j]); indeg[b1[j]]{{a}}; }
}
queue<char> q;
for (auto& [c, d] : indeg) if (d == {{b}}) q.push(c);
string ans;
while (!q.empty()) {
  char u = q.front(); q.pop(); ans += u;
  for (char v : adj[u]) if (--indeg[v] == 0) q.push(v);
}
return ans.size() == indeg.size() ? ans : {{c}};`,
      b: [b("a", "++"), b("b", "0"), b('c', '""', ["''"])],
    },
    {
      c: `Map<Character, Set<Character>> adj = new HashMap<>();
Map<Character, Integer> indeg = new HashMap<>();
for (String w : words) for (char c : w.toCharArray()) indeg.putIfAbsent(c, 0);
for (int i = 0; i + 1 < words.length; i++) {
  String a = words[i], b1 = words[i+1];
  int m = Math.min(a.length(), b1.length()), j = 0;
  while (j < m && a.charAt(j) == b1.charAt(j)) j++;
  if (j < a.length() && j == b1.length()) return "";
  if (j < m) {
    adj.computeIfAbsent(a.charAt(j), z -> new HashSet<>());
    if (adj.get(a.charAt(j)).add(b1.charAt(j)))
      indeg.merge(b1.charAt(j), 1, Integer::{{a}});
  }
}
Deque<Character> q = new ArrayDeque<>();
for (var e : indeg.entrySet()) if (e.getValue() == {{b}}) q.offer(e.getKey());
StringBuilder ans = new StringBuilder();
while (!q.isEmpty()) {
  char u = q.poll(); ans.append(u);
  for (char v : adj.getOrDefault(u, Set.of())) {
    indeg.merge(v, -1, Integer::sum);
    if (indeg.get(v) == 0) q.offer(v);
  }
}
return ans.length() == indeg.size() ? ans.toString() : {{c}};`,
      b: [b("a", "sum"), b("b", "0"), b('c', '""')],
    },
    {
      c: `from collections import deque, defaultdict
adj = defaultdict(set)
indeg = {c: 0 for w in words for c in w}
for a, b_ in zip(words, words[1:]):
    m = min(len(a), len(b_)); j = 0
    while j < m and a[j] == b_[j]: j += 1
    if j < len(a) and j == len(b_): return ""
    if j < m and b_[j] not in adj[a[j]]:
        adj[a[j]].add(b_[j]); indeg[b_[j]] {{a}} 1
q = deque(c for c, d in indeg.items() if d == {{b}})
ans = []
while q:
    u = q.popleft(); ans.append(u)
    for v in adj[u]:
        indeg[v] -= 1
        if indeg[v] == 0: q.append(v)
return "".join(ans) if len(ans) == len(indeg) else {{c}}`,
      b: [b("a", "+="), b("b", "0"), b('c', '""', ["''"])],
    },
  ),
];

// =====================================================================
// DIJKSTRA
// =====================================================================
const dijkstra: Drill[] = [
  d(
    "network-delay-time",
    "Network Delay Time",
    {
      c: `vector<vector<pair<int,int>>> adj(n + 1);
for (auto& t : times) adj[t[0]].push_back({t[1], t[2]});
vector<int> dist(n + 1, INT_MAX);
dist[k] = 0;
priority_queue<pair<int,int>, vector<pair<int,int>>, greater<>> pq;
pq.push({0, k});
while (!pq.empty()) {
  auto [d, u] = pq.top(); pq.pop();
  if (d > dist[u]) continue;
  for (auto& [v, w] : adj[u]) {
    if (d + w {{a}} dist[v]) {
      dist[v] = d + w;
      pq.push({dist[v], {{b}}});
    }
  }
}
int mx = 0;
for (int i = 1; i <= n; i++) mx = max(mx, dist[i]);
return mx == INT_MAX ? -1 : {{c}};`,
      b: [b("a", "<"), b("b", "v"), b("c", "mx")],
    },
    {
      c: `List<int[]>[] adj = new List[n + 1];
for (int i = 1; i <= n; i++) adj[i] = new ArrayList<>();
for (int[] t : times) adj[t[0]].add(new int[]{t[1], t[2]});
int[] dist = new int[n + 1];
Arrays.fill(dist, Integer.MAX_VALUE);
dist[k] = 0;
PriorityQueue<int[]> pq = new PriorityQueue<>((a,b)->a[0]-b[0]);
pq.offer(new int[]{0, k});
while (!pq.isEmpty()) {
  int[] cur = pq.poll();
  int d = cur[0], u = cur[1];
  if (d > dist[u]) continue;
  for (int[] e : adj[u]) {
    int v = e[0], w = e[1];
    if (d + w {{a}} dist[v]) {
      dist[v] = d + w;
      pq.offer(new int[]{dist[v], {{b}}});
    }
  }
}
int mx = 0;
for (int i = 1; i <= n; i++) mx = Math.max(mx, dist[i]);
return mx == Integer.MAX_VALUE ? -1 : {{c}};`,
      b: [b("a", "<"), b("b", "v"), b("c", "mx")],
    },
    {
      c: `import heapq
from collections import defaultdict
adj = defaultdict(list)
for u, v, w in times: adj[u].append((v, w))
dist = {i: float('inf') for i in range(1, n + 1)}
dist[k] = 0
pq = [(0, k)]
while pq:
    d, u = heapq.heappop(pq)
    if d > dist[u]: continue
    for v, w in adj[u]:
        if d + w {{a}} dist[v]:
            dist[v] = d + w
            heapq.heappush(pq, (dist[v], {{b}}))
mx = max(dist.values())
return -1 if mx == float('inf') else {{c}}`,
      b: [b("a", "<"), b("b", "v"), b("c", "mx")],
    },
  ),
  d(
    "cheapest-flights-within-k-stops",
    "Cheapest Flights Within K Stops (Bellman-Ford k+1)",
    {
      c: `vector<int> dist(n, INT_MAX);
dist[src] = 0;
for (int i = 0; i <= k; i++) {
  vector<int> tmp = dist;
  for (auto& f : flights) {
    int u = f[0], v = f[1], w = f[2];
    if (dist[u] == INT_MAX) continue;
    if (dist[u] + w {{a}} tmp[v]) tmp[v] = dist[u] + w;
  }
  dist = {{b}};
}
return dist[dst] == INT_MAX ? -1 : dist[{{c}}];`,
      b: [b("a", "<"), b("b", "tmp"), b("c", "dst")],
    },
    {
      c: `int[] dist = new int[n];
Arrays.fill(dist, Integer.MAX_VALUE);
dist[src] = 0;
for (int i = 0; i <= k; i++) {
  int[] tmp = dist.clone();
  for (int[] f : flights) {
    int u = f[0], v = f[1], w = f[2];
    if (dist[u] == Integer.MAX_VALUE) continue;
    if (dist[u] + w {{a}} tmp[v]) tmp[v] = dist[u] + w;
  }
  dist = {{b}};
}
return dist[dst] == Integer.MAX_VALUE ? -1 : dist[{{c}}];`,
      b: [b("a", "<"), b("b", "tmp"), b("c", "dst")],
    },
    {
      c: `dist = [float('inf')] * n
dist[src] = 0
for _ in range(k + 1):
    tmp = dist[:]
    for u, v, w in flights:
        if dist[u] == float('inf'): continue
        if dist[u] + w {{a}} tmp[v]:
            tmp[v] = dist[u] + w
    dist = {{b}}
return -1 if dist[dst] == float('inf') else dist[{{c}}]`,
      b: [b("a", "<"), b("b", "tmp"), b("c", "dst")],
    },
  ),
  d(
    "path-with-minimum-effort",
    "Path With Minimum Effort (Dijkstra on grid)",
    {
      c: `int m = h.size(), n = h[0].size();
vector<vector<int>> eff(m, vector<int>(n, INT_MAX));
eff[0][0] = 0;
priority_queue<tuple<int,int,int>, vector<tuple<int,int,int>>, greater<>> pq;
pq.push({0, 0, 0});
int dr[] = {1,-1,0,0}, dc[] = {0,0,1,-1};
while (!pq.empty()) {
  auto [e, r, c] = pq.top(); pq.pop();
  if (r == m - 1 && c == n - 1) return {{a}};
  if (e > eff[r][c]) continue;
  for (int d = 0; d < 4; d++) {
    int nr = r + dr[d], nc = c + dc[d];
    if (nr < 0 || nc < 0 || nr >= m || nc >= n) continue;
    int ne = max(e, abs(h[nr][nc] - h[r][c]));
    if (ne {{b}} eff[nr][nc]) {
      eff[nr][nc] = ne;
      pq.push({ne, nr, {{c}}});
    }
  }
}
return 0;`,
      b: [b("a", "e"), b("b", "<"), b("c", "nc")],
    },
    {
      c: `int m = h.length, n = h[0].length;
int[][] eff = new int[m][n];
for (int[] row : eff) Arrays.fill(row, Integer.MAX_VALUE);
eff[0][0] = 0;
PriorityQueue<int[]> pq = new PriorityQueue<>((a,b)->a[0]-b[0]);
pq.offer(new int[]{0, 0, 0});
int[] dr = {1,-1,0,0}, dc = {0,0,1,-1};
while (!pq.isEmpty()) {
  int[] cur = pq.poll();
  int e = cur[0], r = cur[1], c = cur[2];
  if (r == m - 1 && c == n - 1) return {{a}};
  if (e > eff[r][c]) continue;
  for (int d = 0; d < 4; d++) {
    int nr = r+dr[d], nc = c+dc[d];
    if (nr<0||nc<0||nr>=m||nc>=n) continue;
    int ne = Math.max(e, Math.abs(h[nr][nc] - h[r][c]));
    if (ne {{b}} eff[nr][nc]) {
      eff[nr][nc] = ne;
      pq.offer(new int[]{ne, nr, {{c}}});
    }
  }
}
return 0;`,
      b: [b("a", "e"), b("b", "<"), b("c", "nc")],
    },
    {
      c: `import heapq
m, n = len(h), len(h[0])
eff = [[float('inf')] * n for _ in range(m)]
eff[0][0] = 0
pq = [(0, 0, 0)]
while pq:
    e, r, c = heapq.heappop(pq)
    if (r, c) == (m-1, n-1): return {{a}}
    if e > eff[r][c]: continue
    for dr, dc in ((1,0),(-1,0),(0,1),(0,-1)):
        nr, nc = r+dr, c+dc
        if 0 <= nr < m and 0 <= nc < n:
            ne = max(e, abs(h[nr][nc] - h[r][c]))
            if ne {{b}} eff[nr][nc]:
                eff[nr][nc] = ne
                heapq.heappush(pq, (ne, nr, {{c}}))
return 0`,
      b: [b("a", "e"), b("b", "<"), b("c", "nc")],
    },
  ),
];

// =====================================================================
// KNAPSACK (0/1 DP)
// =====================================================================
const knapsack: Drill[] = [
  d(
    "partition-equal-subset-sum",
    "Partition Equal Subset Sum",
    {
      c: `int total = accumulate(nums.begin(), nums.end(), 0);
if (total % 2) return false;
int t = total / 2;
vector<bool> dp(t + 1, false);
dp[0] = {{a}};
for (int x : nums)
  for (int s = t; s >= x; s{{b}})
    dp[s] = dp[s] || dp[s - x];
return dp[{{c}}];`,
      b: [b("a", "true"), b("b", "--"), b("c", "t")],
    },
    {
      c: `int total = 0; for (int x : nums) total += x;
if (total % 2 != 0) return false;
int t = total / 2;
boolean[] dp = new boolean[t + 1];
dp[0] = {{a}};
for (int x : nums)
  for (int s = t; s >= x; s{{b}})
    dp[s] = dp[s] || dp[s - x];
return dp[{{c}}];`,
      b: [b("a", "true"), b("b", "--"), b("c", "t")],
    },
    {
      c: `total = sum(nums)
if total % 2: return False
t = total // 2
dp = [False] * (t + 1)
dp[0] = {{a}}
for x in nums:
    for s in range(t, x - 1, {{b}}):
        dp[s] = dp[s] or dp[s - x]
return dp[{{c}}]`,
      b: [b("a", "True"), b("b", "-1"), b("c", "t")],
    },
  ),
  d(
    "target-sum",
    "Target Sum (subset-sum reduction)",
    {
      c: `int total = 0; for (int x : nums) total += x;
if (abs(target) > total || (total + target) % 2) return 0;
int t = (total + target) / 2;
vector<int> dp(t + 1, 0);
dp[0] = {{a}};
for (int x : nums)
  for (int s = t; s >= x; s--)
    dp[s] {{b}} dp[s - x];
return dp[{{c}}];`,
      b: [b("a", "1"), b("b", "+="), b("c", "t")],
    },
    {
      c: `int total = 0; for (int x : nums) total += x;
if (Math.abs(target) > total || (total + target) % 2 != 0) return 0;
int t = (total + target) / 2;
int[] dp = new int[t + 1];
dp[0] = {{a}};
for (int x : nums)
  for (int s = t; s >= x; s--)
    dp[s] {{b}} dp[s - x];
return dp[{{c}}];`,
      b: [b("a", "1"), b("b", "+="), b("c", "t")],
    },
    {
      c: `total = sum(nums)
if abs(target) > total or (total + target) % 2: return 0
t = (total + target) // 2
dp = [0] * (t + 1)
dp[0] = {{a}}
for x in nums:
    for s in range(t, x - 1, -1):
        dp[s] {{b}} dp[s - x]
return dp[{{c}}]`,
      b: [b("a", "1"), b("b", "+="), b("c", "t")],
    },
  ),
  d(
    "coin-change",
    "Coin Change (unbounded)",
    {
      c: `vector<int> dp(amount + 1, amount + 1);
dp[0] = {{a}};
for (int a = 1; a <= amount; a++)
  for (int c : coins)
    if (a - c >= 0) dp[a] = min(dp[a], dp[a - c] {{b}} 1);
return dp[amount] > amount ? -1 : dp[{{c}}];`,
      b: [b("a", "0"), b("b", "+"), b("c", "amount")],
    },
    {
      c: `int[] dp = new int[amount + 1];
Arrays.fill(dp, amount + 1);
dp[0] = {{a}};
for (int a = 1; a <= amount; a++)
  for (int c : coins)
    if (a - c >= 0) dp[a] = Math.min(dp[a], dp[a - c] {{b}} 1);
return dp[amount] > amount ? -1 : dp[{{c}}];`,
      b: [b("a", "0"), b("b", "+"), b("c", "amount")],
    },
    {
      c: `dp = [amount + 1] * (amount + 1)
dp[0] = {{a}}
for a in range(1, amount + 1):
    for c in coins:
        if a - c >= 0:
            dp[a] = min(dp[a], dp[a - c] {{b}} 1)
return -1 if dp[amount] > amount else dp[{{c}}]`,
      b: [b("a", "0"), b("b", "+"), b("c", "amount")],
    },
  ),
  d(
    "ones-and-zeroes",
    "Ones and Zeroes (2D knapsack)",
    {
      c: `vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));
for (auto& s : strs) {
  int zeros = count(s.begin(), s.end(), '0');
  int ones  = (int)s.size() - zeros;
  for (int i = m; i >= zeros; i--)
    for (int j = n; j >= ones; j{{a}})
      dp[i][j] = max(dp[i][j], dp[i - zeros][j - ones] {{b}} 1);
}
return dp[m][{{c}}];`,
      b: [b("a", "--"), b("b", "+"), b("c", "n")],
    },
    {
      c: `int[][] dp = new int[m + 1][n + 1];
for (String s : strs) {
  int zeros = 0; for (char c : s.toCharArray()) if (c=='0') zeros++;
  int ones = s.length() - zeros;
  for (int i = m; i >= zeros; i--)
    for (int j = n; j >= ones; j{{a}})
      dp[i][j] = Math.max(dp[i][j], dp[i - zeros][j - ones] {{b}} 1);
}
return dp[m][{{c}}];`,
      b: [b("a", "--"), b("b", "+"), b("c", "n")],
    },
    {
      c: `dp = [[0] * (n + 1) for _ in range(m + 1)]
for s in strs:
    zeros = s.count('0')
    ones = len(s) - zeros
    for i in range(m, zeros - 1, -1):
        for j in range(n, ones - 1, {{a}}):
            dp[i][j] = max(dp[i][j], dp[i - zeros][j - ones] {{b}} 1)
return dp[m][{{c}}]`,
      b: [b("a", "-1"), b("b", "+"), b("c", "n")],
    },
  ),
];

// =====================================================================
// LIS
// =====================================================================
const lis: Drill[] = [
  d(
    "longest-increasing-subsequence",
    "Longest Increasing Subsequence (O(n log n))",
    {
      c: `vector<int> tails;
for (int x : nums) {
  auto it = lower_bound(tails.begin(), tails.end(), {{a}});
  if (it == tails.end()) tails.push_back(x);
  else *it = {{b}};
}
return (int)tails.{{c}}();`,
      b: [b("a", "x"), b("b", "x"), b("c", "size")],
    },
    {
      c: `List<Integer> tails = new ArrayList<>();
for (int x : nums) {
  int lo = 0, hi = tails.size();
  while (lo < hi) {
    int m = (lo + hi) / 2;
    if (tails.get(m) < {{a}}) lo = m + 1;
    else hi = m;
  }
  if (lo == tails.size()) tails.add(x);
  else tails.set(lo, {{b}});
}
return tails.{{c}}();`,
      b: [b("a", "x"), b("b", "x"), b("c", "size")],
    },
    {
      c: `import bisect
tails = []
for x in nums:
    i = bisect.bisect_left(tails, {{a}})
    if i == len(tails): tails.append(x)
    else: tails[i] = {{b}}
return {{c}}(tails)`,
      b: [b("a", "x"), b("b", "x"), b("c", "len")],
    },
  ),
  d(
    "russian-doll-envelopes",
    "Russian Doll Envelopes (LIS on heights)",
    {
      c: `sort(env.begin(), env.end(), [](auto& a, auto& b){
  return a[0] == b[0] ? a[1] > b[1] : a[0] < b[0];
});
vector<int> tails;
for (auto& e : env) {
  int h = e[{{a}}];
  auto it = lower_bound(tails.begin(), tails.end(), h);
  if (it == tails.end()) tails.push_back({{b}});
  else *it = h;
}
return (int)tails.{{c}}();`,
      b: [b("a", "1"), b("b", "h"), b("c", "size")],
    },
    {
      c: `Arrays.sort(env, (a,b) -> a[0]==b[0] ? b[1]-a[1] : a[0]-b[0]);
List<Integer> tails = new ArrayList<>();
for (int[] e : env) {
  int h = e[{{a}}];
  int lo = 0, hi = tails.size();
  while (lo < hi) { int m = (lo+hi)/2; if (tails.get(m) < h) lo = m+1; else hi = m; }
  if (lo == tails.size()) tails.add({{b}});
  else tails.set(lo, h);
}
return tails.{{c}}();`,
      b: [b("a", "1"), b("b", "h"), b("c", "size")],
    },
    {
      c: `import bisect
env.sort(key=lambda e: (e[0], -e[1]))
tails = []
for w, h in env:
    i = bisect.bisect_left(tails, h)
    if i == len(tails): tails.append({{b}})
    else: tails[i] = {{a}}
return {{c}}(tails)`,
      b: [b("a", "h"), b("b", "h"), b("c", "len")],
    },
  ),
  d(
    "longest-common-subsequence",
    "Longest Common Subsequence (2D DP)",
    {
      c: `int m = a.size(), n = b.size();
vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));
for (int i = 1; i <= m; i++)
  for (int j = 1; j <= n; j++)
    if (a[i-1] == b[j-1]) dp[i][j] = dp[i-1][j-1] {{a}} 1;
    else dp[i][j] = max(dp[i-1][j], dp[i][j {{b}} 1]);
return dp[m][{{c}}];`,
      b: [b("a", "+"), b("b", "-"), b("c", "n")],
    },
    {
      c: `int m = a.length(), n = b.length();
int[][] dp = new int[m + 1][n + 1];
for (int i = 1; i <= m; i++)
  for (int j = 1; j <= n; j++)
    if (a.charAt(i-1) == b.charAt(j-1)) dp[i][j] = dp[i-1][j-1] {{a}} 1;
    else dp[i][j] = Math.max(dp[i-1][j], dp[i][j {{b}} 1]);
return dp[m][{{c}}];`,
      b: [b("a", "+"), b("b", "-"), b("c", "n")],
    },
    {
      c: `m, n = len(a), len(b)
dp = [[0] * (n + 1) for _ in range(m + 1)]
for i in range(1, m + 1):
    for j in range(1, n + 1):
        if a[i-1] == b[j-1]: dp[i][j] = dp[i-1][j-1] {{a}} 1
        else: dp[i][j] = max(dp[i-1][j], dp[i][j {{b}} 1])
return dp[m][{{c}}]`,
      b: [b("a", "+"), b("b", "-"), b("c", "n")],
    },
  ),
];

// =====================================================================
// MCM / INTERVAL DP
// =====================================================================
const mcm: Drill[] = [
  d(
    "burst-balloons",
    "Burst Balloons (interval DP)",
    {
      c: `vector<int> a = {1};
for (int x : nums) a.push_back(x);
a.push_back(1);
int n = a.size();
vector<vector<int>> dp(n, vector<int>(n, 0));
for (int len = 2; len < n; len++) {
  for (int l = 0; l + len < n; l++) {
    int r = l + len;
    for (int k = l + 1; k {{a}} r; k++) {
      int val = a[l] * a[k] * a[r] + dp[l][k] + dp[k][r];
      dp[l][r] = max(dp[l][r], {{b}});
    }
  }
}
return dp[0][{{c}}];`,
      b: [b("a", "<"), b("b", "val"), b("c", "n - 1")],
    },
    {
      c: `int[] a = new int[nums.length + 2];
a[0] = 1; a[a.length - 1] = 1;
for (int i = 0; i < nums.length; i++) a[i+1] = nums[i];
int n = a.length;
int[][] dp = new int[n][n];
for (int len = 2; len < n; len++)
  for (int l = 0; l + len < n; l++) {
    int r = l + len;
    for (int k = l + 1; k {{a}} r; k++) {
      int val = a[l]*a[k]*a[r] + dp[l][k] + dp[k][r];
      dp[l][r] = Math.max(dp[l][r], {{b}});
    }
  }
return dp[0][{{c}}];`,
      b: [b("a", "<"), b("b", "val"), b("c", "n - 1")],
    },
    {
      c: `a = [1] + nums + [1]
n = len(a)
dp = [[0] * n for _ in range(n)]
for length in range(2, n):
    for l in range(n - length):
        r = l + length
        for k in range(l + 1, {{a}}):
            val = a[l] * a[k] * a[r] + dp[l][k] + dp[k][r]
            dp[l][r] = max(dp[l][r], {{b}})
return dp[0][{{c}}]`,
      b: [b("a", "r"), b("b", "val"), b("c", "n - 1")],
    },
  ),
  d(
    "palindrome-partitioning-ii",
    "Palindrome Partitioning II (min cuts)",
    {
      c: `int n = s.size();
vector<vector<bool>> pal(n, vector<bool>(n, false));
for (int i = n - 1; i >= 0; i--)
  for (int j = i; j < n; j++)
    if (s[i] == s[j] && (j - i <= 1 || pal[i+1][j-1])) pal[i][j] = {{a}};
vector<int> dp(n, 0);
for (int i = 0; i < n; i++) {
  if (pal[0][i]) { dp[i] = 0; continue; }
  dp[i] = i;
  for (int j = 1; j <= i; j++)
    if (pal[j][i]) dp[i] = min(dp[i], dp[j - 1] {{b}} 1);
}
return dp[{{c}}];`,
      b: [b("a", "true"), b("b", "+"), b("c", "n - 1")],
    },
    {
      c: `int n = s.length();
boolean[][] pal = new boolean[n][n];
for (int i = n - 1; i >= 0; i--)
  for (int j = i; j < n; j++)
    if (s.charAt(i) == s.charAt(j) && (j - i <= 1 || pal[i+1][j-1])) pal[i][j] = {{a}};
int[] dp = new int[n];
for (int i = 0; i < n; i++) {
  if (pal[0][i]) { dp[i] = 0; continue; }
  dp[i] = i;
  for (int j = 1; j <= i; j++)
    if (pal[j][i]) dp[i] = Math.min(dp[i], dp[j - 1] {{b}} 1);
}
return dp[{{c}}];`,
      b: [b("a", "true"), b("b", "+"), b("c", "n - 1")],
    },
    {
      c: `n = len(s)
pal = [[False] * n for _ in range(n)]
for i in range(n - 1, -1, -1):
    for j in range(i, n):
        if s[i] == s[j] and (j - i <= 1 or pal[i+1][j-1]):
            pal[i][j] = {{a}}
dp = [0] * n
for i in range(n):
    if pal[0][i]:
        dp[i] = 0; continue
    dp[i] = i
    for j in range(1, i + 1):
        if pal[j][i]:
            dp[i] = min(dp[i], dp[j - 1] {{b}} 1)
return dp[{{c}}]`,
      b: [b("a", "True"), b("b", "+"), b("c", "n - 1")],
    },
  ),
  d(
    "minimum-cost-to-cut-a-stick",
    "Minimum Cost to Cut a Stick",
    {
      c: `cuts.push_back(0); cuts.push_back(n);
sort(cuts.begin(), cuts.end());
int m = cuts.size();
vector<vector<int>> dp(m, vector<int>(m, 0));
for (int len = 2; len < m; len++) {
  for (int i = 0; i + len < m; i++) {
    int j = i + len;
    dp[i][j] = INT_MAX;
    for (int k = i + 1; k {{a}} j; k++)
      dp[i][j] = min(dp[i][j], dp[i][k] + dp[k][j] + cuts[j] {{b}} cuts[i]);
  }
}
return dp[0][m {{c}} 1];`,
      b: [b("a", "<"), b("b", "-"), b("c", "-")],
    },
    {
      c: `int[] ext = new int[cuts.length + 2];
System.arraycopy(cuts, 0, ext, 1, cuts.length);
ext[0] = 0; ext[ext.length - 1] = n;
Arrays.sort(ext);
int m = ext.length;
int[][] dp = new int[m][m];
for (int len = 2; len < m; len++)
  for (int i = 0; i + len < m; i++) {
    int j = i + len;
    dp[i][j] = Integer.MAX_VALUE;
    for (int k = i + 1; k {{a}} j; k++)
      dp[i][j] = Math.min(dp[i][j], dp[i][k] + dp[k][j] + ext[j] {{b}} ext[i]);
  }
return dp[0][m {{c}} 1];`,
      b: [b("a", "<"), b("b", "-"), b("c", "-")],
    },
    {
      c: `cuts = sorted([0] + cuts + [n])
m = len(cuts)
dp = [[0] * m for _ in range(m)]
for length in range(2, m):
    for i in range(m - length):
        j = i + length
        dp[i][j] = float('inf')
        for k in range(i + 1, {{a}}):
            dp[i][j] = min(dp[i][j], dp[i][k] + dp[k][j] + cuts[j] {{b}} cuts[i])
return dp[0][m {{c}} 1]`,
      b: [b("a", "j"), b("b", "-"), b("c", "-")],
    },
  ),
];

// =====================================================================
// BACKTRACKING
// =====================================================================
const backtracking: Drill[] = [
  d(
    "n-queens",
    "N-Queens",
    {
      c: `vector<string> board(n, string(n, '.'));
vector<bool> col(n), d1(2*n), d2(2*n);
function<void(int)> solve = [&](int r) {
  if (r == n) { ans.push_back(board); return; }
  for (int c = 0; c < n; c++) {
    if (col[c] || d1[r + c] || d2[r - c + n]) continue;
    board[r][c] = 'Q';
    col[c] = d1[r + c] = d2[r - c + n] = {{a}};
    solve(r + 1);
    board[r][c] = '.';
    col[c] = d1[r + c] = d2[r - c + n] = {{b}};
  }
};
solve({{c}});`,
      b: [b("a", "true"), b("b", "false"), b("c", "0")],
    },
    {
      c: `char[][] board = new char[n][n];
for (char[] row : board) Arrays.fill(row, '.');
boolean[] col = new boolean[n], d1 = new boolean[2*n], d2 = new boolean[2*n];
solve(0, n, board, col, d1, d2, ans);
// void solve(int r, int n, char[][] b_, boolean[] col, boolean[] d1, boolean[] d2, List<List<String>> ans) {
//   if (r == n) { /* add copy */ return; }
//   for (int c = 0; c < n; c++) {
//     if (col[c] || d1[r+c] || d2[r-c+n]) continue;
//     b_[r][c] = 'Q';
//     col[c] = d1[r+c] = d2[r-c+n] = {{a}};
//     solve(r + 1, n, b_, col, d1, d2, ans);
//     b_[r][c] = '.';
//     col[c] = d1[r+c] = d2[r-c+n] = {{b}};
//   }
// }
// call: solve({{c}}, n, ...);`,
      b: [b("a", "true"), b("b", "false"), b("c", "0")],
    },
    {
      c: `board = [['.'] * n for _ in range(n)]
col, d1, d2 = [False]*n, [False]*(2*n), [False]*(2*n)
def solve(r):
    if r == n:
        ans.append([''.join(row) for row in board]); return
    for c in range(n):
        if col[c] or d1[r+c] or d2[r-c+n]: continue
        board[r][c] = 'Q'
        col[c] = d1[r+c] = d2[r-c+n] = {{a}}
        solve(r + 1)
        board[r][c] = '.'
        col[c] = d1[r+c] = d2[r-c+n] = {{b}}
solve({{c}})`,
      b: [b("a", "True"), b("b", "False"), b("c", "0")],
    },
  ),
  d(
    "permutations",
    "Permutations (swap in place)",
    {
      c: `function<void(int)> solve = [&](int i) {
  if (i == (int)nums.size()) { ans.push_back(nums); return; }
  for (int j = i; j < (int)nums.size(); j++) {
    swap(nums[i], nums[j]);
    solve(i {{a}} 1);
    swap(nums[i], nums[{{b}}]);
  }
};
solve({{c}});`,
      b: [b("a", "+"), b("b", "j"), b("c", "0")],
    },
    {
      c: `void solve(int i, int[] nums, List<List<Integer>> ans) {
  if (i == nums.length) {
    List<Integer> cur = new ArrayList<>();
    for (int x : nums) cur.add(x);
    ans.add(cur); return;
  }
  for (int j = i; j < nums.length; j++) {
    int t = nums[i]; nums[i] = nums[j]; nums[j] = t;
    solve(i {{a}} 1, nums, ans);
    t = nums[i]; nums[i] = nums[j]; nums[{{b}}] = t;
  }
}
// solve({{c}}, nums, ans);`,
      b: [b("a", "+"), b("b", "j"), b("c", "0")],
    },
    {
      c: `def solve(i):
    if i == len(nums):
        ans.append(nums[:]); return
    for j in range(i, len(nums)):
        nums[i], nums[j] = nums[j], nums[i]
        solve(i {{a}} 1)
        nums[i], nums[j] = nums[{{b}}], nums[i]
solve({{c}})`,
      b: [b("a", "+"), b("b", "j"), b("c", "0")],
    },
  ),
  d(
    "subsets",
    "Subsets (choose / skip)",
    {
      c: `function<void(int, vector<int>&)> solve = [&](int i, vector<int>& cur) {
  if (i == (int)nums.size()) { ans.push_back(cur); return; }
  solve(i + 1, cur);
  cur.push_back(nums[i]);
  solve(i {{a}} 1, cur);
  cur.{{b}}();
};
vector<int> cur;
solve({{c}}, cur);`,
      b: [b("a", "+"), b("b", "pop_back"), b("c", "0")],
    },
    {
      c: `void solve(int i, List<Integer> cur, int[] nums, List<List<Integer>> ans) {
  if (i == nums.length) { ans.add(new ArrayList<>(cur)); return; }
  solve(i + 1, cur, nums, ans);
  cur.add(nums[i]);
  solve(i {{a}} 1, cur, nums, ans);
  cur.remove(cur.size() - {{b}});
}
// solve({{c}}, new ArrayList<>(), nums, ans);`,
      b: [b("a", "+"), b("b", "1"), b("c", "0")],
    },
    {
      c: `def solve(i, cur):
    if i == len(nums):
        ans.append(cur[:]); return
    solve(i + 1, cur)
    cur.append(nums[i])
    solve(i {{a}} 1, cur)
    cur.{{b}}()
solve({{c}}, [])`,
      b: [b("a", "+"), b("b", "pop"), b("c", "0")],
    },
  ),
  d(
    "word-search",
    "Word Search (grid backtracking)",
    {
      c: `int m = g.size(), n = g[0].size();
function<bool(int,int,int)> dfs = [&](int r, int c, int i) -> bool {
  if (i == (int)word.size()) return true;
  if (r < 0 || c < 0 || r >= m || c >= n || g[r][c] != word[i]) return false;
  char save = g[r][c];
  g[r][c] = '#';
  bool ok = dfs(r+1,c,i+1) || dfs(r-1,c,i+1) || dfs(r,c+1,i+1) || dfs(r,c-1,i {{a}} 1);
  g[r][c] = {{b}};
  return ok;
};
for (int r = 0; r < m; r++)
  for (int c = 0; c < n; c++)
    if (dfs(r, c, {{c}})) return true;
return false;`,
      b: [b("a", "+"), b("b", "save"), b("c", "0")],
    },
    {
      c: `int m = g.length, n = g[0].length;
for (int r = 0; r < m; r++)
  for (int c = 0; c < n; c++)
    if (dfs(g, r, c, 0, word)) return true;
return false;
// boolean dfs(char[][] g, int r, int c, int i, String w) {
//   if (i == w.length()) return true;
//   if (r<0||c<0||r>=g.length||c>=g[0].length||g[r][c]!=w.charAt(i)) return false;
//   char save = g[r][c];
//   g[r][c] = '#';
//   boolean ok = dfs(g,r+1,c,i+1,w)||dfs(g,r-1,c,i+1,w)||dfs(g,r,c+1,i+1,w)||dfs(g,r,c-1,i {{a}} 1,w);
//   g[r][c] = {{b}};
//   return ok;
// }
// initial call: dfs(g, r, c, {{c}}, word)`,
      b: [b("a", "+"), b("b", "save"), b("c", "0")],
    },
    {
      c: `m, n = len(g), len(g[0])
def dfs(r, c, i):
    if i == len(word): return True
    if r < 0 or c < 0 or r >= m or c >= n or g[r][c] != word[i]: return False
    save = g[r][c]
    g[r][c] = '#'
    ok = dfs(r+1,c,i+1) or dfs(r-1,c,i+1) or dfs(r,c+1,i+1) or dfs(r,c-1,i {{a}} 1)
    g[r][c] = {{b}}
    return ok
for r in range(m):
    for c in range(n):
        if dfs(r, c, {{c}}): return True
return False`,
      b: [b("a", "+"), b("b", "save"), b("c", "0")],
    },
  ),
  d(
    "sudoku-solver",
    "Sudoku Solver",
    {
      c: `function<bool()> solve = [&]() -> bool {
  for (int r = 0; r < 9; r++) for (int c = 0; c < 9; c++) {
    if (board[r][c] != '.') continue;
    for (char d = '1'; d <= '9'; d++) {
      if (!valid(r, c, d)) continue;
      board[r][c] = {{a}};
      if (solve()) return true;
      board[r][c] = {{b}};
    }
    return false;
  }
  return {{c}};
};
solve();`,
      b: [b("a", "d"), b("b", "'.'", ['"."']), b("c", "true")],
    },
    {
      c: `boolean solve(char[][] b) {
  for (int r = 0; r < 9; r++) for (int c = 0; c < 9; c++) {
    if (b[r][c] != '.') continue;
    for (char d = '1'; d <= '9'; d++) {
      if (!valid(b, r, c, d)) continue;
      b[r][c] = {{a}};
      if (solve(b)) return true;
      b[r][c] = {{b}};
    }
    return false;
  }
  return {{c}};
}`,
      b: [b("a", "d"), b("b", "'.'"), b("c", "true")],
    },
    {
      c: `def solve():
    for r in range(9):
        for c in range(9):
            if board[r][c] != '.': continue
            for d in '123456789':
                if not valid(r, c, d): continue
                board[r][c] = {{a}}
                if solve(): return True
                board[r][c] = {{b}}
            return False
    return {{c}}
solve()`,
      b: [b("a", "d"), b("b", "'.'", ['"."']), b("c", "True")],
    },
  ),
];

// =====================================================================
// BINARY SEARCH
// =====================================================================
const binarySearch: Drill[] = [
  d(
    "binary-search",
    "Binary Search",
    {
      c: `int l = 0, r = (int)nums.size() - 1;
while (l {{a}} r) {
  int m = l + (r - l) / 2;
  if (nums[m] == target) return m;
  if (nums[m] < target) l = m {{b}} 1;
  else r = m - 1;
}
return {{c}};`,
      b: [b("a", "<="), b("b", "+"), b("c", "-1")],
    },
    {
      c: `int l = 0, r = nums.length - 1;
while (l {{a}} r) {
  int m = l + (r - l) / 2;
  if (nums[m] == target) return m;
  if (nums[m] < target) l = m {{b}} 1;
  else r = m - 1;
}
return {{c}};`,
      b: [b("a", "<="), b("b", "+"), b("c", "-1")],
    },
    {
      c: `l, r = 0, len(nums) - 1
while l {{a}} r:
    m = (l + r) // 2
    if nums[m] == target: return m
    if nums[m] < target: l = m {{b}} 1
    else: r = m - 1
return {{c}}`,
      b: [b("a", "<="), b("b", "+"), b("c", "-1")],
    },
  ),
  d(
    "search-in-rotated-sorted-array",
    "Search in Rotated Sorted Array",
    {
      c: `int l = 0, r = (int)nums.size() - 1;
while (l <= r) {
  int m = (l + r) / 2;
  if (nums[m] == target) return m;
  if (nums[l] <= nums[m]) {
    if (nums[l] <= target && target < nums[m]) r = m {{a}} 1;
    else l = m + 1;
  } else {
    if (nums[m] < target && target <= nums[r]) l = m {{b}} 1;
    else r = m - 1;
  }
}
return {{c}};`,
      b: [b("a", "-"), b("b", "+"), b("c", "-1")],
    },
    {
      c: `int l = 0, r = nums.length - 1;
while (l <= r) {
  int m = (l + r) / 2;
  if (nums[m] == target) return m;
  if (nums[l] <= nums[m]) {
    if (nums[l] <= target && target < nums[m]) r = m {{a}} 1;
    else l = m + 1;
  } else {
    if (nums[m] < target && target <= nums[r]) l = m {{b}} 1;
    else r = m - 1;
  }
}
return {{c}};`,
      b: [b("a", "-"), b("b", "+"), b("c", "-1")],
    },
    {
      c: `l, r = 0, len(nums) - 1
while l <= r:
    m = (l + r) // 2
    if nums[m] == target: return m
    if nums[l] <= nums[m]:
        if nums[l] <= target < nums[m]: r = m {{a}} 1
        else: l = m + 1
    else:
        if nums[m] < target <= nums[r]: l = m {{b}} 1
        else: r = m - 1
return {{c}}`,
      b: [b("a", "-"), b("b", "+"), b("c", "-1")],
    },
  ),
  d(
    "find-first-and-last-position-of-element-in-sorted-array",
    "Find First and Last Position",
    {
      c: `auto bs = [&](bool first) {
  int l = 0, r = (int)nums.size() - 1, ans = -1;
  while (l <= r) {
    int m = (l + r) / 2;
    if (nums[m] == target) { ans = m; if (first) r = m {{a}} 1; else l = m + 1; }
    else if (nums[m] < target) l = m + 1;
    else r = m {{b}} 1;
  }
  return ans;
};
return {bs(true), bs({{c}})};`,
      b: [b("a", "-"), b("b", "-"), b("c", "false")],
    },
    {
      c: `int bs(int[] nums, int target, boolean first) {
  int l = 0, r = nums.length - 1, ans = -1;
  while (l <= r) {
    int m = (l + r) / 2;
    if (nums[m] == target) { ans = m; if (first) r = m {{a}} 1; else l = m + 1; }
    else if (nums[m] < target) l = m + 1;
    else r = m {{b}} 1;
  }
  return ans;
}
// return new int[]{bs(nums, target, true), bs(nums, target, {{c}})};`,
      b: [b("a", "-"), b("b", "-"), b("c", "false")],
    },
    {
      c: `def bs(first):
    l, r, ans = 0, len(nums) - 1, -1
    while l <= r:
        m = (l + r) // 2
        if nums[m] == target:
            ans = m
            if first: r = m {{a}} 1
            else: l = m + 1
        elif nums[m] < target: l = m + 1
        else: r = m {{b}} 1
    return ans
return [bs(True), bs({{c}})]`,
      b: [b("a", "-"), b("b", "-"), b("c", "False")],
    },
  ),
  d(
    "median-of-two-sorted-arrays",
    "Median of Two Sorted Arrays",
    {
      c: `if (a.size() > b.size()) return findMedian(b, a);
int m = a.size(), n = b.size();
int lo = 0, hi = m;
while (lo <= hi) {
  int i = (lo + hi) / 2;
  int j = (m + n + 1) / 2 - i;
  int aL = i == 0 ? INT_MIN : a[i - 1];
  int aR = i == m ? INT_MAX : a[i];
  int bL = j == 0 ? INT_MIN : b[j - 1];
  int bR = j == n ? INT_MAX : b[j];
  if (aL <= bR && bL <= aR) {
    if ((m + n) % 2 == 0) return (max(aL, bL) + min(aR, {{a}})) / 2.0;
    return max(aL, bL);
  } else if (aL > {{b}}) hi = i - 1;
  else lo = i {{c}} 1;
}
return 0.0;`,
      b: [b("a", "bR"), b("b", "bR"), b("c", "+")],
    },
    {
      c: `if (a.length > b.length) return findMedian(b, a);
int m = a.length, n = b.length;
int lo = 0, hi = m;
while (lo <= hi) {
  int i = (lo + hi) / 2;
  int j = (m + n + 1) / 2 - i;
  int aL = i == 0 ? Integer.MIN_VALUE : a[i - 1];
  int aR = i == m ? Integer.MAX_VALUE : a[i];
  int bL = j == 0 ? Integer.MIN_VALUE : b[j - 1];
  int bR = j == n ? Integer.MAX_VALUE : b[j];
  if (aL <= bR && bL <= aR) {
    if ((m + n) % 2 == 0) return (Math.max(aL, bL) + Math.min(aR, {{a}})) / 2.0;
    return Math.max(aL, bL);
  } else if (aL > {{b}}) hi = i - 1;
  else lo = i {{c}} 1;
}
return 0.0;`,
      b: [b("a", "bR"), b("b", "bR"), b("c", "+")],
    },
    {
      c: `if len(a) > len(b): a, b = b, a
m, n = len(a), len(b)
lo, hi = 0, m
INF = float('inf')
while lo <= hi:
    i = (lo + hi) // 2
    j = (m + n + 1) // 2 - i
    aL = -INF if i == 0 else a[i-1]
    aR =  INF if i == m else a[i]
    bL = -INF if j == 0 else b[j-1]
    bR =  INF if j == n else b[j]
    if aL <= bR and bL <= aR:
        if (m + n) % 2 == 0:
            return (max(aL, bL) + min(aR, {{a}})) / 2
        return max(aL, bL)
    elif aL > {{b}}: hi = i - 1
    else: lo = i {{c}} 1`,
      b: [b("a", "bR"), b("b", "bR"), b("c", "+")],
    },
  ),
];

// =====================================================================
// BINARY SEARCH ON ANSWER
// =====================================================================
const bsAnswer: Drill[] = [
  d(
    "koko-eating-bananas",
    "Koko Eating Bananas",
    {
      c: `auto ok = [&](int k) {
  long long h = 0;
  for (int p : piles) h += (p + k - 1) / k;
  return h <= H;
};
int lo = 1, hi = *max_element(piles.begin(), piles.end());
while (lo {{a}} hi) {
  int mid = lo + (hi - lo) / 2;
  if (ok(mid)) hi = {{b}};
  else lo = mid + 1;
}
return {{c}};`,
      b: [b("a", "<"), b("b", "mid"), b("c", "lo")],
    },
    {
      c: `int lo = 1, hi = 0;
for (int p : piles) hi = Math.max(hi, p);
while (lo {{a}} hi) {
  int mid = lo + (hi - lo) / 2;
  long h = 0;
  for (int p : piles) h += (p + mid - 1) / mid;
  if (h <= H) hi = {{b}};
  else lo = mid + 1;
}
return {{c}};`,
      b: [b("a", "<"), b("b", "mid"), b("c", "lo")],
    },
    {
      c: `def ok(k):
    return sum((p + k - 1) // k for p in piles) <= H
lo, hi = 1, max(piles)
while lo {{a}} hi:
    mid = (lo + hi) // 2
    if ok(mid): hi = {{b}}
    else: lo = mid + 1
return {{c}}`,
      b: [b("a", "<"), b("b", "mid"), b("c", "lo")],
    },
  ),
  d(
    "capacity-to-ship-packages-within-d-days",
    "Capacity to Ship Packages Within D Days",
    {
      c: `auto feasible = [&](int cap) {
  int days = 1, load = 0;
  for (int w : weights) {
    if (load + w > cap) { days++; load = 0; }
    load += w;
  }
  return days <= D;
};
int lo = *max_element(weights.begin(), weights.end());
int hi = accumulate(weights.begin(), weights.end(), 0);
while (lo {{a}} hi) {
  int mid = lo + (hi - lo) / 2;
  if (feasible(mid)) hi = {{b}};
  else lo = mid + 1;
}
return {{c}};`,
      b: [b("a", "<"), b("b", "mid"), b("c", "lo")],
    },
    {
      c: `int lo = 0, hi = 0;
for (int w : weights) { lo = Math.max(lo, w); hi += w; }
while (lo {{a}} hi) {
  int mid = lo + (hi - lo) / 2;
  int days = 1, load = 0;
  for (int w : weights) {
    if (load + w > mid) { days++; load = 0; }
    load += w;
  }
  if (days <= D) hi = {{b}};
  else lo = mid + 1;
}
return {{c}};`,
      b: [b("a", "<"), b("b", "mid"), b("c", "lo")],
    },
    {
      c: `def feasible(cap):
    days, load = 1, 0
    for w in weights:
        if load + w > cap:
            days += 1; load = 0
        load += w
    return days <= D
lo, hi = max(weights), sum(weights)
while lo {{a}} hi:
    mid = (lo + hi) // 2
    if feasible(mid): hi = {{b}}
    else: lo = mid + 1
return {{c}}`,
      b: [b("a", "<"), b("b", "mid"), b("c", "lo")],
    },
  ),
  d(
    "split-array-largest-sum",
    "Split Array Largest Sum",
    {
      c: `auto ok = [&](int cap) {
  int parts = 1, s = 0;
  for (int x : nums) {
    if (s + x > cap) { parts++; s = 0; }
    s += x;
  }
  return parts <= k;
};
int lo = *max_element(nums.begin(), nums.end());
int hi = accumulate(nums.begin(), nums.end(), 0);
while (lo {{a}} hi) {
  int mid = lo + (hi - lo) / 2;
  if (ok(mid)) hi = {{b}};
  else lo = mid + 1;
}
return {{c}};`,
      b: [b("a", "<"), b("b", "mid"), b("c", "lo")],
    },
    {
      c: `int lo = 0, hi = 0;
for (int x : nums) { lo = Math.max(lo, x); hi += x; }
while (lo {{a}} hi) {
  int mid = lo + (hi - lo) / 2;
  int parts = 1, s = 0;
  for (int x : nums) {
    if (s + x > mid) { parts++; s = 0; }
    s += x;
  }
  if (parts <= k) hi = {{b}};
  else lo = mid + 1;
}
return {{c}};`,
      b: [b("a", "<"), b("b", "mid"), b("c", "lo")],
    },
    {
      c: `def ok(cap):
    parts, s = 1, 0
    for x in nums:
        if s + x > cap:
            parts += 1; s = 0
        s += x
    return parts <= k
lo, hi = max(nums), sum(nums)
while lo {{a}} hi:
    mid = (lo + hi) // 2
    if ok(mid): hi = {{b}}
    else: lo = mid + 1
return {{c}}`,
      b: [b("a", "<"), b("b", "mid"), b("c", "lo")],
    },
  ),
];

// =====================================================================
// BIT TRICKS
// =====================================================================
const bitTricks: Drill[] = [
  d(
    "single-number",
    "Single Number (XOR)",
    {
      c: `int x = 0;
for (int a : nums) x {{a}}= a;
return {{b}};`,
      b: [b("a", "^"), b("b", "x")],
    },
    {
      c: `int x = 0;
for (int a : nums) x {{a}}= a;
return {{b}};`,
      b: [b("a", "^"), b("b", "x")],
    },
    {
      c: `x = 0
for a in nums: x {{a}}= a
return {{b}}`,
      b: [b("a", "^"), b("b", "x")],
    },
  ),
  d(
    "number-of-1-bits",
    "Number of 1 Bits (Brian Kernighan)",
    {
      c: `int cnt = 0;
while (n) {
  n {{a}} (n - 1);
  cnt{{b}};
}
return {{c}};`,
      b: [b("a", "&="), b("b", "++"), b("c", "cnt")],
    },
    {
      c: `int cnt = 0;
while (n != 0) {
  n {{a}} (n - 1);
  cnt{{b}};
}
return {{c}};`,
      b: [b("a", "&="), b("b", "++"), b("c", "cnt")],
    },
    {
      c: `cnt = 0
while n:
    n {{a}} (n - 1)
    cnt {{b}} 1
return {{c}}`,
      b: [b("a", "&="), b("b", "+="), b("c", "cnt")],
    },
  ),
  d(
    "counting-bits",
    "Counting Bits (dp[i] = dp[i>>1] + (i&1))",
    {
      c: `vector<int> dp(n + 1, 0);
for (int i = 1; i <= n; i++)
  dp[i] = dp[i {{a}} 1] + (i {{b}} 1);
return {{c}};`,
      b: [b("a", ">>"), b("b", "&"), b("c", "dp")],
    },
    {
      c: `int[] dp = new int[n + 1];
for (int i = 1; i <= n; i++)
  dp[i] = dp[i {{a}} 1] + (i {{b}} 1);
return {{c}};`,
      b: [b("a", ">>"), b("b", "&"), b("c", "dp")],
    },
    {
      c: `dp = [0] * (n + 1)
for i in range(1, n + 1):
    dp[i] = dp[i {{a}} 1] + (i {{b}} 1)
return {{c}}`,
      b: [b("a", ">>"), b("b", "&"), b("c", "dp")],
    },
  ),
  d(
    "missing-number",
    "Missing Number (XOR trick)",
    {
      c: `int x = (int)nums.size();
for (int i = 0; i < (int)nums.size(); i++)
  x {{a}}= i {{b}} nums[i];
return {{c}};`,
      b: [b("a", "^"), b("b", "^"), b("c", "x")],
    },
    {
      c: `int x = nums.length;
for (int i = 0; i < nums.length; i++)
  x {{a}}= i {{b}} nums[i];
return {{c}};`,
      b: [b("a", "^"), b("b", "^"), b("c", "x")],
    },
    {
      c: `x = len(nums)
for i, v in enumerate(nums):
    x {{a}}= i {{b}} v
return {{c}}`,
      b: [b("a", "^"), b("b", "^"), b("c", "x")],
    },
  ),
  d(
    "sum-of-two-integers",
    "Sum of Two Integers (no + / -)",
    {
      c: `while (b != 0) {
  unsigned carry = ((unsigned)a & (unsigned)b) {{a}} 1;
  a = a {{b}} b;
  b = (int)carry;
}
return {{c}};`,
      b: [b("a", "<<"), b("b", "^"), b("c", "a")],
    },
    {
      c: `while (b != 0) {
  int carry = (a & b) {{a}} 1;
  a = a {{b}} b;
  b = carry;
}
return {{c}};`,
      b: [b("a", "<<"), b("b", "^"), b("c", "a")],
    },
    {
      c: `MASK = 0xFFFFFFFF
while b & MASK:
    carry = ((a & b) {{a}} 1) & MASK
    a = (a {{b}} b) & MASK
    b = carry
return a if a <= 0x7FFFFFFF else ~(a ^ MASK)
# return {{c}}`,
      b: [b("a", "<<"), b("b", "^"), b("c", "a")],
    },
  ),
];

// =====================================================================
// NUMBER THEORY BASICS (placements)
// =====================================================================
const numberTheory: Drill[] = [
  d(
    "count-primes",
    "Count Primes (Sieve of Eratosthenes)",
    {
      c: `if (n < 2) return 0;
vector<bool> isPrime(n, true);
isPrime[0] = isPrime[1] = false;
for (int i = 2; (long long)i * i < n; i++)
  if (isPrime[i])
    for (int j = i * i; j < n; j += {{a}})
      isPrime[j] = {{b}};
int cnt = 0;
for (int i = 2; i < n; i++) if (isPrime[i]) cnt++;
return {{c}};`,
      b: [b("a", "i"), b("b", "false"), b("c", "cnt")],
    },
    {
      c: `if (n < 2) return 0;
boolean[] isPrime = new boolean[n];
Arrays.fill(isPrime, true);
isPrime[0] = isPrime[1] = false;
for (int i = 2; (long) i * i < n; i++)
  if (isPrime[i])
    for (int j = i * i; j < n; j += {{a}})
      isPrime[j] = {{b}};
int cnt = 0;
for (int i = 2; i < n; i++) if (isPrime[i]) cnt++;
return {{c}};`,
      b: [b("a", "i"), b("b", "false"), b("c", "cnt")],
    },
    {
      c: `if n < 2: return 0
is_prime = [True] * n
is_prime[0] = is_prime[1] = False
for i in range(2, int(n**0.5) + 1):
    if is_prime[i]:
        for j in range(i * i, n, {{a}}):
            is_prime[j] = {{b}}
return sum({{c}})`,
      b: [b("a", "i"), b("b", "False"), b("c", "is_prime")],
    },
  ),
  d(
    "happy-number",
    "Happy Number (Floyd cycle on digits)",
    {
      c: `auto next_ = [](int x) {
  int s = 0;
  while (x) { int d = x % 10; s += d * d; x /= 10; }
  return s;
};
int slow = n, fast = next_(n);
while (fast != {{a}} && fast != slow) {
  slow = next_(slow);
  fast = next_(next_(fast));
}
return fast == {{b}};`,
      b: [b("a", "1"), b("b", "1")],
    },
    {
      c: `int next_(int x) {
  int s = 0;
  while (x > 0) { int d = x % 10; s += d * d; x /= 10; }
  return s;
}
int slow = n, fast = next_(n);
while (fast != {{a}} && fast != slow) {
  slow = next_(slow);
  fast = next_(next_(fast));
}
return fast == {{b}};`,
      b: [b("a", "1"), b("b", "1")],
    },
    {
      c: `def nxt(x):
    s = 0
    while x:
        d = x % 10; s += d*d; x //= 10
    return s
slow, fast = n, nxt(n)
while fast != {{a}} and fast != slow:
    slow = nxt(slow)
    fast = nxt(nxt(fast))
return fast == {{b}}`,
      b: [b("a", "1"), b("b", "1")],
    },
  ),
  d(
    "palindrome-number",
    "Palindrome Number (reverse half)",
    {
      c: `if (x < 0 || (x % 10 == 0 && x != 0)) return false;
int rev = 0;
while (x > rev) {
  rev = rev * 10 + x {{a}} 10;
  x /= {{b}};
}
return x == rev || x == rev / {{c}};`,
      b: [b("a", "%"), b("b", "10"), b("c", "10")],
    },
    {
      c: `if (x < 0 || (x % 10 == 0 && x != 0)) return false;
int rev = 0;
while (x > rev) {
  rev = rev * 10 + x {{a}} 10;
  x /= {{b}};
}
return x == rev || x == rev / {{c}};`,
      b: [b("a", "%"), b("b", "10"), b("c", "10")],
    },
    {
      c: `if x < 0 or (x % 10 == 0 and x != 0): return False
rev = 0
while x > rev:
    rev = rev * 10 + x {{a}} 10
    x //= {{b}}
return x == rev or x == rev // {{c}}`,
      b: [b("a", "%"), b("b", "10"), b("c", "10")],
    },
  ),
  d(
    "power-of-two",
    "Power of Two (bit trick)",
    {
      c: `return n > 0 && (n {{a}} (n {{b}} 1)) == {{c}};`,
      b: [b("a", "&"), b("b", "-"), b("c", "0")],
    },
    {
      c: `return n > 0 && (n {{a}} (n {{b}} 1)) == {{c}};`,
      b: [b("a", "&"), b("b", "-"), b("c", "0")],
    },
    {
      c: `return n > 0 and (n {{a}} (n {{b}} 1)) == {{c}}`,
      b: [b("a", "&"), b("b", "-"), b("c", "0")],
    },
  ),
  d(
    "factorial-trailing-zeroes",
    "Factorial Trailing Zeroes (count 5s)",
    {
      c: `int cnt = 0;
while (n > 0) {
  n /= {{a}};
  cnt {{b}} n;
}
return {{c}};`,
      b: [b("a", "5"), b("b", "+="), b("c", "cnt")],
    },
    {
      c: `int cnt = 0;
while (n > 0) {
  n /= {{a}};
  cnt {{b}} n;
}
return {{c}};`,
      b: [b("a", "5"), b("b", "+="), b("c", "cnt")],
    },
    {
      c: `cnt = 0
while n > 0:
    n //= {{a}}
    cnt {{b}} n
return {{c}}`,
      b: [b("a", "5"), b("b", "+="), b("c", "cnt")],
    },
  ),
  d(
    "greatest-common-divisor-of-strings",
    "GCD of Strings",
    {
      c: `if (str1 + str2 != str2 + str1) return "";
int g = __gcd((int)str1.size(), (int)str2.{{a}}());
return str1.substr(0, {{b}});`,
      b: [b("a", "size"), b("b", "g")],
    },
    {
      c: `if (!(str1 + str2).equals(str2 + str1)) return "";
int g = gcd(str1.length(), str2.{{a}}());
return str1.substring(0, {{b}});
// int gcd(int a, int b) { return b == 0 ? a : gcd(b, a % b); }`,
      b: [b("a", "length"), b("b", "g")],
    },
    {
      c: `from math import gcd
if str1 + str2 != str2 + str1: return ""
g = gcd(len(str1), {{a}}(str2))
return str1[:{{b}}]`,
      b: [b("a", "len"), b("b", "g")],
    },
  ),
];

// =====================================================================
// PATTERN PRINTING
// =====================================================================
const patternPrinting: Drill[] = [
  d(
    "pascals-triangle",
    "Pascal's Triangle",
    {
      c: `vector<vector<int>> ans;
for (int i = 0; i < numRows; i++) {
  vector<int> row(i + 1, {{a}});
  for (int j = 1; j < i; j++)
    row[j] = ans[i - 1][j - 1] + ans[i - 1][{{b}}];
  ans.push_back({{c}});
}
return ans;`,
      b: [b("a", "1"), b("b", "j"), b("c", "row")],
      // https://leetcode.com/problems/pascals-triangle/
    },
    {
      c: `List<List<Integer>> ans = new ArrayList<>();
for (int i = 0; i < numRows; i++) {
  List<Integer> row = new ArrayList<>();
  for (int j = 0; j <= i; j++) row.add({{a}});
  for (int j = 1; j < i; j++)
    row.set(j, ans.get(i - 1).get(j - 1) + ans.get(i - 1).get({{b}}));
  ans.add({{c}});
}
return ans;`,
      b: [b("a", "1"), b("b", "j"), b("c", "row")],
    },
    {
      c: `ans = []
for i in range(numRows):
    row = [{{a}}] * (i + 1)
    for j in range(1, i):
        row[j] = ans[i-1][j-1] + ans[i-1][{{b}}]
    ans.append({{c}})
return ans`,
      b: [b("a", "1"), b("b", "j"), b("c", "row")],
    },
  ),
  d(
    "pascals-triangle-ii",
    "Pascal's Triangle II (row k, O(k) space)",
    {
      c: `vector<int> row(rowIndex + 1, 1);
for (int i = 2; i <= rowIndex; i++)
  for (int j = i - 1; j >= 1; j{{a}})
    row[j] = row[j] + row[j {{b}} 1];
return {{c}};`,
      b: [b("a", "--"), b("b", "-"), b("c", "row")],
    },
    {
      c: `int[] row = new int[rowIndex + 1];
Arrays.fill(row, 1);
for (int i = 2; i <= rowIndex; i++)
  for (int j = i - 1; j >= 1; j{{a}})
    row[j] = row[j] + row[j {{b}} 1];
// return list of row
return Arrays.stream(row).boxed().toList();
// {{c}}`,
      b: [b("a", "--"), b("b", "-"), b("c", "row")],
    },
    {
      c: `row = [1] * (rowIndex + 1)
for i in range(2, rowIndex + 1):
    for j in range(i - 1, 0, {{a}}):
        row[j] = row[j] + row[j {{b}} 1]
return {{c}}`,
      b: [b("a", "-1"), b("b", "-"), b("c", "row")],
    },
  ),
  d(
    "spiral-matrix",
    "Spiral Matrix (traversal)",
    {
      c: `vector<int> ans;
int top = 0, bot = m - 1, left = 0, right = n - 1;
while (top <= bot && left <= right) {
  for (int j = left; j <= right; j++) ans.push_back(mat[top][j]);
  top{{a}};
  for (int i = top; i <= bot; i++) ans.push_back(mat[i][right]);
  right--;
  if (top <= bot) {
    for (int j = right; j >= left; j--) ans.push_back(mat[bot][j]);
    bot{{b}};
  }
  if (left <= right) {
    for (int i = bot; i >= top; i--) ans.push_back(mat[i][left]);
    left{{c}};
  }
}
return ans;`,
      b: [b("a", "++"), b("b", "--"), b("c", "++")],
    },
    {
      c: `List<Integer> ans = new ArrayList<>();
int top = 0, bot = m - 1, left = 0, right = n - 1;
while (top <= bot && left <= right) {
  for (int j = left; j <= right; j++) ans.add(mat[top][j]);
  top{{a}};
  for (int i = top; i <= bot; i++) ans.add(mat[i][right]);
  right--;
  if (top <= bot) {
    for (int j = right; j >= left; j--) ans.add(mat[bot][j]);
    bot{{b}};
  }
  if (left <= right) {
    for (int i = bot; i >= top; i--) ans.add(mat[i][left]);
    left{{c}};
  }
}
return ans;`,
      b: [b("a", "++"), b("b", "--"), b("c", "++")],
    },
    {
      c: `ans = []
top, bot, left, right = 0, m - 1, 0, n - 1
while top <= bot and left <= right:
    for j in range(left, right + 1): ans.append(mat[top][j])
    top {{a}} 1
    for i in range(top, bot + 1): ans.append(mat[i][right])
    right -= 1
    if top <= bot:
        for j in range(right, left - 1, -1): ans.append(mat[bot][j])
        bot {{b}} 1
    if left <= right:
        for i in range(bot, top - 1, -1): ans.append(mat[i][left])
        left {{c}} 1
return ans`,
      b: [b("a", "+="), b("b", "-="), b("c", "+=")],
    },
  ),
  d(
    "print-in-order",
    "Print in Order (semaphore / lock)",
    {
      c: `// use two mutexes locked at construction
mutex m1, m2;
Foo() { m1.lock(); m2.lock(); }
void first(function<void()> f)  { f(); m1.{{a}}(); }
void second(function<void()> f) { m1.lock(); f(); m2.{{b}}(); }
void third(function<void()> f)  { m2.lock(); f(); {{c}} }`,
      b: [b("a", "unlock"), b("b", "unlock"), b("c", "//")],
    },
    {
      c: `private final Semaphore run2 = new Semaphore(0), run3 = new Semaphore(0);
public void first(Runnable r)  { r.run(); run2.{{a}}(); }
public void second(Runnable r) { run2.acquire(); r.run(); run3.{{b}}(); }
public void third(Runnable r)  { run3.acquire(); r.run(); {{c}} }`,
      b: [b("a", "release"), b("b", "release"), b("c", "//")],
    },
    {
      c: `import threading
class Foo:
    def __init__(self):
        self.e2 = threading.Event()
        self.e3 = threading.Event()
    def first(self, f):
        f(); self.e2.{{a}}()
    def second(self, f):
        self.e2.wait(); f(); self.e3.{{b}}()
    def third(self, f):
        self.e3.wait(); f(); {{c}}`,
      b: [b("a", "set"), b("b", "set"), b("c", "pass")],
    },
  ),
];

// =====================================================================
// STRING BASICS
// =====================================================================
const stringBasics: Drill[] = [
  d(
    "valid-palindrome",
    "Valid Palindrome",
    {
      c: `int l = 0, r = (int)s.size() - 1;
while (l {{a}} r) {
  while (l < r && !isalnum(s[l])) l++;
  while (l < r && !isalnum(s[r])) r--;
  if (tolower(s[l]) != tolower(s[r])) return {{b}};
  l++; r--;
}
return {{c}};`,
      b: [b("a", "<"), b("b", "false"), b("c", "true")],
    },
    {
      c: `int l = 0, r = s.length() - 1;
while (l {{a}} r) {
  while (l < r && !Character.isLetterOrDigit(s.charAt(l))) l++;
  while (l < r && !Character.isLetterOrDigit(s.charAt(r))) r--;
  if (Character.toLowerCase(s.charAt(l)) != Character.toLowerCase(s.charAt(r))) return {{b}};
  l++; r--;
}
return {{c}};`,
      b: [b("a", "<"), b("b", "false"), b("c", "true")],
    },
    {
      c: `l, r = 0, len(s) - 1
while l {{a}} r:
    while l < r and not s[l].isalnum(): l += 1
    while l < r and not s[r].isalnum(): r -= 1
    if s[l].lower() != s[r].lower(): return {{b}}
    l += 1; r -= 1
return {{c}}`,
      b: [b("a", "<"), b("b", "False"), b("c", "True")],
    },
  ),
  d(
    "reverse-string",
    "Reverse String (in place)",
    {
      c: `int l = 0, r = (int)s.size() - 1;
while (l {{a}} r) {
  {{b}}(s[l], s[r]);
  l++;
  r{{c}};
}`,
      b: [b("a", "<"), b("b", "swap"), b("c", "--")],
    },
    {
      c: `int l = 0, r = s.length - 1;
while (l {{a}} r) {
  char t = s[l];
  s[l] = s[r];
  s[r] = {{b}};
  l++;
  r{{c}};
}`,
      b: [b("a", "<"), b("b", "t"), b("c", "--")],
    },
    {
      c: `l, r = 0, len(s) - 1
while l {{a}} r:
    s[l], s[r] = s[r], s[{{b}}]
    l += 1
    r {{c}} 1`,
      b: [b("a", "<"), b("b", "l"), b("c", "-=")],
    },
  ),
  d(
    "reverse-words-in-a-string",
    "Reverse Words in a String",
    {
      c: `stringstream ss(s);
vector<string> words;
string w;
while (ss >> w) words.push_back(w);
reverse(words.begin(), words.{{a}}());
string ans;
for (int i = 0; i < (int)words.size(); i++) {
  if (i) ans += {{b}};
  ans += words[i];
}
return {{c}};`,
      b: [b("a", "end"), b('b', '" "', ["' '"]), b("c", "ans")],
    },
    {
      c: `String[] parts = s.trim().split("\\\\s+");
Collections.reverse(Arrays.asList({{a}}));
return String.{{b}}(" ", parts);
// return {{c}};`,
      b: [b("a", "parts"), b("b", "join"), b("c", "parts")],
    },
    {
      c: `parts = s.split()
parts.{{a}}()
return {{b}}.join({{c}})`,
      b: [b("a", "reverse"), b('b', '" "', ["' '"]), b("c", "parts")],
    },
  ),
  d(
    "first-unique-character-in-a-string",
    "First Unique Character in a String",
    {
      c: `int cnt[26] = {};
for (char c : s) cnt[c - 'a']{{a}};
for (int i = 0; i < (int)s.size(); i++)
  if (cnt[s[i] - 'a'] == {{b}}) return i;
return {{c}};`,
      b: [b("a", "++"), b("b", "1"), b("c", "-1")],
    },
    {
      c: `int[] cnt = new int[26];
for (char c : s.toCharArray()) cnt[c - 'a']{{a}};
for (int i = 0; i < s.length(); i++)
  if (cnt[s.charAt(i) - 'a'] == {{b}}) return i;
return {{c}};`,
      b: [b("a", "++"), b("b", "1"), b("c", "-1")],
    },
    {
      c: `from collections import Counter
cnt = Counter(s)
for i, c in enumerate(s):
    if cnt[c] == {{b}}: return i
return {{c}}
# {{a}}`,
      b: [b("a", "#"), b("b", "1"), b("c", "-1")],
    },
  ),
  d(
    "string-compression",
    "String Compression (in place)",
    {
      c: `int w = 0, i = 0, n = chars.size();
while (i < n) {
  int j = i;
  while (j < n && chars[j] == chars[i]) j++;
  chars[w++] = chars[i];
  int run = j {{a}} i;
  if (run > 1) {
    for (char c : to_string(run)) chars[w++] = c;
  }
  i = {{b}};
}
return {{c}};`,
      b: [b("a", "-"), b("b", "j"), b("c", "w")],
    },
    {
      c: `int w = 0, i = 0, n = chars.length;
while (i < n) {
  int j = i;
  while (j < n && chars[j] == chars[i]) j++;
  chars[w++] = chars[i];
  int run = j {{a}} i;
  if (run > 1)
    for (char c : Integer.toString(run).toCharArray()) chars[w++] = c;
  i = {{b}};
}
return {{c}};`,
      b: [b("a", "-"), b("b", "j"), b("c", "w")],
    },
    {
      c: `w, i, n = 0, 0, len(chars)
while i < n:
    j = i
    while j < n and chars[j] == chars[i]:
        j += 1
    chars[w] = chars[i]; w += 1
    run = j {{a}} i
    if run > 1:
        for c in str(run):
            chars[w] = c; w += 1
    i = {{b}}
return {{c}}`,
      b: [b("a", "-"), b("b", "j"), b("c", "w")],
    },
  ),
  d(
    "roman-to-integer",
    "Roman to Integer",
    {
      c: `unordered_map<char,int> m;
m['I']=1; m['V']=5; m['X']=10; m['L']=50; m['C']=100; m['D']=500; m['M']=1000;
int ans = 0;
for (int i = 0; i < (int)s.size(); i++) {
  if (i + 1 < (int)s.size() && m[s[i]] < m[s[i+1]]) ans {{a}} m[s[i]];
  else ans += m[s[i]];
}
return {{b}};
// {{c}}`,
      b: [b("a", "-="), b("b", "ans"), b("c", "//")],
    },
    {
      c: `Map<Character,Integer> m = Map.of('I',1,'V',5,'X',10,'L',50,'C',100,'D',500,'M',1000);
int ans = 0;
for (int i = 0; i < s.length(); i++) {
  if (i + 1 < s.length() && m.get(s.charAt(i)) < m.get(s.charAt(i+1)))
    ans {{a}} m.get(s.charAt(i));
  else ans += m.get(s.charAt(i));
}
return {{b}};
// {{c}}`,
      b: [b("a", "-="), b("b", "ans"), b("c", "//")],
    },
    {
      c: `m = {'I':1,'V':5,'X':10,'L':50,'C':100,'D':500,'M':1000}
ans = 0
for i, ch in enumerate(s):
    if i + 1 < len(s) and m[ch] < m[s[i+1]]:
        ans {{a}} m[ch]
    else:
        ans += m[ch]
return {{b}}
# {{c}}`,
      b: [b("a", "-="), b("b", "ans"), b("c", "#")],
    },
  ),
];

// =====================================================================
// MATRIX BASICS
// =====================================================================
const matrixBasics: Drill[] = [
  d(
    "rotate-image",
    "Rotate Image 90° (transpose + reverse rows)",
    {
      c: `int n = mat.size();
for (int i = 0; i < n; i++)
  for (int j = i + 1; j < n; j++)
    swap(mat[i][j], mat[{{a}}][i]);
for (int i = 0; i < n; i++)
  reverse(mat[i].begin(), mat[i].{{b}}());
// {{c}}`,
      b: [b("a", "j"), b("b", "end"), b("c", "//")],
    },
    {
      c: `int n = mat.length;
for (int i = 0; i < n; i++)
  for (int j = i + 1; j < n; j++) {
    int t = mat[i][j]; mat[i][j] = mat[j][i]; mat[{{a}}][i] = t;
  }
for (int i = 0; i < n; i++) {
  int l = 0, r = n - 1;
  while (l < r) { int t = mat[i][l]; mat[i][l] = mat[i][r]; mat[i][r] = t; l++; r--; }
}
// {{b}} / {{c}}`,
      b: [b("a", "j"), b("b", "//"), b("c", "//")],
    },
    {
      c: `n = len(mat)
for i in range(n):
    for j in range(i + 1, n):
        mat[i][j], mat[{{a}}][i] = mat[j][i], mat[i][j]
for row in mat:
    row.{{b}}()
# {{c}}`,
      b: [b("a", "j"), b("b", "reverse"), b("c", "#")],
    },
  ),
  d(
    "spiral-matrix",
    "Spiral Matrix (traversal)",
    {
      c: `int top=0, bot=m-1, left=0, right=n-1;
vector<int> ans;
while (top <= bot && left <= right) {
  for (int j=left; j<=right; j++) ans.push_back(mat[top][j]); top{{a}};
  for (int i=top; i<=bot; i++) ans.push_back(mat[i][right]); right--;
  if (top<=bot) { for (int j=right; j>=left; j--) ans.push_back(mat[bot][j]); bot{{b}}; }
  if (left<=right) { for (int i=bot; i>=top; i--) ans.push_back(mat[i][left]); left{{c}}; }
}
return ans;`,
      b: [b("a", "++"), b("b", "--"), b("c", "++")],
    },
    {
      c: `int top=0, bot=m-1, left=0, right=n-1;
List<Integer> ans = new ArrayList<>();
while (top <= bot && left <= right) {
  for (int j=left; j<=right; j++) ans.add(mat[top][j]); top{{a}};
  for (int i=top; i<=bot; i++) ans.add(mat[i][right]); right--;
  if (top<=bot) { for (int j=right; j>=left; j--) ans.add(mat[bot][j]); bot{{b}}; }
  if (left<=right) { for (int i=bot; i>=top; i--) ans.add(mat[i][left]); left{{c}}; }
}
return ans;`,
      b: [b("a", "++"), b("b", "--"), b("c", "++")],
    },
    {
      c: `ans = []
top, bot, left, right = 0, m-1, 0, n-1
while top <= bot and left <= right:
    for j in range(left, right+1): ans.append(mat[top][j])
    top {{a}} 1
    for i in range(top, bot+1): ans.append(mat[i][right])
    right -= 1
    if top <= bot:
        for j in range(right, left-1, -1): ans.append(mat[bot][j])
        bot {{b}} 1
    if left <= right:
        for i in range(bot, top-1, -1): ans.append(mat[i][left])
        left {{c}} 1
return ans`,
      b: [b("a", "+="), b("b", "-="), b("c", "+=")],
    },
  ),
  d(
    "set-matrix-zeroes",
    "Set Matrix Zeroes (first row/col markers)",
    {
      c: `int m = mat.size(), n = mat[0].size();
bool firstCol = false;
for (int i = 0; i < m; i++) {
  if (mat[i][0] == 0) firstCol = true;
  for (int j = 1; j < n; j++)
    if (mat[i][j] == 0) mat[i][0] = mat[0][j] = {{a}};
}
for (int i = m - 1; i >= 0; i--) {
  for (int j = n - 1; j >= 1; j--)
    if (mat[i][0] == 0 || mat[0][j] == 0) mat[i][j] = {{b}};
  if (firstCol) mat[i][0] = {{c}};
}`,
      b: [b("a", "0"), b("b", "0"), b("c", "0")],
    },
    {
      c: `int m = mat.length, n = mat[0].length;
boolean firstCol = false;
for (int i = 0; i < m; i++) {
  if (mat[i][0] == 0) firstCol = true;
  for (int j = 1; j < n; j++)
    if (mat[i][j] == 0) { mat[i][0] = {{a}}; mat[0][j] = 0; }
}
for (int i = m - 1; i >= 0; i--) {
  for (int j = n - 1; j >= 1; j--)
    if (mat[i][0] == 0 || mat[0][j] == 0) mat[i][j] = {{b}};
  if (firstCol) mat[i][0] = {{c}};
}`,
      b: [b("a", "0"), b("b", "0"), b("c", "0")],
    },
    {
      c: `m, n = len(mat), len(mat[0])
first_col = False
for i in range(m):
    if mat[i][0] == 0: first_col = True
    for j in range(1, n):
        if mat[i][j] == 0:
            mat[i][0] = mat[0][j] = {{a}}
for i in range(m - 1, -1, -1):
    for j in range(n - 1, 0, -1):
        if mat[i][0] == 0 or mat[0][j] == 0:
            mat[i][j] = {{b}}
    if first_col: mat[i][0] = {{c}}`,
      b: [b("a", "0"), b("b", "0"), b("c", "0")],
    },
  ),
  d(
    "search-a-2d-matrix",
    "Search a 2D Matrix (flatten binary search)",
    {
      c: `int m = mat.size(), n = mat[0].size();
int lo = 0, hi = m * n - 1;
while (lo <= hi) {
  int mid = (lo + hi) / 2;
  int v = mat[mid / n][mid {{a}} n];
  if (v == target) return true;
  if (v < target) lo = mid + 1;
  else hi = mid {{b}} 1;
}
return {{c}};`,
      b: [b("a", "%"), b("b", "-"), b("c", "false")],
    },
    {
      c: `int m = mat.length, n = mat[0].length;
int lo = 0, hi = m * n - 1;
while (lo <= hi) {
  int mid = (lo + hi) / 2;
  int v = mat[mid / n][mid {{a}} n];
  if (v == target) return true;
  if (v < target) lo = mid + 1;
  else hi = mid {{b}} 1;
}
return {{c}};`,
      b: [b("a", "%"), b("b", "-"), b("c", "false")],
    },
    {
      c: `m, n = len(mat), len(mat[0])
lo, hi = 0, m * n - 1
while lo <= hi:
    mid = (lo + hi) // 2
    v = mat[mid // n][mid {{a}} n]
    if v == target: return True
    if v < target: lo = mid + 1
    else: hi = mid {{b}} 1
return {{c}}`,
      b: [b("a", "%"), b("b", "-"), b("c", "False")],
    },
  ),
  d(
    "search-a-2d-matrix-ii",
    "Search a 2D Matrix II (staircase)",
    {
      c: `int r = 0, c = (int)mat[0].size() - 1;
while (r < (int)mat.size() && c >= 0) {
  if (mat[r][c] == target) return true;
  if (mat[r][c] < target) r{{a}};
  else c{{b}};
}
return {{c}};`,
      b: [b("a", "++"), b("b", "--"), b("c", "false")],
    },
    {
      c: `int r = 0, c = mat[0].length - 1;
while (r < mat.length && c >= 0) {
  if (mat[r][c] == target) return true;
  if (mat[r][c] < target) r{{a}};
  else c{{b}};
}
return {{c}};`,
      b: [b("a", "++"), b("b", "--"), b("c", "false")],
    },
    {
      c: `r, c = 0, len(mat[0]) - 1
while r < len(mat) and c >= 0:
    if mat[r][c] == target: return True
    if mat[r][c] < target: r {{a}} 1
    else: c {{b}} 1
return {{c}}`,
      b: [b("a", "+="), b("b", "-="), b("c", "False")],
    },
  ),
  d(
    "transpose-matrix",
    "Transpose Matrix",
    {
      c: `int m = mat.size(), n = mat[0].size();
vector<vector<int>> t(n, vector<int>(m, 0));
for (int i = 0; i < m; i++)
  for (int j = 0; j < n; j++)
    t[j][{{a}}] = mat[i][{{b}}];
return {{c}};`,
      b: [b("a", "i"), b("b", "j"), b("c", "t")],
    },
    {
      c: `int m = mat.length, n = mat[0].length;
int[][] t = new int[n][m];
for (int i = 0; i < m; i++)
  for (int j = 0; j < n; j++)
    t[j][{{a}}] = mat[i][{{b}}];
return {{c}};`,
      b: [b("a", "i"), b("b", "j"), b("c", "t")],
    },
    {
      c: `m, n = len(mat), len(mat[0])
t = [[0] * m for _ in range(n)]
for i in range(m):
    for j in range(n):
        t[j][{{a}}] = mat[i][{{b}}]
return {{c}}`,
      b: [b("a", "i"), b("b", "j"), b("c", "t")],
    },
  ),
];

// =====================================================================
// RECURSION BASICS
// =====================================================================
const recursionBasics: Drill[] = [
  d(
    "fibonacci-number",
    "Fibonacci Number (recursion + memo)",
    {
      c: `int fib(int n, vector<int>& memo) {
  if (n < 2) return {{a}};
  if (memo[n] != -1) return memo[n];
  return memo[n] = fib(n - 1, memo) {{b}} fib(n - {{c}}, memo);
}`,
      b: [b("a", "n"), b("b", "+"), b("c", "2")],
    },
    {
      c: `int fib(int n, int[] memo) {
  if (n < 2) return {{a}};
  if (memo[n] != -1) return memo[n];
  return memo[n] = fib(n - 1, memo) {{b}} fib(n - {{c}}, memo);
}`,
      b: [b("a", "n"), b("b", "+"), b("c", "2")],
    },
    {
      c: `def fib(n, memo):
    if n < 2: return {{a}}
    if memo[n] != -1: return memo[n]
    memo[n] = fib(n - 1, memo) {{b}} fib(n - {{c}}, memo)
    return memo[n]`,
      b: [b("a", "n"), b("b", "+"), b("c", "2")],
    },
  ),
  d(
    "climbing-stairs",
    "Climbing Stairs",
    {
      c: `if (n <= 2) return n;
int a = 1, b = 2;
for (int i = 3; i {{a}} n; i++) {
  int c = a + b;
  a = b;
  b = {{b}};
}
return {{c}};`,
      b: [b("a", "<="), b("b", "c"), b("c", "b")],
    },
    {
      c: `if (n <= 2) return n;
int a = 1, b = 2;
for (int i = 3; i {{a}} n; i++) {
  int c = a + b;
  a = b;
  b = {{b}};
}
return {{c}};`,
      b: [b("a", "<="), b("b", "c"), b("c", "b")],
    },
    {
      c: `if n <= 2: return n
a, b = 1, 2
for i in range(3, n + 1):
    a, b = b, a {{a}} b
return {{b}}
# {{c}}`,
      b: [b("a", "+"), b("b", "b"), b("c", "#")],
    },
  ),
  d(
    "powx-n",
    "Pow(x, n) (fast power)",
    {
      c: `double myPow(double x, long n) {
  if (n < 0) { x = 1 / x; n = -n; }
  double ans = 1;
  while (n > 0) {
    if (n {{a}} 1) ans *= x;
    x *= x;
    n {{b}}= 1;
  }
  return {{c}};
}`,
      b: [b("a", "&"), b("b", ">>"), b("c", "ans")],
    },
    {
      c: `double myPow(double x, long n) {
  if (n < 0) { x = 1 / x; n = -n; }
  double ans = 1;
  while (n > 0) {
    if ((n {{a}} 1) == 1) ans *= x;
    x *= x;
    n {{b}}= 1;
  }
  return {{c}};
}`,
      b: [b("a", "&"), b("b", ">>"), b("c", "ans")],
    },
    {
      c: `def myPow(x, n):
    if n < 0: x, n = 1/x, -n
    ans = 1.0
    while n > 0:
        if n {{a}} 1:
            ans *= x
        x *= x
        n {{b}}= 1
    return {{c}}`,
      b: [b("a", "&"), b("b", ">>"), b("c", "ans")],
    },
  ),
  d(
    "sum-of-digits-of-string-after-convert",
    "Sum of Digits of String After Convert",
    {
      c: `string t;
for (char c : s) t += to_string(c - 'a' + 1);
for (int i = 0; i < k; i++) {
  int sum = 0;
  for (char c : t) sum += c {{a}} '0';
  t = to_string({{b}});
}
return stoi({{c}});`,
      b: [b("a", "-"), b("b", "sum"), b("c", "t")],
    },
    {
      c: `StringBuilder sb = new StringBuilder();
for (char c : s.toCharArray()) sb.append(c - 'a' + 1);
String t = sb.toString();
for (int i = 0; i < k; i++) {
  int sum = 0;
  for (char c : t.toCharArray()) sum += c {{a}} '0';
  t = Integer.toString({{b}});
}
return Integer.parseInt({{c}});`,
      b: [b("a", "-"), b("b", "sum"), b("c", "t")],
    },
    {
      c: `t = ''.join(str(ord(c) - ord('a') + 1) for c in s)
for _ in range(k):
    s2 = sum(int(ch) for ch in t)
    t = str({{b}})
return int({{c}})
# {{a}}`,
      b: [b("a", "#"), b("b", "s2"), b("c", "t")],
    },
  ),
  d(
    "subsets",
    "Subsets (recursive)",
    {
      c: `function<void(int, vector<int>&)> solve = [&](int i, vector<int>& cur) {
  if (i == (int)nums.size()) { ans.push_back(cur); return; }
  solve(i + 1, cur);
  cur.push_back(nums[i]);
  solve(i {{a}} 1, cur);
  cur.{{b}}();
};
vector<int> cur;
solve({{c}}, cur);`,
      b: [b("a", "+"), b("b", "pop_back"), b("c", "0")],
    },
    {
      c: `void solve(int i, List<Integer> cur, int[] nums, List<List<Integer>> ans) {
  if (i == nums.length) { ans.add(new ArrayList<>(cur)); return; }
  solve(i + 1, cur, nums, ans);
  cur.add(nums[i]);
  solve(i {{a}} 1, cur, nums, ans);
  cur.remove(cur.size() - {{b}});
}
// solve({{c}}, new ArrayList<>(), nums, ans);`,
      b: [b("a", "+"), b("b", "1"), b("c", "0")],
    },
    {
      c: `def solve(i, cur):
    if i == len(nums):
        ans.append(cur[:]); return
    solve(i + 1, cur)
    cur.append(nums[i])
    solve(i {{a}} 1, cur)
    cur.{{b}}()
solve({{c}}, [])`,
      b: [b("a", "+"), b("b", "pop"), b("c", "0")],
    },
  ),
  d(
    "letter-combinations-of-a-phone-number",
    "Letter Combinations of a Phone Number",
    {
      c: `if (digits.empty()) return {};
vector<string> map = {"","","abc","def","ghi","jkl","mno","pqrs","tuv","wxyz"};
vector<string> ans;
function<void(int, string&)> solve = [&](int i, string& cur) {
  if (i == (int)digits.size()) { ans.push_back(cur); return; }
  for (char c : map[digits[i] - '0']) {
    cur.push_back(c);
    solve(i {{a}} 1, cur);
    cur.{{b}}();
  }
};
string cur;
solve({{c}}, cur);
return ans;`,
      b: [b("a", "+"), b("b", "pop_back"), b("c", "0")],
    },
    {
      c: `if (digits.isEmpty()) return new ArrayList<>();
String[] map = {"","","abc","def","ghi","jkl","mno","pqrs","tuv","wxyz"};
List<String> ans = new ArrayList<>();
solve(0, new StringBuilder(), digits, map, ans);
return ans;
// void solve(int i, StringBuilder cur, String d, String[] map, List<String> ans) {
//   if (i == d.length()) { ans.add(cur.toString()); return; }
//   for (char c : map[d.charAt(i) - '0'].toCharArray()) {
//     cur.append(c);
//     solve(i {{a}} 1, cur, d, map, ans);
//     cur.deleteCharAt(cur.length() - {{b}});
//   }
// }
// initial i = {{c}}`,
      b: [b("a", "+"), b("b", "1"), b("c", "0")],
    },
    {
      c: `if not digits: return []
mp = {'2':'abc','3':'def','4':'ghi','5':'jkl','6':'mno','7':'pqrs','8':'tuv','9':'wxyz'}
ans = []
def solve(i, cur):
    if i == len(digits):
        ans.append(''.join(cur)); return
    for c in mp[digits[i]]:
        cur.append(c)
        solve(i {{a}} 1, cur)
        cur.{{b}}()
solve({{c}}, [])
return ans`,
      b: [b("a", "+"), b("b", "pop"), b("c", "0")],
    },
  ),
];

// =====================================================================
// EXPORT
// =====================================================================
export const DRILLS: Record<string, Drill[]> = {
  "two-pointers": twoPointers,
  kadane,
  "prefix-sum": prefixSum,
  "sliding-window": slidingWindow,
  "hashmap-frequency": hashmapFreq,
  "monotonic-stack": monotonicStack,
  "fast-slow": fastSlow,
  "reverse-list": reverseList,
  "tree-dfs": treeDfs,
  "tree-bfs": treeBfs,
  "graph-bfs-dfs": graphBfsDfs,
  "topo-sort": topoSort,
  dijkstra,
  knapsack,
  lis,
  mcm,
  backtracking,
  "binary-search": binarySearch,
  "bs-on-answer": bsAnswer,
  "bit-tricks": bitTricks,
  "number-theory-basics": numberTheory,
  "pattern-printing": patternPrinting,
  "string-basics": stringBasics,
  "matrix-basics": matrixBasics,
  "recursion-basics": recursionBasics,
};
