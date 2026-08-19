import type { SiteSettingsData } from "@/lib/site-settings";

type Props = {
  settings: SiteSettingsData | null;
};

export function SiteFooter({ settings }: Props) {
  if (!settings?.footerText) {
    return (
      <footer className="px-4 pb-10 pt-6 text-center sm:px-8">
        <hr className="wavy-rule mx-auto mb-4" />
      </footer>
    );
  }

  const lines = settings.footerText.split("\n").filter((line) => line.trim());

  return (
    <footer className="px-4 pb-10 pt-6 text-center sm:px-8">
      <hr className="wavy-rule mx-auto mb-4" />
      <p className="text-xs leading-relaxed text-muted">
        {lines.map((line, i) => (
          <span key={i}>
            {i > 0 && <br />}
            {line}
          </span>
        ))}
      </p>
    </footer>
  );
}
