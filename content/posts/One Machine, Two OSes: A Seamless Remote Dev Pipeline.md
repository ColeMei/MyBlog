---
title: "One Machine, Two OSes: A Seamless Remote Dev Pipeline"
slug: "one-machine-two-oses-a-seamless-remote-dev-pipeline"
date: 2026-04-06T12:00:00+10:00
draft: false
toc: true
description: "How I wired macOS and WSL2 into one seamless dev environment with Tailscale and 1Password SSH agent."
pin: false
scrolltotop: true
ShowLastmod: false
images:
  - https://picsum.photos/id/1067/1920/1080
tags: 
  - Tutorial
---

## The problem: two machines, one workflow

If you work in research or anything that involves heavy compute, you've probably landed in this situation: your daily driver is a MacBook (great keyboard, great display, great battery), but your workloads need a beefy desktop with a GPU, more RAM, or specific OS-level tooling.

My setup is a MacBook Pro for everyday development and a Windows desktop running WSL2 with Ubuntu. Until recently I did most things on the Mac — including running experiments in Docker. That changed when I started working on a security research benchmark: one of the dynamic analysis tools had a compatibility issue with Docker on macOS and simply wouldn't run. I had to move the experiment execution stage to WSL2. Once I did, I also realized the desktop's extra CPU and RAM cut experiment runtimes significantly, so it made sense to keep it that way.

I already use Tailscale across all my devices and keep all my SSH keys in 1Password — so the question was less "what tools do I need" and more "how do I wire what I already have into a pipeline where I never have to touch the Windows desktop." Everything should happen through the terminal on the Mac.

The catch? WSL2 gets a new internal IP every time Windows reboots. And without a bit of plumbing, you end up manually hunting for IPs and re-running commands every few weeks.

Here's how I wired it all together.

## Architecture overview

Before diving into the details, here's how all the pieces fit together:

{{< svg caption="Figure 1 — High-level architecture: macOS develops, WSL2 executes, Tailscale connects the Mac to Windows, port forwarding reaches WSL2." >}}
<svg viewBox="0 0 690 420" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </marker>
  </defs>

  <!-- Tailscale mesh cloud -->
  <rect x="165" y="165" width="360" height="90" rx="45" fill="none" stroke="#1D9E75" stroke-width="1" stroke-dasharray="6 4" opacity="0.5"/>
  <text x="345" y="195" text-anchor="middle" font-family="sans-serif" font-size="11" fill="#0F6E56" font-weight="500" opacity="0.7">Tailscale private mesh (100.x.x.x)</text>

  <!-- macOS box -->
  <g>
    <rect x="40" y="30" width="190" height="100" rx="10" fill="#E1F5EE" stroke="#1D9E75" stroke-width="0.8"/>
    <text x="135" y="62" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#085041" font-weight="500">macOS</text>
    <text x="135" y="82" text-anchor="middle" font-family="sans-serif" font-size="11" fill="#0F6E56">develop · edit · analyze</text>
    <text x="135" y="100" text-anchor="middle" font-family="sans-serif" font-size="11" fill="#0F6E56">1Password agent</text>
  </g>

  <!-- Windows/WSL2 box -->
  <g>
    <rect x="460" y="30" width="190" height="100" rx="10" fill="#E6F1FB" stroke="#378ADD" stroke-width="0.8"/>
    <text x="555" y="55" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#0C447C" font-weight="500">Windows desktop</text>
    <rect x="475" y="68" width="160" height="50" rx="6" fill="#B5D4F4" stroke="#378ADD" stroke-width="0.5"/>
    <text x="555" y="88" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#042C53" font-weight="500">WSL2 (Ubuntu)</text>
    <text x="555" y="105" text-anchor="middle" font-family="sans-serif" font-size="10" fill="#185FA5">Docker · GPU · compute</text>
  </g>

  <!-- SSH arrow Mac -> WSL2 -->
  <path d="M230 75 Q345 60 460 75" fill="none" stroke="#1D9E75" stroke-width="1.5" marker-end="url(#arr)"/>
  <text x="345" y="52" text-anchor="middle" font-family="monospace" font-size="10" fill="#0F6E56">ssh wsl</text>

  <!-- rsync arrow WSL2 -> Mac -->
  <path d="M460 110 Q345 150 230 110" fill="none" stroke="#378ADD" stroke-width="1.5" marker-end="url(#arr)"/>
  <text x="345" y="145" text-anchor="middle" font-family="monospace" font-size="10" fill="#185FA5">rsync results</text>

  <!-- Port forwarding detail -->
  <g>
    <rect x="410" y="280" width="240" height="104" rx="8" fill="#FAEEDA" stroke="#EF9F27" stroke-width="0.6"/>
    <text x="530" y="305" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#854F0B" font-weight="500">Windows port forward</text>
    <text x="530" y="324" text-anchor="middle" font-family="monospace" font-size="10" fill="#854F0B">:2222 → WSL2 :22</text>
    <text x="530" y="346" text-anchor="middle" font-family="sans-serif" font-size="10" fill="#854F0B">Auto-runs on startup via</text>
    <text x="530" y="362" text-anchor="middle" font-family="sans-serif" font-size="10" fill="#854F0B">Task Scheduler + PowerShell</text>
  </g>

  <!-- 1Password detail -->
  <g>
    <rect x="40" y="280" width="240" height="104" rx="8" fill="#EEEDFE" stroke="#7F77DD" stroke-width="0.6"/>
    <text x="160" y="305" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#3C3489" font-weight="500">1Password SSH agent</text>
    <text x="160" y="326" text-anchor="middle" font-family="sans-serif" font-size="10" fill="#534AB7">Keys never leave 1Password</text>
    <text x="160" y="346" text-anchor="middle" font-family="sans-serif" font-size="10" fill="#534AB7">Biometric unlock on macOS</text>
    <text x="160" y="366" text-anchor="middle" font-family="sans-serif" font-size="10" fill="#534AB7">Agent forwarding to WSL2</text>
  </g>

  <!-- Connectors to detail boxes -->
  <line x1="135" y1="130" x2="135" y2="278" stroke="#7F77DD" stroke-width="0.8" stroke-dasharray="4 3" marker-end="url(#arr)"/>
  <line x1="555" y1="130" x2="555" y2="278" stroke="#EF9F27" stroke-width="0.8" stroke-dasharray="4 3" marker-end="url(#arr)"/>

  <!-- tmux label -->
  <rect x="310" y="380" width="70" height="24" rx="12" fill="#F1EFE8" stroke="#B4B2A9" stroke-width="0.5"/>
  <text x="345" y="396" text-anchor="middle" font-family="monospace" font-size="10" fill="#5F5E5A">tmux</text>
  <text x="345" y="416" text-anchor="middle" font-family="sans-serif" font-size="10" fill="#888780">persistent sessions</text>
</svg>
{{< /svg >}}

Each piece solves one specific annoyance: Tailscale gives stable IPs; 1Password removes key management; The port-forwarding script handles the WSL2 dynamic IP; tmux keeps experiments alive when SSH drops. 

Next, let's walk through each.

---

## Exposing WSL2 after every reboot

WSL2 runs inside a lightweight VM, which means it gets a fresh internal IP address (in the `172.x.x.x` range) every time Windows reboots. This breaks any hardcoded SSH config pointing at WSL2.

The fix is a small PowerShell script that runs on Windows startup. It discovers the current WSL2 IP, tears down any stale port forwarding rules, and sets up a fresh forward from Windows port `2222` to WSL2 port `22`.

### The PowerShell script

```powershell
# wsl2-port-forward.ps1
# Get the current WSL2 IP
$wslIp = (wsl hostname -I).Trim().Split(" ")[0]

# Remove stale rules
netsh interface portproxy reset

# Forward port 2222 on all Windows interfaces to WSL2:22
netsh interface portproxy add v4tov4 `
  listenport=2222 listenaddress=0.0.0.0 `
  connectport=22 connectaddress=$wslIp

# Allow through Windows Firewall (run once)
# New-NetFirewallRule -DisplayName "WSL2 SSH" `
#   -Direction Inbound -LocalPort 2222 -Protocol TCP -Action Allow

Write-Host "Forwarding 0.0.0.0:2222 -> ${wslIp}:22"
```

### Automate it with Task Scheduler

Create a scheduled task that triggers "At log on" (or "At startup") running this script with elevated privileges. After that, every reboot is handled automatically — no manual IP hunting.

> **Why port 2222?**
> Using a non-standard port avoids conflicts if Windows itself is running an SSH server on port 22. It also makes it immediately clear in your SSH config which connections are going to WSL2 versus a native host.

---

## Tailscale: stable IPs without thinking

I've been running [Tailscale](https://tailscale.com) on all my devices for a while now, it's one of those tools that disappears into the background once set up. It creates a WireGuard-based mesh VPN where each device gets a stable `100.x.x.x` address that works from anywhere. No port forwarding on your router, no dynamic DNS.

For this pipeline, Tailscale only needs to be on two things:

1. **macOS** — via the Mac App Store or `brew install tailscale`
2. **Windows** — via the Tailscale Windows installer

Since we already have port forwarding from Windows port `2222` to WSL2 port `22`, there's no need to install Tailscale inside WSL2. The Mac connects to the Windows host's Tailscale IP, and the port forward takes care of the rest.

### SSH config on the Mac

With Tailscale and 1Password SSH agent both running, the Mac-side `~/.ssh/config` looks like this:

```ssh-config
# ~/.ssh/config
# Use 1Password SSH agent for all hosts
Host *
  IdentityAgent ~/.1password/agent.sock
  Include ~/.ssh/1Password/config
  IdentitiesOnly yes

# WSL2 via Windows host's Tailscale IP
Host wsl
  HostName 100.x.x.x            # Windows host's Tailscale IP
  User your-username
  Port 2222
  IdentityFile ~/.ssh/keys/your-key.pub
```

Now `ssh wsl` from anywhere lands you in your Ubuntu session — the IP never changes, so this config survives reboots indefinitely.

---

## 1Password SSH agent: keys without key files

I switched to 1Password's SSH agent a while back and haven't looked at a raw key file since. All my SSH keys live in my 1Password vault — encrypted, synced, and never written to disk. The 1Password app on macOS exposes an agent socket that any SSH client can use, with biometric (Touch ID) approval for each connection.

### How it fits into this pipeline

1. **Keys live in 1Password.** Generate or import your SSH keys directly in the 1Password app. No `~/.ssh/id_*` files on disk.
2. **macOS uses the 1Password agent.** The `IdentityAgent` and `IdentityFile` lines in the SSH config (shown above) tell SSH to ask 1Password for the key. When you `ssh wsl`, Touch ID fires, and you're in.
3. **Agent forwarding passes the key to WSL2.** With agent forwarding, your 1Password-managed key is available inside the WSL2 session too. You can `git pull` from private repos or `rsync` back to the Mac — all authenticated through the forwarded agent.

In 1Password settings, make sure the SSH agent is enabled under **Developer → SSH Agent**. The agent will serve any key in your vault that has the "Use for SSH" toggle turned on.

> **Security benefit.**
> Your private keys never exist as files on disk — on *any* machine. They're encrypted in 1Password's vault, decrypted only in memory when you approve a request. If your WSL2 instance or Mac is compromised, there's no `~/.ssh/` directory to exfiltrate.

### The Windows side: bridging 1Password into WSL2

1Password runs on Windows too, but WSL2 is a separate Linux VM — the agent's named pipe doesn't exist inside WSL2. The bridge is [`npiperelay`](https://github.com/jstarks/npiperelay) combined with `socat`: a small relay that exposes the Windows 1Password agent as a Unix socket inside WSL2. When you `git push` from a local WSL2 terminal, the request travels through the relay to 1Password, the GUI pops up, you approve with Windows Hello, and the key is served.

This works great — until you SSH into WSL2 from the Mac. There's no desktop session, no GUI, no way for 1Password to show its popup. The bridge just hangs.

The fix is a conditional block in `~/.zshrc` that detects how you entered WSL2:

```zsh
if [[ -n "$SSH_CONNECTION" ]]; then
    # Remote session — use a dedicated headless key
    ln -sf ~/.ssh/config.headless ~/.ssh/config
    eval $(keychain --eval --quiet ~/.ssh/id_ed25519_headless 2>/dev/null)
else
    # Local desktop — bridge to 1Password agent
    ln -sf ~/.ssh/config.local ~/.ssh/config
    export SSH_AUTH_SOCK="$HOME/.ssh/agent.sock"
    [[ $- == *i* ]] && setsid socat \
        UNIX-LISTEN:"$SSH_AUTH_SOCK",mode=600,unlink-early,fork \
        EXEC:"/mnt/c/Windows/System32/npiperelay.exe -ei -s //./pipe/openssh-ssh-agent",nofork \
        >/dev/null 2>&1 &
fi
```

It also symlinks the right SSH config: the local version lets 1Password handle key selection; the headless version pins a dedicated key with `IdentitiesOnly yes` for GitHub and the Mac. The headless key (`id_ed25519_headless`) is the one key that lives on disk — it's added to `authorized_keys` on the Mac and to GitHub, and only gets used when the GUI isn't available.

The result: at the desktop you get the full biometric popup; from the Mac you get seamless headless auth.

---

## Persistent sessions with tmux

Long-running experiments will outlive your SSH connection. Wi-Fi drops, laptops sleep, and VPN tunnels time out. Without a persistent session, your process dies when the connection does.

`tmux` is the standard solution. Start a named tmux session on WSL2, run your experiment inside it, and detach freely. Reconnect whenever you want.

```bash
# On WSL2: start a named session
tmux new -s experiment

# Run your workload inside the session
python run_experiment.py --config my_config.toml

# Detach: Ctrl+B then D
# Reconnect later:
tmux attach -t experiment
```

I name sessions after the experiment or task, so `tmux ls` gives me a quick dashboard of what's running.

### What this looks like in practice

In my recent research project, my typical flow is: develop and iterate on the Mac, then SSH into WSL2 to kick off the real run. Here's a concrete example — starting from the Mac terminal:

```bash
# 1. SSH into WSL2
ssh wsl

# 2. Pull the latest code
cd ~/projects/my-project
git pull

# 3. Start a named tmux session and run the experiment
tmux new -s baseline-run
python src/run_experiment.py --config configs/baseline.toml
```

Detach with `Ctrl-b d`, close the laptop, go get coffee or sleep. Later:

```bash
# Reconnect from anywhere
ssh wsl
tmux attach -t baseline-run
```

The Mac is the control plane — I write code, tweak configs, run quick smoke tests locally. The moment I need real compute (GPU, large dataset, Docker), I `ssh wsl` and run it there. The Windows desktop itself never needs to be touched.

---

## Syncing results back to macOS

Once an experiment finishes on WSL2, I want the results on my Mac for analysis. A simple `rsync` handles this:

```bash
# From WSL2, sync a specific run back to the Mac
rsync -avz --progress \
  ~/projects/my-project/runs/baseline/2026-04-05_14-30/ \
  mac:~/projects/my-project/runs/baseline/2026-04-05_14-30/
```

The `mac` host alias works because the Mac is also on the Tailnet with a stable IP, and WSL2's agent-forwarded SSH key authenticates the connection. No passwords, no key files.

For repeated use, I wrap this in a small shell script that takes an experiment name and a run timestamp, resolves the paths, and handles edge cases like partial transfers or syncing evaluation results alongside the raw run output. Something like:

```bash
# A wrapper script that syncs run + eval directories
bash scripts/sync_run_to_mac.sh baseline 2026-04-05_14-30

# Preview what would be synced without actually transferring
bash scripts/sync_run_to_mac.sh --dry-run baseline 2026-04-05_14-30
```

> **Keep large runs out of git.**
> Experiment outputs can be gigabytes of logs, checkpoints, and evaluation artifacts. Add your runs directory to `.gitignore` and treat rsync as the transport layer. Commit only code, configs, and lightweight analysis.

---

## Bonus: quality-of-life extras

### Auto-start SSH server in WSL2

WSL2 doesn't start `sshd` automatically. Add this to your WSL2's `/etc/wsl.conf` (WSL2 in Windows 11 supports `[boot]` commands):

```ini
# /etc/wsl.conf
[boot]
command = service ssh start
```

Now `sshd` starts every time WSL2 boots, no manual intervention needed.

### Git commit signing with 1Password

Since your SSH keys are already in 1Password, you can use the same setup for signing git commits. 1Password can automatically configure your local `~/.gitconfig` with the right signing key. Every commit is signed, verified on GitHub, and the key never touches disk.

### Monitoring from the Mac

For long-running jobs, I sometimes want to glance at GPU usage or system load without SSHing in. A lightweight solution is to run a small status script on WSL2 that periodically writes a JSON summary, then pull it with a cron job on the Mac.

---

## Wrapping up

None of the individual pieces here are novel — Tailscale, 1Password, tmux, rsync are all tools I was already using. The value is in wiring them together into a pipeline where the daily workflow is just:

1. Write code and configs on the Mac
2. `ssh wsl` — land in Ubuntu on the desktop
3. `git pull`, start a tmux session, run the experiment
4. Detach, close the laptop, come back later
5. Sync results back, analyze locally

The Mac is always the control plane. The Windows box never needs its monitor turned on.
