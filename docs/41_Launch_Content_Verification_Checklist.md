# Launch content verification checklist

- [ ] Merge the launch introduction cleanup PR after CI passes.
- [ ] Run `npm run seed:sanity` with the production `SANITY_API_TOKEN`.
- [ ] Confirm all seven known legacy seed articles are absent from Sanity.
- [ ] Confirm the introduction article is present and published.
- [ ] Confirm the introduction is the homepage lead.
- [ ] Confirm the News archive contains the introduction.
- [ ] Confirm `/articles/welcome-to-the-rugby-panda` renders correctly.
- [ ] Confirm the brand image renders with appropriate alt text.
- [ ] Confirm removed legacy slugs are absent from the sitemap.
- [ ] Confirm Province, URC and International pages handle an empty article state cleanly.
- [ ] Confirm production deployment is green.
