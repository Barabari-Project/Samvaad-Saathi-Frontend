"use client";

/**
 * Top navigation bar used across protected screens.
 * Renders a solid brand strip with an optional title on the left
 * and a settings icon button on the right.
 */
export default function TopNav({
  title,

  className = "",
}: {
  title?: string;
  onSettingsClick?: () => void;
  className?: string;
}) {
  return (
    <div
      className={`fixed top-0 left-0 w-full h-16 bg-[#1F285B] z-50 flex items-center px-4 ${className}`}
    >
      <div className="flex-1 flex items-center">
        {title ? (
          <h1 className="text-white text-[16px] font-semibold">{title}</h1>
        ) : (
          <span className="sr-only">Top Navigation</span>
        )}
      </div>
    </div>
  );
}
