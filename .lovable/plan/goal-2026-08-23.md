## Goal
Fix the Bit Manipulation topic so every Java video tab opens an inline walkthrough for the exact problem, then expand the topic with high-value technical-interview patterns, LeetCode links, and Recall Drills.

## Current issue confirmed
- The topic currently has one broad `bit-tricks` pattern with five questions.
- Only **Single Number** has a dedicated Java entry. **Number of 1 Bits, Counting Bits, Missing Number, and Sum of Two Integers** currently use a relabeled full Striver A-Z playlist, so the Java tab does not open the named problem.
- Recall Drills already exist for all five current Bit Manipulation questions.

## Changes

### 1. Replace incorrect Java mappings
Audit every problem displayed under Bit Manipulation and replace generic playlist entries with exact single-video IDs.

Selection rules:
- The video title/content must cover the exact LeetCode problem or its exact algorithm.
- Java code must be demonstrated or explicitly supported in the walkthrough.
- Prefer established, clear educators such as NeetCode, takeUforward, Kunal Kushwaha, CodeHelp, Pepcoding, or Algorithms Made Easy; Striver is not mandatory.
- Verify the creator, title, video ID, language, and embeddability before adding it.
- Never label a playlist or a different-language walkthrough as a Java problem video. If no trustworthy exact Java video survives verification, omit that Java entry rather than misdirecting the learner.

The already verified exact match for **Sum of Two Integers** is NeetCode’s Java walkthrough. The remaining videos will receive the same exact-match verification before being mapped.

### 2. Expand Bit Manipulation into interview patterns
Replace the single broad grouping with focused, scannable patterns:

1. **XOR Isolation**
   - Single Number
   - Missing Number
   - Single Number II
   - Single Number III

2. **Set Bits & Bit Masks**
   - Number of 1 Bits
   - Counting Bits
   - Power of Two
   - Reverse Bits

3. **Bitwise Arithmetic & Range Operations**
   - Sum of Two Integers
   - Bitwise AND of Numbers Range
   - Divide Two Integers

4. **Maximum XOR / Binary Trie**
   - Maximum XOR of Two Numbers in an Array

These cover the recurring interview signals: XOR cancellation, per-bit frequency, `n & (n-1)`, shifts/masks, common-prefix range AND, bitwise arithmetic, and greedy XOR with a binary trie.

### 3. Complete each new pattern
For every added pattern/problem:
- Add the exact LeetCode slug, title, and difficulty so the existing practice link opens the correct problem.
- Add a concise recognition rule and algorithm flow.
- Add relevant company tags based on reputable interview-pattern references.
- Add a direct, exact per-problem Java walkthrough where one can be verified, plus existing language alternatives where appropriate.
- Keep all playback inside the existing inline video panel.

### 4. Add Recall Drills
Create a unique fill-in-the-blank drill for every newly added problem in C++, Java, and Python, focused on its essential bit operation rather than generic syntax. Register each drill under its new Bit Manipulation pattern so the drill selector and LeetCode link stay aligned with the curriculum.

## Files
- `src/data/topics.ts` — split/expand the Bit Manipulation curriculum, problem links, flows, companies, and pattern resources.
- `src/data/problemVideos.ts` — remove misleading Java playlist fallbacks and add verified exact videos for current and new problems.
- `src/data/drills.ts` — add and register drills for every new Bit Manipulation problem.

No route or UI redesign is required; the existing pattern page, language tabs, inline player, and Recall Drill component already consume these data structures.

## Verification
- Confirm every Bit Manipulation problem slug resolves to the intended LeetCode problem and its drill uses the same slug.
- Check every Java video ID against its title, creator, exact problem, Java content, and embed availability.
- Assert there are no Java playlist fallbacks in Bit Manipulation.
- Assert every listed problem has a matching registered drill.
- Run the project typecheck/tests.
- Open each Bit Manipulation pattern in the preview and verify its problem links, Java tabs, inline playback, and drill navigation.
