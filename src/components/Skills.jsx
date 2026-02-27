import useLanguage from '../hooks/useLanguage'
import profileES from '../data/profile.js'
import profileEN from '../data/profile.en.js'
import translations from '../data/translations'

const colorMap = {
  danger: { border: 'border-danger/40', label: 'text-danger', tag: 'bg-danger/10 border-danger/30 text-danger' },
  warning: { border: 'border-warning/40', label: 'text-warning', tag: 'bg-warning/10 border-warning/30 text-warning' },
  info: { border: 'border-info/40', label: 'text-info', tag: 'bg-info/10 border-info/30 text-info' },
  success: { border: 'border-success/40', label: 'text-success', tag: 'bg-success/10 border-success/30 text-success' },
  primary: { border: 'border-primary/40', label: 'text-primary', tag: 'bg-primary/10 border-primary/30 text-primary' },
  secondary: { border: 'border-secondary/40', label: 'text-secondary', tag: 'bg-surface2 border-surface2 text-secondary' },
}

function Skills() {
  const { lang } = useLanguage()
  const profile = lang === 'es' ? profileES : profileEN
  const t = translations[lang].skills

  return (
    <section id="skills" className="flex flex-col gap-6 scroll-mt-20">

      <div className="border-l-4 border-secondary pl-4">
        <h2 className="text-2xl font-bold text-light">
          {t.title} <span className="text-secondary">{t.subtitle}</span>
        </h2>
        <p className="text-secondary text-sm mt-1">{t.source}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {profile.skills.map(group => {
          const colors = colorMap[group.color] ?? colorMap.secondary
          return (
            <div
              key={group.category}
              className={`flex flex-col gap-3 p-5 rounded-lg bg-surface border ${colors.border}`}
            >
              <h3 className={`text-xs font-semibold uppercase tracking-wider ${colors.label}`}>
                {group.category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {group.items.map(skill => (
                  <span
                    key={skill.name}
                    title={skill.source}
                    className={`px-2.5 py-1 rounded border text-xs font-medium cursor-default ${colors.tag}`}
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          )
        })}
      </div>

    </section>
  )
}

export default Skills