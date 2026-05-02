# Stage 1

## Notification Priority System Design

### 1. Sorting Logic & Priority Algorithm
The system is designed to sort notifications in a two-tiered manner to ensure the most critical and relevant information bubbles up to the top of the "Priority Inbox".

#### Primary Sorting (Weight)
Each notification type is assigned a specific integer weight to dictate its overall importance:
- **Placement (Weight: 3)**: The highest priority, as placement opportunities are time-sensitive and critical to student career outcomes.
- **Result (Weight: 2)**: Medium priority, as academic results are highly important but generally less immediately actionable than a job placement.
- **Event (Weight: 1)**: Standard priority, representing general campus events or announcements.

#### Secondary Sorting (Recency)
If two notifications share the same type (and therefore the same weight), the algorithm uses a secondary condition: **Recency**. 
- The timestamps of the notifications are compared.
- The newer notification (more recent timestamp) is prioritized over the older one.

### 2. Time Complexity Analysis
The sorting mechanism utilizes JavaScript's native `Array.prototype.sort()`.

- **Time Complexity:** `O(N log N)`, where `N` is the number of unread notifications. Modern JavaScript engines implement `sort()` using variations of Merge Sort or Timsort, ensuring an average and worst-case time complexity of `O(N log N)`. 
- **Space Complexity:** `O(N)` because we create a shallow copy of the filtered unread notifications array before sorting (`[...notifications].sort(...)`) to prevent mutating the original state directly. The sorting algorithm itself might also require up to `O(N)` auxiliary space depending on the browser's JavaScript engine implementation.

This approach guarantees that the priority feed can efficiently handle even large batches of notifications without causing main-thread blocking or visual lag on the frontend.
