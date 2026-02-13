import Image from 'next/image'

export default function Home() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Image
        src="/logo.png"
        alt="Mariz AI"
        width={400}
        height={400}
        style={{ objectFit: 'contain', filter: 'drop-shadow(0 25px 25px rgba(0,0,0,0.3))' }}
        priority
      />
    </main>
  )
}
