import { useState } from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiEye,
  FiSearch,
  FiTrash2,
} from "react-icons/fi";

type ContentItem = {
  title: string;
  handle: string;
  date: string;
  description: string;
  imageCount: number;
};

const contentItems: ContentItem[] = [
  {
    title: "Ryan Mitchell",
    handle: "@ryan_0242",
    date: "23 Aug 2026, 12:08 PM",
    description:
      "Tried this burger on a whim today 😊 Juicy, perfectly cooked, and the bun was super soft...",
    imageCount: 2,
  },
  {
    title: "Ryan Mitchell",
    handle: "@ryan_0242",
    date: "23 Aug 2026, 12:08 PM",
    description:
      "Tried this burger on a whim today 😊 Juicy, perfectly cooked, and the bun was super soft...",
    imageCount: 2,
  },
  {
    title: "Ryan Mitchell",
    handle: "@ryan_0242",
    date: "23 Aug 2026, 12:08 PM",
    description:
      "Tried this burger on a whim today 😊 Juicy, perfectly cooked, and the bun was super soft...",
    imageCount: 2,
  },
  {
    title: "Ryan Mitchell",
    handle: "@ryan_0242",
    date: "23 Aug 2026, 12:08 PM",
    description:
      "Tried this burger on a whim today 😊 Juicy, perfectly cooked, and the bun was super soft...",
    imageCount: 2,
  },
];

const detailImages = Array.from({ length: 4 }, (_, index) => ({
  label: `Image ${index + 1}`,
  src: "/content-food.svg",
}));

function AdminContentPage() {
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(
    null,
  );

  return (
    <section className="dashboard-hero dashboard-hero--wide">
      <div className="dashboard-section-header dashboard-section-header--content">
        <h1 className="dashboard-page-title">Content</h1>
        <button className="dashboard-sort-button" type="button">
          <span>Sort by</span>
          <FiChevronRight aria-hidden="true" focusable="false" />
        </button>
      </div>

      <div className="dashboard-content-toolbar">
        <label className="dashboard-search" aria-label="Search content">
          <FiSearch aria-hidden="true" focusable="false" />
          <input type="text" placeholder="Search here..." />
        </label>
      </div>

      <div className="dashboard-content-grid">
        {contentItems.map((item, index) => (
          <article
            className="content-card"
            key={`${item.title}-${index}`}
            role="button"
            tabIndex={0}
            onClick={() => setSelectedContent(item)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setSelectedContent(item);
              }
            }}
          >
            <div className="content-card__header">
              <img
                className="content-card__avatar"
                src="/admin-avatar.svg"
                alt="Ryan Mitchell"
              />
              <div>
                <strong>{item.title}</strong>
                <span>{item.handle}</span>
              </div>
            </div>

            <div className="content-card__date">{item.date}</div>
            <p className="content-card__description">{item.description}</p>

            <div className="content-card__thumbs">
              <img src="/content-food.svg" alt="Content image 1" />
              <div className="content-card__thumb-count">
                {item.imageCount}+
              </div>
            </div>

            <div className="content-card__actions">
              <button
                type="button"
                className="content-card__icon-button"
                aria-label="View details"
                onClick={(event) => {
                  event.stopPropagation();
                  setSelectedContent(item);
                }}
              >
                <FiEye aria-hidden="true" focusable="false" />
              </button>
              <button
                type="button"
                className="content-card__icon-button content-card__icon-button--danger"
                aria-label="Delete content"
                onClick={(event) => event.stopPropagation()}
              >
                <FiTrash2 aria-hidden="true" focusable="false" />
              </button>
            </div>
          </article>
        ))}
      </div>

      <div className="dashboard-pagination" aria-label="Pagination">
        {["01", "02", "03", "04", "05", "...", "17"].map((page, index) => (
          <button
            key={`${page}-${index}`}
            type="button"
            className={`dashboard-pagination__button ${page === "02" ? "dashboard-pagination__button--active" : ""}`}
          >
            {page}
          </button>
        ))}
      </div>

      {selectedContent ? (
        <div
          className="content-modal"
          role="presentation"
          onClick={() => setSelectedContent(null)}
        >
          <div
            className="content-modal__panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="content-details-title"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id="content-details-title" className="content-modal__title">
              Content details
            </h2>
            <div className="content-modal__divider" />

            <div className="content-modal__author">
              <img
                className="content-modal__avatar"
                src="/admin-avatar.svg"
                alt="Ryan Mitchell"
              />
              <div>
                <strong>{selectedContent.title}</strong>
                <span>{selectedContent.handle}</span>
              </div>
            </div>

            <div className="content-modal__date">{selectedContent.date}</div>
            <p className="content-modal__description">
              Tried this burger on a whim today 😊 Juicy, perfectly cooked, and
              the bun was super soft. Totally worth it!
            </p>

            <div className="content-modal__gallery">
              {detailImages.map((image) => (
                <img key={image.label} src={image.src} alt={image.label} />
              ))}
            </div>

            <div className="content-modal__pager">
              <button type="button" className="content-modal__pager-button">
                <FiChevronLeft aria-hidden="true" focusable="false" />
                <span>Previous</span>
              </button>
              <button
                type="button"
                className="content-modal__pager-button content-modal__pager-button--next"
              >
                <span>Next</span>
                <FiChevronRight aria-hidden="true" focusable="false" />
              </button>
            </div>

            <div className="content-modal__footer">
              <button
                type="button"
                className="content-modal__secondary-button"
                onClick={() => setSelectedContent(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="content-modal__primary-button"
                onClick={() => setSelectedContent(null)}
              >
                Delete Content
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

export default AdminContentPage;
