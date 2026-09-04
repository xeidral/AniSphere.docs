---
title: AniSphere
layout: home

hero:
  name: AniSphere
  text: One window.
  tagline: Search twenty thousand titles before you finish typing, watch, track and download. A desktop client that hosts nothing and streams nothing of its own.
  image:
    src: /logo.png
    alt: AniSphere
  actions:
    - theme: brand
      text: Install it
      link: /Installation
    - theme: alt
      text: How it works
      link: /Architecture-Overview
    - theme: alt
      text: Source
      link: https://github.com/xeidral/anisphere

features:
  - icon: ⌘
    title: The catalogue is on your disk
    details: Twenty thousand titles indexed locally, so search answers while you type instead of after a request. What is on screen is fetched for the screen, and nothing beyond it.
    link: /Getting-Started
    linkText: Getting started
  - icon: ⚡
    title: One request opens the home screen
    details: Four rankings and the spotlight in a single query. The order is kept, so a second visit costs nothing, and every card the page drew is fetched together right after it.
    link: /Data-Sources
    linkText: What it asks for
  - icon: ⛓
    title: Everything has something behind it
    details: A ranking falls through to another ranking, a schedule to its stored copy, an episode to the file you saved. Pull the network out and the library is still there.
    link: /Downloads-And-Offline
    linkText: Downloads and offline
  - icon: ⚑
    title: It says what it sends
    details: Every service is named, with how often it is asked and what is kept. Nothing about what you watch leaves the machine, and there is no analytics endpoint to opt out of.
    link: /Data-Privacy-And-Security
    linkText: Privacy
  - icon: ⌗
    title: Boundaries the quality gate enforces
    details: The layers point one way, a command is an adapter and never a decision, and no query may walk a catalogue. ESLint and named Sonar project checks keep that shape visible without turning static rules into tests.
    link: /Architecture-Boundaries
    linkText: Boundaries
  - icon: ◆
    title: Six sites, raced
    details: Providers are asked at once and the first playable answer wins, with a bound on how long anyone may wait. A source that goes down is routed around, not waited for.
    link: /Provider-System
    linkText: Provider system
---

<div class="shots">

## What it looks like

![The home screen](/home.webp)

<div class="shots-pair">

![The library](/library.webp)

![The player](/player.webp)

</div>

![The connectivity board](/connectivity.webp)

</div>

<div class="closing">

## Where to go next

| If you want to | Start at |
|---|---|
| Install it and watch something | [Installation](/Installation) |
| Know what it sends where | [Data sources](/Data-Sources) |
| Fix something that is not working | [Troubleshooting](/Troubleshooting) |
| Build it yourself | [Development setup](/Development-Setup) |
| Know where the next thing goes | [Architecture boundaries](/Architecture-Boundaries) |

</div>
