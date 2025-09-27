# Accessibility Guidelines

To keep the Mawu Foundation experience inclusive and demo-ready we follow these accessibility principles across the product:

## Colour & Contrast
- Minimum 4.5:1 contrast ratio for interactive text, with 7:1 targets on primary CTAs against hero photography.
- Layer translucent brand gradients over imagery to preserve readability and legibility for all visitors.
- Use neutral "ink" palette tokens for body copy to avoid grey-on-white combinations that fall below WCAG AA.

## Focus & Keyboard Navigation
- Global `:focus-visible` styles create a high-contrast brand ring with offset to separate focus from adjacent elements.
- Every interactive element (buttons, links, form inputs, cards) is reachable via keyboard tab order and provides clear visual feedback.
- Skip navigation link appears on focus to let keyboard and assistive-technology users jump directly to the main content.

## Semantics & Assistive Tech Support
- Headings follow a logical hierarchy using the `Heading` design-system component to reinforce document structure for screen readers.
- Navigation landmarks (header, main, footer) and labelled `<nav>` elements improve orientation and reduce cognitive load.
- Decorative icons receive `aria-hidden` while meaningful media includes descriptive `alt` text for context.

## Motion & Feedback
- Animations use subtle easing tokens and respect user preferences by avoiding flashing or looping sequences that could trigger discomfort.
- Buttons and toggles share consistent interaction states—hover, focus, disabled—so behaviour remains predictable.

Document last reviewed: 2025-09-27.
