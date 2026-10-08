"use client";

export function ConfirmDelete({ title }: { title: string }) {
  return (
    <button
      type="submit"
      className="t-micro admin-action admin-action-danger"
      onClick={(e) => {
        if (
          !confirm(
            `Delete "${title || "Untitled"}" permanently? This cannot be undone.`,
          )
        ) {
          e.preventDefault();
        }
      }}
    >
      DELETE
    </button>
  );
}
