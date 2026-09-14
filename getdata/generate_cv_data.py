#!/usr/bin/env python3
"""
Generates cv-data.json with updated portfolio stats + base CV content.
Called automatically by deploy.sh after data fetch.
"""

import json
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT_DIR = Path(__file__).parent.parent
DATA_DIR = ROOT_DIR / "src" / "data"


def load_json(path: Path) -> dict:
    if path.exists():
        return json.loads(path.read_text())
    return {}


def build_htb_stats() -> dict:
    machines   = load_json(DATA_DIR / "machines.json")
    academy    = load_json(DATA_DIR / "academy.json")
    challenges = load_json(DATA_DIR / "challenges.json")
    sherlocks  = load_json(DATA_DIR / "sherlocks.json")
    rooms      = load_json(DATA_DIR / "rooms.json")

    m_stats = machines.get("statistics", {})
    a_stats = academy.get("statistics", {})
    c_stats = challenges.get("statistics", {})
    s_stats = sherlocks.get("statistics", {})
    r_stats = rooms.get("statistics", {})

    return {
        "machines": {
            "total":      m_stats.get("total", 0),
            "root_owned": m_stats.get("root_owns", 0),
            "user_owned": m_stats.get("user_owns", 0),
        },
        "academy": {
            "modules_completed":      a_stats.get("completed", 0),
            "modules_total":          a_stats.get("total_modules", 0),
            "completion_percentage":  a_stats.get("completion_percentage", 0),
        },
        "challenges": {
            "owned": c_stats.get("owned", 0),
            "total": c_stats.get("total", 0),
        },
        "sherlocks": {
            "owned": s_stats.get("owned", 0),
            "total": s_stats.get("total", 0),
        },
        "thm_rooms": {
            "completed": r_stats.get("completed", 0),
            "total":     r_stats.get("total_rooms", 0),
        },
    }


CV_BASE = {
    "es": """\
ESTEBAN ZÁRATE
Analista de Ciberseguridad | Desarrollador de Software
Buenos Aires, Argentina | estebanzarateok@gmail.com
LinkedIn: linkedin.com/in/esteban-zarate | GitHub: github.com/estebanzarate
Portfolio: estebanzarate.vercel.app | Blog: no0funny.vercel.app

PERFIL
Aspirante a Analista de Ciberseguridad con formación en desarrollo de software y experiencia práctica desarrollando herramientas de seguridad, aplicaciones full stack y laboratorios de seguridad ofensiva. Puse en práctica mis conocimientos mediante Hack The Box, TryHackMe, laboratorios propios de Active Directory y proyectos personales enfocados en automatización, documentación técnica y desarrollo seguro. Interesado en incorporarme a un equipo de ciberseguridad donde pueda aplicar mis conocimientos en desarrollo de software y seguridad ofensiva mientras continúo creciendo profesionalmente.

HABILIDADES TÉCNICAS
Lenguajes: Python, Bash, JavaScript, TypeScript, HTML, CSS
Frameworks y tecnologías: React, Vite, Express.js, PostgreSQL, Docker, Tailwind CSS
Ciberseguridad: Seguridad en aplicaciones web, Active Directory, Linux, Windows, HTTP, autenticación, autorización, RBAC, JWT, gestión de sesiones
Herramientas: Burp Suite, Nmap, Wireshark, Metasploit, ffuf, Gobuster, Hydra, Impacket, NetExec, Git, GitHub

PROYECTOS DESTACADOS
Plataforma Full Stack con Autenticación Segura
- Desarrollé una aplicación full stack utilizando React, TypeScript, Express y PostgreSQL.
- Implementé autenticación mediante JWT, refresh tokens rotativos, cookies httpOnly y RBAC.
- Diseñé una arquitectura reutilizable con operaciones transaccionales y soporte para múltiples backends.

urlfckr
- Desarrollé un crawler web multihilo en Python para reconocimiento, capaz de descubrir subdominios y rutas.
- Implementé profundidad configurable, limitación de velocidad, cabeceras HTTP personalizadas y exportación JSON.

EXPERIENCIA PRÁCTICA
Laboratorios de Ciberseguridad y CTF
- Resolución de máquinas y desafíos en Hack The Box y TryHackMe.
- Práctica de pruebas de seguridad web, escalada de privilegios en Linux/Windows, enumeración de Active Directory y post-explotación.
- Desarrollo de herramientas propias para automatizar reconocimiento y pentesting.
- Mantenimiento de portfolio técnico, blog especializado y repositorios públicos en GitHub.

EDUCACIÓN
Brigham Young University–Idaho — Desarrollo de Software
Certificado: Web & Computer Programming
Ensign College — Licenciatura en Tecnología de la Información

CERTIFICACIONES
- Cisco Networking Academy — Ethical Hacker (2026)
- Cisco Networking Academy — Introduction to Cybersecurity (2026)
- TryHackMe — Jr Penetration Tester Learning Path
- TestOut — PC Pro | TestOut — Client Pro

IDIOMAS
Español: Nativo | Inglés: Comprensión técnica y lectura de documentación profesional
""",

    "en": """\
ESTEBAN ZÁRATE
Cybersecurity Analyst | Software Developer
Buenos Aires, Argentina | estebanzarateok@gmail.com
LinkedIn: linkedin.com/in/esteban-zarate | GitHub: github.com/estebanzarate
Portfolio: estebanzarate.vercel.app | Blog: no0funny.vercel.app

PROFILE
Aspiring Cybersecurity Analyst with a software development background and hands-on experience building security tools, full-stack applications and offensive security labs. I have strengthened my skills through Hack The Box, TryHackMe, personal Active Directory labs and projects focused on automation, technical documentation and secure software development. Interested in joining a cybersecurity team where I can apply my software development and offensive security skills while continuing to grow professionally.

TECHNICAL SKILLS
Languages: Python, Bash, JavaScript, TypeScript, HTML, CSS
Frameworks & Technologies: React, Vite, Express.js, PostgreSQL, Docker, Tailwind CSS
Cybersecurity: Web Application Security, Active Directory, Linux, Windows, HTTP, Authentication, Authorization, RBAC, JWT, Session Management
Tools: Burp Suite, Nmap, Wireshark, Metasploit, ffuf, Gobuster, Hydra, Impacket, NetExec, Git, GitHub

SELECTED PROJECTS
Secure Full-Stack Authentication Platform
- Developed a full-stack application using React, TypeScript, Express and PostgreSQL.
- Implemented secure authentication using JWT, rotating refresh tokens, httpOnly cookies and RBAC.
- Designed a reusable architecture with transactional operations and support for multiple backend implementations.

urlfckr
- Developed a multithreaded Python web crawler for reconnaissance capable of discovering subdomains and application paths.
- Implemented configurable crawl depth, rate limiting, custom HTTP headers and JSON export.

PRACTICAL EXPERIENCE
Cybersecurity Labs & Capture The Flag
- Completed security labs and challenges on Hack The Box and TryHackMe.
- Practiced web application security testing, Linux privilege escalation, Active Directory enumeration and post-exploitation.
- Developed custom tools to automate reconnaissance and penetration testing tasks.
- Maintain a technical portfolio, cybersecurity blog and public GitHub repositories.

EDUCATION
Brigham Young University–Idaho — Software Development
Certificate: Web & Computer Programming
Ensign College — Bachelor's in Information Technology

CERTIFICATIONS
- Cisco Networking Academy — Ethical Hacker (2026)
- Cisco Networking Academy — Introduction to Cybersecurity (2026)
- TryHackMe — Jr Penetration Tester Learning Path
- TestOut — PC Pro | TestOut — Client Pro

LANGUAGES
Spanish: Native | English: Professional reading comprehension and technical documentation
""",
}


def main():
    htb_stats = build_htb_stats()

    output = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "personal": {
            "name":      "Esteban Zárate",
            "title_es":  "Analista de Ciberseguridad | Desarrollador de Software",
            "title_en":  "Cybersecurity Analyst | Software Developer",
            "location":  "Buenos Aires, Argentina",
            "email":     "estebanzarateok@gmail.com",
            "linkedin":  "linkedin.com/in/esteban-zarate",
            "github":    "github.com/estebanzarate",
            "portfolio": "estebanzarate.vercel.app",
            "blog":      "no0funny.vercel.app",
        },
        "htb_stats": htb_stats,
        "base_cv": CV_BASE,
    }

    out_path = ROOT_DIR / "cv-data.json"
    out_path.write_text(json.dumps(output, indent=2, ensure_ascii=False))
    print(f"  cv-data.json generated ({out_path})")


if __name__ == "__main__":
    main()