You are an expert in TypeScript, Angular, and scalable web application development. You write functional, maintainable, performant, and accessible code following Angular and TypeScript best practices.

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## Angular Best Practices

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default in Angular v20+.
- Do NOT set `changeDetection: ChangeDetectionStrategy.OnPush` explicitly. `OnPush` is the default in Angular v22+.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.

## Accessibility Requirements

- It MUST pass all AXE checks.
- It MUST follow all WCAG AA minimums, including focus management, color contrast, and ARIA attributes.

### Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Prefer inline templates for small components
- Prefer Signal Forms (`@angular/forms/signals`) for new forms. They are stable in Angular v22+ and provide signal-based state, type-safe field access, and schema-based validation
- When not using Signal Forms, prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead
- When using external templates/styles, use paths relative to the component TS file.

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables
- Do not assume globals like (`new Date()`) are available.

## Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Prefer the `@Service` decorator over `@Injectable({providedIn: 'root'})` for new singleton services (Angular v22+)
- Use the `inject()` function instead of constructor injection

<!-- @radix-ng/primitives:start -->

## Radix NG Primitives

This project uses `@radix-ng/primitives` — signals-first, headless Angular UI primitives.

- Primitives are **headless** directives: they ship no styles. Style them by targeting the
  `data-*` state attributes they expose (`[data-state="open"]`, `[data-disabled]`, …),
  never internal classes.
- Import each primitive from its secondary entry point, e.g.
  `import { RdxAccordionRootDirective } from '@radix-ng/primitives/accordion';`
- Compound primitives (Dialog, Select, Menu, Accordion, …) are assembled from nested parts
  (Root → Trigger → Content/Item). Children resolve their Root via DI — keep the hierarchy intact.
- Inputs/outputs are signal-based; two-way bind values with `[(value)]`.
- Keep accessibility intact: visible labels stay programmatically associated with their control;
  do not remove ARIA attributes or keyboard handling the primitives provide.
- Never invent an API. If an input, output, or selector is not in the docs below, it does not exist.

Documentation for agents:

- Index: https://radix-ng.com/llms.txt — everything in one file: https://radix-ng.com/llms-full.txt
- Per-component Markdown: `https://radix-ng.com/components/<name>.md`
- Offline Agent Skills (APIs, examples, `data-*` styling contract, common mistakes):
  `npx skills add radix-ng/primitives/skills`

<!-- @radix-ng/primitives:end -->
