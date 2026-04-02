from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import Frame, PageTemplate, Paragraph, SimpleDocTemplate, Spacer


ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT / "output" / "pdf"
TMP_DIR = ROOT / "tmp" / "pdfs"
OUTPUT_PATH = OUTPUT_DIR / "app-summary-one-page.pdf"


def build_story():
    styles = getSampleStyleSheet()
    title = ParagraphStyle(
        "Title",
        parent=styles["Heading1"],
        fontName="Helvetica-Bold",
        fontSize=20,
        leading=23,
        textColor=colors.HexColor("#111827"),
        spaceAfter=6,
    )
    subtitle = ParagraphStyle(
        "Subtitle",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=9,
        leading=12,
        textColor=colors.HexColor("#4B5563"),
        spaceAfter=10,
    )
    h2 = ParagraphStyle(
        "H2",
        parent=styles["Heading2"],
        fontName="Helvetica-Bold",
        fontSize=10,
        leading=12,
        textColor=colors.HexColor("#B91C1C"),
        spaceBefore=2,
        spaceAfter=4,
    )
    body = ParagraphStyle(
        "Body",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=8.2,
        leading=10.2,
        textColor=colors.HexColor("#111827"),
        spaceAfter=4,
    )
    bullet = ParagraphStyle(
        "Bullet",
        parent=body,
        leftIndent=9,
        firstLineIndent=-6,
        bulletIndent=0,
        spaceAfter=2,
    )
    run = ParagraphStyle(
        "Run",
        parent=body,
        leftIndent=9,
        firstLineIndent=-6,
        bulletIndent=0,
        spaceAfter=1.5,
    )

    features = [
        "Netflix-style landing flow with sound, profile selection, and personalized navigation paths.",
        "Role-based browsing for recruiter, developer, stalker, and adventurer personas.",
        "Dedicated pages for skills, projects, work experience, contact, music, and reading.",
        "Project gallery opens focused details from a local project catalog with images, links, and videos.",
        "Interactive career timeline is rendered from local timeline data with a simulated async load.",
        "Embedded Spotify songs and playlists plus profile-specific recommendation rows.",
        "Built-in mini-games mapped to personas, including chess, snake race, shooting range, and space exploration.",
    ]
    architecture = [
        "UI shell: React 18 app bootstrapped in <b>src/index.js</b>; routing is defined in <b>src/App.js</b> with React Router.",
        "Page layer: route targets under <b>src/pages</b> and <b>src/components</b> render portfolio sections and profile views.",
        "Shared pieces: <b>Layout</b>, <b>Navbar</b>, <b>ProfileBanner</b>, <b>TopPicksRow</b>, and <b>ContinueWatching</b> compose repeated UI.",
        "Content/data: local arrays in <b>ProjectsData.js</b>, <b>skillsData.js</b>, and <b>getTimeline.js</b>; no repo evidence of a custom backend API.",
        "Assets/integrations: local images, PDFs, and audio from <b>src/assets</b>; remote embeds/images come from Spotify, Giphy, and Picsum URLs in component code.",
        "Delivery flow: source builds into <b>build/</b>; Firebase Hosting rewrites all routes to <b>index.html</b> for SPA navigation.",
    ]
    getting_started = [
        "Install Node dependencies: <b>npm install</b>",
        "Start locally: <b>npm start</b>",
        "Open: <b>http://localhost:3000</b>",
        "Create production build if needed: <b>npm run build</b>",
    ]

    story = [
        Paragraph("App Summary", title),
        Paragraph(
            "Repository-based one-page brief for the portfolio app in "
            "<b>D:\\my portfolo\\my-protforlio</b>.",
            subtitle,
        ),
        Paragraph("What It Is", h2),
        Paragraph(
            "A personal portfolio web app for Aditya Mishra built as a React single-page application with a Netflix-inspired browsing theme. "
            "It presents skills, projects, experience, contact details, music, reading, and persona-linked mini-games.",
            body,
        ),
        Paragraph("Who It's For", h2),
        Paragraph(
            "Primary persona: recruiters and other visitors evaluating Aditya Mishra's background, projects, and interests.",
            body,
        ),
        Paragraph("What It Does", h2),
    ]
    for item in features:
        story.append(Paragraph(item, bullet, bulletText="-"))

    story.extend(
        [
            Spacer(1, 2),
            Paragraph("How It Works", h2),
        ]
    )
    for item in architecture:
        story.append(Paragraph(item, bullet, bulletText="-"))

    story.extend(
        [
            Spacer(1, 2),
            Paragraph("How to Run", h2),
        ]
    )
    for item in getting_started:
        story.append(Paragraph(item, run, bulletText="-"))

    story.extend(
        [
            Spacer(1, 2),
            Paragraph("Not found in repo: authentication, database, server-side services, or documented test/runbook beyond README and package scripts.", body),
        ]
    )
    return story


def add_background(canvas, doc):
    width, height = A4
    canvas.saveState()
    canvas.setFillColor(colors.HexColor("#F8FAFC"))
    canvas.rect(0, 0, width, height, fill=1, stroke=0)
    canvas.setFillColor(colors.HexColor("#991B1B"))
    canvas.rect(0, height - 18 * mm, width, 18 * mm, fill=1, stroke=0)
    canvas.setFillColor(colors.white)
    canvas.setFont("Helvetica-Bold", 9)
    canvas.drawString(doc.leftMargin, height - 11 * mm, "Portfolio App Snapshot")
    canvas.setFillColor(colors.HexColor("#6B7280"))
    canvas.setFont("Helvetica", 7.5)
    canvas.drawRightString(width - doc.rightMargin, 8 * mm, "Generated from repo evidence only")
    canvas.restoreState()


def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    TMP_DIR.mkdir(parents=True, exist_ok=True)

    doc = SimpleDocTemplate(
        str(OUTPUT_PATH),
        pagesize=A4,
        leftMargin=14 * mm,
        rightMargin=14 * mm,
        topMargin=24 * mm,
        bottomMargin=12 * mm,
    )
    frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)
    doc.addPageTemplates([PageTemplate(id="onepage", frames=[frame], onPage=add_background)])
    doc.build(build_story())
    print(OUTPUT_PATH)


if __name__ == "__main__":
    main()
