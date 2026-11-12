with open('src/App.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

skills_marker = '{/* ── 02. TECHNICAL SKILLS ────────────────────────── */}'
projects_marker = '{/* ── 03. SELECTED WORK / PROJECTS (VINYL ALBUM CARDS) ── */}'
exp_marker = '{/* ── 04. EXPERIENCE (VINYL ALBUM CARDS) ─────────────── */}'
edu_marker = '{/* ── 05. EDUCATION & CERTIFICATIONS ─────────────── */}'
contact_marker = '{/* ── 06. CONTACT & ELSEWHERE ────────────────────── */}'

idx_skills = text.find(skills_marker)
idx_projects = text.find(projects_marker)
idx_exp = text.find(exp_marker)
idx_edu = text.find(edu_marker)
idx_contact = text.find(contact_marker)

# 1. Part up to skills
part1 = text[:idx_skills]

# 2. Extract projects part and renumber 03 -> 02
projects_block = text[idx_projects:idx_exp]
projects_block = projects_block.replace('03. SELECTED WORK', '02. SELECTED WORK')
projects_block = projects_block.replace('                      03\n', '                      02\n')

# 3. Extract experience part and renumber 04 -> 03
exp_block = text[idx_exp:idx_edu]
exp_block = exp_block.replace('04. EXPERIENCE', '03. EXPERIENCE')
exp_block = exp_block.replace('                      04\n', '                      03\n')

# 4. Extract education part and renumber 05 -> 04
edu_block = text[idx_edu:idx_contact]
edu_block = edu_block.replace('05. EDUCATION & CERTIFICATIONS', '04. EDUCATION & CERTIFICATIONS')
edu_block = edu_block.replace('                      05\n', '                      04\n')

# 5. Build the new Technical Stack section for position 05 (right before Contact)
skills_section = """{/* ── 05. TECHNICAL STACK (INTERACTIVE 3D SKILLS TREE) ── */}
              <section id="skills" className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start scroll-mt-20">
                {/* Left Header Column (Sticky) */}
                <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-2">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs uppercase tracking-wider text-zinc-500 font-semibold px-2 py-0.5 rounded-md bg-zinc-100 border border-zinc-200/80">
                      05
                    </span>
                    <span className="text-xs uppercase tracking-wider text-zinc-400 font-medium">
                      Expertise
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-900">
                    Technical Stack
                  </h2>
                  <p className="text-sm text-zinc-500 max-w-xs leading-relaxed hidden sm:block">
                    Interactive 3D cuboids dropping from a single straight line. Click and drag any cube to rotate it in 3D.
                  </p>
                </div>

                {/* Right Interactive 3D Skills Tree & Rotatable Cuboids */}
                <div className="lg:col-span-8">
                  <Interactive3DSkillsTree skills={skills} />
                </div>
              </section>

              """

# 6. Part from contact onwards
contact_part = text[idx_contact:]

# Assemble new content
new_text = part1 + projects_block + exp_block + edu_block + skills_section + contact_part

with open('src/App.jsx', 'w', encoding='utf-8') as f:
    f.write(new_text)

print('Updated src/App.jsx successfully')

