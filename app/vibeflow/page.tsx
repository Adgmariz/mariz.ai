'use client'

import { useCallback, useEffect, useState } from 'react'
import styles from './vibeflow.module.css'

const STORAGE_KEY = 'vibeflow-lang'

const t = {
  en: {
    logoTag: 'Block the apps that suck your attention on iPhone.',
    logoByline: 'To vibecoders by vibecoders',
    headline: 'Less brainrot. Get in the flow!',
    tagline:
      "Unlocks apps when you put AI to work in Cursor or Claude Code — and blocks them again when it's done. Automatically.",
    formIntro: 'Get notified at launch. Early access for those who join the list.',
    emailPlaceholder: 'you@email.com',
    submitBtn: 'Notify me',
    submitting: 'Sending…',
    howItWorks: 'How it works',
    step1:
      'On iPhone, you choose which apps (the brainrot) to block and when — once.',
    step2:
      'When you send a prompt in Cursor or Claude Code, Vibeflow detects it and notifies the app.',
    step3:
      'Apps unlock right away. When AI finishes, the block comes back so you can get back to the flow!',
    footer: 'One email, on launch day. No spam, no commitment.',
    errorEmail: 'Enter your email.',
    successMsg: "You're on the list!",
    errorGeneric: 'Something went wrong. Try again.',
    errorNetwork: 'Connection error. Check the API URL or try later.',
  },
  pt: {
    logoTag: 'Bloqueie os apps que sugam sua atenção no iPhone.',
    logoByline: 'Para vibecoders, por vibecoders',
    headline: 'Menos brainrot. Entre no Flow!',
    tagline:
      'Libera os apps na hora em que você coloca a IA para trabalhar no Cursor ou no Claude Code — e bloqueia de volta quando ela termina. Automaticamente.',
    formIntro: 'Seja avisado no lançamento. Acesso antecipado para quem entra na lista.',
    emailPlaceholder: 'seu@email.com',
    submitBtn: 'Quero ser avisado',
    submitting: 'Enviando…',
    howItWorks: 'Como funciona',
    step1:
      'No iPhone, você escolhe quais apps (o brainrot) bloquear e em quais horários — uma vez só.',
    step2:
      'Quando você manda um prompt no Cursor ou Claude Code, o Vibeflow detecta e avisa o app.',
    step3:
      'Os apps liberam na hora. Quando a IA termina, o bloqueio volta sozinho para você voltar para o Flow!',
    footer: 'Um e-mail só, no dia do lançamento. Sem spam, sem compromisso.',
    errorEmail: 'Digite seu e-mail.',
    successMsg: 'Inscrito com sucesso!',
    errorGeneric: 'Algo deu errado. Tente de novo.',
    errorNetwork: 'Erro de conexão. Verifique a URL da API ou tente depois.',
  },
} as const

type Lang = 'en' | 'pt'

function getStoredLang(): Lang {
  if (typeof window === 'undefined') return 'en'
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored === 'pt' || stored === 'en' ? stored : 'en'
  } catch {
    return 'en'
  }
}

export default function VibeflowPage() {
  const [lang, setLangState] = useState<Lang>('en')
  const [mounted, setMounted] = useState(false)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' as '' | 'error' | 'success' })

  const s = t[lang]

  const setLang = useCallback((next: Lang) => {
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* ignore */
    }
    setLangState(next)
    document.documentElement.lang = next === 'pt' ? 'pt-BR' : 'en'
    document.title =
      next === 'pt' ? 'Vibeflow — Menos brainrot, mais fluxo' : 'Vibeflow — Less brainrot, more flow'
  }, [])

  useEffect(() => {
    setLang(getStoredLang())
    setMounted(true)
  }, [setLang])

  const apiBase =
    typeof window !== 'undefined'
      ? (window as unknown as { VIBEFLOW_API?: string; VIBEBLOCK_API?: string }).VIBEFLOW_API ||
        (window as unknown as { VIBEBLOCK_API?: string }).VIBEBLOCK_API ||
        process.env.NEXT_PUBLIC_VIBEFLOW_API ||
        ''
      : ''

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = email.trim()
    if (!trimmed) {
      setMessage({ text: s.errorEmail, type: 'error' })
      return
    }
    setMessage({ text: '', type: '' })
    setLoading(true)
    try {
      const res = await fetch(`${apiBase}/waitlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed }),
      })
      const data = (await res.json().catch(() => ({}))) as { message?: string }
      if (res.ok) {
        setMessage({ text: data.message || s.successMsg, type: 'success' })
        setEmail('')
      } else {
        setMessage({ text: data.message || s.errorGeneric, type: 'error' })
      }
    } catch {
      setMessage({ text: s.errorNetwork, type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const msgClass =
    message.type === 'error'
      ? `${styles.formMessage} ${styles.formMessageError}`
      : message.type === 'success'
        ? `${styles.formMessage} ${styles.formMessageSuccess}`
        : styles.formMessage

  return (
    <div className={styles.root}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Vibeflow',
            description:
              'Block distracting apps on iPhone. Unlock when you code with Cursor or Claude Code — automatically. Less brainrot, more flow.',
            url: 'https://mariz.ai/vibeflow',
            potentialAction: {
              '@type': 'SubscribeAction',
              target: {
                '@type': 'EntryPoint',
                urlTemplate: 'https://mariz.ai/vibeflow',
              },
              deliveryMethod: 'http://schema.org/HttpDeliveryMethod',
            },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'Vibeflow',
            applicationCategory: 'ProductivityApplication',
            operatingSystem: 'iOS',
            description:
              'Focus app for developers: blocks distracting apps on iPhone during work hours and unlocks them automatically when you use Cursor or Claude Code.',
          }),
        }}
      />

      <main className={styles.page}>
        <div className={styles.langSwitcher} role="group" aria-label="Language">
          <button
            type="button"
            title="English"
            aria-pressed={mounted && lang === 'en'}
            className={mounted && lang === 'en' ? styles.langBtnActive : ''}
            onClick={() => setLang('en')}
          >
            🇺🇸
          </button>
          <button
            type="button"
            title="Português"
            aria-pressed={mounted && lang === 'pt'}
            className={mounted && lang === 'pt' ? styles.langBtnActive : ''}
            onClick={() => setLang('pt')}
          >
            🇧🇷
          </button>
        </div>

        <div className={styles.logo}>Vibeflow</div>
        <p className={styles.logoTag}>{s.logoTag}</p>
        <p className={styles.logoByline}>{s.logoByline}</p>
        <h1 className={styles.h1}>{s.headline}</h1>
        <p className={styles.tagline}>{s.tagline}</p>
        <p className={styles.formIntro}>{s.formIntro}</p>

        <div className={styles.formWrap}>
          <form className={styles.formRow} noValidate onSubmit={onSubmit}>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={s.emailPlaceholder}
              required
              autoComplete="email"
              aria-label={lang === 'pt' ? 'Seu e-mail' : 'Your email'}
              className={styles.emailInput}
            />
            <button type="submit" disabled={loading} className={styles.submitBtn}>
              {loading ? s.submitting : s.submitBtn}
            </button>
          </form>
          <p className={msgClass} aria-live="polite">
            {message.text}
          </p>
        </div>

        <section className={styles.steps}>
          <h2>{s.howItWorks}</h2>
          <ol className={styles.stepList}>
            <li>
              <span className={styles.stepNum}>1</span>
              <span>{s.step1}</span>
            </li>
            <li>
              <span className={styles.stepNum}>2</span>
              <span>{s.step2}</span>
            </li>
            <li>
              <span className={styles.stepNum}>3</span>
              <span>{s.step3}</span>
            </li>
          </ol>
        </section>

        <footer className={styles.footer}>{s.footer}</footer>
      </main>
    </div>
  )
}
