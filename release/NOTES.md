## PresenceHub v2.10.0

A hardening release. No behaviour changes for agents beyond the fixes below, but the Queue Hub
tab now costs a small fraction of the API calls it used to, and the project finally builds and
releases itself.

### Queue Hub: API calls cut from O(queues x agents) to 2 per refresh

Loading agents issued **one request per queue**, and then, inside each of those, a sequential
loop of presence lookups batched ten users at a time. An agent in 15 queues with 40 members each
was making roughly 75 requests **every 10 seconds**, which is a realistic way to get throttled
(HTTP 429) in a large contact centre.

Membership and presence are now each resolved in a single FetchXML query joined server-side, so a
refresh costs **two requests regardless of how many queues or agents are involved**. If an org
rejects the joined presence query, it falls back to id-batched filters run in parallel rather
than sequentially.

Related:
- **A hidden tab no longer polls.** The Queue Hub kept refreshing in the background for the whole
  session once opened, even while the Presence History tab was on screen. Both panels now suspend
  when hidden and refresh immediately when shown.
- **Expanded agents no longer re-fetch a full day of history every 10 seconds** - the cache was
  being cleared on every poll. It now has a 60 second TTL.
- **Profile photos are no longer re-requested on every re-render**, and users with no photo are
  remembered so their 404 is only ever hit once.
- **Personal default queues are filtered out server-side** where the org allows it, instead of
  guessing from the queue name.

### Queue Hub: failures are visible again

Background refreshes swallowed every error, so a throttled or erroring WebAPI left the tab frozen
on stale data with no indication anything was wrong. Failures now surface in a banner and back off
progressively, matching the Presence History tab.

Re-rendering the list also no longer scrolls you back to the top.

### Accessibility

- Tabs expose `role="tab"` / `aria-selected` / `aria-controls`; agent rows are keyboard-operable
  with Enter and Space and report `aria-expanded`.
- Presence dots carry an `aria-label` with the status name, and their inner icons are marked
  decorative.
- The date picker closes on Escape and returns focus to its button.

### Localization

- Added the missing `Show agents`, `now` and `Offline` strings, which were previously hardcoded
  English regardless of language. 33 of 43 locales are now complete, up from 0.
- `zh-HK` falls back to `zh-TW` rather than English.
- `npm run i18n:check` reports which locales are still partial. Ten remain: eu, gl, et, lv, lt,
  bg, sr, el, kk, zh-HK. These fall back to English for the missing strings, as before.

### Project

- **The solution project is now committed**, so the shipped .zip is reproducible by anyone. It was
  previously gitignored and existed only on one machine.
- **CI on every push** builds the control, builds both solution packages and runs the tests;
  tagging `v*` builds and publishes the release automatically.
- **65 unit tests** covering status classification, duration formatting, day-window clamping and
  the OData literal format - the areas where the v2.9.0 bugs actually lived.
- The version is set from one place: `npm run version:set 2.10.1`. CI fails if the manifest,
  solution and bundle stamp disagree.
- `getInitials` no longer throws on a whitespace-only display name.

### Assets
- `PresenceHub_2_10_0_managed.zip` - managed solution (recommended)
- `PresenceHub_2_10_0.zip` - unmanaged solution

### Install
In-place upgrade from any 2.x - no need to uninstall first:
```pwsh
pac solution import --path PresenceHub_2_10_0_managed.zip --publish-changes
```
Or import the .zip from **Power Apps -> Solutions -> Import solution**.

After install, have agents hard-reload the browser (Ctrl+F5) to drop the cached bundle, and confirm
the **v2.10.0** stamp at the bottom of the Presence History panel.

---

## PresenceHub v2.9.0

Fixes the two issues reported from the field: custom presence statuses rendering grey, and the
"time in status" timer showing an alarming multi-day number after a weekend.

### Custom / localized presence statuses are no longer grey

Colours and icons used to be derived purely from English keyword matching on the presence text
(`available`, `busy`, `away`, `offline`, ...). Any status an admin created - `Break`, `Lunch`,
`Training`, `Coaching`, `Wrap-up` - matched nothing and fell through to the grey default, which is
exactly the reported symptom: **everything grey except Available**. Orgs running a non-English UI
language hit the same problem for the out-of-the-box statuses.

Presence Hub now reads **`msdyn_basepresencestatus`** (the *Base status* field on each presence
record) and colours from it: Available -> green, Busy -> red, Busy - DND -> red, Away -> yellow,
Offline -> grey. Keyword matching is kept only as a fallback for orgs where that column can't be
read, and *After conversation work* still keeps its distinct pink.

Two related colouring bugs are fixed at the same time:
- `Busy - After Conversation Work` was matching the shorter `busy` key first and rendering red
  instead of pink, because the lookup iterated keys in declaration order.
- Status sorting in Queue Hub now uses the same resolver, so custom statuses sort into the right
  group instead of always landing in "other".

> If a custom status still shows grey after upgrading, open it in the Customer Service admin center
> and make sure its **Base status** is set.

### Time in status

- **Timer no longer counts a stale, already-closed segment.** `_getPresence` picked the newest
  history row for the current presence *regardless of whether it had already ended*, so a closed
  segment could anchor the timer days in the past. It now takes the still-open segment
  (`msdyn_endtime eq null`) and falls back to `msdyn_presencemodifiedon`.
- **Timer no longer freezes on a rapid A -> B -> A change.** Polling only resynced when the presence
  *id* changed, so switching away and back between two 5-second polls left the clock running from
  the old start. It now also resyncs when the segment start time changes.
- **Durations past 24h are readable.** `138:22:33` now renders as `5d 18:22:33`, and Queue Hub's
  `138h 22m` renders as `5d 18h`.
- **The status start time is shown under the timer**, so a large value is self-explanatory rather
  than looking like a bug.

### "No activity on this day" while the pill showed hours in that status

The timeline query matched only segments that **started** inside the selected day. A status held
across midnight - the common "signed out Friday, back Monday" case - was excluded entirely, so the
day looked empty while the pill reported many hours in that same status. Both the Presence History
timeline and the Queue Hub agent bars now match segments that **overlap** the day and clamp them to
the day's boundaries, so totals are day-local and correct.

### Refresh behaviour

- Presence polls every **5s**, Queue Hub every **10s** (unchanged), but polling now **resumes
  immediately when the browser tab regains focus** instead of waiting for the next interval -
  background tabs are heavily throttled by browsers, so this was the main source of stale data for
  agents returning after a break.
- The **"Today" view now rolls over at midnight** for panels left open overnight; previously it kept
  showing the previous day labelled "Today".
- The "Today" timeline auto-refreshes every 5 minutes so the in-progress segment keeps growing.

### Other

- `getInitials` no longer throws on a whitespace-only display name.
- The version stamp is driven by a single constant instead of being duplicated in the markup.

### Assets
- `PresenceHub_2_9_0_managed.zip` - managed solution (recommended)
- `PresenceHub_2_9_0.zip` - unmanaged solution

### Install
In-place upgrade from any 2.x - no need to uninstall first:
```pwsh
pac solution import --path PresenceHub_2_9_0_managed.zip --publish-changes
```
Or import the .zip from **Power Apps -> Solutions -> Import solution**.

After install, have agents hard-reload the browser (Ctrl+F5) to drop the cached bundle, and confirm
the **v2.9.0** stamp at the bottom of the Presence History panel.
