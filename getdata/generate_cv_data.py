#!/usr/bin/env python3
"""
Generates cv-data.json with all portfolio information needed to adapt the CV.
Called automatically by deploy.sh after data fetch.
"""

import json
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

    m_stats = machines.get("statistics", {})
    a_stats = academy.get("statistics", {})
    c_stats = challenges.get("statistics", {})
    s_stats = sherlocks.get("statistics", {})

    academy_by_category = {
        cat: {
            "completed": data["completed"],
            "total": data["total"],
            "percentage": data["percentage"],
        }
        for cat, data in a_stats.get("by_category", {}).items()
    }

    challenges_by_category = c_stats.get("by_category", {})
    challenges_by_diff     = c_stats.get("by_difficulty", {})
    sherlocks_by_category  = s_stats.get("by_category", {})
    sherlocks_by_diff      = s_stats.get("by_difficulty", {})
    machines_by_diff       = m_stats.get("by_difficulty", {})
    machines_by_os         = m_stats.get("by_os", {})

    return {
        "machines": {
            "total":         m_stats.get("total", 0),
            "root_owned":    m_stats.get("root_owns", 0),
            "user_owned":    m_stats.get("user_owns", 0),
            "by_difficulty": machines_by_diff,
            "by_os":         machines_by_os,
        },
        "academy": {
            "modules_completed":     a_stats.get("completed", 0),
            "modules_total":         a_stats.get("total_modules", 0),
            "completion_percentage": a_stats.get("completion_percentage", 0),
            "by_category":           academy_by_category,
        },
        "challenges": {
            "owned":         c_stats.get("owned", 0),
            "total":         c_stats.get("total", 0),
            "by_difficulty": challenges_by_diff,
            "by_category":   challenges_by_category,
        },
        "sherlocks": {
            "owned":         s_stats.get("owned", 0),
            "total":         s_stats.get("total", 0),
            "by_difficulty": sherlocks_by_diff,
            "by_category":   sherlocks_by_category,
        },
    }


def build_thm_stats() -> dict:
    rooms = load_json(DATA_DIR / "rooms.json")
    r_stats = rooms.get("statistics", {})
    return {
        "completed":             r_stats.get("completed", 0),
        "total":                 r_stats.get("total_rooms", 0),
        "completion_percentage": r_stats.get("completion_percentage", 0),
        "by_difficulty":         r_stats.get("by_difficulty", {}),
        "by_type":               r_stats.get("by_type", {}),
    }


PROFILE = {
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
    "summary": {
        "es": (
            "Aspirante a Analista de Ciberseguridad con formación en desarrollo de software y experiencia práctica "
            "desarrollando herramientas de seguridad, aplicaciones full stack y laboratorios de seguridad ofensiva. "
            "Puse en práctica mis conocimientos mediante Hack The Box, TryHackMe, laboratorios propios de Active Directory "
            "y proyectos personales enfocados en automatización, documentación técnica y desarrollo seguro. Interesado en "
            "incorporarme a un equipo de ciberseguridad donde pueda aplicar mis conocimientos en desarrollo de software y "
            "seguridad ofensiva mientras continúo creciendo profesionalmente."
        ),
        "en": (
            "Aspiring Cybersecurity Analyst with a software development background and hands-on experience building security "
            "tools, full-stack applications and offensive security labs. I have strengthened my skills through Hack The Box, "
            "TryHackMe, personal Active Directory labs and projects focused on automation, technical documentation and secure "
            "software development. Interested in joining a cybersecurity team where I can apply my software development and "
            "offensive security skills while continuing to grow professionally."
        ),
    },
    "skills": {
        "languages":       ["Python", "Bash", "JavaScript", "TypeScript", "HTML", "CSS"],
        "frameworks":      ["React", "Vite", "Express.js", "PostgreSQL", "Docker", "Tailwind CSS"],
        "cybersecurity":   [
            "Web Application Security", "Active Directory", "Linux", "Windows",
            "HTTP", "Authentication", "Authorization", "RBAC", "JWT", "Session Management",
            "Privilege Escalation", "Network Enumeration", "Post-Exploitation",
            "Password Attacks", "File Inclusion", "SQL Injection",
        ],
        "tools": [
            "Burp Suite", "Nmap", "Wireshark", "Metasploit", "ffuf", "Gobuster",
            "Hydra", "Impacket", "NetExec", "Git", "GitHub",
        ],
        "htb_academy_topics": [
            "Penetration Testing Process", "Footprinting", "Information Gathering",
            "Vulnerability Assessment", "File Transfers", "Shells & Payloads",
            "Password Attacks", "Privilege Escalation (Linux & Windows)",
            "Active Directory Attacks", "Web Application Attacks",
            "Network Traffic Analysis", "Incident Handling",
        ],
    },
    "projects": [
        {
            "name": "Secure Full-Stack Authentication Platform",
            "description_es": (
                "Aplicación full stack con React, TypeScript, Express y PostgreSQL. "
                "Autenticación mediante JWT, refresh tokens rotativos, cookies httpOnly y RBAC. "
                "Arquitectura reutilizable con operaciones transaccionales y soporte para múltiples backends."
            ),
            "description_en": (
                "Full-stack application using React, TypeScript, Express and PostgreSQL. "
                "Secure authentication with JWT, rotating refresh tokens, httpOnly cookies and RBAC. "
                "Reusable architecture with transactional operations and support for multiple backend implementations."
            ),
            "technologies": ["React", "TypeScript", "Express.js", "PostgreSQL", "JWT", "RBAC"],
        },
        {
            "name": "urlfckr",
            "description_es": (
                "Crawler web multihilo en Python para reconocimiento. "
                "Descubre subdominios y rutas de aplicaciones web. "
                "Implementa profundidad configurable, limitación de velocidad, cabeceras HTTP personalizadas y exportación JSON."
            ),
            "description_en": (
                "Multithreaded Python web crawler for reconnaissance. "
                "Discovers subdomains and application paths. "
                "Configurable crawl depth, rate limiting, custom HTTP headers and JSON export."
            ),
            "technologies": ["Python", "multithreading", "HTTP", "reconnaissance"],
        },
        {
            "name": "Portfolio de Ciberseguridad / Cybersecurity Portfolio",
            "description_es": (
                "Portfolio técnico con integración en tiempo real de HackTheBox y TryHackMe vía APIs. "
                "Desarrollado con React, Vite y Tailwind CSS. "
                "Incluye estadísticas de máquinas, challenges, sherlocks, rooms y módulos de academia."
            ),
            "description_en": (
                "Technical portfolio with real-time HackTheBox and TryHackMe integration via APIs. "
                "Built with React, Vite and Tailwind CSS. "
                "Includes stats for machines, challenges, sherlocks, rooms and academy modules."
            ),
            "technologies": ["React", "Vite", "Tailwind CSS", "Python", "Node.js", "REST APIs"],
        },
    ],
    "experience": [
        {
            "role_es": "Practicante de Ciberseguridad y CTF Player",
            "role_en": "Cybersecurity Practitioner & CTF Player",
            "company": "Self-directed / HackTheBox / TryHackMe",
            "period": "2022 — Present",
            "highlights_es": [
                "Resolución de máquinas y desafíos en HackTheBox y TryHackMe.",
                "Práctica de pruebas de seguridad web, escalada de privilegios en Linux/Windows, enumeración de Active Directory y post-explotación.",
                "Desarrollo de herramientas propias para automatizar reconocimiento y pentesting.",
                "Mantenimiento de portfolio técnico, blog especializado y repositorios públicos en GitHub.",
            ],
            "highlights_en": [
                "Completed security labs and challenges on Hack The Box and TryHackMe.",
                "Practiced web application security testing, Linux/Windows privilege escalation, Active Directory enumeration and post-exploitation.",
                "Developed custom tools to automate reconnaissance and penetration testing tasks.",
                "Maintain a technical portfolio, cybersecurity blog and public GitHub repositories.",
            ],
        },
    ],
    "education": [
        {
            "institution": "Brigham Young University–Idaho",
            "degree_es": "Desarrollo de Software",
            "degree_en": "Software Development",
            "certificate": "Web & Computer Programming",
            "relevant_courses": [
                "Programming with Functions", "Programming with Classes",
                "JavaScript Language", "Web Fundamentals",
                "Web Frontend Development I", "Career Development",
            ],
        },
        {
            "institution": "Ensign College",
            "degree_es": "Licenciatura en Tecnología de la Información",
            "degree_en": "Bachelor's in Information Technology",
            "relevant_courses": [
                "Python Scripting", "Cloud Server Administration",
                "PC Hardware Technician", "Introduction to Information Technology",
            ],
        },
    ],
    "certifications": [
        {"name": "Ethical Hacker",              "issuer": "Cisco Networking Academy", "year": 2026},
        {"name": "Introduction to Cybersecurity","issuer": "Cisco Networking Academy", "year": 2026},
        {"name": "Jr Penetration Tester Learning Path", "issuer": "TryHackMe",        "year": 2023},
        {"name": "PC Pro",                       "issuer": "TestOut",                  "year": 2024},
        {"name": "Client Pro",                   "issuer": "TestOut",                  "year": 2024},
    ],
    "languages": [
        {"language": "Spanish", "level": "Native"},
        {"language": "English",  "level": "Professional reading comprehension and technical documentation"},
    ],
    "base_cv": {
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
Español: Nativo | Inglés: Comprensión técnica y lectura de documentación profesional""",

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
Spanish: Native | English: Professional reading comprehension and technical documentation""",
    },
}


def main():
    output = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        **PROFILE,
        "htb_stats":  build_htb_stats(),
        "thm_stats":  build_thm_stats(),
    }

    out_path = ROOT_DIR / "cv-data.json"
    out_path.write_text(json.dumps(output, indent=2, ensure_ascii=False))
    print(f"  cv-data.json updated ({len(output['htb_stats']['machines']['by_difficulty'])} machine diffs, "
          f"{output['htb_stats']['academy']['modules_completed']} academy modules, "
          f"{output['htb_stats']['challenges']['owned']} challenges, "
          f"{output['htb_stats']['sherlocks']['owned']} sherlocks)")


if __name__ == "__main__":
    main()