# UI failure mode

The earlier code had two independent theme decisions: outer tool foreground followed Sanity theme; inner preview background was always white. Without an inner foreground reset, dark mode created the exact white/light-on-white failure. The patch makes background and foreground decisions atomic at the inner boundary.
