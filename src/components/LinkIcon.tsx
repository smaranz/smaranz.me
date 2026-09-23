import { Mail } from "lucide-react";
import Image from "next/image";
import { Github } from "./icons";

// Icon for one of the profile links, matched by its label.
export function LinkIcon({
  label,
  className = "size-[17px]",
}: {
  label: string;
  className?: string;
}) {
  switch (label) {
    case "GitHub":
      return <Github className={className} />;
    case "Instagram":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          className={className}
          aria-hidden
        >
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
        </svg>
      );
    case "CodeStarters":
      return (
        <Image
          src="/logos/codestarters-white.png"
          alt=""
          width={17}
          height={17}
          className={`${className} object-contain`}
        />
      );
    case "Email":
      return <Mail className={className} strokeWidth={1.75} />;
    default:
      return null;
  }
}
