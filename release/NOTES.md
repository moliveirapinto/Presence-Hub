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
