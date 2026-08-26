import React, { useEffect, useMemo, useState } from "react";
import { useClient, useCurrentUser, type Tool } from "sanity";

import { EDITORIAL_API_BASE_URL, QUEUE_QUERY, actionMap } from "./EditorialReview/constants";
import { normaliseId } from "./EditorialReview/formatting";
import { textToBody } from "./EditorialReview/portableText";
import { createEditorialReview, articleToEditable } from "./EditorialReview/editorialReview";
import { ReviewQueue } from "./EditorialReview/ReviewQueue";
import { EditorialReviewSummary } from "./EditorialReview/EditorialReviewSummary";
import { DraftEditor } from "./EditorialReview/DraftEditor";
import { AIEditorialReview } from "./EditorialReview/AIEditorialReview";
import { FeaturedImagePanel } from "./EditorialReview/FeaturedImagePanel";
import { SourcesPanel } from "./EditorialReview/SourcesPanel";
import { FactLedgerPanel } from "./EditorialReview/FactLedgerPanel";
import { WorkflowPanel } from "./EditorialReview/WorkflowPanel";
import { AuditHistoryPanel } from "./EditorialReview/AuditHistoryPanel";
import type { ReviewArticle, EditorialAction, AiEditorialFinding, AiEditorialVoiceAssessment, EditableDraft } from "./EditorialReview/types";

type StudioTokenClient = { getToken?: () => Promise<string | undefined>; config: () => { token?: string } };

export function EditorialReviewTool({ tool: _tool }: { tool: Tool }): React.JSX.Element {
  const studioClient = useClient({ apiVersion: "2025-01-01" });
  const client = studioClient.withConfig({ perspective: "raw", useCdn: false });
  const currentUser = useCurrentUser();
  const [articles, setArticles] = useState<ReviewArticle[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<EditableDraft | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [note, setNote] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [aiFindings, setAiFindings] = useState<AiEditorialFinding[] | null>(null);
  const [aiVoiceAssessment, setAiVoiceAssessment] = useState<AiEditorialVoiceAssessment | null>(null);
  const [isAiReviewing, setIsAiReviewing] = useState(false);
  const actor = currentUser?.name?.trim() || currentUser?.email?.trim() || "Sanity editor";
  const selected = useMemo(() => articles.find((article) => article._id === selectedId) ?? articles[0], [articles, selectedId]);
  const availableActions = actionMap[selected?.workflowStatus ?? "draft"] ?? [];
  const showReviewNote = availableActions.includes("submit") || availableActions.includes("reject");
  const editorialReview = useMemo(() => (selected && draft ? createEditorialReview(selected, draft) : null), [selected, draft]);

  async function getStudioToken() { const tokenClient = client as unknown as StudioTokenClient; const token = tokenClient.getToken ? await tokenClient.getToken() : tokenClient.config().token; if (!token) throw new Error("Your Sanity Studio session could not be authenticated. Sign in again and retry."); return token; }
  async function readJsonResponse<T>(response: Response): Promise<T> { const contentType = response.headers.get("content-type") ?? ""; if (!contentType.includes("application/json")) throw new Error(`Editorial API returned an invalid response (${response.status}).`); return (await response.json()) as T; }
  async function loadQueue(preferredId?: string) { setIsLoading(true); setMessage(null); try { const result = await client.fetch<ReviewArticle[]>(QUEUE_QUERY); setArticles(result); setSelectedId((current) => { const candidate = preferredId ?? current; return candidate && result.some((article) => article._id === candidate) ? candidate : (result[0]?._id ?? null); }); } catch (error) { setMessage(error instanceof Error ? error.message : "Unable to load the editorial queue."); } finally { setIsLoading(false); } }
  useEffect(() => { void loadQueue(); }, []);
  useEffect(() => { if (!selected) { setDraft(null); setIsDirty(false); setAiFindings(null); setAiVoiceAssessment(null); return; } setDraft(articleToEditable(selected)); setIsDirty(false); setAiFindings(null); setAiVoiceAssessment(null); }, [selected?._id]);
  function updateDraft(field: keyof EditableDraft, value: string) { setDraft((current) => (current ? { ...current, [field]: value } : current)); setIsDirty(true); }
  async function runAiReview() { if (!selected || !draft) return; setIsAiReviewing(true); setMessage(null); try { const token = await getStudioToken(); const response = await fetch(`${EDITORIAL_API_BASE_URL}/api/editorial/review`, { method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${token}` }, body: JSON.stringify({ title: draft.title, standfirst: draft.standfirst, bodyText: draft.bodyText, seoTitle: draft.seoTitle, seoDescription: draft.seoDescription, sourceRecords: selected.sourceRecords ?? [], factLedger: { facts: selected.factLedger?.facts ?? [], unsupportedClaims: selected.factLedger?.unsupportedClaims ?? [], conflicts: selected.factLedger?.conflicts ?? [] } }) }); const payload = await readJsonResponse<{ findings?: AiEditorialFinding[]; voiceAssessment?: AiEditorialVoiceAssessment; error?: string }>(response); if (!response.ok) throw new Error(payload.error ?? `AI review failed with ${response.status}.`); setAiFindings(payload.findings ?? []); setAiVoiceAssessment(payload.voiceAssessment ?? null); } catch (error) { setMessage(error instanceof Error ? error.message : "AI editorial review failed."); } finally { setIsAiReviewing(false); } }
  async function saveDraft() { if (!selected || !draft) return false; if (!draft.title.trim() || !draft.standfirst.trim()) { setMessage("Headline and standfirst are required."); return false; } setIsSaving(true); setMessage(null); try { await client.patch(selected._id).set({ title: draft.title.trim(), standfirst: draft.standfirst.trim(), body: textToBody(draft.bodyText, selected.body), seoTitle: draft.seoTitle.trim() || null, seoDescription: draft.seoDescription.trim() || null, updatedAt: new Date().toISOString() }).commit(); setIsDirty(false); setMessage("Draft changes saved in Sanity."); await loadQueue(selected._id); return true; } catch (error) { setMessage(error instanceof Error ? error.message : "Unable to save the draft."); return false; } finally { setIsSaving(false); } }
  useEffect(() => { function handleKeyDown(event: KeyboardEvent) { if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") { event.preventDefault(); if (isDirty && !isSaving) void saveDraft(); } } window.addEventListener("keydown", handleKeyDown); return () => window.removeEventListener("keydown", handleKeyDown); }, [isDirty, isSaving, selected?._id, draft]);
  useEffect(() => { function warnBeforeUnload(event: BeforeUnloadEvent) { if (!isDirty) return; event.preventDefault(); event.returnValue = ""; } window.addEventListener("beforeunload", warnBeforeUnload); return () => window.removeEventListener("beforeunload", warnBeforeUnload); }, [isDirty]);
  async function runAction(action: EditorialAction) { if (!selected || !draft) return; const protectedAction = action === "approve" || action === "publish"; if (protectedAction && editorialReview?.blockingCount) { setMessage("Resolve all blocking Editorial Review issues before approval or publication."); return; } if (protectedAction && (aiFindings === null || aiVoiceAssessment === null)) { setMessage("Run the Publication Risk Review before approval or publication. Publishing without a current review is blocked."); return; } if (protectedAction && isDirty) { setMessage("The article changed after the Publication Risk Review. Save it, run the review again, then publish."); return; } const blockingAiFindings = aiFindings?.filter((finding) => finding.severity === "blocking") ?? []; const warningAiFindings = aiFindings?.filter((finding) => finding.severity === "warning") ?? []; if (protectedAction && (aiVoiceAssessment?.aiLikeness !== "low" || blockingAiFindings.length > 0 || warningAiFindings.length > 0)) { setMessage("Publication blocked by the conservative risk gate. Resolve all blocking and warning findings and achieve Low publication risk, then run the review again."); return; } if (isDirty && action !== "discard") { const saved = await saveDraft(); if (!saved) return; } if (action === "reject" && !note.trim()) { setMessage("A rejection reason is required so replacement generation can avoid the same angle."); return; } if ((action === "discard" || action === "publish") && !window.confirm(`Confirm ${action} for “${draft.title || selected.title || "this article"}”?`)) return; setIsSaving(true); setMessage(null); try { const token = await getStudioToken(); const response = await fetch(`${EDITORIAL_API_BASE_URL}/api/editorial/workflow`, { method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${token}` }, body: JSON.stringify({ articleId: normaliseId(selected._id), action, note: note.trim() || undefined }) }); const payload = await readJsonResponse<{ error?: string; status?: string; workflow?: { status?: string } }>(response); if (!response.ok) throw new Error(payload.error ?? `Workflow action failed with ${response.status}.`); setMessage(`${action} completed. Article status: ${payload.workflow?.status ?? payload.status ?? "ok"}.`); setNote(""); await loadQueue(); } catch (error) { setMessage(error instanceof Error ? error.message : "Workflow action failed."); } finally { setIsSaving(false); } }

  return <main className="rp-editorial-review">
    <style>{`
      .rp-editorial-review{padding:1.5rem;display:grid;gap:1rem;color:var(--card-fg-color,currentColor)}
      .rp-editorial-review__header{display:grid;gap:.35rem}.rp-editorial-review__header h1{margin:0}.rp-editorial-review__intro{margin:0;max-width:900px;color:var(--card-muted-fg-color,currentColor);opacity:.78}
      .rp-editorial-review__layout{display:grid;grid-template-columns:minmax(260px,360px) minmax(0,1fr);gap:1rem;align-items:start;min-width:0}.rp-editorial-review__article{display:grid;gap:1rem;min-width:0}
      @media(max-width:760px){.rp-editorial-review{padding:.75rem;gap:.75rem}.rp-editorial-review__header{padding:0 .25rem}.rp-editorial-review__header h1{font-size:clamp(1.65rem,8vw,2.2rem);line-height:1.05}.rp-editorial-review__intro{font-size:1rem;line-height:1.45;opacity:.9}.rp-editorial-review__layout{grid-template-columns:minmax(0,1fr);gap:.75rem}.rp-editorial-review__layout>*{min-width:0;max-width:100%}.rp-editorial-review button,.rp-editorial-review input,.rp-editorial-review textarea,.rp-editorial-review select{font-size:16px!important}.rp-editorial-review button{min-height:44px}.rp-editorial-review textarea{line-height:1.5}}
    `}</style>
    <header className="rp-editorial-review__header"><h1>Editorial Review</h1><p className="rp-editorial-review__intro">Edit generated drafts, inspect evidence and imagery, save changes, then use the protected editorial workflow.</p></header>
    <section className="rp-editorial-review__layout">
      <ReviewQueue articles={articles} selectedId={selected?._id ?? null} isDirty={isDirty} isLoading={isLoading} isSaving={isSaving} onRefresh={() => void loadQueue()} onSelect={setSelectedId}/>
      {selected && draft ? <article className="rp-editorial-review__article"><DraftEditor article={selected} draft={draft} isDirty={isDirty} isSaving={isSaving} onChange={updateDraft} onSave={() => void saveDraft()}/><EditorialReviewSummary article={selected} review={editorialReview}/><AIEditorialReview findings={aiFindings} voiceAssessment={aiVoiceAssessment} isReviewing={isAiReviewing} isSaving={isSaving} isStale={isDirty && aiFindings !== null} onRunReview={() => void runAiReview()}/><FeaturedImagePanel article={selected}/><SourcesPanel article={selected}/><FactLedgerPanel article={selected}/><WorkflowPanel actor={actor} note={note} showReviewNote={showReviewNote} availableActions={availableActions} editorialReview={editorialReview} isSaving={isSaving} message={message} onNoteChange={setNote} onRunAction={(action) => void runAction(action)}/><AuditHistoryPanel article={selected}/></article> : null}
    </section>
  </main>;
}
