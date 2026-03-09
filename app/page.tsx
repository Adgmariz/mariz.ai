import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  const projetos = [
    {
      nome: 'NR1 Riscos Psicossociais',
      descricao: 'Sistema para aplicação de questionários de análise de riscos psicossociais, em conformidade com a NR-1.',
      url: 'https://www.nr1riscospsicossociais.com.br/',
    },
  ]

  return (
    <main className="blog">
      <header className="header">
        <h1 className="site-title">Mariz AI</h1>
      </header>

      <article className="article">
        <section className="hero">
          <div className="hero-image-wrapper">
            <Image
              src="/alexis_formatura.jpeg"
              alt="Alexis na formatura"
              width={600}
              height={800}
              className="hero-image"
              priority
            />
          </div>
          <div className="hero-text">
            <h2>Olá, meu nome é <span className="name-inline">Alexis Mariz.</span></h2>
            <h3 className="story-title">Minha história</h3>
            <p>
              Formado em Ciência da Computação pela Universidade Federal de Minas Gerais, carrego com orgulho a bagagem
              de uma formação que valoriza rigor acadêmico e pensamento crítico. Essa foto
              registra um daqueles momentos que marcam: a formatura, o diploma na mão e a
              sensação de dever cumprido. Foram muitos desafios, uma pandemia e o principal aprendizado: como aprender a aprender.
            </p>
            <p>
              Desde a faculdade me dedico à Inteligência Artificial, agentes e programação com IA.
              Hoje estou numa jornada de empreendedorismo, levando esse conhecimento para
              projetos reais e ajudando a construir o futuro com tecnologia.
            </p>
          </div>
        </section>

        <section className="projects">
          <h2>Projetos</h2>
          <p className="projects-intro">
            Abaixo está uma lista não exaustiva dos meus projetos.
          </p>
          {projetos.length > 0 ? (
            <ul className="project-list">
              {projetos.map((projeto, i) => (
                <li key={i} className="project-item">
                  {projeto.url ? (
                    <Link href={projeto.url} target="_blank" rel="noopener noreferrer">
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
            <p className="projects-empty">
              Em breve, novos projetos serão listados aqui.
            </p>
          )}
        </section>
      </article>

      <footer className="footer">
        <p>© {new Date().getFullYear()} Mariz AI</p>
      </footer>
    </main>
  )
}
