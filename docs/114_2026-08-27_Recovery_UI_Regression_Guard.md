# UI regression guard

Future theme work must treat a fixed-background nested surface as owning its foreground too. Do not rely on inherited theme foreground inside a fixed light/dark proof surface.
