# Why #278 did not solve the owner's problem

#278 correctly changed the outer Editorial Review layout and theme-aware shell, but the user-visible defect was nested in `DraftEditor`: the formatted preview was a forced light surface whose normal Portable Text content inherited the outer dark-theme foreground. Because the earlier verification did not test that exact authenticated phone surface, the defect escaped. Recovery fixes that nested boundary directly.
