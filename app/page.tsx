'use client'

import { IBM_Plex_Mono, Plus_Jakarta_Sans } from 'next/font/google'
import { useCallback, useEffect, useState } from 'react'
import s from './inicio.module.css'

const texto = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'], variable: '--fonte-texto' })
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--fonte-mono' })

const STORAGE_KEY = 'mariz-lang'

const t = {
  pt: {
    titulo: 'Olá, eu sou Alexis Mariz.',
    chamada: 'Cientista da computação pela UFMG. Construo produtos e agentes com inteligência artificial.',
    verProjetos: 'Ver projetos',
    fotoAlt: 'Alexis na formatura',
    legenda: 'Formatura · Ciência da Computação, UFMG',
    historiaRotulo: 'Minha história',
    historiaTitulo: 'Aprender a aprender.',
    historia1:
      'Formado em Ciência da Computação pela Universidade Federal de Minas Gerais, carrego com orgulho a bagagem de uma formação que valoriza rigor acadêmico e pensamento crítico. Essa foto registra um daqueles momentos que marcam: a formatura, o diploma na mão e a sensação de dever cumprido. Foram muitos desafios, uma pandemia e o principal aprendizado: como aprender a aprender.',
    historia2:
      'Desde a faculdade me dedico à Inteligência Artificial, agentes e programação com IA. Hoje estou numa jornada de empreendedorismo, levando esse conhecimento para projetos reais e ajudando a construir o futuro com tecnologia.',
    projetosRotulo: 'Projetos',
    projetosTitulo: 'O que estou construindo',
    nr1Etiqueta: 'SaaS · Saúde ocupacional',
    nr1Desc: 'Sistema para aplicação de questionários de análise de riscos psicossociais, em conformidade com a NR-1.',
    visitar: 'Visitar ↗',
    emBreve: 'Novos projetos em breve',
    idioma: 'Idioma',
  },
  en: {
    titulo: "Hi, I'm Alexis Mariz.",
    chamada: 'Computer scientist from UFMG. I build products and agents with artificial intelligence.',
    verProjetos: 'See projects',
    fotoAlt: 'Alexis at graduation',
    legenda: 'Graduation · Computer Science, UFMG',
    historiaRotulo: 'My story',
    historiaTitulo: 'Learning how to learn.',
    historia1:
      'I have a degree in Computer Science from Universidade Federal de Minas Gerais, and I carry the pride of an education that values academic rigor and critical thinking. This photo captures one of those defining moments: graduation, diploma in hand, and the feeling of mission accomplished. There were many challenges, a pandemic, and the main lesson: how to learn to learn.',
    historia2:
      'Since university I have been dedicated to Artificial Intelligence, agents, and programming with AI. Today I am on an entrepreneurial journey, taking this knowledge to real projects and helping to build the future with technology.',
    projetosRotulo: 'Projects',
    projetosTitulo: "What I'm building",
    nr1Etiqueta: 'SaaS · Occupational health',
    nr1Desc:
      'System for applying psychosocial risk analysis questionnaires, in compliance with NR-1, a Brazilian regulation for occupational health and safety in the workplace.',
    visitar: 'Visit ↗',
    emBreve: 'New projects coming soon',
    idioma: 'Language',
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
  }, [])

  useEffect(() => {
    setLang(getStoredLang())
    setMounted(true)
  }, [setLang])

  const x = t[lang]
  const ativo = (l: Lang) => (mounted && lang === l ? s.ativo : '')

  return (
    <main className={`${s.pagina} ${texto.variable} ${mono.variable}`}>
      <div className={s.topo}>
        <div className={s.largura}>
          <header className={s.cabecalho}>
            <div className={s.marca}>
              <img src="/icone-claro.svg" alt="" width={40} height={40} />
              Mariz AI
            </div>
            <div className={s.idiomas} role="group" aria-label={x.idioma}>
              <button type="button" className={ativo('pt')} aria-pressed={mounted && lang === 'pt'} onClick={() => setLang('pt')}>
                PT
              </button>
              <button type="button" className={ativo('en')} aria-pressed={mounted && lang === 'en'} onClick={() => setLang('en')}>
                EN
              </button>
            </div>
          </header>

          <section className={s.hero}>
            <div>
              <h1>{x.titulo}</h1>
              <p className={s.chamada}>{x.chamada}</p>
              <div className={s.botoes}>
                <a className={s.botao} href="#projetos">
                  {x.verProjetos}
                </a>
              </div>
            </div>
            <figure className={s.polaroid}>
              <img src="/alexis_formatura.jpeg" alt={x.fotoAlt} />
              <figcaption>{x.legenda}</figcaption>
            </figure>
          </section>
        </div>
      </div>

      <div className={s.largura}>
        <section className={s.historia}>
          <div>
            <div className={s.rotulo}>{x.historiaRotulo}</div>
            <h2 className={s.titulo}>{x.historiaTitulo}</h2>
          </div>
          <div>
            <p>{x.historia1}</p>
            <p>{x.historia2}</p>
          </div>
        </section>
      </div>

      <section className={s.projetos} id="projetos">
        <div className={s.largura}>
          <div className={s.rotulo}>{x.projetosRotulo}</div>
          <h2 className={s.titulo}>{x.projetosTitulo}</h2>
          <div className={s.grade}>
            <a className={s.cartao} href="https://www.nr1riscospsicossociais.com.br/" target="_blank" rel="noopener noreferrer">
              <span className={s.etiqueta}>{x.nr1Etiqueta}</span>
              <strong>NR1 Riscos Psicossociais</strong>
              <p>{x.nr1Desc}</p>
              <span className={s.visitar}>{x.visitar}</span>
            </a>
            <div className={s.embreve}>{x.emBreve}</div>
          </div>
        </div>
      </section>

      <footer className={s.rodape}>
        <div className={s.largura}>
          <div className={s.marca}>
            <img src="/logo.svg" alt="" width={34} height={34} />
            Mariz AI
          </div>
          <span>
            © {new Date().getFullYear()} · MARIZ TECNOLOGIA E INTELIGENCIA ARTIFICIAL LTDA · CNPJ 65.123.113/0001-20
          </span>
        </div>
      </footer>
    </main>
  )
}
