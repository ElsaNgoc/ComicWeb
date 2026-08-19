import {
  getEffectiveLayout,
  isBlockEnabled,
  parseSidebarNotes,
  type SiteSettingsData,
} from "@/lib/site-settings";

type Props = {
  settings: SiteSettingsData | null;
};

export function BlogSidebar({ settings }: Props) {
  const layout = getEffectiveLayout(settings?.layoutConfig ?? null);
  const notes = parseSidebarNotes(settings?.sidebarNotes ?? null);

  const blocks = layout.sidebar.filter((b) => b.enabled);

  function renderBlock(type: string) {
    switch (type) {
      case "sidebar-quote":
        if (
          !isBlockEnabled(settings?.layoutConfig ?? null, "sidebar", "sidebar-quote") ||
          !settings?.sidebarQuote
        ) {
          return null;
        }
        return (
          <p key="quote" className="italic text-foreground/80">
            &ldquo;{settings.sidebarQuote}&rdquo;
          </p>
        );
      case "sidebar-intro":
        if (
          !isBlockEnabled(settings?.layoutConfig ?? null, "sidebar", "sidebar-intro") ||
          !settings?.sidebarIntro
        ) {
          return null;
        }
        return <p key="intro">{settings.sidebarIntro}</p>;
      case "sidebar-corner":
        if (
          !isBlockEnabled(settings?.layoutConfig ?? null, "sidebar", "sidebar-corner") ||
          (!settings?.sidebarCornerTitle && !settings?.sidebarCornerCaption)
        ) {
          return null;
        }
        return (
          <section key="corner">
            {settings?.sidebarCornerTitle && (
              <h3 className="text-center text-xs font-semibold tracking-[0.18em] text-foreground">
                {settings.sidebarCornerTitle}
              </h3>
            )}
            <div className="mt-3 aspect-[5/2] w-full bg-gradient-to-br from-peri-soft/70 via-pink/50 to-coral/40" />
            {settings?.sidebarCornerCaption && (
              <p className="mt-2 text-center text-xs">
                {settings.sidebarCornerCaption}
              </p>
            )}
          </section>
        );
      case "sidebar-notes":
        if (
          !isBlockEnabled(settings?.layoutConfig ?? null, "sidebar", "sidebar-notes") ||
          (!settings?.sidebarNotesTitle && notes.length === 0)
        ) {
          return null;
        }
        return (
          <section key="notes">
            {settings?.sidebarNotesTitle && (
              <h3 className="font-display text-center text-base text-foreground">
                {settings.sidebarNotesTitle}
              </h3>
            )}
            {notes.length > 0 && (
              <ul className="mt-3 list-none space-y-2 text-[0.9rem]">
                {notes.map((note) => (
                  <li key={note}>_ {note}</li>
                ))}
              </ul>
            )}
          </section>
        );
      default:
        return null;
    }
  }

  const rendered = blocks.map((b) => renderBlock(b.type)).filter(Boolean);
  if (rendered.length === 0) return null;

  return (
    <aside className="space-y-6 text-sm leading-relaxed text-muted">
      {rendered.map((node, i) => (
        <div key={i}>
          {i > 0 && <hr className="wavy-rule my-4" />}
          {node}
        </div>
      ))}
    </aside>
  );
}
