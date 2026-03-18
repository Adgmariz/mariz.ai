'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'mariz-lang'

const t = {
  pt: {
    siteTitle: 'Mariz AI',
    hello: 'Olá, meu nome é',
    name: 'Alexis Mariz!',
    storyTitle: 'Minha história',
    story1:
      'Formado em Ciência da Computação pela Universidade Federal de Minas Gerais, carrego com orgulho a bagagem de uma formação que valoriza rigor acadêmico e pensamento crítico. Essa foto registra um daqueles momentos que marcam: a formatura, o diploma na mão e a sensação de dever cumprido. Foram muitos desafios, uma pandemia e o principal aprendizado: como aprender a aprender.',
    story2:
      'Desde a faculdade me dedico à Inteligência Artificial, agentes e programação com IA. Hoje estou numa jornada de empreendedorismo, levando esse conhecimento para projetos reais e ajudando a construir o futuro com tecnologia.',
    projectsTitle: 'Projetos',
    projectsIntro: 'Abaixo está uma lista não exaustiva dos meus projetos.',
    projectsEmpty: 'Em breve, novos projetos serão listados aqui.',
    nr1Name: 'NR1 Riscos Psicossociais',
    nr1Desc:
      'Sistema para aplicação de questionários de análise de riscos psicossociais, em conformidade com a NR-1.',
    vibeflowDesc:
      'App para vibecoders que bloqueia distrações no iPhone e libera automaticamente quando você programa com Cursor ou Claude Code.',
  },
  en: {
    siteTitle: 'Mariz AI',
    hello: "Hi, I'm",
    name: 'Alexis Mariz!',
    storyTitle: 'My story',
    story1:
      'I have a degree in Computer Science from Universidade Federal de Minas Gerais, and I carry the pride of a education that values academic rigor and critical thinking. This photo captures one of those defining moments: graduation, diploma in hand, and the feeling of mission accomplished. There were many challenges, a pandemic, and the main lesson: how to learn to learn.',
    story2:
      'Since university I have been dedicated to Artificial Intelligence, agents, and programming with AI. Today I am on an entrepreneurial journey, taking this knowledge to real projects and helping to build the future with technology.',
    projectsTitle: 'Projects',
    projectsIntro: 'Below is a non-exhaustive list of my projects.',
    projectsEmpty: 'New projects will be listed here soon.',
    nr1Name: 'NR1 Riscos Psicossociais',
    nr1Desc:
      'System for applying psychosocial risk analysis questionnaires, in compliance with NR-1, a Brazilian regulation for occupational health and safety in the workplace.',
    vibeflowDesc:
      'App for vibecoders that blocks distractions on iPhone and unlocks automatically when you code with Cursor or Claude Code.',
  },
} as const

type Lang = 'pt' | 'en'

function getStoredLang(): Lang {
  if (typeof window === 'undefined') return 'pt'
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored === 'en' || stored === 'pt' ? stored : 'pt'
  } catch {
    return 'pt'
  }
}

export default function Home() {
  const [lang, setLangState] = useState<Lang>('pt')
  const [mounted, setMounted] = useState(false)

  const setLang = useCallback((next: Lang) => {
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* ignore */
    }
    setLangState(next)
    document.documentElement.lang = next === 'pt' ? 'pt-BR' : 'en'
    document.title = next === 'pt' ? 'Mariz AI' : 'Mariz AI'
  }, [])

  useEffect(() => {
    setLang(getStoredLang())
    setMounted(true)
  }, [setLang])

  const s = t[lang]

  const projetos = [
    {
      nome: s.nr1Name,
      descricao: s.nr1Desc,
      url: 'https://www.nr1riscospsicossociais.com.br/',
    },
    {
      nome: 'VibeFlow',
      descricao: s.vibeflowDesc,
      url: '/vibeflow',
    },
  ]

  return (
    <main className="blog">
      <header className="header">
        <h1 className="site-title">{s.siteTitle}</h1>
        <div className="lang-switcher" role="group" aria-label={lang === 'pt' ? 'Idioma' : 'Language'}>
          <button
            type="button"
            title="Português"
            aria-pressed={mounted && lang === 'pt'}
            className={mounted && lang === 'pt' ? 'active' : ''}
            onClick={() => setLang('pt')}
          >
            🇧🇷
          </button>
          <button
            type="button"
            title="English"
            aria-pressed={mounted && lang === 'en'}
            className={mounted && lang === 'en' ? 'active' : ''}
            onClick={() => setLang('en')}
          >
            🇺🇸
          </button>
        </div>
      </header>

      <article className="article">
        <section className="hero">
          <div className="hero-image-wrapper">
            <Image
              src="/alexis_formatura.jpeg"
              alt={lang === 'pt' ? 'Alexis na formatura' : 'Alexis at graduation'}
              width={600}
              height={800}
              className="hero-image"
              priority
            />
          </div>
          <div className="hero-text">
            <h2>
              {s.hello} <span className="name-inline">{s.name}</span>
            </h2>
            <h3 className="story-title">{s.storyTitle}</h3>
            <p>{s.story1}</p>
            <p>{s.story2}</p>
          </div>
        </section>

        <section className="projects">
          <h2>{s.projectsTitle}</h2>
          <p className="projects-intro">{s.projectsIntro}</p>
          {projetos.length > 0 ? (
            <ul className="project-list">
              {projetos.map((projeto, i) => (
                <li key={i} className="project-item">
                  {projeto.url ? (
                    <Link
                      href={projeto.url}
                      {...(projeto.url.startsWith('http')
                        ? { target: '_blank', rel: 'noopener noreferrer' }
                        : {})}
                    >
                      <strong>{projeto.nome}</strong>
                      {projeto.descricao && (
                        <span className="project-desc"> — {projeto.descricao}</span>
                      )}
                    </Link>
                  ) : (
                    <>
                      <strong>{projeto.nome}</strong>
                      {projeto.descricao && (
                        <span className="project-desc"> — {projeto.descricao}</span>
                      )}
                    </>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="projects-empty">{s.projectsEmpty}</p>
          )}
        </section>
      </article>

      <footer className="footer">
        <p>© {new Date().getFullYear()} Mariz AI</p>
      </footer>
    </main>
  )
}
