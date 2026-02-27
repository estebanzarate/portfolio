const profile = {
  name: "Esteban Zárate",
  role: "Cybersecurity Analyst",
  description:
    "Entusiasta de ciberseguridad con experiencia en desarrollo full stack (JavaScript, React, Node.js) en transición hacia la seguridad ofensiva y defensiva. Actualmente me centro en penetration testing y análisis de vulnerabilidades, documentando mi aprendizaje con artículos sobre máquinas en Hack The Box, TryHackMe y otras plataformas en mi GitBook.",
  location: "Buenos Aires, Argentina",
  links: {
    github: "https://github.com/estebanzarate",
    linkedin: "https://www.linkedin.com/in/esteban-zarate",
    htb: "https://app.hackthebox.com/users/1089152",
    thm: "https://tryhackme.com/p/no0funny",
    email: "mailto:estebanzarateok@gmail.com",
    blog: "https://estebanzarate.gitbook.io/hackache",
  },
  experience: [
    {
      id: 1,
      role: "Cybersecurity Learner & CTF Player",
      company: "",
      period: "2022 — Presente",
      description:
        "Práctica activa de penetration testing mediante resolución de máquinas en plataformas CTF. Writeups documentados en gitbook personal. Técnicas trabajadas: privilege escalation en Linux/Windows, Active Directory attacks, web application exploitation, network enumeration y post-exploitation.",
      tags: ["Pentesting", "Web Security", "CTF"],
    },
  ],
  // Skills derivados de módulos completados en HTB Academy
  // Cada tag corresponde a uno o más módulos finalizados — sin inventar niveles
  skills: [
    {
      category: "Pentesting & Explotación",
      color: "danger",
      items: [
        { name: "Metasploit Framework", source: "Using the Metasploit Framework" },
        { name: "Privilege Escalation (Linux)", source: "Linux Privilege Escalation" },
        { name: "Privilege Escalation (Windows)", source: "Windows Privilege Escalation" },
        { name: "Buffer Overflows (Linux x86)", source: "Stack-Based Buffer Overflows on Linux x86" },
        { name: "Buffer Overflows (Windows x86)", source: "Stack-Based Buffer Overflows on Windows x86" },
        { name: "Shells & Payloads", source: "Shells & Payloads" },
        { name: "Password Attacks", source: "Password Attacks" },
        { name: "Login Brute Forcing", source: "Login Brute Forcing" },
        { name: "Pivoting & Tunneling", source: "Pivoting, Tunneling, and Port Forwarding" },
        { name: "Attacking Common Services", source: "Attacking Common Services" },
        { name: "Attacking Common Applications", source: "Attacking Common Applications" },
      ],
    },
    {
      category: "Seguridad Web",
      color: "warning",
      items: [
        { name: "SQL Injection", source: "SQL Injection Fundamentals" },
        { name: "File Inclusion (LFI/RFI)", source: "File Inclusion" },
        { name: "Web Fuzzing", source: "Attacking Web Applications with Ffuf / Web Fuzzing" },
        { name: "JavaScript Deobfuscation", source: "JavaScript Deobfuscation" },
        { name: "WordPress Hacking", source: "Hacking WordPress" },
        { name: "Information Gathering Web", source: "Information Gathering - Web Edition" },
        { name: "Web Requests & HTTP", source: "Web Requests" },
        { name: "Bug Bounty Process", source: "Bug Bounty Hunting Process" },
      ],
    },
    {
      category: "Redes & Reconocimiento",
      color: "info",
      items: [
        { name: "Nmap", source: "Network Enumeration with Nmap" },
        { name: "Network Traffic Analysis", source: "Intro to Network Traffic Analysis" },
        { name: "Footprinting", source: "Footprinting" },
        { name: "DNS Enumeration", source: "DNS Enumeration Using Python" },
        { name: "File Transfers", source: "File Transfers" },
        { name: "Networking Fundamentals", source: "Introduction to Networking / Network Foundations" },
      ],
    },
    {
      category: "Sistemas Operativos",
      color: "success",
      items: [
        { name: "Linux", source: "Linux Fundamentals" },
        { name: "Windows", source: "Windows Fundamentals" },
        { name: "macOS", source: "MacOS Fundamentals" },
        { name: "Bash Scripting", source: "Introduction to Bash Scripting" },
        { name: "Windows CLI & PowerShell", source: "Introduction to Windows Command Line" },
        { name: "Active Directory", source: "Introduction to Active Directory" },
      ],
    },
    {
      category: "Programación & Scripting",
      color: "primary",
      items: [
        { name: "Python 3", source: "Introduction to Python 3 / DNS Enumeration Using Python" },
        { name: "JavaScript", source: "JavaScript Deobfuscation / Secure Coding 101" },
        { name: "C#", source: "Introduction to C#" },
        { name: "Bash", source: "Introduction to Bash Scripting" },
      ],
    },
    {
      category: "Metodología & Proceso",
      color: "secondary",
      items: [
        { name: "Penetration Testing Process", source: "Penetration Testing Process" },
        { name: "Vulnerability Assessment", source: "Vulnerability Assessment" },
        { name: "Incident Handling", source: "Security Incident Reporting" },
        { name: "Pentest Reporting", source: "Pentest in a Nutshell" },
        { name: "Fundamentos de IA", source: "Fundamentals of AI" },
      ],
    },
  ],
  education: [
    {
      id: 1,
      title: "TestOut Client Pro",
      institution: "TestOut Corporation",
      period: "2024",
      certificate: "/certificates/TOCP.webp"
    },
    {
      id: 2,
      title: "TestOut PC Pro",
      institution: "TestOut Corporation",
      period: "2024",
      certificate: "/certificates/TOPCP.webp"
    },
    {
      id: 3,
      title: "Introducción a Linux",
      institution: "Hack4u",
      period: "2023"
    },
    {
      id: 4,
      title: "Introducción al Hacking",
      institution: "Hack4u",
      period: "2023",
      certificate: "/certificates/IH.webp"
    },
    {
      id: 5,
      title: "Python Ofensivo",
      institution: "Hack4u",
      period: "2023",
      certificate: "/certificates/PO.webp"
    },
    {
      id: 6,
      title: "Introduction to Cyber Security Learning Path",
      institution: "TryHackMe",
      period: "2023",
      certificate: "/certificates/ICSLP.webp"
    },
    {
      id: 7,
      title: "Pre Security Learning Path",
      institution: "TryHackMe",
      period: "2023",
      certificate: "/certificates/PSLP.webp"
    },
    {
      id: 8,
      title: "Complete Beginner Learning Path",
      institution: "TryHackMe",
      period: "2023",
      certificate: "/certificates/CBLP.webp"
    },
    {
      id: 9,
      title: "Web Fundamentals Learning Path",
      institution: "TryHackMe",
      period: "2023",
      certificate: "/certificates/WFLP.webp"
    },
    {
      id: 10,
      title: "Jr Penetration Tester Learning Path",
      institution: "TryHackMe",
      period: "2023",
      certificate: "/certificates/JPTLP.webp"
    }
  ],
}

export default profile