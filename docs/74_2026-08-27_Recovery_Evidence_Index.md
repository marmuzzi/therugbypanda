# Recovery evidence index

Primary owner evidence: 27 August received email showing stale stories; authenticated Android Sanity screenshot showing low-contrast Stored formatted preview and owner-observed unrelated Henderson image.

Repository root-cause evidence: `sanity/components/EditorialReview/DraftEditor.tsx` forced white preview background while normal Portable Text inherited theme foreground. Recovery implementation sets explicit high-contrast light-surface foregrounds.

See docs 54-73 for recovery acceptance and boundaries.
