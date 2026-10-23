import React, { useState, useContext, useEffect } from "react";
import { extractTextFromImage } from "../lib/ocr";
import { AppContext } from "../context/AppContext";
import { translations } from "../data/translations";
import { schemesData } from "../data/schemes";
import {
  ArrowLeft,
  UploadCloud,
  CheckCircle,
  AlertCircle,
  FileText,
  Volume2,
  Check,
  Download,
  Trash2,
  ScanText,
  Copy,
} from "lucide-react";
import {
  saveDocument,
  getDocument,
  deleteDocument,
} from "../lib/documentVault";

const DOCUMENT_TYPES = ["aadhaar", "passbook", "landRecord"];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
];

const DocManager = () => {
  const {
    language,
    applications,
    updateDocumentStatus,
    navigateTo,
    speakText,
  } = useContext(AppContext);

  const t = translations[language] || translations.en;
  const currentApp = applications?.[0];

  const currentScheme = currentApp
    ? schemesData.find((s) => s.id === currentApp.schemeId)
    : schemesData[0];

  const farmerId = String(
    currentApp?.farmerId ||
      currentApp?.userId ||
      currentApp?.phone ||
      JSON.parse(localStorage.getItem("ks_user") || "{}")?.phone ||
      "guest",
  );

  const [savedFiles, setSavedFiles] = useState({});
  const [uploading, setUploading] = useState({});
  const [error, setError] = useState("");
  const [loadingDocuments, setLoadingDocuments] = useState(true);

  // OCR state
  const [ocrText, setOcrText] = useState("");
  const [ocrProgress, setOcrProgress] = useState(0);
  const [isReading, setIsReading] = useState(false);
  const [ocrError, setOcrError] = useState("");
  const [ocrDocumentName, setOcrDocumentName] = useState("");

  const documentSlots = [
    {
      id: "aadhaar",
      label:
        language === "en"
          ? "Aadhaar Card"
          : language === "hi"
            ? "आधार कार्ड"
            : "आधार कार्ड",
      desc: {
        en: "Proof of identity (12-digit UIDAI number card)",
        hi: "पहचान का प्रमाण (12-अंकों का आधार कार्ड)",
        mr: "ओळख पुरावा (१२-अंकी आधार कार्ड)",
      },
    },
    {
      id: "passbook",
      label:
        language === "en"
          ? "Bank Passbook"
          : language === "hi"
            ? "बैंक पासबुक"
            : "बँक पासबुक",
      desc: {
        en: "Passbook front page showing Account No. & IFSC Code",
        hi: "खाता संख्या और IFSC कोड दर्शाने वाला पासबुक का मुखपृष्ठ",
        mr: "खाते क्रमांक आणि IFSC कोड असलेले बँक पासबुक पहिले पान",
      },
    },
    {
      id: "landRecord",
      label:
        language === "en"
          ? "Land Record (7/12 Extract)"
          : language === "hi"
            ? "भूमि रिकॉर्ड (7/12 उतारा)"
            : "जमीन उतारा (७/१२)",
      desc: {
        en: "Land possession details certified by Patwari",
        hi: "पटवारी द्वारा प्रमाणित भूमि स्वामित्व विवरण",
        mr: "तलाठ्याकडून प्रमाणित जमिनीचा अधिकार अभिलेख (७/१२)",
      },
    },
  ];

  // Load documents saved in IndexedDB.
  useEffect(() => {
    let active = true;

    const loadDocuments = async () => {
      setLoadingDocuments(true);

      try {
        const entries = await Promise.all(
          DOCUMENT_TYPES.map(async (type) => [
            type,
            await getDocument(farmerId, type),
          ]),
        );

        if (active) {
          setSavedFiles(Object.fromEntries(entries));
        }
      } catch (err) {
        console.error("Could not load documents:", err);

        if (active) {
          setError(
            "Could not load saved documents. Please check browser storage.",
          );
        }
      } finally {
        if (active) {
          setLoadingDocuments(false);
        }
      }
    };

    loadDocuments();

    return () => {
      active = false;
    };
  }, [farmerId]);

  // Preserve existing voice guidance.
  useEffect(() => {
    const text =
      language === "hi"
        ? "कृपया आवश्यक दस्तावेज अपलोड करें। अपना आधार कार्ड, बैंक पासबुक या भूमि रिकॉर्ड अपलोड करने के लिए स्लॉट पर टैप करें।"
        : language === "mr"
          ? "कृपया आवश्यक कागदपत्रे अपलोड करा. आधार कार्ड, बँक पासबुक किंवा जमिनीचा उतारा अपलोड करण्यासाठी कार्डवर दाबा."
          : "Please upload the required documents. Select a file for your Aadhaar Card, Bank Passbook, or Land Record.";

    speakText(text);
  }, [language, speakText]);

  const handleFileUpload = async (event, docType, label) => {
    const input = event.target;
    const file = input.files?.[0];

    input.value = "";

    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Choose a PDF, JPG, PNG, or WEBP file.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("File size must not exceed 5 MB.");
      return;
    }

    setError("");
    setUploading((prev) => ({ ...prev, [docType]: true }));

    try {
      const savedDocument = await saveDocument(file, farmerId, docType);

      setSavedFiles((prev) => ({
        ...prev,
        [docType]: savedDocument,
      }));

      // Clear previous OCR results when replacing a document.
      setOcrText("");
      setOcrError("");
      setOcrProgress(0);
      setOcrDocumentName("");

      if (currentApp?.id) {
        updateDocumentStatus(currentApp.id, docType, "uploaded");
      }

      speakText(
        language === "hi"
          ? `${label} सफलतापूर्वक सेव हो गया है।`
          : language === "mr"
            ? `${label} यशस्वीरित्या सेव केले आहे.`
            : `${label} saved successfully.`,
      );
    } catch (err) {
      console.error("Document upload failed:", err);
      setError(
        "Could not save the document. Check browser storage and try again.",
      );
    } finally {
      setUploading((prev) => ({ ...prev, [docType]: false }));
    }
  };

  // Extract text from saved PDF or image documents.
  const handleExtractText = async (docType) => {
    if (isReading) return;

    setOcrText("");
    setOcrError("");
    setOcrProgress(0);
    setOcrDocumentName("");

    try {
      const doc = await getDocument(farmerId, docType);

      if (!doc?.file) {
        setOcrError("Document not found. Please upload it again.");
        return;
      }

      if (!ALLOWED_TYPES.includes(doc.file.type)) {
        setOcrError("Please upload a PDF, JPG, PNG, or WEBP document.");
        return;
      }

      if (doc.file.size > MAX_FILE_SIZE) {
        setOcrError("The document must not exceed 5 MB.");
        return;
      }

      setIsReading(true);
      setOcrDocumentName(doc.name || docType);

      const text = await extractTextFromImage(doc.file, setOcrProgress);

      setOcrText(text || "No readable text found. Try a clearer document.");
    } catch (err) {
      console.error("OCR extraction failed:", err);
      setOcrError(
        err.message || "Could not extract text. Please try another document.",
      );
    } finally {
      setIsReading(false);
    }
  };

  const handleCopyText = async () => {
    if (!ocrText) return;

    try {
      await navigator.clipboard.writeText(ocrText);
      setOcrError("");
    } catch (err) {
      console.error("Copy failed:", err);
      setOcrError(
        "Copy failed. Please select the extracted text and copy it manually.",
      );
    }
  };

  const handleDownload = async (docType) => {
    try {
      const doc = await getDocument(farmerId, docType);

      if (!doc?.file) {
        setError("Document not found. Please upload it again.");
        return;
      }

      const url = URL.createObjectURL(doc.file);
      const link = document.createElement("a");

      link.href = url;
      link.download = doc.name || docType;
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      setError("");
    } catch (err) {
      console.error("Download failed:", err);
      setError("Could not download the document.");
    }
  };

  const handleDelete = async (docType) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this saved document?",
    );

    if (!confirmed) return;

    try {
      await deleteDocument(farmerId, docType);

      setSavedFiles((prev) => ({
        ...prev,
        [docType]: null,
      }));

      setOcrText("");
      setOcrError("");
      setOcrProgress(0);
      setOcrDocumentName("");

      if (currentApp?.id) {
        updateDocumentStatus(currentApp.id, docType, "pending");
      }

      setError("");
    } catch (err) {
      console.error("Delete failed:", err);
      setError("Could not delete the document.");
    }
  };

  const allUploaded =
    DOCUMENT_TYPES.every((type) => Boolean(savedFiles[type]?.file)) &&
    !loadingDocuments;

  const handleComplete = () => {
    if (allUploaded) {
      navigateTo("tracking");
    }
  };

  if (!currentApp) {
    return (
      <div className="px-5 py-6 bg-brand-beige min-h-[92vh] flex items-center justify-center">
        <button
          onClick={() => navigateTo("dashboard")}
          className="p-4 bg-brand-green text-white font-bold rounded-2xl"
        >
          Go back to dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="px-5 py-6 bg-brand-beige min-h-[92vh] pb-24 flex flex-col justify-between animate-fade-in-up">
      <div>
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigateTo("dashboard")}
            className="w-10 h-10 bg-white border border-brand-beige-dark rounded-xl flex items-center justify-center text-gray-500 hover:text-gray-700 shadow-sm cursor-pointer"
            aria-label="Back to dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <h1 className="text-xl font-extrabold text-brand-green-deep">
            {t.documentsUploadTitle}
          </h1>

          <button
            onClick={() =>
              speakText(
                language === "en"
                  ? "Document Manager. Save your identity proofs and land documents for reuse."
                  : language === "hi"
                    ? "दस्तावेज प्रबंधक। अपने पहचान और भूमि दस्तावेज सुरक्षित करें।"
                    : "कागदपत्र व्यवस्थापन. तुमची ओळख आणि जमीन कागदपत्रे सुरक्षित ठेवा.",
              )
            }
            className="w-10 h-10 bg-white border border-brand-beige-dark rounded-xl flex items-center justify-center text-brand-blue shadow-sm"
            aria-label="Read instructions aloud"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>

        {/* Scheme information */}
        {currentScheme && (
          <div className="bg-white p-4 rounded-2xl border border-brand-beige-dark shadow-sm mb-6 flex items-center gap-3">
            <FileText className="w-5 h-5 text-brand-green shrink-0" />

            <div>
              <span className="text-[10px] text-gray-400 font-bold block uppercase">
                {language === "en"
                  ? "Documents for"
                  : language === "hi"
                    ? "दस्तावेज जमा हो रहे हैं"
                    : "कागदपत्रे जमा होत आहेत"}
              </span>

              <span className="text-xs font-black text-gray-700">
                {currentScheme.name[language] ||
                  currentScheme.name.en ||
                  "Loan application"}
              </span>
            </div>
          </div>
        )}

        {/* Smart Document Vault description */}
        <div className="bg-white rounded-2xl p-4 mb-5 border border-brand-beige-dark">
          <h2 className="font-bold text-brand-green-deep">
            Smart Document Vault
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Save your documents once and download them whenever needed. Saved
            files remain available in this browser.
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-4 p-3 rounded-xl bg-red-50 text-red-700 text-sm"
          >
            {error}
          </div>
        )}

        {loadingDocuments && (
          <p className="text-sm text-gray-500 mb-4">
            Loading your saved documents...
          </p>
        )}
      </div>

      {/* Document cards */}
      <div className="flex flex-col gap-4 flex-1 justify-center my-auto">
        {documentSlots.map((slot) => {
          const savedFile = savedFiles[slot.id];
          const isUploaded = Boolean(savedFile?.file);
          const isUploading = Boolean(uploading[slot.id]);

          const supportsOCR = ALLOWED_TYPES.includes(savedFile?.file?.type);

          return (
            <div
              key={slot.id}
              className={`p-5 rounded-3xl border-2 transition-all flex flex-col gap-3 ${
                isUploaded
                  ? "bg-emerald-50/50 border-brand-green/30"
                  : isUploading
                    ? "bg-brand-blue-light/20 border-brand-blue/30"
                    : "bg-white border-brand-beige-dark"
              }`}
            >
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1">
                  <h3 className="text-md font-bold text-gray-800 tracking-tight">
                    {slot.label}
                  </h3>

                  <p className="text-xs text-gray-500 mt-1 leading-snug font-medium">
                    {slot.desc[language] || slot.desc.en}
                  </p>
                </div>

                <div className="shrink-0">
                  {isUploaded ? (
                    <div className="bg-brand-green p-1.5 rounded-full flex items-center justify-center text-white">
                      <Check className="w-4 h-4 stroke-[3px]" />
                    </div>
                  ) : (
                    <div className="bg-brand-beige-dark p-2 rounded-xl text-gray-500">
                      <UploadCloud className="w-5 h-5" />
                    </div>
                  )}
                </div>
              </div>

              {isUploaded && (
                <div className="border-t border-brand-beige-dark/30 pt-3">
                  <div className="flex items-start gap-2">
                    <FileText className="w-4 h-4 text-brand-green shrink-0 mt-0.5" />

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-gray-700 break-all">
                        {savedFile.name}
                      </p>

                      <p className="text-xs text-gray-500 mt-1">
                        {(savedFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-3">
                    <button
                      type="button"
                      onClick={() => handleDownload(slot.id)}
                      className="flex-1 min-w-[100px] py-2 px-3 rounded-xl bg-brand-green text-white text-sm font-bold flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>

                    {supportsOCR && (
                      <button
                        type="button"
                        onClick={() => handleExtractText(slot.id)}
                        disabled={isReading}
                        className="flex-1 min-w-[120px] py-2 px-3 rounded-xl bg-blue-100 text-blue-800 text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <ScanText className="w-4 h-4" />
                        {isReading ? "Reading..." : "Extract Text"}
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDelete(slot.id)}
                      className="py-2 px-3 rounded-xl bg-red-100 text-red-700 text-sm font-bold flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>

                  {!supportsOCR && (
                    <p className="text-xs text-gray-500 mt-2">
                      Text extraction supports PDF, JPG, PNG, and WEBP files.
                    </p>
                  )}
                </div>
              )}

              {!isUploaded && (
                <div className="border-t border-brand-beige-dark/30 pt-3">
                  <label
                    htmlFor={`file-${slot.id}`}
                    className="block text-sm font-bold text-gray-700 mb-2"
                  >
                    Select document
                  </label>

                  <input
                    id={`file-${slot.id}`}
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.webp"
                    disabled={isUploading || loadingDocuments}
                    onChange={(event) =>
                      handleFileUpload(event, slot.id, slot.label)
                    }
                    className="block w-full text-sm text-gray-700 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:bg-brand-green file:text-white file:font-bold disabled:opacity-50"
                  />

                  <p className="text-xs text-gray-500 mt-2">
                    PDF, JPG, PNG or WEBP · Maximum 5 MB
                  </p>

                  {isUploading && (
                    <p className="text-sm text-brand-blue mt-2">
                      Saving document...
                    </p>
                  )}

                  {!isUploading && (
                    <span className="text-brand-accent flex items-center gap-1 mt-3 text-xs font-bold">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Upload required
                    </span>
                  )}
                </div>
              )}

              {isUploaded && (
                <span className="text-brand-green flex items-center gap-1 text-xs font-bold">
                  <CheckCircle className="w-3.5 h-3.5" />
                  {t.statusUploaded || "Saved successfully"}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* OCR results */}
      {(isReading || ocrText || ocrError) && (
        <section className="mt-6 rounded-2xl border border-brand-beige-dark bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <ScanText className="w-5 h-5 text-brand-green" />
            <h2 className="font-bold text-brand-green-deep">
              OCR Text Extraction
            </h2>
          </div>

          {ocrDocumentName && (
            <p className="text-xs text-gray-500 mt-1 break-all">
              Document: {ocrDocumentName}
            </p>
          )}

          {isReading && (
            <div className="mt-4">
              <p className="text-sm text-blue-700">
                Extracting text... {ocrProgress}%
              </p>

              <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-blue-600 transition-all"
                  style={{ width: `${ocrProgress}%` }}
                />
              </div>

              <p className="text-xs text-gray-500 mt-2">
                The first run may take longer while OCR resources load. PDFs are
                processed page by page.
              </p>
            </div>
          )}

          {ocrError && (
            <p role="alert" className="mt-3 text-sm text-red-600">
              {ocrError}
            </p>
          )}

          {ocrText && (
            <div className="mt-4">
              <label
                htmlFor="ocr-result"
                className="block text-sm font-semibold text-gray-800"
              >
                Extracted text — review before using
              </label>

              <textarea
                id="ocr-result"
                value={ocrText}
                onChange={(event) => setOcrText(event.target.value)}
                rows={8}
                className="mt-2 w-full rounded-lg border border-gray-300 p-3 text-sm text-gray-800"
                placeholder="Extracted document text will appear here..."
              />

              <button
                type="button"
                onClick={handleCopyText}
                className="mt-3 rounded-xl bg-brand-green px-4 py-2 text-sm font-bold text-white flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                Copy Extracted Text
              </button>

              <p className="mt-3 text-xs text-gray-500">
                OCR can make mistakes. Check the extracted information against
                the original document. This feature does not verify document
                authenticity.
              </p>
            </div>
          )}
        </section>
      )}

      {/* Submit button */}
      <div className="max-w-sm w-full mx-auto mt-6">
        <button
          onClick={handleComplete}
          disabled={!allUploaded}
          className={`w-full py-4 text-white text-lg font-bold rounded-2xl shadow-lg transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 ${
            allUploaded
              ? "bg-brand-green hover:bg-brand-green-dark"
              : "bg-gray-300 opacity-60 cursor-not-allowed"
          }`}
        >
          {allUploaded && <Check className="w-5 h-5" />}

          <span>
            {allUploaded
              ? language === "en"
                ? "Submit Application"
                : language === "hi"
                  ? "आवेदन जमा करें"
                  : "अर्ज सादर करा"
              : language === "en"
                ? "Upload All Documents"
                : language === "hi"
                  ? "सभी दस्तावेज अपलोड करें"
                  : "सर्व कागदपत्रे अपलोड करा"}
          </span>
        </button>
      </div>
    </div>
  );
};

export default DocManager;
