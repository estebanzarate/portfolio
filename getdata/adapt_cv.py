#!/usr/bin/env python3
"""
CV adapter — reads cv-data.json + job-offer.txt, calls Ollama, outputs a PDF.

Usage:
    python3 getdata/adapt_cv.py              # uses job-offer.txt, outputs cv-adapted.pdf
    python3 getdata/adapt_cv.py --lang es    # Spanish output
    python3 getdata/adapt_cv.py --lang en    # English output
    python3 getdata/adapt_cv.py --model mistral
    python3 getdata/adapt_cv.py --offer path/to/offer.txt --out output.pdf
"""

import argparse
import json
import sys
from pathlib import Path

try:
    import ollama
except ImportError:
    print("ERROR: ollama not installed. Run: pip install ollama", file=sys.stderr)
    sys.exit(1)

try:
    from reportlab.lib.pagesizes import A4
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib.units import mm
    from reportlab.lib.colors import HexColor
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
    from reportlab.lib.enums import TA_LEFT, TA_CENTER
except ImportError:
    print("ERROR: reportlab not installed. Run: pip install reportlab", file=sys.stderr)
    sys.exit(1)

ROOT_DIR = Path(__file__).parent.parent

HTB_GREEN  = HexColor("#9fef00")
DARK_BG    = HexColor("#141d2b")
GREY_TEXT  = HexColor("#444444")
BLACK      = HexColor("#111111")


def load_cv_data() -> dict:
    path = ROOT_DIR / "cv-data.json"
    if not path.exists():
        print("ERROR: cv-data.json not found. Run ./deploy.sh first.", file=sys.stderr)
        sys.exit(1)
    return json.loads(path.read_text())


def load_job_offer(offer_path: Path) -> str:
    if not offer_path.exists():
        print(f"ERROR: {offer_path} not found. Paste the job offer there.", file=sys.stderr)
        sys.exit(1)
    content = offer_path.read_text().strip()
    if not content:
        print(f"ERROR: {offer_path} is empty. Paste the job offer there.", file=sys.stderr)
        sys.exit(1)
    return content


def build_prompt(cv_data: dict, job_offer: str, lang: str) -> str:
    stats = cv_data["htb_stats"]
    base_cv = cv_data["base_cv"][lang]

    stats_context = f"""
Current portfolio stats (use these to add concrete numbers where relevant):
- HackTheBox machines: {stats['machines']['root_owned']} owned out of {stats['machines']['total']}
- HTB Academy: {stats['academy']['modules_completed']} modules completed ({stats['academy']['completion_percentage']}%)
- HTB Challenges: {stats['challenges']['owned']} solved out of {stats['challenges']['total']}
- HTB Sherlocks: {stats['sherlocks']['owned']} completed out of {stats['sherlocks']['total']}
- TryHackMe rooms: {stats['thm_rooms']['completed']} completed out of {stats['thm_rooms']['total']}
"""

    lang_instruction = "in Spanish" if lang == "es" else "in English"

    return f"""You are an expert ATS optimization consultant. Your task is to adapt a cybersecurity CV for a specific job offer.

STRICT RULES — follow these without exception:
1. Do NOT invent, fabricate or exaggerate any skill, tool, experience or achievement.
2. Only use information already present in the base CV or the portfolio stats provided.
3. Keep the output to exactly ONE PAGE — approximately 550-650 words maximum.
4. Incorporate keywords from the job offer NATURALLY where they honestly match the candidate's background.
5. Prioritize and reorder sections to highlight what's most relevant to this specific role.
6. Use standard ATS-friendly section headers (no tables, no graphics, no columns).
7. Write {lang_instruction}.
8. Output ONLY the adapted CV text — no explanations, no comments, no markdown formatting.

FORMAT RULES for the output (I will parse this to generate PDF):
- First line: full name only
- Second line: job title adapted to the role
- Third line: location | email | linkedin | github | portfolio
- Section headers: ALL CAPS on their own line (e.g. PROFILE, TECHNICAL SKILLS, etc.)
- Bullet points: start each with "- "
- Blank line between sections

BASE CV:
{base_cv}

{stats_context}

JOB OFFER:
{job_offer}

Now output the adapted CV {lang_instruction}:"""


def call_ollama(prompt: str, model: str) -> str:
    print(f"Calling Ollama ({model})...")
    try:
        response = ollama.generate(
            model=model,
            prompt=prompt,
            options={
                "temperature": 0.3,
                "num_predict": 1200,
            },
        )
        return response["response"].strip()
    except Exception as e:
        print(f"ERROR: Ollama call failed — {e}", file=sys.stderr)
        print("Make sure Ollama is running: ollama serve", file=sys.stderr)
        sys.exit(1)


def build_pdf(cv_text: str, output_path: Path, lang: str):
    doc = SimpleDocTemplate(
        str(output_path),
        pagesize=A4,
        leftMargin=18 * mm,
        rightMargin=18 * mm,
        topMargin=14 * mm,
        bottomMargin=14 * mm,
    )

    name_style = ParagraphStyle(
        "Name",
        fontSize=20,
        leading=24,
        textColor=BLACK,
        fontName="Helvetica-Bold",
        spaceAfter=1,
        alignment=TA_LEFT,
    )
    title_style = ParagraphStyle(
        "Title",
        fontSize=10,
        leading=13,
        textColor=GREY_TEXT,
        fontName="Helvetica",
        spaceAfter=1,
        alignment=TA_LEFT,
    )
    contact_style = ParagraphStyle(
        "Contact",
        fontSize=8.5,
        leading=11,
        textColor=GREY_TEXT,
        fontName="Helvetica",
        spaceAfter=6,
        alignment=TA_LEFT,
    )
    header_style = ParagraphStyle(
        "Header",
        fontSize=9,
        leading=12,
        textColor=BLACK,
        fontName="Helvetica-Bold",
        spaceBefore=7,
        spaceAfter=3,
        borderPadding=(0, 0, 2, 0),
    )
    body_style = ParagraphStyle(
        "Body",
        fontSize=9,
        leading=12,
        textColor=HexColor("#222222"),
        fontName="Helvetica",
        spaceAfter=1,
    )
    bullet_style = ParagraphStyle(
        "Bullet",
        fontSize=9,
        leading=12,
        textColor=HexColor("#222222"),
        fontName="Helvetica",
        leftIndent=10,
        spaceAfter=1,
        bulletIndent=0,
    )

    lines = cv_text.split("\n")
    story = []

    # First three lines are name, title, contact
    if len(lines) >= 1:
        story.append(Paragraph(lines[0].strip(), name_style))
    if len(lines) >= 2:
        story.append(Paragraph(lines[1].strip(), title_style))
    if len(lines) >= 3:
        story.append(Paragraph(lines[2].strip(), contact_style))

    # Divider line after header
    story.append(Paragraph('<hr width="100%" color="#9fef00" thickness="1.5"/>', body_style))
    story.append(Spacer(1, 3))

    for line in lines[3:]:
        stripped = line.strip()
        if not stripped:
            story.append(Spacer(1, 2))
        elif stripped == stripped.upper() and len(stripped) > 2 and not stripped.startswith("-"):
            story.append(Paragraph(stripped, header_style))
            story.append(Paragraph('<hr width="100%" color="#e0e0e0" thickness="0.5"/>', body_style))
        elif stripped.startswith("- "):
            story.append(Paragraph(f"• {stripped[2:]}", bullet_style))
        else:
            story.append(Paragraph(stripped, body_style))

    doc.build(story)
    print(f"PDF saved to {output_path}")


def main():
    parser = argparse.ArgumentParser(description="Adapt CV for a specific job offer using Ollama.")
    parser.add_argument("--lang",  choices=["es", "en"], default="en", help="Output language (default: en)")
    parser.add_argument("--model", default="llama3.2",   help="Ollama model (default: llama3.2)")
    parser.add_argument("--offer", default=str(ROOT_DIR / "job-offer.txt"), help="Path to job offer text file")
    parser.add_argument("--out",   default=str(ROOT_DIR / "cv-adapted.pdf"), help="Output PDF path")
    args = parser.parse_args()

    cv_data   = load_cv_data()
    job_offer = load_job_offer(Path(args.offer))
    prompt    = build_prompt(cv_data, job_offer, args.lang)
    cv_text   = call_ollama(prompt, args.model)
    build_pdf(cv_text, Path(args.out), args.lang)


if __name__ == "__main__":
    main()