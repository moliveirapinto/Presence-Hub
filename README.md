# Presence Hub

A **Power Apps Component Framework (PCF)** control designed for the **Dynamics 365 Customer Service workspace productivity pane**. It combines [Presence Timer](https://github.com/moliveirapinto/modern-sla-timer-pcf) and [Queue Hub](https://github.com/moliveirapinto/Queue-Hub) into a single two-tab tool with shared initialization.

This PCF shows the agent’s live and historical availability—like how much break time you still have left—and also displays queue presence, helping ensure other agents are available before you log off.

![Presence Hub](img/presence_hub.png)

## Table of Contents

- [What It Does](#what-it-does)
- [Presence Status Colors](#presence-status-colors)
- [Control Properties](#control-properties)
- [Prerequisites](#prerequisites)
- [How to Deploy to Your Dynamics 365 Environment](#how-to-deploy-to-your-dynamics-365-environment)
- [Configure as a Productivity Pane Tool](#configure-as-a-productivity-pane-tool)
- [Enabling for Users](#enabling-for-users)
- [Project Structure](#project-structure)
- [Data Model](#data-model)
- [License](#license)

## What It Does

This control provides a **tabbed layout** inside the productivity pane with two panels:

### Presence History (default tab)
- Displays the agent's **current presence status** with a color-coded card
- **Live elapsed timer** showing time in current status — reads from `msdyn_agentstatushistory` so it **survives page refreshes**
- **Daily timeline** of all presence changes for the selected date
- **Summary chips** with a breakdown of time spent in each status
- **Calendar picker** to browse presence history for any past date
- **Timezone-aware** — day boundaries use the user's local timezone, not UTC
- **5-second auto-refresh** for near real-time updates

### Queue Hub
- Lists all **queues the current agent is a member of** (via `queuemembership` N:N)
- **Search bar** to filter queues by name
- Click any queue to see all **agents assigned to that queue**
- Each agent card shows:
  - **Avatar** with initials and a **presence dot** (color-coded)
  - **Real-time presence status**
  - **Duration** since last presence change
  - **"You" badge** highlighting the current agent
- **Summary chips** showing status breakdown across the queue
- **Status-based sorting** — Available agents first, Offline agents last
- **Profile photos** from Dataverse `entityimage` with initials fallback
- **10-second auto-refresh**

## Presence Status Colors

| Status | Color |
|---|---|
| Available | Green |
| Busy | Red |
| Do Not Disturb | Red |
| Away / Appear Away | Yellow |
| After Conversation Work | Pink |
| Offline / Inactive | Gray |

## Control Properties

| Property | Description | Default |
|---|---|---|
| **dummyProp** (SingleLine.Text) | Unused property required by PCF framework | — |

The control uses the **WebAPI** and **Utility** PCF features to query Dataverse directly.

## Prerequisites

- Dynamics 365 Customer Service with **Omnichannel for Customer Service** enabled
- **Productivity pane** configured in your Customer Service workspace app
- Agents must have an **active Omnichannel presence** for presence data to appear
- Agents must be **members of at least one queue** for the Queue Hub tab to show results

## How to Deploy to Your Dynamics 365 Environment

> [!IMPORTANT]
> After importing the solution, you **must** configure the control as a productivity pane tool — see [Configure as a Productivity Pane Tool](#configure-as-a-productivity-pane-tool) below. The control will not appear in the workspace until this step is completed.

### Option 1: Import the Solution (Recommended)

1. Download the latest solution zip from the [Releases](../../releases) page
2. Go to your Dynamics 365 environment → **Settings** → **Solutions** (or use [make.powerapps.com](https://make.powerapps.com))
3. Click **Import** and upload the solution zip
4. Follow the import wizard and publish all customizations

### Option 2: Import via Power Platform CLI

```bash
# Install Power Platform CLI if not already installed
npm install -g pac

# Authenticate to your environment
pac auth create --url https://YOUR_ORG.crm.dynamics.com

# Import the solution
pac solution import --path ./solution.zip
```

### Option 3: Build from Source

If you want to modify the control and rebuild:

```bash
# Clone the repository
git clone https://github.com/moliveirapinto/Presence-Hub.git
cd Presence-Hub

# Install dependencies
npm install

# Build the control
npm run build

# Build the solution zip (unmanaged)
cd Solution
dotnet build --configuration Release

# Import to your environment
pac solution import --path bin/Release/Solution.zip
```

## Configure as a Productivity Pane Tool

After importing the solution, you need to configure Presence Hub as a **pane tool** in the productivity pane:

1. Open [make.powerapps.com](https://make.powerapps.com) and navigate to your environment
2. Go to **Apps** → open **Customer Service admin center**
3. Navigate to **Workspaces** → **Productivity pane**
4. Under **Pane tools**, click **+ Add tool**
5. Configure the pane tool:

   | Field | Value |
   |---|---|
   | **Name** | `Presence Hub` |
   | **Unique Name** | `mau_presencehub` |
   | **Control name** | `mau_MauLabs.PresenceHub` |
   | **Icon (Web resource)** | Choose an existing icon web resource or upload a new SVG/PNG (e.g., a clock-alarm icon). The icon appears in the productivity pane sidebar. |

6. Save and enable the tool
7. Add it to your **Pane tab configuration** linked to your productivity pane config
8. **Publish** all customizations

The control will appear as a new icon in the productivity pane sidebar of the Customer Service workspace.

## Enabling for Users

After installation, agents need to be **assigned to the correct experience profile** to see the Presence Hub in their productivity pane.

### Option A: Assign via Agent Experience Profile

1. Go to **Customer Service admin center** → **Agent experience** → **Workspaces** → **Agent experience profiles**.
2. Open the profile that has the Presence Hub pane tool (e.g., **Contact center agent experience profile**).
3. Under the **Users** section, click **Add users** and search for the agents you want to enable.
4. Save the profile. Those agents will see the Presence Hub icon next time they open the workspace.

### Option B: Assign via Workstream (for Omnichannel agents)

1. Go to **Customer Service admin center** → **Customer support** → **Workstreams**.
2. Open the workstream (e.g., **Chat workstream**, **Voice workstream**, etc.).
3. Under **Advanced settings**, find the **Agent experience profile** field.
4. Set it to the profile that contains the Presence Hub tool.
5. Save the workstream. All agents routed through this workstream will get the configured productivity pane.

### Option C: Default profile (all agents)

1. In **Agent experience profiles**, open the profile marked as **Default**.
2. Add the Presence Hub pane tool to its productivity pane (same steps as [Configure as a Productivity Pane Tool](#configure-as-a-productivity-pane-tool)).
3. All agents without a specific profile assignment will inherit this default.

> **Note:** Changes to experience profiles take effect on the agent's next page load — no restart needed, just a browser refresh.

## Project Structure

```
Presence-Hub/
├── README.md
├── package.json
├── tsconfig.json
├── pcfconfig.json
├── Presence-Hub.pcfproj
└── PresenceHub/
    ├── ControlManifest.Input.xml          # PCF control manifest
    ├── index.ts                           # Main control logic (both tabs)
    └── css/
        └── PresenceHub.css                # Control styles
```

## Data Model

The control queries the following Dataverse entities:

### Presence History tab

```
systemuser
    ↓
msdyn_agentstatus          (current presence ID + modified timestamp)
    ↓
msdyn_agentstatushistory   (presence changes with start/end times)
    ↓
msdyn_presence             (presence ID → friendly name mapping)
```

- **Current status**: read from `msdyn_agentstatus` for the logged-in agent
- **Timer start time**: read from the latest `msdyn_agentstatushistory` record matching the current presence, so it persists across page refreshes
- **Timeline & chips**: queried from `msdyn_agentstatushistory` filtered by selected date (timezone-aware boundaries)

### Queue Hub tab

```
queue ←→ queuemembership (N:N) ←→ systemuser
                                        ↓
                                  msdyn_agentstatus
                                        ↓
                                  msdyn_presence
```

- **Queues**: filtered to only show queues where the current user is a member
- **Agents**: retrieved per queue via the `queuemembership` intersect entity
- **Presence**: loaded from `msdyn_agentstatus` (batched in groups of 10) and resolved to friendly names via `msdyn_presence`

## License

[MIT](LICENSE)
