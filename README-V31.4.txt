V31.4 FAST LOGIN
- Previously successful credentials open instantly from local auth cache.
- Session UI no longer waits for initial cloud synchronization.
- Account validation and synchronization continue silently in the background.
- First-time owner login skips unnecessary schema setup round trips.
- Removed an extra subscriber-name query from the critical owner login path.
- Existing sync datasets/logic otherwise preserved.
