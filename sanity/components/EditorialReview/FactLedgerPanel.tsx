import React from "react";

import { cardStyle } from "./constants";
import { displayConfidence } from "./formatting";

import type { ReviewArticle } from "./types";

type FactLedgerPanelProps = {
  article: ReviewArticle;
};

export function FactLedgerPanel({
  article,
}: FactLedgerPanelProps): React.JSX.Element {
  return (
    <section style={cardStyle}>
      <h3 style={{ marginTop: 0 }}>Fact ledger</h3>

      {(article.factLedger?.facts ?? []).length === 0 ? (
        <p>No fact ledger stored.</p>
      ) : (
        <div style={{ display: "grid", gap: ".65rem" }}>
          {article.factLedger?.facts?.map((fact) => (
            <div
              key={fact.id ?? fact.claim}
              style={{
                borderBottom: "1px solid #eee",
                paddingBottom: ".65rem",
              }}
            >
              <strong>{fact.claim}</strong>
              <div>
                <small>
                  {fact.status} · {displayConfidence(fact.confidence)} ·{" "}
                  {fact.usableInDraft ? "usable" : "not usable"}
                </small>
              </div>
              {fact.notes ? <div>{fact.notes}</div> : null}
            </div>
          ))}
        </div>
      )}

      {(article.factLedger?.unsupportedClaims ?? []).length ? (
        <p>
          <strong>Unsupported claims:</strong>{" "}
          {article.factLedger?.unsupportedClaims?.join("; ")}
        </p>
      ) : null}

      {(article.factLedger?.conflicts ?? []).length ? (
        <p>
          <strong>Conflicts:</strong>{" "}
          {article.factLedger?.conflicts?.join("; ")}
        </p>
      ) : null}
    </section>
  );
}
