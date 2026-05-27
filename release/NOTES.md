## PresenceHub v2.8.3

### Critical bug fixes
- **Pill no longer freezes on "Loading..."** when the OmniChannel agent-status row is missing or its `_msdyn_currentpresenceid_value` is null. We now render `Offline` in those cases instead of throwing.
- **Fixed broken poll backoff** (`_errStreak % (skip+1) !== 0`) that permanently locked polling after 3 consecutive failures because `_errStreak` only changed on real attempts, so the modulo never reset. Replaced with an independent `_skipCount` tick counter.
- **Restored compile-time correctness**: the v2.8.2 source had a stale `PresenceTimerPanel._tzOffsetStr()` call in `_fetchAgentHistory` after the `_toUtcLiteral` refactor - meaning v2.8.2's bundle could not actually be rebuilt cleanly from source. Replaced with a UTC literal helper so the queue-tab agent history is now also immune to the OData `+` URL-decode bug in positive-offset timezones.
- **Defensive `_render`**: re-queries the DOM if the cached `data-ref="sName"` node was detached, and falls back to `"Unknown"` if `p.name` is empty.
- **Visible version stamp** ("PresenceHub v2.8.3") in the bottom-right of the presence panel - lets you confirm at a glance whether the browser is running the latest bundle vs a cached one.
- **Console diagnostics** when the agent-status query returns no row or a null presence id (look for `[PresenceHub]` warnings in DevTools console).

### Assets
- `PresenceHub_2_8_3.zip` - unmanaged solution
- `PresenceHub_2_8_3_managed.zip` - managed solution

### Install
If you already have v2.8.2 (broken) installed, this version is an in-place upgrade - no need to uninstall first:
```pwsh
pac solution import --path PresenceHub_2_8_3_managed.zip --publish-changes
```

After install, hard-reload the browser (Ctrl+F5) to bypass any cached copy of the v2.8.2 bundle. Confirm the "v2.8.3" stamp is visible at the bottom of the presence panel.
