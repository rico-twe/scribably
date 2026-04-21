import { Layout } from '../components/layout/Layout'
import { useNoIndex } from '../hooks/useNoIndex'
import { navigate } from '../hooks/useHashRoute'

interface LegalPageProps {
  theme: 'cream' | 'dark'
  onThemeToggle: () => void
}

export function ImpressumPage({ theme, onThemeToggle }: LegalPageProps) {
  useNoIndex()

  return (
    <Layout context="landing" theme={theme} onThemeToggle={onThemeToggle}>
      <div className="max-w-[720px] mx-auto px-6 md:px-10 py-16 md:py-24">
        <button
          onClick={() => navigate('landing')}
          className="inline-flex items-center gap-1.5 text-[13px] text-text-secondary hover:text-text-primary transition-colors mb-10 font-clay-ui"
        >
          ← Zurück
        </button>

        <h1 className="text-[2rem] md:text-[2.5rem] font-clay-display font-bold text-text-primary mb-12 leading-tight">
          Impressum
        </h1>

        <div className="prose-legal space-y-10 text-[15px] leading-[1.75] text-text-primary">

          <section>
            <h2 className="text-[1.1rem] font-semibold font-clay-display mb-3 text-text-primary">
              Angaben gemäß § 5 TMG
            </h2>
            <p>
              Rico Twesten-Weber<br />
              Ludwig-Erhard-Str. 18<br />
              c/o IP-Management #9756<br />
              20459 Hamburg
            </p>
          </section>

          <section>
            <h2 className="text-[1.1rem] font-semibold font-clay-display mb-3 text-text-primary">
              Kontakt
            </h2>
            <p>
              E-Mail:{' '}
              <a
                href="mailto:hello@scribably.com"
                className="text-ube-600 dark:text-ube-300 hover:underline"
              >
                hello@scribably.com
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-[1.1rem] font-semibold font-clay-display mb-3 text-text-primary">
              Redaktionell verantwortlich
            </h2>
            <p>Rico Twesten-Weber</p>
          </section>

          <section>
            <h2 className="text-[1.1rem] font-semibold font-clay-display mb-3 text-text-primary">
              Haftungsausschluss
            </h2>
            <h3 className="font-semibold mb-2 text-[0.95rem]">Haftung für Inhalte</h3>
            <p className="mb-4 text-text-secondary">
              Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten
              nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als
              Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde
              Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige
              Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von
              Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine
              diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten
              Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen
              werden wir diese Inhalte umgehend entfernen.
            </p>
            <h3 className="font-semibold mb-2 text-[0.95rem]">Haftung für Links</h3>
            <p className="text-text-secondary">
              Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen
              Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr
              übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder
              Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der
              Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum
              Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente inhaltliche Kontrolle der
              verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht
              zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend
              entfernen.
            </p>
          </section>

          <section>
            <h2 className="text-[1.1rem] font-semibold font-clay-display mb-3 text-text-primary">
              Urheberrecht
            </h2>
            <p className="text-text-secondary">
              Der Quellcode dieser Webanwendung ist unter der{' '}
              <a
                href="https://github.com/rico-twe/scribably/blob/main/LICENSE"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ube-600 dark:text-ube-300 hover:underline"
              >
                Apache-2.0-Lizenz
              </a>{' '}
              auf GitHub veröffentlicht. Sofern die Inhalte auf dieser Seite nicht vom Betreiber
              erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte
              Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung
              aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von
              Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.
            </p>
          </section>

          <p className="text-[12px] text-text-tertiary pt-4 border-t border-border-subtle font-mono">
            Quelle: e-recht24.de
          </p>
        </div>
      </div>
    </Layout>
  )
}
