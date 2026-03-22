# Presence Hub

A unified PCF control for Dynamics 365 Customer Service workspace that combines **Presence History** and **Queue Hub** into a single productivity pane tool with tab navigation.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Build](#build)
- [Configuration](#configuration)
- [License](#license)

## Overview

Presence Hub merges two standalone PCF controls into one:

| Tab | Description |
|---|---|
| **Presence History** | Shows the agent's current presence status with a live elapsed timer, daily timeline of presence changes, summary chips, and a calendar date picker for viewing historical data. |
| **Queue Hub** | Lists all queues the current agent belongs to. Drill into any queue to see every member's real-time presence status, profile photo, and time in status. |

The **Presence History** tab is the default view when the control loads.

## Features

- **Tabbed layout** — switch between Presence History and Queue Hub without leaving the productivity pane
- **Shared initialization** — presence map and user identity are loaded once and shared across both tabs
- **Live timers** — Presence History polls every 5 seconds; Queue Hub polls every 10 seconds
- **Calendar picker** — browse presence history for any past date
- **Profile photos** — Queue Hub displays Dataverse entity images with initials fallback
- **Status chips** — at-a-glance breakdown of presence distribution

## Installation

> [!IMPORTANT]
> After importing the managed solution, you must add the control to a **productivity pane tool** in the Customer Service admin center (under *Productivity* → *Productivity pane*). Configure it as a custom web resource tool pointing to the `MauLabs.PresenceHub` control.

1. Build the solution (see [Build](#build)).
2. Import the generated managed solution ZIP into your D365 environment.
3. Add the control to a productivity pane tool and publish.

## Build

```bash
npm install
npm run build
```

To create a solution package:

```bash
cd Presence-Hub
dotnet build
```

The output ZIP will be in `bin/Debug/`.

## Configuration

No special configuration properties are required. The control uses:

- **WebAPI** feature for Dataverse queries
- **Utility** feature for `getEntityMetadata` (enabled by default)

Defined in `ControlManifest.Input.xml` with a single dummy property to satisfy the PCF schema.

## License

[MIT](LICENSE)
