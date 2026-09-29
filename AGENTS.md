# Agents

Fractunes is a WIP app. Code is always in flux. That makes these rules all the more important:

1. Read `DESIGN.md` for all design and styling rules. Follow them.
2. You are not permitted to add yourself as contributor in git repo pushes.
3. Every new feature, component, major edit or modification in the app must follow the `product-design-tech spec workflow` detailed in section below. See section `## Product Design Tech Spec Workflow` in this doc then start at `docs/dev-workflow/01-workflow-intro.md`
4. Before starting any dev server, always check with user if they have a server live, and use that instead of running parallel servers.
5. See the `skills` folder for useful skills.

## Currently Active

1. app styling being standardized
2. need to add settings.

## YAML frontmatter and Indexing

All documents inside `docs` must have YAML frontmatter (except `INDEX.md` files), and all subfolders in `docs` must have an `INDEX.md` file as registry of the documents in that subfolder.

YAML frontmatter rules:

```YAML
---
title: 
description: //max 2-line description that is greppable and gives file context without needing agent to spend tokens on reading full file.
type: //the subfolder this doc is in
id: a numbered sequencing that records the place of each doc in its folder's sequence.
---
```

Links in md docs should **not** use the `[[` and `]]` backlinks convention. Write simple links, using relative paths, like this linked [design doc](/DESIGN.md).

## Product Design Tech Spec Workflow

The objective of this workflow is efficient agents and mature context. And the spec workflow is more to build and evolve app knowledge, than to maintain a history and record of decisions etc.

Do not treat this workflow as a storage record of past decisions. Decisions can change. The past does not become a bible to live by.
Treat this workflow as good product development techniques, and the continuous building of app knowledge that can feed agent context, user knowledge, product documentation - anything.

The workflow is simple, for any new feature, component, major edit or modification:

1. Start with writing the product spec. When it is aligned with and approved by user,
2. Write the design spec. When it is aligned with an approved by user,
3. Write the tech spec. When it aligned with an approved by user,
4. Implement spec. When user approves that spec has been implemented,
5. Conduct closure checks and close task.

For complete details, see the skills `skills/write-specs` and `skills/implement-specs`.