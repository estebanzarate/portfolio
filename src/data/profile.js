const profile = {
  es: {
    name: "Esteban Zárate",
    role: "Analista de Ciberseguridad",
    description:
      "Desde 2021 empecé a estudiar programación e interesarme por la ciberseguridad estudiando en las academias de Hack The Box y TryHackMe. Tengo conocimientos en JavaScript, Python, bases de datos SQL y NoSQL. Me gusta practicar en plataformas de CTF y programación como Hack The Box, Try Hack Me, HackerRank, etc. A partir de ahí empecé a buscar mi primer oportunidad tanto en programación como en ciberseguridad.",
    location: "Buenos Aires, Argentina",
    links: {
      github: "https://github.com/estebanzarate",
      linkedin: "https://www.linkedin.com/in/esteban-zarate",
      htb: "https://app.hackthebox.com/users/1089152",
      thm: "https://tryhackme.com/p/no0funny",
      email: "mailto:estebanzarateok@gmail.com",
      blog: "https://no0funny.vercel.app",
    },
    experience: [
      {
        id: 1,
        role: "Cybersecurity Learner & CTF Player",
        company: "",
        period: "2022 — Presente",
        description:
          "Practico mediante resolución de máquinas en plataformas CTF. Writeups documentados en mi blog personal.",
        tags: ["Pentesting", "Web Security", "CTF"],
      },
    ],
    skills: [
      {
        category: "Pentesting & Explotación",
        color: "danger",
        items: [
          {
            name: "Metasploit Framework",
            source: "Using the Metasploit Framework",
          },
          {
            name: "Privilege Escalation (Linux)",
            source: "Linux Privilege Escalation",
          },
          {
            name: "Privilege Escalation (Windows)",
            source: "Windows Privilege Escalation",
          },
          {
            name: "Buffer Overflows (Linux x86)",
            source: "Stack-Based Buffer Overflows on Linux x86",
          },
          {
            name: "Buffer Overflows (Windows x86)",
            source: "Stack-Based Buffer Overflows on Windows x86",
          },
          { name: "Shells & Payloads", source: "Shells & Payloads" },
          { name: "Password Attacks", source: "Password Attacks" },
          { name: "Login Brute Forcing", source: "Login Brute Forcing" },
          {
            name: "Pivoting & Tunneling",
            source: "Pivoting, Tunneling, and Port Forwarding",
          },
          {
            name: "Attacking Common Services",
            source: "Attacking Common Services",
          },
          {
            name: "Attacking Common Applications",
            source: "Attacking Common Applications",
          },
        ],
      },
      {
        category: "Seguridad Web",
        color: "warning",
        items: [
          { name: "SQL Injection", source: "SQL Injection Fundamentals" },
          { name: "File Inclusion (LFI/RFI)", source: "File Inclusion" },
          {
            name: "Web Fuzzing",
            source: "Attacking Web Applications with Ffuf / Web Fuzzing",
          },
          {
            name: "JavaScript Deobfuscation",
            source: "JavaScript Deobfuscation",
          },
          { name: "WordPress Hacking", source: "Hacking WordPress" },
          {
            name: "Information Gathering Web",
            source: "Information Gathering - Web Edition",
          },
          { name: "Web Requests & HTTP", source: "Web Requests" },
          { name: "Bug Bounty Process", source: "Bug Bounty Hunting Process" },
        ],
      },
      {
        category: "Redes & Reconocimiento",
        color: "info",
        items: [
          { name: "Nmap", source: "Network Enumeration with Nmap" },
          {
            name: "Network Traffic Analysis",
            source: "Intro to Network Traffic Analysis",
          },
          { name: "Footprinting", source: "Footprinting" },
          { name: "DNS Enumeration", source: "DNS Enumeration Using Python" },
          { name: "File Transfers", source: "File Transfers" },
          {
            name: "Networking Fundamentals",
            source: "Introduction to Networking / Network Foundations",
          },
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
          {
            name: "Windows CLI & PowerShell",
            source: "Introduction to Windows Command Line",
          },
          {
            name: "Active Directory",
            source: "Introduction to Active Directory",
          },
        ],
      },
      {
        category: "Programación & Scripting",
        color: "primary",
        items: [
          {
            name: "Python 3",
            source: "Introduction to Python 3 / DNS Enumeration Using Python",
          },
          {
            name: "JavaScript",
            source: "JavaScript Deobfuscation / Secure Coding 101",
          },
          { name: "C#", source: "Introduction to C#" },
          { name: "Bash", source: "Introduction to Bash Scripting" },
        ],
      },
      {
        category: "Metodología & Proceso",
        color: "secondary",
        items: [
          {
            name: "Penetration Testing Process",
            source: "Penetration Testing Process",
          },
          {
            name: "Vulnerability Assessment",
            source: "Vulnerability Assessment",
          },
          { name: "Incident Handling", source: "Security Incident Reporting" },
          { name: "Pentest Reporting", source: "Pentest in a Nutshell" },
          { name: "Fundamentos de IA", source: "Fundamentals of AI" },
        ],
      },
    ],
    education: [
      {
        id: 1,
        title: "Jr Penetration Tester Learning Path",
        institution: "TryHackMe",
        period: "2023",
        certificate: "/certificates/JPTLP.webp",
        courseUrl: "https://tryhackme.com/path/outline/jrpenetrationtester",
      },
      {
        id: 2,
        title: "Web Fundamentals Learning Path",
        institution: "TryHackMe",
        period: "2023",
        certificate: "/certificates/WFLP.webp",
        courseUrl: "https://tryhackme.com/path/outline/web",
      },
      {
        id: 3,
        title: "Complete Beginner Learning Path",
        institution: "TryHackMe",
        period: "2023",
        certificate: "/certificates/CBLP.webp",
        courseUrl: "https://tryhackme.com/path/outline/presecurity",
      },
      {
        id: 4,
        title: "Pre Security Learning Path",
        institution: "TryHackMe",
        period: "2023",
        certificate: "/certificates/PSLP.webp",
        courseUrl: "https://tryhackme.com/path/outline/presecurity",
      },
      {
        id: 5,
        title: "Introduction to Cyber Security Learning Path",
        institution: "TryHackMe",
        period: "2023",
        certificate: "/certificates/ICSLP.webp",
        courseUrl:
          "https://tryhackme.com/module/introduction-to-cyber-security",
      },
      {
        id: 6,
        title: "Python Ofensivo",
        institution: "Hack4u",
        period: "2023",
        certificate: "/certificates/PO.webp",
        courseUrl: "https://hack4u.io/curso/python-ofensivo",
      },
      {
        id: 7,
        title: "Introducción al Hacking",
        institution: "Hack4u",
        period: "2023",
        certificate: "/certificates/IH.webp",
        courseUrl: "https://hack4u.io/curso/introduccion-al-hacking",
      },
      {
        id: 8,
        title: "Introducción a Linux",
        institution: "Hack4u",
        period: "2023",
        certificate: "/certificates/IL.webp",
        courseUrl: "https://hack4u.io/curso/introduccion-a-linux",
      },
      {
        id: 9,
        title: "TestOut PC Pro",
        institution: "TestOut Corporation",
        period: "2024",
        certificate: "/certificates/TOPCP.webp",
        courseUrl: "https://www.comptia.org/en-us/certifications/pc-pro/",
      },
      {
        id: 10,
        title: "TestOut Client Pro",
        institution: "TestOut Corporation",
        period: "2024",
        certificate: "/certificates/TOCP.webp",
        courseUrl:
          "https://www.comptia.org/en-us/certifications/windows-client-pro/",
      },
      {
        id: 11,
        title: "Introduction to Cybersecurity",
        institution:
          "Networking Academy through the Cisco Networking Academy program",
        period: "2026",
        certificate: "/certificates/ITC.webp",
        courseUrl:
          "https://www.netacad.com/courses/introduction-to-cybersecurity?courseLang=en-US",
      },
      {
        id: 12,
        title: "Ethical Hacker",
        institution:
          "Networking Academy through the Cisco Networking Academy program",
        period: "2026",
        certificate: "/certificates/EH.webp",
        courseUrl:
          "https://www.netacad.com/courses/ethical-hacker?courseLang=en-US",
      },
      {
        id: 13,
        title: "Network Basics",
        institution:
          "Networking Academy through the Cisco Networking Academy program",
        period: "2026",
        certificate: "/certificates/NB.webp",
        courseUrl:
          "https://www.netacad.com/courses/networking-basics?courseLang=en-US",
      },
    ],
  },

  en: {
    name: "Esteban Zárate",
    role: "Cybersecurity Analyst",
    description:
      "Since 2021, I've been studying programming and developing an interest in cybersecurity through the Hack The Box and TryHackMe academies. I have knowledge of JavaScript, Python, SQL, and NoSQL databases. I enjoy practicing on CTF and coding platforms such as Hack The Box, TryHackMe, and HackerRank. Since then, I've been looking for my first opportunity in either software development or cybersecurity.",
    location: "Buenos Aires, Argentina",
    links: {
      github: "https://github.com/estebanzarate",
      linkedin: "https://www.linkedin.com/in/esteban-zarate",
      htb: "https://app.hackthebox.com/users/1089152",
      thm: "https://tryhackme.com/p/no0funny",
      email: "mailto:estebanzarateok@gmail.com",
      blog: "https://no0funny.vercel.app",
    },
    experience: [
      {
        id: 1,
        role: "Cybersecurity Learner & CTF Player",
        company: "",
        period: "2022 — Present",
        description:
          "I regularly practice by solving machines on CTF platforms and documenting my write-ups on my personal blog.",
        tags: ["Pentesting", "Web Security", "CTF"],
      },
    ],
    skills: [
      {
        category: "Pentesting & Exploitation",
        color: "danger",
        items: [
          {
            name: "Metasploit Framework",
            source: "Using the Metasploit Framework",
          },
          {
            name: "Privilege Escalation (Linux)",
            source: "Linux Privilege Escalation",
          },
          {
            name: "Privilege Escalation (Windows)",
            source: "Windows Privilege Escalation",
          },
          {
            name: "Buffer Overflows (Linux x86)",
            source: "Stack-Based Buffer Overflows on Linux x86",
          },
          {
            name: "Buffer Overflows (Windows x86)",
            source: "Stack-Based Buffer Overflows on Windows x86",
          },
          { name: "Shells & Payloads", source: "Shells & Payloads" },
          { name: "Password Attacks", source: "Password Attacks" },
          { name: "Login Brute Forcing", source: "Login Brute Forcing" },
          {
            name: "Pivoting & Tunneling",
            source: "Pivoting, Tunneling, and Port Forwarding",
          },
          {
            name: "Attacking Common Services",
            source: "Attacking Common Services",
          },
          {
            name: "Attacking Common Applications",
            source: "Attacking Common Applications",
          },
        ],
      },
      {
        category: "Web Security",
        color: "warning",
        items: [
          { name: "SQL Injection", source: "SQL Injection Fundamentals" },
          { name: "File Inclusion (LFI/RFI)", source: "File Inclusion" },
          {
            name: "Web Fuzzing",
            source: "Attacking Web Applications with Ffuf / Web Fuzzing",
          },
          {
            name: "JavaScript Deobfuscation",
            source: "JavaScript Deobfuscation",
          },
          { name: "WordPress Hacking", source: "Hacking WordPress" },
          {
            name: "Web Information Gathering",
            source: "Information Gathering - Web Edition",
          },
          { name: "Web Requests & HTTP", source: "Web Requests" },
          { name: "Bug Bounty Process", source: "Bug Bounty Hunting Process" },
        ],
      },
      {
        category: "Networks & Reconnaissance",
        color: "info",
        items: [
          { name: "Nmap", source: "Network Enumeration with Nmap" },
          {
            name: "Network Traffic Analysis",
            source: "Intro to Network Traffic Analysis",
          },
          { name: "Footprinting", source: "Footprinting" },
          { name: "DNS Enumeration", source: "DNS Enumeration Using Python" },
          { name: "File Transfers", source: "File Transfers" },
          {
            name: "Networking Fundamentals",
            source: "Introduction to Networking / Network Foundations",
          },
        ],
      },
      {
        category: "Operating Systems",
        color: "success",
        items: [
          { name: "Linux", source: "Linux Fundamentals" },
          { name: "Windows", source: "Windows Fundamentals" },
          { name: "macOS", source: "MacOS Fundamentals" },
          { name: "Bash Scripting", source: "Introduction to Bash Scripting" },
          {
            name: "Windows CLI & PowerShell",
            source: "Introduction to Windows Command Line",
          },
          {
            name: "Active Directory",
            source: "Introduction to Active Directory",
          },
        ],
      },
      {
        category: "Programming & Scripting",
        color: "primary",
        items: [
          {
            name: "Python 3",
            source: "Introduction to Python 3 / DNS Enumeration Using Python",
          },
          {
            name: "JavaScript",
            source: "JavaScript Deobfuscation / Secure Coding 101",
          },
          { name: "C#", source: "Introduction to C#" },
          { name: "Bash", source: "Introduction to Bash Scripting" },
        ],
      },
      {
        category: "Methodology & Process",
        color: "secondary",
        items: [
          {
            name: "Penetration Testing Process",
            source: "Penetration Testing Process",
          },
          {
            name: "Vulnerability Assessment",
            source: "Vulnerability Assessment",
          },
          { name: "Incident Handling", source: "Security Incident Reporting" },
          { name: "Pentest Reporting", source: "Pentest in a Nutshell" },
          { name: "AI Fundamentals", source: "Fundamentals of AI" },
        ],
      },
    ],
    education: [
      {
        id: 1,
        title: "Jr Penetration Tester Learning Path",
        institution: "TryHackMe",
        period: "2023",
        certificate: "/certificates/JPTLP.webp",
        courseUrl: "https://tryhackme.com/path/outline/jrpenetrationtester",
      },
      {
        id: 2,
        title: "Web Fundamentals Learning Path",
        institution: "TryHackMe",
        period: "2023",
        certificate: "/certificates/WFLP.webp",
        courseUrl: "https://tryhackme.com/path/outline/web",
      },
      {
        id: 3,
        title: "Complete Beginner Learning Path",
        institution: "TryHackMe",
        period: "2023",
        certificate: "/certificates/CBLP.webp",
        courseUrl: "https://tryhackme.com/path/outline/presecurity",
      },
      {
        id: 4,
        title: "Pre Security Learning Path",
        institution: "TryHackMe",
        period: "2023",
        certificate: "/certificates/PSLP.webp",
        courseUrl: "https://tryhackme.com/path/outline/presecurity",
      },
      {
        id: 5,
        title: "Introduction to Cyber Security Learning Path",
        institution: "TryHackMe",
        period: "2023",
        certificate: "/certificates/ICSLP.webp",
        courseUrl:
          "https://tryhackme.com/module/introduction-to-cyber-security",
      },
      {
        id: 6,
        title: "Offensive Python",
        institution: "Hack4u",
        period: "2023",
        certificate: "/certificates/PO.webp",
        courseUrl: "https://hack4u.io/curso/python-ofensivo",
      },
      {
        id: 7,
        title: "Introduction to Hacking",
        institution: "Hack4u",
        period: "2023",
        certificate: "/certificates/IH.webp",
        courseUrl: "https://hack4u.io/curso/introduccion-al-hacking",
      },
      {
        id: 8,
        title: "Introduction to Linux",
        institution: "Hack4u",
        period: "2023",
        certificate: "/certificates/IL.webp",
        courseUrl: "https://hack4u.io/curso/introduccion-a-linux",
      },
      {
        id: 9,
        title: "TestOut PC Pro",
        institution: "TestOut Corporation",
        period: "2024",
        certificate: "/certificates/TOPCP.webp",
        courseUrl: "https://www.comptia.org/en-us/certifications/pc-pro/",
      },
      {
        id: 10,
        title: "TestOut Client Pro",
        institution: "TestOut Corporation",
        period: "2024",
        certificate: "/certificates/TOCP.webp",
        courseUrl:
          "https://www.comptia.org/en-us/certifications/windows-client-pro/",
      },
      {
        id: 11,
        title: "Introduction to Cybersecurity",
        institution:
          "Networking Academy through the Cisco Networking Academy program",
        period: "2026",
        certificate: "/certificates/ITC.webp",
        courseUrl:
          "https://www.netacad.com/courses/introduction-to-cybersecurity?courseLang=en-US",
      },
      {
        id: 12,
        title: "Ethical Hacker",
        institution:
          "Networking Academy through the Cisco Networking Academy program",
        period: "2026",
        certificate: "/certificates/EH.webp",
        courseUrl:
          "https://www.netacad.com/courses/ethical-hacker?courseLang=en-US",
      },
      {
        id: 13,
        title: "Network Basics",
        institution:
          "Networking Academy through the Cisco Networking Academy program",
        period: "2026",
        certificate: "/certificates/NB.webp",
        courseUrl:
          "https://www.netacad.com/courses/networking-basics?courseLang=en-US",
      },
    ],
  },
};

export default profile;
