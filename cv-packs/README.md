# CV Packs

Drop one Word, PDF, Markdown or text source into its own folder:

    cv-packs/my-new-role/source.docx

Optional `manifest.json`:

    {
      "title": "Principal Consultant - Example",
      "type": "cv",
      "description": "Tailored CV and application pack"
    }

Supported `type` values are intentionally open:

- `cv`
- `cv-cover`
- `skills-matrix`
- `application`
- `portfolio`
- any future template type

Once the folder exists, the normal production build discovers it automatically and creates:

    /cv/my-new-role/

No App.tsx route editing is required.
