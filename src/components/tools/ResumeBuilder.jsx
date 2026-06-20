import React, { useEffect, useMemo, useState } from 'react'
import { v4 as uuid } from 'uuid'
import { EMPTY_RESUME, SAMPLE_RESUME, loadResume, saveResume, clearStoredResume } from '../../utils/resume.js'
import DownloadButton from '../shared/DownloadButton.jsx'

function makeId(prefix) {
  return `${prefix}-${uuid().slice(0, 8)}`
}

export default function ResumeBuilder() {
  const [resume, setResume] = useState(() => loadResume())
  const [skillInput, setSkillInput] = useState('')

  // Print stylesheet (clean A4 resume) only applies while this page is mounted.
  // Without this scope, printing any other tool would also hide its form.
  useEffect(() => {
    document.body.classList.add('resume-print')
    return () => document.body.classList.remove('resume-print')
  }, [])

  // Persist on every change
  useEffect(() => {
    saveResume(resume)
  }, [resume])

  function updatePersonal(field, value) {
    setResume((r) => ({ ...r, personal: { ...r.personal, [field]: value } }))
  }

  function addExperience() {
    setResume((r) => ({
      ...r,
      experience: [...r.experience, { id: makeId('exp'), company: '', role: '', from: '', to: '', bullets: '' }],
    }))
  }

  function updateExperience(id, field, value) {
    setResume((r) => ({
      ...r,
      experience: r.experience.map((e) => (e.id === id ? { ...e, [field]: value } : e)),
    }))
  }

  function removeExperience(id) {
    setResume((r) => ({ ...r, experience: r.experience.filter((e) => e.id !== id) }))
  }

  function addEducation() {
    setResume((r) => ({
      ...r,
      education: [...r.education, { id: makeId('edu'), school: '', degree: '', from: '', to: '', details: '' }],
    }))
  }

  function updateEducation(id, field, value) {
    setResume((r) => ({
      ...r,
      education: r.education.map((e) => (e.id === id ? { ...e, [field]: value } : e)),
    }))
  }

  function removeEducation(id) {
    setResume((r) => ({ ...r, education: r.education.filter((e) => e.id !== id) }))
  }

  function addSkill(raw) {
    const s = raw.trim()
    if (!s) return
    setResume((r) => (r.skills.includes(s) ? r : { ...r, skills: [...r.skills, s] }))
  }

  function addSkillFromInput() {
    addSkill(skillInput)
    setSkillInput('')
  }

  function removeSkill(s) {
    setResume((r) => ({ ...r, skills: r.skills.filter((x) => x !== s) }))
  }

  function handlePrint() {
    window.print()
  }

  function loadSample() {
    // Re-mint IDs so clicking Load Sample twice doesn't produce two entries
    // with the same React key (`exp-1`, `edu-1`).
    const remint = (items, prefix) => items.map((it) => ({ ...it, id: makeId(prefix) }))
    setResume({
      ...SAMPLE_RESUME,
      experience: remint(SAMPLE_RESUME.experience, 'exp'),
      education: remint(SAMPLE_RESUME.education, 'edu'),
    })
  }

  function handleReset() {
    if (!window.confirm('Clear all resume data?')) return
    setResume(EMPTY_RESUME)
    clearStoredResume()
  }

  const hasName = resume.personal.name.trim().length > 0
  // Memoize so we don't re-stringify + re-allocate a Blob on every render.
  const jsonBlob = useMemo(
    () => new Blob([JSON.stringify(resume, null, 2)], { type: 'application/json' }),
    [resume]
  )

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
      {/* FORM */}
      <section className="space-y-4 print:hidden" aria-label="Resume editor">
        <div className="flex flex-wrap gap-2">
          <button onClick={loadSample} className="btn-secondary flex-1 sm:flex-none">Load Sample</button>
          <button onClick={handlePrint} className="btn-primary flex-1 sm:flex-none bg-gradient-to-r from-pink-500 to-rose-600 shadow-pink-500/30 hover:shadow-pink-500/40">Print to PDF</button>
          <DownloadButton
            getBlob={() => jsonBlob}
            filename={`${(resume.personal.name || 'resume').toLowerCase().replace(/\s+/g, '-')}.json`}
            label="Export JSON"
            className="bg-gradient-to-r from-pink-500 to-rose-600"
          />
          <button onClick={handleReset} className="btn-secondary flex-1 sm:flex-none">Clear</button>
        </div>

        {/* Personal */}
        <div className="card p-5 sm:p-6">
          <h2 className="text-base font-bold text-slate-900 mb-4">Personal</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input className="input-field" placeholder="Full name" value={resume.personal.name} onChange={(e) => updatePersonal('name', e.target.value)} />
            <input className="input-field" placeholder="Title (e.g. Software Engineer)" value={resume.personal.title} onChange={(e) => updatePersonal('title', e.target.value)} />
            <input className="input-field" type="email" placeholder="Email" value={resume.personal.email} onChange={(e) => updatePersonal('email', e.target.value)} />
            <input className="input-field" placeholder="Phone" value={resume.personal.phone} onChange={(e) => updatePersonal('phone', e.target.value)} />
            <input className="input-field" placeholder="Location" value={resume.personal.location} onChange={(e) => updatePersonal('location', e.target.value)} />
            <input className="input-field" placeholder="Links (github, linkedin, …)" value={resume.personal.links} onChange={(e) => updatePersonal('links', e.target.value)} />
          </div>
        </div>

        {/* Summary */}
        <div className="card p-5 sm:p-6">
          <h2 className="text-base font-bold text-slate-900 mb-4">Summary</h2>
          <textarea className="input-field resize-y" rows={3} placeholder="A short professional summary…" value={resume.summary} onChange={(e) => setResume((r) => ({ ...r, summary: e.target.value }))} />
        </div>

        {/* Experience */}
        <div className="card p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900">Experience</h2>
            <button onClick={addExperience} className="text-xs font-bold text-brand-600 hover:text-brand-700">+ Add</button>
          </div>
          {resume.experience.length === 0 && <p className="text-sm text-slate-500 italic">No experience yet.</p>}
          {resume.experience.map((e) => (
            <div key={e.id} className="border-t border-slate-200 pt-4 mt-4 first:border-t-0 first:pt-0 first:mt-0 space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input className="input-field" placeholder="Role / title" value={e.role} onChange={(ev) => updateExperience(e.id, 'role', ev.target.value)} />
                <input className="input-field" placeholder="Company" value={e.company} onChange={(ev) => updateExperience(e.id, 'company', ev.target.value)} />
                <input className="input-field" placeholder="From (year)" value={e.from} onChange={(ev) => updateExperience(e.id, 'from', ev.target.value)} />
                <input className="input-field" placeholder="To (year or 'Present')" value={e.to} onChange={(ev) => updateExperience(e.id, 'to', ev.target.value)} />
              </div>
              <textarea className="input-field resize-y" rows={3} placeholder="Key achievements (one per line)" value={e.bullets} onChange={(ev) => updateExperience(e.id, 'bullets', ev.target.value)} />
              <button onClick={() => removeExperience(e.id)} className="text-xs font-semibold text-red-600 hover:text-red-700">Remove</button>
            </div>
          ))}
        </div>

        {/* Education */}
        <div className="card p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900">Education</h2>
            <button onClick={addEducation} className="text-xs font-bold text-brand-600 hover:text-brand-700">+ Add</button>
          </div>
          {resume.education.length === 0 && <p className="text-sm text-slate-500 italic">No education yet.</p>}
          {resume.education.map((ed) => (
            <div key={ed.id} className="border-t border-slate-200 pt-4 mt-4 first:border-t-0 first:pt-0 first:mt-0 space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input className="input-field" placeholder="School" value={ed.school} onChange={(ev) => updateEducation(ed.id, 'school', ev.target.value)} />
                <input className="input-field" placeholder="Degree" value={ed.degree} onChange={(ev) => updateEducation(ed.id, 'degree', ev.target.value)} />
                <input className="input-field" placeholder="From" value={ed.from} onChange={(ev) => updateEducation(ed.id, 'from', ev.target.value)} />
                <input className="input-field" placeholder="To" value={ed.to} onChange={(ev) => updateEducation(ed.id, 'to', ev.target.value)} />
              </div>
              <input className="input-field" placeholder="Details (CGPA, honors, …)" value={ed.details} onChange={(ev) => updateEducation(ed.id, 'details', ev.target.value)} />
              <button onClick={() => removeEducation(ed.id)} className="text-xs font-semibold text-red-600 hover:text-red-700">Remove</button>
            </div>
          ))}
        </div>

        {/* Skills */}
        <div className="card p-5 sm:p-6">
          <h2 className="text-base font-bold text-slate-900 mb-4">Skills</h2>
          <div className="flex gap-2 mb-3">
            <input className="input-field flex-1" placeholder="Add a skill and press Enter" value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkillFromInput() } }} />
            <button onClick={addSkillFromInput} className="px-4 py-3 text-sm font-bold text-white bg-gradient-to-r from-pink-500 to-rose-600 rounded-xl hover:shadow-lg transition-all">Add</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {resume.skills.map((s) => (
              <span key={s} className="inline-flex items-center gap-1.5 px-3 py-1 text-sm font-medium bg-pink-50 text-pink-700 rounded-full">
                {s}
                <button onClick={() => removeSkill(s)} className="hover:text-pink-900" aria-label={`Remove ${s}`}>×</button>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* LIVE PREVIEW */}
      <section aria-label="Resume preview" className="bg-white rounded-2xl shadow-card p-6 sm:p-8 text-slate-900 print:shadow-none print:p-0 print:max-w-full">
        {hasName ? (
          <div className="space-y-5">
            <header className="border-b-2 border-slate-200 pb-4">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{resume.personal.name}</h1>
              {resume.personal.title && <p className="text-sm text-slate-600 mt-1">{resume.personal.title}</p>}
              <p className="text-xs text-slate-600 mt-2 flex flex-wrap gap-x-2">
                {[resume.personal.email, resume.personal.phone, resume.personal.location, resume.personal.links]
                  .filter(Boolean).join(' • ')}
              </p>
            </header>

            {resume.summary && (
              <section>
                <h2 className="text-sm font-bold uppercase tracking-widest text-slate-700 mb-1">Summary</h2>
                <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-line">{resume.summary}</p>
              </section>
            )}

            {resume.experience.length > 0 && (
              <section>
                <h2 className="text-sm font-bold uppercase tracking-widest text-slate-700 mb-2">Experience</h2>
                {resume.experience.map((e) => (
                  <div key={e.id} className="mb-3 last:mb-0">
                    <div className="flex justify-between items-baseline">
                      <p className="text-sm font-bold">{e.role}{e.company ? ` — ${e.company}` : ''}</p>
                      <p className="text-xs text-slate-600">{[e.from, e.to].filter(Boolean).join(' – ')}</p>
                    </div>
                    {e.bullets && (
                      <ul className="list-disc list-inside text-sm text-slate-800 mt-1 space-y-0.5">
                        {e.bullets.split('\n').filter(Boolean).map((b, i) => <li key={i}>{b}</li>)}
                      </ul>
                    )}
                  </div>
                ))}
              </section>
            )}

            {resume.education.length > 0 && (
              <section>
                <h2 className="text-sm font-bold uppercase tracking-widest text-slate-700 mb-2">Education</h2>
                {resume.education.map((ed) => (
                  <div key={ed.id} className="mb-2 last:mb-0">
                    <div className="flex justify-between items-baseline">
                      <p className="text-sm font-bold">{ed.school}</p>
                      <p className="text-xs text-slate-600">{[ed.from, ed.to].filter(Boolean).join(' – ')}</p>
                    </div>
                    {ed.degree && <p className="text-sm text-slate-800">{ed.degree}</p>}
                    {ed.details && <p className="text-xs text-slate-600">{ed.details}</p>}
                  </div>
                ))}
              </section>
            )}

            {resume.skills.length > 0 && (
              <section>
                <h2 className="text-sm font-bold uppercase tracking-widest text-slate-700 mb-1">Skills</h2>
                <p className="text-sm text-slate-800">{resume.skills.join(' • ')}</p>
              </section>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-400 text-sm">Fill in the form to see a live preview here.</p>
          </div>
        )}
      </section>
    </div>
  )
}