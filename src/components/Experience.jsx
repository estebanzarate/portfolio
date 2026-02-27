import profile from '../data/profile.js'

function Experience() {
  return (
    <section id="experience" className="flex flex-col gap-10 scroll-mt-20">

      {/* Experiencia */}
      <div className="flex flex-col gap-6">
        <div className="border-l-4 border-warning pl-4">
          <h2 className="text-2xl font-bold text-light">Experiencia <span className="text-warning">Laboral</span></h2>
        </div>

        <div className="flex flex-col gap-4">
          {profile.experience.map(exp => (
            <div
              key={exp.id}
              className="flex flex-col gap-3 p-5 rounded-lg bg-surface border border-surface2 hover:border-primary/40 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <div>
                  <h3 className="text-light font-semibold text-base">{exp.role}</h3>
                  <p className="text-primary text-sm">{exp.company}</p>
                </div>
                <span className="text-secondary text-xs border border-surface2 px-2 py-1 rounded self-start sm:self-auto">
                  {exp.period}
                </span>
              </div>
              <p className="text-secondary text-sm leading-relaxed">{exp.description}</p>
              <div className="flex flex-wrap gap-2">
                {exp.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded bg-surface2 text-secondary text-xs border border-surface2"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Educación */}
      {/* <div className="flex flex-col gap-6">
        <div className="border-l-4 border-info pl-4">
          <h2 className="text-2xl font-bold text-light">Educación y <span className="text-info">Certificaciones</span></h2>
        </div>

        <div className="flex flex-col gap-3">
          {profile.education.map(edu => (
            <div
              key={edu.id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 p-4 rounded-lg bg-surface border border-surface2 hover:border-info/40 transition-colors"
            >
              <div>
                <h3 className="text-light font-medium text-sm">{edu.title}</h3>
                <p className="text-info text-xs mt-0.5">{edu.institution}</p>
              </div>
              <span className="text-secondary text-xs border border-surface2 px-2 py-1 rounded self-start sm:self-auto">
                {edu.period}
              </span>
            </div>
          ))}
        </div>
      </div> */}

    </section>
  )
}

export default Experience