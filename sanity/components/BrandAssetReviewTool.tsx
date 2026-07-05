import React, { useEffect, useMemo, useState } from "react";
import { useClient } from "sanity";

type CandidateLogo = {
  url?: string;
  format?: string;
  notes?: string;
};

type BrandAsset = {
  _id: string;
  title?: string;
  shortName?: string;
  brandType?: string;
  lifecycleStatus?: string;
  approvedForEditorialUse?: boolean;
  rightsStatus?: string;
  rightsHolder?: string;
  sourceUrl?: string;
  externalLogoUrl?: string;
  candidateLogoUrls?: CandidateLogo[];
};

const NEEDS_REVIEW_QUERY = `*[
  _type == "brandAsset" &&
  (!defined(lifecycleStatus) || lifecycleStatus in ["candidate", "Candidate", "pending-validation", "Pending Validation"] || !defined(approvedForEditorialUse) || approvedForEditorialUse != true)
] | order(_updatedAt desc) {
  _id,
  title,
  shortName,
  brandType,
  lifecycleStatus,
  approvedForEditorialUse,
  rightsStatus,
  rightsHolder,
  sourceUrl,
  externalLogoUrl,
  candidateLogoUrls
}`;

function firstLogoUrl(asset: BrandAsset) {
  return asset.externalLogoUrl ?? asset.candidateLogoUrls?.find((candidate) => candidate.url)?.url;
}

export function BrandAssetReviewTool() {
  const client = useClient({ apiVersion: "2025-01-01" });
  const [assets, setAssets] = useState<BrandAsset[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  async function loadAssets() {
    setIsLoading(true);
    setMessage(null);

    try {
      const result = await client.fetch<BrandAsset[]>(NEEDS_REVIEW_QUERY);
      setAssets(result);
      setSelectedIds((current) => current.filter((id) => result.some((asset) => asset._id === id)));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to load brand assets.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadAssets();
  }, []);

  function toggleSelected(id: string) {
    setSelectedIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  function selectAll() {
    setSelectedIds(assets.map((asset) => asset._id));
  }

  function clearSelection() {
    setSelectedIds([]);
  }

  async function bulkUpdate(action: "approved" | "rejected" | "archived") {
    if (selectedIds.length === 0) {
      setMessage("Select at least one brand asset first.");
      return;
    }

    setIsSaving(true);
    setMessage(null);

    try {
      let transaction = client.transaction();
      const reviewedAt = new Date().toISOString();

      for (const id of selectedIds) {
        transaction = transaction.patch(id, (patch) =>
          patch.set({
            lifecycleStatus: action,
            approvedForEditorialUse: action === "approved",
            reviewedAt,
          }),
        );
      }

      await transaction.commit();
      setMessage(`${selectedIds.length} brand asset${selectedIds.length === 1 ? "" : "s"} updated to ${action}.`);
      setSelectedIds([]);
      await loadAssets();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Bulk update failed.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <main style={{ padding: "2rem", display: "grid", gap: "1.5rem" }}>
      <header style={{ display: "grid", gap: "0.5rem" }}>
        <h1 style={{ margin: 0 }}>Brand Asset Review</h1>
        <p style={{ margin: 0, maxWidth: "820px", color: "#666" }}>
          Review candidate rugby logos and brand marks in bulk. Approval only marks a record as editorially reviewed; approved logo files should still be uploaded into Sanity assets before public template use.
        </p>
      </header>

      <section style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "center" }}>
        <button type="button" onClick={selectAll} disabled={isLoading || assets.length === 0 || isSaving}>
          Select all
        </button>
        <button type="button" onClick={clearSelection} disabled={selectedIds.length === 0 || isSaving}>
          Clear
        </button>
        <button type="button" onClick={() => bulkUpdate("approved")} disabled={selectedIds.length === 0 || isSaving}>
          Approve selected
        </button>
        <button type="button" onClick={() => bulkUpdate("rejected")} disabled={selectedIds.length === 0 || isSaving}>
          Reject selected
        </button>
        <button type="button" onClick={() => bulkUpdate("archived")} disabled={selectedIds.length === 0 || isSaving}>
          Archive selected
        </button>
        <button type="button" onClick={() => loadAssets()} disabled={isLoading || isSaving}>
          Refresh
        </button>
        <strong>{selectedIds.length} selected</strong>
      </section>

      {message ? <p style={{ margin: 0, color: "#444" }}>{message}</p> : null}

      {isLoading ? <p>Loading brand assets…</p> : null}

      {!isLoading && assets.length === 0 ? <p>No brand assets currently need review.</p> : null}

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: "1rem",
        }}
      >
        {assets.map((asset) => {
          const src = firstLogoUrl(asset);
          const selected = selectedSet.has(asset._id);

          return (
            <article
              key={asset._id}
              style={{
                border: selected ? "3px solid #111" : "1px solid #ddd",
                borderRadius: "12px",
                overflow: "hidden",
                background: "#fff",
                boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
              }}
            >
              <button
                type="button"
                onClick={() => toggleSelected(asset._id)}
                style={{ width: "100%", padding: 0, border: 0, background: "transparent", cursor: "pointer" }}
                aria-pressed={selected}
              >
                {src ? (
                  <div style={{ aspectRatio: "4 / 3", display: "grid", placeItems: "center", background: "#f6f6f6", padding: "1rem" }}>
                    <img
                      src={src}
                      alt=""
                      style={{ display: "block", maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                    />
                  </div>
                ) : (
                  <div style={{ aspectRatio: "4 / 3", display: "grid", placeItems: "center", background: "#f2f2f2" }}>No logo preview</div>
                )}
              </button>

              <div style={{ padding: "0.75rem", display: "grid", gap: "0.35rem" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 700 }}>
                  <input type="checkbox" checked={selected} onChange={() => toggleSelected(asset._id)} />
                  {asset.title ?? "Untitled brand"}
                </label>
                <small>Short name: {asset.shortName ?? "—"}</small>
                <small>Type: {asset.brandType ?? "brand"}</small>
                <small>Status: {asset.lifecycleStatus ?? "candidate"}</small>
                <small>Rights: {asset.rightsStatus ?? "editorial-trademark-use-only"}</small>
                <small>Rights holder: {asset.rightsHolder ?? "Needs review"}</small>
                {asset.sourceUrl ? (
                  <a href={asset.sourceUrl} target="_blank" rel="noreferrer" style={{ fontSize: "0.75rem" }}>
                    Open source page
                  </a>
                ) : null}
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}
