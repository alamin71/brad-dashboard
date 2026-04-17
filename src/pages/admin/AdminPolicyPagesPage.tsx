import { useEffect, useRef, useState } from "react";
import {
  FiAlignCenter,
  FiAlignLeft,
  FiAlignRight,
  FiBold,
  FiChevronDown,
  FiItalic,
  FiAlignJustify,
  FiUnderline,
} from "react-icons/fi";
import { MdFormatListBulleted, MdFormatListNumbered } from "react-icons/md";
import { toast } from "react-toastify";
import {
  policyService,
  type AdminPolicyType,
} from "../../services/policyService";

type PolicyTabId = "privacy" | "terms" | "about";

type PolicyTab = {
  id: PolicyTabId;
  label: string;
  type: AdminPolicyType;
  title: string;
  defaultContent: string;
};

const defaultPolicyFont = "Satoshi";

const policyTabs: PolicyTab[] = [
  {
    id: "privacy",
    label: "Privacy Policy",
    type: "privacy-policy",
    title: "Privacy-Policy",
    defaultContent: `Effective Date: January 2026

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
    type: "terms-conditions",
    title: "Terms-Conditions",
    defaultContent: `Effective Date: January 2026

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
    type: "about-app",
    title: "About-App",
    defaultContent: `This app is designed for food lovers and food explorers who enjoy discovering and sharing great food experiences.

Users can share food photos, reviews, and recommendations while discovering restaurants, cafes, street food, and hidden gems through an interactive map and community-driven content.

Our goal is to create a friendly space where people can explore new food places, share honest experiences, and connect with others who love food.

Whether you are looking for trending restaurants, street food spots, or honest food reviews, this app helps you discover the best places around you.`,
  },
];

const fontOptions = [defaultPolicyFont, "Arial", "Georgia", "Times New Roman"];
const fontSizeOptions = ["14", "16", "18", "20", "24", "28"];
const alignOptions = ["left", "center", "right", "justify"] as const;
const listOptions = ["none", "unordered", "ordered"] as const;

type AlignType = (typeof alignOptions)[number];
type ListType = (typeof listOptions)[number];

const escapeHtml = (value: string) => {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
};

const plainTextToHtml = (value: string) => {
  return escapeHtml(value).replaceAll("\n", "<br>");
};

const isLikelyHtml = (value: string) => {
  return /<[^>]+>/.test(value);
};

const normalizePolicyContent = (value: string) => {
  if (!value.trim()) {
    return "";
  }

  return isLikelyHtml(value) ? value : plainTextToHtml(value);
};

const forceLtrContent = (value: string) => {
  return value
    .replace(/\sdir=("|')rtl\1/gi, "")
    .replace(/direction\s*:\s*rtl/gi, "direction: ltr");
};

const buildDefaultDrafts = (): Record<PolicyTabId, string> => {
  return policyTabs.reduce(
    (acc, tab) => {
      acc[tab.id] = plainTextToHtml(tab.defaultContent);
      return acc;
    },
    {
      privacy: "",
      terms: "",
      about: "",
    } as Record<PolicyTabId, string>,
  );
};

const buildFalseByTypeMap = () => {
  return policyTabs.reduce(
    (acc, tab) => {
      acc[tab.type] = false;
      return acc;
    },
    {
      "privacy-policy": false,
      "terms-conditions": false,
      "about-app": false,
    } as Record<AdminPolicyType, boolean>,
  );
};

const getErrorMessage = (error: unknown) => {
  const maybeError = error as {
    response?: {
      data?: {
        message?: string;
      };
    };
  };

  if (typeof maybeError.response?.data?.message === "string") {
    return maybeError.response.data.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "";
};

const typeToTabIdMap: Record<AdminPolicyType, PolicyTabId> = {
  "privacy-policy": "privacy",
  "terms-conditions": "terms",
  "about-app": "about",
};

function AdminPolicyPagesPage() {
  const [activeTab, setActiveTab] = useState<PolicyTabId>("privacy");
  const [drafts, setDrafts] =
    useState<Record<PolicyTabId, string>>(buildDefaultDrafts);
  const [existingByType, setExistingByType] =
    useState<Record<AdminPolicyType, boolean>>(buildFalseByTypeMap);
  const [fetchedByType, setFetchedByType] =
    useState<Record<AdminPolicyType, boolean>>(buildFalseByTypeMap);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [fontFamily, setFontFamily] = useState(defaultPolicyFont);
  const [fontSize, setFontSize] = useState("24");
  const [alignment, setAlignment] = useState<AlignType>("left");
  const [listType, setListType] = useState<ListType>("none");
  const editorRef = useRef<HTMLDivElement | null>(null);
  const selectionRef = useRef<Range | null>(null);

  const activeTabConfig =
    policyTabs.find((tab) => tab.id === activeTab) ?? policyTabs[0];

  const setEditorRef = (node: HTMLDivElement | null) => {
    editorRef.current = node;
  };

  const saveSelection = () => {
    const selection = window.getSelection();

    if (!selection || selection.rangeCount === 0) {
      return;
    }

    selectionRef.current = selection.getRangeAt(0);
  };

  const restoreSelection = () => {
    const selection = window.getSelection();
    const editor = editorRef.current;

    if (!selection || !editor) {
      return;
    }

    if (!selectionRef.current) {
      const fallbackRange = document.createRange();
      fallbackRange.selectNodeContents(editor);
      fallbackRange.collapse(false);
      selection.removeAllRanges();
      selection.addRange(fallbackRange);
      selectionRef.current = fallbackRange;
      return;
    }

    selection.removeAllRanges();
    selection.addRange(selectionRef.current);
  };

  const getEditorContent = () => {
    return forceLtrContent(editorRef.current?.innerHTML ?? drafts[activeTab]);
  };

  const persistCurrentDraft = () => {
    const nextContent = getEditorContent();

    setDrafts((current) => {
      if (current[activeTab] === nextContent) {
        return current;
      }

      return {
        ...current,
        [activeTab]: nextContent,
      };
    });

    return nextContent;
  };

  const withEditorSelection = (operation: (editor: HTMLDivElement) => void) => {
    const editor = editorRef.current;

    if (!editor) {
      return;
    }

    editor.focus();
    restoreSelection();
    document.execCommand("styleWithCSS", false, "true");
    operation(editor);

    const nextHtml = forceLtrContent(editor.innerHTML);

    setDrafts((current) => ({
      ...current,
      [activeTab]: nextHtml,
    }));

    saveSelection();
  };

  const applyCommand = (command: string, value?: string) => {
    withEditorSelection(() => {
      document.execCommand(command, false, value);
    });
  };

  const applyFontSize = (size: string) => {
    setFontSize(size);

    withEditorSelection((editor) => {
      // `fontSize` is more predictable with styleWithCSS disabled.
      document.execCommand("styleWithCSS", false, "false");
      document.execCommand("fontSize", false, "7");

      editor.querySelectorAll("font[size='7']").forEach((fontElement) => {
        const span = document.createElement("span");
        span.style.fontSize = `${size}px`;
        span.innerHTML = fontElement.innerHTML;
        fontElement.replaceWith(span);
      });

      document.execCommand("styleWithCSS", false, "true");
    });
  };

  const applyAlignment = (nextAlignment: AlignType) => {
    setAlignment(nextAlignment);

    if (nextAlignment === "center") {
      applyCommand("justifyCenter");
      return;
    }

    if (nextAlignment === "right") {
      applyCommand("justifyRight");
      return;
    }

    if (nextAlignment === "justify") {
      applyCommand("justifyFull");
      return;
    }

    applyCommand("justifyLeft");
  };

  const applyList = (nextList: ListType) => {
    setListType(nextList);

    if (nextList === "unordered") {
      applyCommand("insertUnorderedList");
      return;
    }

    if (nextList === "ordered") {
      applyCommand("insertOrderedList");
      return;
    }

    withEditorSelection(() => {
      if (document.queryCommandState("insertOrderedList")) {
        document.execCommand("insertOrderedList", false);
      }

      if (document.queryCommandState("insertUnorderedList")) {
        document.execCommand("insertUnorderedList", false);
      }
    });
  };

  useEffect(() => {
    let isMounted = true;

    const fetchAllPolicies = async () => {
      setIsLoading(true);

      try {
        const policies = await policyService.getAllPolicies();

        if (!isMounted) {
          return;
        }

        setDrafts((current) => {
          const nextDrafts = { ...current };

          for (const policy of policies) {
            const tabId = typeToTabIdMap[policy.type];
            nextDrafts[tabId] = forceLtrContent(
              normalizePolicyContent(policy.content),
            );
          }

          return nextDrafts;
        });

        setExistingByType((current) => {
          const next = { ...current };

          for (const policy of policies) {
            next[policy.type] = true;
          }

          return next;
        });
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void fetchAllPolicies();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    const activeType = activeTabConfig.type;

    if (!existingByType[activeType] || fetchedByType[activeType]) {
      return;
    }

    const fetchPolicyByType = async () => {
      try {
        const policy = await policyService.getPolicyByType(activeType);

        if (!isMounted) {
          return;
        }

        const tabId = typeToTabIdMap[policy.type];
        setDrafts((current) => ({
          ...current,
          [tabId]: forceLtrContent(normalizePolicyContent(policy.content)),
        }));
      } finally {
        if (isMounted) {
          setFetchedByType((current) => ({
            ...current,
            [activeType]: true,
          }));
        }
      }
    };

    void fetchPolicyByType();

    return () => {
      isMounted = false;
    };
  }, [activeTabConfig.type, existingByType, fetchedByType]);

  useEffect(() => {
    const editor = editorRef.current;

    if (!editor) {
      return;
    }

    editor.setAttribute("dir", "ltr");

    if (document.activeElement === editor) {
      return;
    }

    const nextContent = isLoading ? "" : drafts[activeTab];

    if (editor.innerHTML !== nextContent) {
      editor.innerHTML = nextContent;
    }
  }, [activeTab, drafts, isLoading]);

  const handleSave = async () => {
    const latestContent = persistCurrentDraft();
    const payload = {
      title: activeTabConfig.title,
      content: latestContent,
    };
    const currentType = activeTabConfig.type;

    setIsSaving(true);

    try {
      if (!existingByType[currentType]) {
        try {
          await policyService.createPolicy(currentType, payload);
        } catch (error) {
          const message = getErrorMessage(error).toLowerCase();

          if (!message.includes("already exists")) {
            throw error;
          }

          await policyService.updatePolicy(currentType, payload);
        }
      } else {
        await policyService.updatePolicy(currentType, payload);
      }

      const latest = await policyService.getPolicyByType(currentType);
      const latestTabId = typeToTabIdMap[latest.type];

      setDrafts((current) => ({
        ...current,
        [latestTabId]: forceLtrContent(normalizePolicyContent(latest.content)),
      }));

      setExistingByType((current) => ({
        ...current,
        [currentType]: true,
      }));
      setFetchedByType((current) => ({
        ...current,
        [currentType]: true,
      }));

      toast.success(`${activeTabConfig.label} saved successfully.`);
    } finally {
      setIsSaving(false);
    }
  };

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
              onClick={() => {
                persistCurrentDraft();
                setActiveTab(tab.id);
                setFontFamily(defaultPolicyFont);
                setFontSize("24");
                setAlignment("left");
                setListType("none");
              }}
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
          aria-label={`${activeTabConfig.label} editor toolbar`}
        >
          <label
            className="policy-editor__tool-label"
            htmlFor="policy-font-family"
          >
            Font
          </label>
          <select
            id="policy-font-family"
            className="policy-editor__tool-select"
            value={fontFamily}
            onChange={(event) => {
              const nextFont = event.target.value;
              setFontFamily(nextFont);
              applyCommand("fontName", nextFont);
            }}
            onMouseDown={saveSelection}
          >
            {fontOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <label
            className="policy-editor__tool-label"
            htmlFor="policy-font-size"
          >
            Size
          </label>
          <select
            id="policy-font-size"
            className="policy-editor__tool-select policy-editor__tool-select--size"
            value={fontSize}
            onChange={(event) => applyFontSize(event.target.value)}
            onMouseDown={saveSelection}
          >
            {fontSizeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <div className="policy-editor__divider" />

          <button
            type="button"
            className="policy-editor__tool"
            aria-label="Bold"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => applyCommand("bold")}
          >
            <FiBold aria-hidden="true" focusable="false" />
          </button>
          <button
            type="button"
            className="policy-editor__tool"
            aria-label="Italic"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => applyCommand("italic")}
          >
            <FiItalic aria-hidden="true" focusable="false" />
          </button>
          <button
            type="button"
            className="policy-editor__tool"
            aria-label="Underline"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => applyCommand("underline")}
          >
            <FiUnderline aria-hidden="true" focusable="false" />
          </button>

          <div className="policy-editor__divider" />

          <button
            type="button"
            className="policy-editor__tool policy-editor__tool--icon"
            aria-label="Align"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => applyAlignment(alignment)}
          >
            {alignment === "center" ? (
              <FiAlignCenter aria-hidden="true" focusable="false" />
            ) : alignment === "right" ? (
              <FiAlignRight aria-hidden="true" focusable="false" />
            ) : alignment === "justify" ? (
              <FiAlignJustify aria-hidden="true" focusable="false" />
            ) : (
              <FiAlignLeft aria-hidden="true" focusable="false" />
            )}
            <FiChevronDown aria-hidden="true" focusable="false" />
          </button>
          <label
            className="policy-editor__tool-label"
            htmlFor="policy-align-select"
          >
            Align
          </label>
          <select
            id="policy-align-select"
            className="policy-editor__tool-select policy-editor__tool-select--align"
            value={alignment}
            onMouseDown={saveSelection}
            onChange={(event) => {
              applyAlignment(event.target.value as AlignType);
            }}
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
            <option value="justify">Justify</option>
          </select>

          <button
            type="button"
            className="policy-editor__tool"
            aria-label="Bulleted list"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => applyList("unordered")}
          >
            <MdFormatListBulleted aria-hidden="true" focusable="false" />
          </button>
          <button
            type="button"
            className="policy-editor__tool"
            aria-label="Numbered list"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => applyList("ordered")}
          >
            <MdFormatListNumbered aria-hidden="true" focusable="false" />
          </button>
          <label
            className="policy-editor__tool-label"
            htmlFor="policy-list-select"
          >
            List
          </label>
          <select
            id="policy-list-select"
            className="policy-editor__tool-select policy-editor__tool-select--list"
            value={listType}
            onMouseDown={saveSelection}
            onChange={(event) => {
              applyList(event.target.value as ListType);
            }}
          >
            <option value="none">None</option>
            <option value="unordered">Bulleted</option>
            <option value="ordered">Numbered</option>
          </select>
        </div>

        <label className="policy-editor__label" htmlFor="policy-editor-content">
          {activeTabConfig.label} content
        </label>
        <div
          id="policy-editor-content"
          ref={setEditorRef}
          className="policy-editor__content"
          dir="ltr"
          contentEditable={!isLoading && !isSaving}
          suppressContentEditableWarning
          data-placeholder="Write policy content here..."
          onMouseUp={saveSelection}
          onKeyUp={saveSelection}
          onBlur={saveSelection}
          onInput={(event) => {
            const nextValue = forceLtrContent(event.currentTarget.innerHTML);
            event.currentTarget.setAttribute("dir", "ltr");
            selectionRef.current = null;
            setDrafts((current) => ({
              ...current,
              [activeTab]: nextValue,
            }));
            saveSelection();
          }}
        />
      </div>

      <button
        type="button"
        className="policy-page__save-button"
        onClick={handleSave}
        disabled={isLoading || isSaving}
      >
        {isSaving ? "Saving..." : "Save Changes"}
      </button>
    </section>
  );
}

export default AdminPolicyPagesPage;
