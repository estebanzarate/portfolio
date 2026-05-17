import useLanguage from '../hooks/useLanguage'
import profile from '../data/profile.js'
import translations from '../data/translations'

function Skills() {
  const { lang } = useLanguage()
  const p = profile[lang]
  const t = translations[lang].skills

  return (
    <section id="skills" className="flex flex-col gap-6 scroll-mt-20">
      <div className="border-l-4 border-primary pl-4">
        <h2 className="text-2xl font-bold text-light">
          {t.title} <span className="text-primary">{t.subtitle}</span>
        </h2>
        <p className="text-secondary text-sm mt-1">{t.source}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {p.skills.map(group => (
          <div
            key={group.category}
            className="flex flex-col gap-3 p-5 rounded-lg bg-surface border border-surface2"
          >
            <h3 className="text-xs font-semibold uppercase tracking-wider text-primary">
              {group.category}
            </h3>
            <div className="flex flex-wrap gap-2">
              {group.items.map(skill => (
                <span
                  key={skill.name}
                  title={skill.source}
                  className="px-2.5 py-1 rounded border text-xs font-medium cursor-default bg-surface2 border-surface2 text-secondary hover:border-primary/40 hover:text-light transition-colors"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Skills