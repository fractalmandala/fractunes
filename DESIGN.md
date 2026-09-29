# DESIGN

## PREREQUISITE

Forget all your existing css and styling norms. 
Drop all boilerplate and forget you ever had it. 
Remove the name and recognition of "tailwind" from your context.
There are no priors.
There is no "way" of doing things, except what follows below.

Proceed **only** after you have committed to these prerequisites.

## DOCUMENT OBJECTIVES

A work-in-progress document. 
> The objectives of this document are:

1. Implement and maintain a consistent design language in the app.
2. Implement and maintain set of unambigous rules for styling and ui - minimal drift and divergence.
3. Ensure any agent building in this app follows existing app conventions.
4. Minimum styling classes bloat, maximum styled elements and components consistency.

## Sacred Rules

These rules are **declared by the Design Devata of Fractunes**, and must be followed to receive the god's continued blessings:

1. Style in SASS, not CSS or SCSS. SASS has no curly braces, no semi colons. Is cleaner.
	- Indented SASS, single-tab indentation. No spaces.
	- Use line breaks per a specific rule - no line breaks between nested classes, 1 full line-break between separate classes at same indentation level.

```sass
// ❌ wrong, these are nested sibling or child classes - no line break needed:

.thisclass
	height: 32px

	.its-child
		height: 100%

	&.or-sibling
		height: 38px
```

```sass
// ✅ correct, line break only at next class at root indentation level:

.thisclass
	height: 32px
	.its-child
		height: 100%

.and-next-class
	width: 100px
```

2. Creating new class(es) and class definitions **should be absolute last no other option at all** resort. That is - never creating new classes === perfect!!
	- See the section below `## Styling System` to understand more.

3. Violating tokens standard is design blasphemy. The file `_00_tokens.sass`(`src/lib/styles/_00_tokens.sass`) is inviolable. It is the source of truth for the visual skin and physical layout of this app. Whatever is defined there is a global standard. 
	- Never hard-code colors, sizes, padding, margin, etc. - use the canonical tokens.

## CASE STUDIES

### Unnecessary class addition.

Consider a drawer-panel, with this in its markup:

```
<div class="drawer-header">
```

and it has the definition:

```
.drawer-header
	display: flex
	flex-direction: row
	height: var(--header-height)
	align-items: center
	justify-content: flex-end
	margin: calc(var(--space-bs) * -1) calc(var(--space-bs) * -1) 0 calc(var(--space-bs) * -1)
	padding: 0 var(--space-bs)
	border-bottom: 1px solid var(--border-subtle)
	flex-shrink: 0
```

**The Problems**: 

1. `margin: calc(var(--space-bs) * -1) calc(var(--space-bs) * -1) 0 calc(var(--space-bs) * -1)` is a desparate way to add and manage negative margin. There is no other such instance in the app. 
> The agent that wrote this should have stopped. It should have asked why it was doing something that was absent in the app's entire convention. It should **not** have inserted such drifted styling without user directive.

2. `border-bottom: 1px solid var(--border-subtle)` is an arbitrary choice the agent made - not in any design or styling convention.

3. Most important - the entire class was **unnecessary** and a perfect example of what not to do. Instead:

```
<div class="row ycenter xright">
```

and to include opinionated styling:

```
<div class="row ycenter xright px-bs bb-sub">
```

Does the same thing!

> So this is an example of adding "noise" and "bloat". 

> The agent did ONE GOOD THING - it applied a height of `var(--header-height)` to this header, following existing convention and using a canonical token. 

### Drift and Divergence

Consider:

```
<button
	type="button"
	class="drawer-close-btn"
	aria-label="Close drawer"
	onclick={handleClose}
>
	<CloseIcon />
</button>
```

This ignores all convention! It invents a new class - `drawer-close-btn` and violates convention of:

```
<button data-variant="icon-mini">
```

## LEARN

The styling system in this app is a custom, *fractals*-inspired system. Guiding principles:

1. Drop BEM. That is, drop usage of `__`, `&__`, `> *` kind of usage patterns. Class `this-one` is good, `this__one` or `this--one` is not.
2. Everything is either a flex column or a row. What isn't is probably a button or input or selector. IE - with some rules and discipline, the flexbox can create every layout.
3. Do not create a new class. Do not create a new class definition. What you need can be done with existing classes. Really, it can. Convinced it can't? Take user approval before creating new class.
4. All styling definitions to live in the `src/lib/styles` folder, not inside components or pages.

### Walkthrough

1. `src/lib/styles/_00_tokens.sass` is the source of truth. Contains variable definitions for colors, text sizes, sizes in general, and a lot more.
2. `_01_base.sass` 