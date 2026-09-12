
/**
 * LoadingIndicator
 * A simple, accessible loading overlay with a translucent background and a white circular spinner.
 *
 * Props:
 * - visible: boolean (default: true)  -- show/hide the overlay
 * - size: number (pixels, default: 48) -- diameter of the spinner
 * - message: string (optional)        -- short accessible text shown under spinner
 * - backdrop: boolean (default: true) -- whether to show the translucent backdrop
 * - className: string (optional)      -- extra classes for the overlay container
 *
 * Usage:
 * <LoadingIndicator visible={loading} />
 * <LoadingIndicator visible={true} size={64} message="Saving..." />
 */

export default function Loading({
  visible = true,
  size = 48,
  message = "Loading...",
  backdrop = true,
  className = "",
}) {
  if (!visible) return null;

  const spinnerStyle = {
    width: size,
    height: size,
    // keep border thickness proportional to size (4px at default 48)
    borderWidth: Math.max(3, Math.round(size * 0.08)),
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed inset-0 z-50 flex items-center justify-center ${className}`}
    >
      {/* Backdrop */}
      <div
        aria-hidden={!backdrop}
        className={`${backdrop ? "absolute inset-0 bg-black/50 backdrop-blur-sm" : "absolute inset-0 pointer-events-none"}`}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-3 p-4">
        <div
          className="rounded-full flex items-center justify-center"
          style={spinnerStyle}
        >
          {/* spinner: white circle with one transparent quarter to create the spinning effect */}
          <div
            className="rounded-full animate-spin"
            style={{
              width: "100%",
              height: "100%",
              boxSizing: "border-box",
              borderStyle: "solid",
              borderColor: "white",
              borderTopColor: "transparent",
              borderWidth: spinnerStyle.borderWidth,
            }}
          />
        </div>

        {/* Accessible text: visually visible for sighted users and announced by screen readers */}
        {message ? (
          <span className="text-sm text-white opacity-95 select-none">{message}</span>
        ) : (
          <span className="sr-only">Loading</span>
        )}
      </div>
    </div>
  );
}
