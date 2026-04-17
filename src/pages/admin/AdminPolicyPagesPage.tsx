import { useMemo, useState } from "react";
import {
  FiAlignLeft,
  FiBold,
  FiChevronDown,
  FiItalic,
  FiList,
  FiListOl,
  FiUnderline,
} from "react-icons/fi";

type PolicyTabId = "privacy" | "terms" | "about";

type PolicyTab = {
  id: PolicyTabId;
  label: string;
  content: string;
};

const policyTabs: PolicyTab[] = [
  {
    id: "privacy",
    label: "Privacy Policy",
    content: `Effective Date: January 2026

Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your information when you use our application.

Information We Collect

When you use our app, we may collect certain information such as:
• Your name, email address, and profile information
• Content you create, including posts, photos, videos, and comments
• Location data when you choose to tag a food place
• Device information and usage activity to improve app performance

How We Use Your Information

We use the collected information to:
• Provide and improve our services
• Allow users to create and share content
• Show relevant food locations and posts
• Send notifications about likes, comments, and updates
• Maintain the security of the platform`,
  },
  {
    id: "terms",
    label: "Terms & Conditions",
    content: `Effective Date: January 2026

By using this application, you agree to the following terms and conditions.

User Accounts

Users are responsible for maintaining the confidentiality of their account information. You must not share your login credentials with others.

User Content

Users may post photos, videos, reviews, and comments related to food experiences. By posting content, you confirm that:
• The content does not violate any laws
• The content does not contain harmful, offensive, or misleading information
• You own or have permission to share the content

Prohibited Activities

Users must not:
• Post inappropriate or harmful content
• Harass or abuse other users
• Attempt to exploit, hack, or misuse the application`,
  },
  {
    id: "about",
    label: "About this app",
    content: `This app is designed for food lovers and food explorers who enjoy discovering and sharing great food experiences.

Users can share food photos, reviews, and recommendations while discovering restaurants, cafes, street food, and hidden gems through an interactive map and community-driven content.

Our goal is to create a friendly space where people can explore new food places, share honest experiences, and connect with others who love food.

Whether you are looking for trending restaurants, street food spots, or honest food reviews, this app helps you discover the best places around you.`,
  },
];

const toolbarItems = [
  { id: "font", label: "Inter" },
  { id: "size", label: "24" },
];

function AdminPolicyPagesPage() {
  const [activeTab, setActiveTab] = useState<PolicyTabId>("privacy");
  const [drafts, setDrafts] = useState<Record<PolicyTabId, string>>(() => ({
    privacy: policyTabs.find((tab) => tab.id === "privacy")?.content ?? "",
    terms: policyTabs.find((tab) => tab.id === "terms")?.content ?? "",
    about: policyTabs.find((tab) => tab.id === "about")?.content ?? "",
  }));

  const activeContent = drafts[activeTab];

  const activeLabel = useMemo(
    () => policyTabs.find((tab) => tab.id === activeTab)?.label ?? "",
    [activeTab],
  );

  return (
    <section className="dashboard-hero dashboard-hero--wide policy-page">
      <h1 className="policy-page__title">Policy Pages</h1>

      <div
        className="policy-page__tabs"
        role="tablist"
        aria-label="Policy tabs"
      >
        {policyTabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`policy-panel-${tab.id}`}
              id={`policy-tab-${tab.id}`}
              className={`policy-page__tab ${isActive ? "policy-page__tab--active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div
        className="policy-editor"
        role="tabpanel"
        id={`policy-panel-${activeTab}`}
        aria-labelledby={`policy-tab-${activeTab}`}
      >
        <div
          className="policy-editor__toolbar"
          aria-label={`${activeLabel} editor toolbar`}
        >
          {toolbarItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className="policy-editor__tool policy-editor__tool--select"
            >
              <span>{item.label}</span>
              <FiChevronDown aria-hidden="true" focusable="false" />
            </button>
          ))}

          <div className="policy-editor__divider" />

          <button
            type="button"
            className="policy-editor__tool"
            aria-label="Bold"
          >
            <FiBold aria-hidden="true" focusable="false" />
          </button>
          <button
            type="button"
            className="policy-editor__tool"
            aria-label="Italic"
          >
            <FiItalic aria-hidden="true" focusable="false" />
          </button>
          <button
            type="button"
            className="policy-editor__tool"
            aria-label="Underline"
          >
            <FiUnderline aria-hidden="true" focusable="false" />
          </button>

          <div className="policy-editor__divider" />

          <button
            type="button"
            className="policy-editor__tool"
            aria-label="Align left"
          >
            <FiAlignLeft aria-hidden="true" focusable="false" />
          </button>
          <button
            type="button"
            className="policy-editor__tool"
            aria-label="Bulleted list"
          >
            <FiList aria-hidden="true" focusable="false" />
          </button>
          <button
            type="button"
            className="policy-editor__tool"
            aria-label="Numbered list"
          >
            <FiListOl aria-hidden="true" focusable="false" />
          </button>
        </div>

        <label className="policy-editor__label" htmlFor="policy-editor-content">
          {activeLabel} content
        </label>
        <textarea
          id="policy-editor-content"
          className="policy-editor__textarea"
          value={activeContent}
          onChange={(event) => {
            const nextValue = event.target.value;
            setDrafts((current) => ({
              ...current,
              [activeTab]: nextValue,
            }));
          }}
        />
      </div>

      <button type="button" className="policy-page__save-button">
        Save Changes
      </button>
    </section>
  );
}

export default AdminPolicyPagesPage;
