# Originality evidence-only generation

This branch removes source excerpts/body text from the OpenAI generation prompt while retaining them for the deterministic originality check. Generation now receives the validated fact ledger plus source provenance (publisher, title, URL, date and primary-source flag), reducing source-shaped phrasing without weakening the plagiarism/originality gate.

The controlled acquisition importer also processes every candidate before reporting a batch failure, so one rejected story no longer hides the verification result for the remaining stories.
