import React, { useEffect, useMemo, useRef, useState } from "react";
import { useClient } from "sanity";

import { cardStyle, inputStyle } from "./constants";
import { displayConfidence } from "./formatting";

import type { ReviewArticle } from "./types";

type ApprovedImage = {
  _id: string;
  title?: string;
  altText?: string;
  caption?: string;
  creditLine?: string;
  photographer?: string;
  sourceName?: string;
  rightsNotes?: string;
  editorialCategory?: string;
  photoType?: string;
  imageUrl?: string;
  image?: {
    _type?: "image";
    asset?: { _type?: "reference"; _ref?: string };
    crop?: Record<string, number>;
    hotspot?: Record<string, number>;
  };
};

type CurrentImage = {
  url?: string;
  alt?: string;
  caption?: string;
  credit?: string;
};

type FeaturedImagePanelProps = {
  article: ReviewArticle;
  onChanged?: () => void | Promise<void>;
};

const APPROVED_IMAGES_QUERY = `*[
  _type == "editorialImage" &&
  !(_id in path("drafts.**")) &&
  usageApproved == true &&
  lifecycleStatus in ["approved", "published"] &&
  defined(image.asset._ref)
] | order(_updatedAt desc)[0...100] {
  _id,
  title,
  altText,
  caption,
  creditLine,
  photographer,
  sourceName,
  rightsNotes,
  editorialCategory,
  photoType,
  image,
  "imageUrl": image.asset->url
}`;

function toFeaturedImage(image: ApprovedImage) {
  if (!image.image?.asset?._ref) throw new Error("The selected image has no Sanity asset.");
  return {
    ...image.image,
    _type: "image",
    asset: { _type: "reference", _ref: image.image.asset._ref },
    alt: image.altText ?? image.title ?? "Rugby editorial image",
    caption: image.caption,
    photographer: image.creditLine ?? image.photographer,
    source: image.sourceName,
    rights: image.rightsNotes,
  };
}

function articleImage(article: ReviewArticle): CurrentImage {
  return {
    url: article.featuredImageUrl,
    alt: article.featuredImageAlt,
    caption: article.featuredImageCaption,
    credit: article.featuredImageCredit,
  };
}

export function FeaturedImagePanel({
  article,
  onChanged,
}: FeaturedImagePanelProps): React.JSX.Element {
  const client = useClient({ apiVersion: "2025-01-01" }).withConfig({ perspective: "raw", useCdn: false });
  const [images, setImages] = useState<ApprovedImage[]>([]);
  const [currentImage, setCurrentImage] = useState<CurrentImage>(() => articleImage(article));
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const autoAssignmentAttempted = useRef<string | null>(null);

  async function loadImages() {
    setIsLoading(true);
    setMessage(null);
    try {
      setImages(await client.fetch<ApprovedImage[]>(APPROVED_IMAGES_QUERY));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to load approved editorial images.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    setCurrentImage(articleImage(article));
    autoAssignmentAttempted.current = null;
  }, [article._id, article.featuredImageUrl]);

  useEffect(() => {
    void loadImages();
  }, []);

  useEffect(() => {
    if (currentImage.url || images.length === 0 || isSaving || autoAssignmentAttempted.current === article._id) return;
    autoAssignmentAttempted.current = article._id;
    void assignImage(images[0], true);
  }, [article._id, currentImage.url, images, isSaving]);

  const filteredImages = useMemo(() => {
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    if (terms.length === 0) return images;
    return images.filter((image) => {
      const text = [image.title, image.altText, image.caption, image.editorialCategory, image.photoType]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return terms.every((term) => text.includes(term));
    });
  }, [images, query]);

  async function assignImage(image: ApprovedImage, automatic = false) {
    setIsSaving(true);
    setMessage(automatic ? "Assigning an approved featured image automatically…" : null);
    try {
      await client.patch(article._id).set({ featuredImage: toFeaturedImage(image), updatedAt: new Date().toISOString() }).commit();
      setCurrentImage({
        url: image.imageUrl,
        alt: image.altText ?? image.title,
        caption: image.caption,
        credit: image.creditLine ?? image.photographer,
      });
      setMessage(automatic
        ? `Approved featured image assigned automatically: “${image.title ?? "Editorial image"}”.`
        : `Featured image changed to “${image.title ?? "approved image"}”.`);
      await onChanged?.();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to assign the featured image.");
    } finally {
      setIsSaving(false);
    }
  }

  async function removeImage() {
    if (!window.confirm("Remove the featured image from this article? A replacement can be selected immediately below.")) return;
    setIsSaving(true);
    setMessage(null);
    autoAssignmentAttempted.current = article._id;
    try {
      await client.patch(article._id).unset(["featuredImage"]).set({ updatedAt: new Date().toISOString() }).commit();
      setCurrentImage({});
      setMessage("Featured image removed. Choose a replacement from the approved library.");
      await onChanged?.();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to remove the featured image.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section style={{ ...cardStyle, display: "grid", gap: ".75rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: ".75rem", alignItems: "center", flexWrap: "wrap" }}>
        <div>
          <h3 style={{ margin: 0 }}>Featured image</h3>
          <small style={{ color: "#666" }}>An approved image is assigned automatically. Replace it here whenever another approved image is a better fit.</small>
        </div>
        {currentImage.url ? (
          <button type="button" onClick={() => void removeImage()} disabled={isSaving}>Remove image</button>
        ) : null}
      </div>

      {currentImage.url ? (
        <figure style={{ margin: 0 }}>
          <img
            src={currentImage.url}
            alt={currentImage.alt ?? ""}
            style={{ width: "100%", maxHeight: 420, objectFit: "cover", borderRadius: 8 }}
          />
          <figcaption style={{ marginTop: ".35rem", color: "#666" }}>
            {[currentImage.caption, currentImage.credit].filter(Boolean).join(" — ")}
          </figcaption>
        </figure>
      ) : (
        <p style={{ margin: 0 }}><strong>Image:</strong> {isSaving ? "Assigning approved image…" : "No approved featured image is currently available."}</p>
      )}

      <details>
        <summary style={{ cursor: "pointer", fontWeight: 600 }}>Replace from approved image library</summary>
        <div style={{ display: "grid", gap: ".75rem", marginTop: ".75rem" }}>
          <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by team, competition, subject or photo type"
              style={{ ...inputStyle, flex: "1 1 280px" }}
            />
            <button type="button" onClick={() => void loadImages()} disabled={isLoading || isSaving}>
              {isLoading ? "Loading…" : "Refresh library"}
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: ".75rem" }}>
            {filteredImages.map((image) => (
              <article key={image._id} style={{ border: "1px solid #ddd", borderRadius: 8, overflow: "hidden", display: "grid", alignContent: "start" }}>
                {image.imageUrl ? (
                  <img src={image.imageUrl} alt={image.altText ?? image.title ?? ""} style={{ width: "100%", height: 150, objectFit: "cover" }} />
                ) : null}
                <div style={{ padding: ".65rem", display: "grid", gap: ".4rem" }}>
                  <strong>{image.title ?? "Untitled image"}</strong>
                  <small style={{ color: "#666" }}>{[image.editorialCategory, image.photoType, image.creditLine ?? image.photographer].filter(Boolean).join(" · ")}</small>
                  <button type="button" onClick={() => void assignImage(image)} disabled={isSaving}>
                    Use this image
                  </button>
                </div>
              </article>
            ))}
          </div>

          {!isLoading && filteredImages.length === 0 ? <p style={{ margin: 0 }}>No approved images match this search.</p> : null}
        </div>
      </details>

      {message ? <p role="status" style={{ margin: 0 }}>{message}</p> : null}

      <p style={{ margin: 0 }}><strong>Editorial angle:</strong> {article.editorialAngle ?? "Not recorded"}</p>
      <p style={{ margin: 0 }}><strong>Audience promise:</strong> {article.audiencePromise ?? "Not recorded"}</p>
      <p style={{ margin: 0 }}>
        <strong>Confidence:</strong> {displayConfidence(article.editorialConfidence)} {article.needsHumanFactCheck ? "— human fact-check required" : ""}
      </p>
    </section>
  );
}
