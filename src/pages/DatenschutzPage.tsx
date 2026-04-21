import { Layout } from '../components/layout/Layout'
import { useNoIndex } from '../hooks/useNoIndex'
import { navigate } from '../hooks/useHashRoute'

interface LegalPageProps {
  theme: 'cream' | 'dark'
  onThemeToggle: () => void
}

export function DatenschutzPage({ theme, onThemeToggle }: LegalPageProps) {
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
          Datenschutzerklärung
        </h1>

        <div className="space-y-10 text-[15px] leading-[1.75] text-text-primary">

          {/* 1 */}
          <section>
            <h2 className="text-[1.25rem] font-bold font-clay-display mb-4 text-text-primary">
              1. Datenschutz auf einen Blick
            </h2>

            <h3 className="font-semibold mb-2 text-[0.95rem]">Allgemeine Hinweise</h3>
            <p className="mb-4 text-text-secondary">
              Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren
              personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene
              Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.
              Ausführliche Informationen zum Thema Datenschutz entnehmen Sie unserer unter diesem
              Text aufgeführten Datenschutzerklärung.
            </p>

            <h3 className="font-semibold mb-2 text-[0.95rem]">Datenerfassung auf dieser Website</h3>
            <p className="font-medium mb-1 text-[0.9rem]">
              Wer ist verantwortlich für die Datenerfassung auf dieser Website?
            </p>
            <p className="mb-4 text-text-secondary">
              Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen
              Kontaktdaten können Sie dem Abschnitt „Hinweis zur Verantwortlichen Stelle" in dieser
              Datenschutzerklärung entnehmen.
            </p>

            <p className="font-medium mb-1 text-[0.9rem]">Wie erfassen wir Ihre Daten?</p>
            <p className="mb-4 text-text-secondary">
              Scribably ist eine reine Client-Anwendung – es gibt keinen Scribably-Server. Ihre
              Eingaben, Einstellungen und API-Schlüssel werden ausschließlich lokal in Ihrem Browser
              gespeichert (localStorage) und verlassen Ihr Gerät nicht an Scribably-Infrastruktur.
              Beim Aufruf der Website können technisch bedingt Serverdaten (z. B. IP-Adresse,
              Zeitstempel) durch den Hosting-Anbieter erfasst werden.
            </p>

            <p className="font-medium mb-1 text-[0.9rem]">Wofür nutzen wir Ihre Daten?</p>
            <p className="mb-4 text-text-secondary">
              Die technisch erfassten Serverdaten dienen ausschließlich der fehlerfreien
              Bereitstellung der Website. Es findet keine Analyse Ihres Nutzerverhaltens statt.
            </p>

            <p className="font-medium mb-1 text-[0.9rem]">Welche Rechte haben Sie bezüglich Ihrer Daten?</p>
            <p className="mb-4 text-text-secondary">
              Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und
              Zweck Ihrer gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem ein
              Recht, die Berichtigung oder Löschung dieser Daten zu verlangen. Wenn Sie eine
              Einwilligung zur Datenverarbeitung erteilt haben, können Sie diese Einwilligung
              jederzeit für die Zukunft widerrufen. Außerdem haben Sie das Recht, unter bestimmten
              Umständen die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten zu
              verlangen. Des Weiteren steht Ihnen ein Beschwerderecht bei der zuständigen
              Aufsichtsbehörde zu.
            </p>

            <p className="font-medium mb-1 text-[0.9rem]">Analyse-Tools und Tools von Drittanbietern</p>
            <p className="text-text-secondary">
              Diese Website nutzt <strong>Umami</strong> – eine datenschutzfreundliche
              Webanalyse-Software, die wir selbst betreiben. Umami setzt keine Cookies und
              speichert keine personenbezogenen Daten dauerhaft. Weitere Informationen finden
              Sie im Abschnitt „Webanalyse mit Umami".
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-[1.25rem] font-bold font-clay-display mb-4 text-text-primary">
              2. Hosting
            </h2>
            <p className="mb-3 font-semibold text-[0.95rem]">All-Inkl</p>
            <p className="mb-4 text-text-secondary">
              Wir hosten die Inhalte unserer Website bei folgendem Anbieter: ALL-INKL.COM – Neue
              Medien Münnich, Inh. René Münnich, Hauptstraße 68, 02742 Friedersdorf. Details
              entnehmen Sie der Datenschutzerklärung von All-Inkl:{' '}
              <a
                href="https://all-inkl.com/datenschutzinformationen"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ube-600 dark:text-ube-300 hover:underline"
              >
                all-inkl.com/datenschutzinformationen
              </a>
              .
            </p>
            <p className="mb-4 text-text-secondary">
              Die Verwendung von All-Inkl erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Wir
              haben ein berechtigtes Interesse an einer möglichst zuverlässigen Darstellung unserer
              Website.
            </p>
            <p className="font-medium mb-2 text-[0.9rem]">Auftragsverarbeitung</p>
            <p className="text-text-secondary">
              Wir haben einen Vertrag über Auftragsverarbeitung (AVV) zur Nutzung des oben genannten
              Dienstes geschlossen. Hierbei handelt es sich um einen datenschutzrechtlich
              vorgeschriebenen Vertrag, der gewährleistet, dass dieser die personenbezogenen Daten
              unserer Websitebesucher nur nach unseren Weisungen und unter Einhaltung der DSGVO
              verarbeitet.
            </p>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-[1.25rem] font-bold font-clay-display mb-4 text-text-primary">
              3. Allgemeine Hinweise und Pflichtinformationen
            </h2>

            <h3 className="font-semibold mb-2 text-[0.95rem]">Datenschutz</h3>
            <p className="mb-4 text-text-secondary">
              Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir
              behandeln Ihre personenbezogenen Daten vertraulich und entsprechend den gesetzlichen
              Datenschutzvorschriften sowie dieser Datenschutzerklärung.
            </p>
            <p className="mb-6 text-text-secondary">
              Wir weisen darauf hin, dass die Datenübertragung im Internet (z. B. bei der
              Kommunikation per E-Mail) Sicherheitslücken aufweisen kann. Ein lückenloser Schutz der
              Daten vor dem Zugriff durch Dritte ist nicht möglich.
            </p>

            <h3 className="font-semibold mb-2 text-[0.95rem]">Hinweis zur verantwortlichen Stelle</h3>
            <p className="mb-2 text-text-secondary">
              Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:
            </p>
            <p className="mb-6 text-text-secondary">
              Rico Twesten-Weber<br />
              c/o IP-Management #9756<br />
              Ludwig-Erhard-Str. 18<br />
              20459 Hamburg<br />
              E-Mail:{' '}
              <a
                href="mailto:hello@scribably.com"
                className="text-ube-600 dark:text-ube-300 hover:underline"
              >
                hello@scribably.com
              </a>
            </p>
            <p className="mb-6 text-text-secondary">
              Verantwortliche Stelle ist die natürliche oder juristische Person, die allein oder
              gemeinsam mit anderen über die Zwecke und Mittel der Verarbeitung von
              personenbezogenen Daten entscheidet.
            </p>

            <h3 className="font-semibold mb-2 text-[0.95rem]">Speicherdauer</h3>
            <p className="mb-6 text-text-secondary">
              Soweit innerhalb dieser Datenschutzerklärung keine speziellere Speicherdauer genannt
              wurde, verbleiben Ihre personenbezogenen Daten bei uns, bis der Zweck für die
              Datenverarbeitung entfällt. Wenn Sie ein berechtigtes Löschersuchen geltend machen
              oder eine Einwilligung zur Datenverarbeitung widerrufen, werden Ihre Daten gelöscht,
              sofern wir keine anderen rechtlich zulässigen Gründe für die Speicherung Ihrer
              personenbezogenen Daten haben.
            </p>

            <h3 className="font-semibold mb-2 text-[0.95rem]">
              Allgemeine Hinweise zu den Rechtsgrundlagen der Datenverarbeitung auf dieser Website
            </h3>
            <p className="mb-6 text-text-secondary">
              Sofern Sie in die Datenverarbeitung eingewilligt haben, verarbeiten wir Ihre
              personenbezogenen Daten auf Grundlage von Art. 6 Abs. 1 lit. a DSGVO. Sind Ihre Daten
              zur Vertragserfüllung oder zur Durchführung vorvertraglicher Maßnahmen erforderlich,
              verarbeiten wir Ihre Daten auf Grundlage des Art. 6 Abs. 1 lit. b DSGVO. Des Weiteren
              verarbeiten wir Ihre Daten, sofern diese zur Erfüllung einer rechtlichen Verpflichtung
              erforderlich sind, auf Grundlage von Art. 6 Abs. 1 lit. c DSGVO. Die
              Datenverarbeitung kann ferner auf Grundlage unseres berechtigten Interesses nach
              Art. 6 Abs. 1 lit. f DSGVO erfolgen.
            </p>

            <h3 className="font-semibold mb-2 text-[0.95rem]">Widerruf Ihrer Einwilligung zur Datenverarbeitung</h3>
            <p className="mb-6 text-text-secondary">
              Viele Datenverarbeitungsvorgänge sind nur mit Ihrer ausdrücklichen Einwilligung
              möglich. Sie können eine bereits erteilte Einwilligung jederzeit widerrufen. Die
              Rechtmäßigkeit der bis zum Widerruf erfolgten Datenverarbeitung bleibt vom Widerruf
              unberührt.
            </p>

            <h3 className="font-semibold mb-2 text-[0.95rem]">
              Widerspruchsrecht gegen die Datenerhebung in besonderen Fällen sowie gegen
              Direktwerbung (Art. 21 DSGVO)
            </h3>
            <p className="mb-6 text-text-secondary uppercase text-[0.875rem]">
              Wenn die Datenverarbeitung auf Grundlage von Art. 6 Abs. 1 lit. e oder f DSGVO
              erfolgt, haben Sie jederzeit das Recht, aus Gründen, die sich aus Ihrer besonderen
              Situation ergeben, gegen die Verarbeitung Ihrer personenbezogenen Daten Widerspruch
              einzulegen; dies gilt auch für ein auf diese Bestimmungen gestütztes Profiling. Die
              jeweilige Rechtsgrundlage, auf denen eine Verarbeitung beruht, entnehmen Sie dieser
              Datenschutzerklärung. Wenn Sie Widerspruch einlegen, werden wir Ihre betroffenen
              personenbezogenen Daten nicht mehr verarbeiten, es sei denn, wir können zwingende
              schutzwürdige Gründe für die Verarbeitung nachweisen, die Ihre Interessen, Rechte und
              Freiheiten überwiegen oder die Verarbeitung dient der Geltendmachung, Ausübung oder
              Verteidigung von Rechtsansprüchen (Widerspruch nach Art. 21 Abs. 1 DSGVO).
            </p>

            <h3 className="font-semibold mb-2 text-[0.95rem]">Beschwerderecht bei der zuständigen Aufsichtsbehörde</h3>
            <p className="mb-6 text-text-secondary">
              Im Falle von Verstößen gegen die DSGVO steht den Betroffenen ein Beschwerderecht bei
              einer Aufsichtsbehörde, insbesondere in dem Mitgliedstaat ihres gewöhnlichen
              Aufenthalts, ihres Arbeitsplatzes oder des Orts des mutmaßlichen Verstoßes zu. Das
              Beschwerderecht besteht unbeschadet anderweitiger verwaltungsrechtlicher oder
              gerichtlicher Rechtsbehelfe.
            </p>

            <h3 className="font-semibold mb-2 text-[0.95rem]">Recht auf Datenübertragbarkeit</h3>
            <p className="mb-6 text-text-secondary">
              Sie haben das Recht, Daten, die wir auf Grundlage Ihrer Einwilligung oder in
              Erfüllung eines Vertrags automatisiert verarbeiten, an sich oder an einen Dritten in
              einem gängigen, maschinenlesbaren Format aushändigen zu lassen.
            </p>

            <h3 className="font-semibold mb-2 text-[0.95rem]">Auskunft, Berichtigung und Löschung</h3>
            <p className="mb-6 text-text-secondary">
              Sie haben im Rahmen der geltenden gesetzlichen Bestimmungen jederzeit das Recht auf
              unentgeltliche Auskunft über Ihre gespeicherten personenbezogenen Daten, deren
              Herkunft und Empfänger und den Zweck der Datenverarbeitung und ggf. ein Recht auf
              Berichtigung oder Löschung dieser Daten. Hierzu sowie zu weiteren Fragen zum Thema
              personenbezogene Daten können Sie sich jederzeit an uns wenden.
            </p>

            <h3 className="font-semibold mb-2 text-[0.95rem]">Recht auf Einschränkung der Verarbeitung</h3>
            <p className="mb-4 text-text-secondary">
              Sie haben das Recht, die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten
              zu verlangen. Hierzu können Sie sich jederzeit an uns wenden. Das Recht auf
              Einschränkung der Verarbeitung besteht in folgenden Fällen:
            </p>
            <ul className="list-disc pl-5 space-y-2 mb-6 text-text-secondary">
              <li>
                Wenn Sie die Richtigkeit Ihrer bei uns gespeicherten personenbezogenen Daten
                bestreiten, benötigen wir in der Regel Zeit, um dies zu überprüfen. Für die Dauer
                der Prüfung haben Sie das Recht, die Einschränkung der Verarbeitung Ihrer
                personenbezogenen Daten zu verlangen.
              </li>
              <li>
                Wenn die Verarbeitung Ihrer personenbezogenen Daten unrechtmäßig
                geschah/geschieht, können Sie statt der Löschung die Einschränkung der
                Datenverarbeitung verlangen.
              </li>
              <li>
                Wenn wir Ihre personenbezogenen Daten nicht mehr benötigen, Sie sie jedoch zur
                Ausübung, Verteidigung oder Geltendmachung von Rechtsansprüchen benötigen, haben
                Sie das Recht, statt der Löschung die Einschränkung der Verarbeitung Ihrer
                personenbezogenen Daten zu verlangen.
              </li>
              <li>
                Wenn Sie einen Widerspruch nach Art. 21 Abs. 1 DSGVO eingelegt haben, muss eine
                Abwägung zwischen Ihren und unseren Interessen vorgenommen werden. Solange noch
                nicht feststeht, wessen Interessen überwiegen, haben Sie das Recht, die
                Einschränkung der Verarbeitung Ihrer personenbezogenen Daten zu verlangen.
              </li>
            </ul>

            <h3 className="font-semibold mb-2 text-[0.95rem]">SSL- bzw. TLS-Verschlüsselung</h3>
            <p className="text-text-secondary">
              Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher
              Inhalte eine SSL- bzw. TLS-Verschlüsselung. Eine verschlüsselte Verbindung erkennen
              Sie daran, dass die Adresszeile des Browsers von „http://" auf „https://" wechselt und
              an dem Schloss-Symbol in Ihrer Browserzeile.
            </p>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-[1.25rem] font-bold font-clay-display mb-4 text-text-primary">
              4. Datenerfassung auf dieser Website
            </h2>

            <h3 className="font-semibold mb-2 text-[0.95rem]">Cookies und lokale Speicherung</h3>
            <p className="mb-6 text-text-secondary">
              Diese Website setzt <strong>keine Cookies</strong>. Zur Speicherung von
              Benutzereinstellungen (z. B. Farbschema) und von Ihnen eingegebenen API-Schlüsseln
              wird ausschließlich der <strong>localStorage</strong> Ihres Browsers verwendet. Diese
              Daten verbleiben lokal auf Ihrem Gerät und werden nicht an Server übertragen.
              Das Webanalyse-Tool Umami speichert ebenfalls <strong>keine</strong> Daten im
              localStorage oder in Cookies – es werden keine Tracking-Informationen auf Ihrem
              Endgerät abgelegt.
              Sie können alle localStorage-Daten jederzeit über die Entwicklerwerkzeuge Ihres
              Browsers löschen.
            </p>

            <h3 className="font-semibold mb-2 text-[0.95rem]">Audioverarbeitung</h3>
            <p className="mb-6 text-text-secondary">
              Audioaufnahmen, die Sie über die Scribably-Anwendung erstellen, werden
              <strong> ausschließlich lokal in Ihrem Browser</strong> verarbeitet. Eine Übertragung
              an Scribably-Server findet nicht statt. Sofern Sie einen externen Anbieter (Groq,
              OpenAI) für die Spracherkennung konfigurieren, werden Audiodaten direkt von Ihrem
              Browser an den jeweiligen Anbieter gesendet – nicht über Scribably-Infrastruktur.
              Für diese Verarbeitung gilt Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung /
              Dienstnutzung).
            </p>

            <h3 className="font-semibold mb-2 text-[0.95rem]">API-Anfragen an Drittanbieter</h3>
            <p className="mb-4 text-text-secondary">
              API-Anfragen für Spracherkennung und Textverarbeitung werden direkt von Ihrem Browser
              an die jeweiligen Drittanbieter gesendet. Scribably agiert dabei nicht als Proxy oder
              Zwischenspeicher. Für die Verarbeitung Ihrer Daten durch diese Anbieter gelten deren
              jeweilige Datenschutzerklärungen:
            </p>
            <ul className="list-disc pl-5 space-y-2 mb-6 text-text-secondary">
              <li>
                <strong>Groq:</strong>{' '}
                <a
                  href="https://groq.com/privacy-policy/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ube-600 dark:text-ube-300 hover:underline"
                >
                  groq.com/privacy-policy
                </a>
              </li>
              <li>
                <strong>OpenAI:</strong>{' '}
                <a
                  href="https://openai.com/policies/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ube-600 dark:text-ube-300 hover:underline"
                >
                  openai.com/policies/privacy-policy
                </a>
              </li>
              <li>
                <strong>Anthropic:</strong>{' '}
                <a
                  href="https://www.anthropic.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ube-600 dark:text-ube-300 hover:underline"
                >
                  anthropic.com/privacy
                </a>
              </li>
            </ul>

            <h3 className="font-semibold mb-2 text-[0.95rem]">Server-Log-Dateien</h3>
            <p className="mb-6 text-text-secondary">
              Der Provider der Seiten erhebt und speichert automatisch Informationen in
              Server-Log-Dateien, die Ihr Browser automatisch übermittelt. Dies sind: Browsertyp und
              Browserversion, verwendetes Betriebssystem, Referrer URL, Hostname des zugreifenden
              Rechners, Uhrzeit der Serveranfrage, IP-Adresse. Eine Zusammenführung dieser Daten mit
              anderen Datenquellen wird nicht vorgenommen. Die Erfassung dieser Daten erfolgt auf
              Grundlage von Art. 6 Abs. 1 lit. f DSGVO.
            </p>

            <h3 className="font-semibold mb-2 text-[0.95rem]">Anfrage per E-Mail</h3>
            <p className="text-text-secondary">
              Wenn Sie uns per E-Mail kontaktieren, wird Ihre Anfrage inklusive aller daraus
              hervorgehenden personenbezogenen Daten (Name, Anfrage) zum Zwecke der Bearbeitung
              Ihres Anliegens bei uns gespeichert und verarbeitet. Diese Daten geben wir nicht ohne
              Ihre Einwilligung weiter. Die Verarbeitung dieser Daten erfolgt auf Grundlage von
              Art. 6 Abs. 1 lit. b DSGVO, sofern Ihre Anfrage mit der Erfüllung eines Vertrags
              zusammenhängt, oder auf unserem berechtigten Interesse an der effektiven Bearbeitung
              der an uns gerichteten Anfragen (Art. 6 Abs. 1 lit. f DSGVO).
            </p>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-[1.25rem] font-bold font-clay-display mb-4 text-text-primary">
              5. Webanalyse mit Umami
            </h2>

            <h3 className="font-semibold mb-2 text-[0.95rem]">Was ist Umami?</h3>
            <p className="mb-4 text-text-secondary">
              Diese Website nutzt <strong>Umami</strong>, eine Open-Source-Software zur anonymen
              Webanalyse. Wir betreiben Umami auf eigener Infrastruktur in der Europäischen Union;
              Daten werden nicht an Dritte übermittelt.
            </p>

            <h3 className="font-semibold mb-2 text-[0.95rem]">Welche Daten werden erfasst?</h3>
            <p className="mb-2 text-text-secondary">
              Beim Seitenaufruf übermittelt Ihr Browser technische Informationen, die Umami
              ausschließlich zur statistischen Auswertung verwendet:
            </p>
            <ul className="list-disc pl-5 space-y-1 mb-4 text-text-secondary">
              <li>Aufgerufene URL und Seitentitel</li>
              <li>Referrer (die Seite, von der Sie kamen)</li>
              <li>Browsertyp und Betriebssystem (aus dem User-Agent-Header)</li>
              <li>Bildschirmauflösung und Browsersprache</li>
              <li>Herkunftsland (grobe Geolokalisierung aus der IP-Adresse)</li>
              <li>Interaktionsereignisse (z. B. Aufnahme starten, Export-Format)</li>
            </ul>
            <p className="mb-4 text-text-secondary">
              Ihre <strong>IP-Adresse</strong> wird von Umami ausschließlich transient zur
              Berechnung eines anonymen Sitzungsbezeichners verwendet und <strong>nicht dauerhaft
              gespeichert</strong>. Der Sitzungsbezeichner ist ein Hash aus Website-ID, User-Agent,
              IP-Adresse und einem monatlich rotierenden Salt – er ist nicht über Monatsintervalle
              hinweg nachverfolgbar und erlaubt keine Identifizierung einzelner Personen.
            </p>

            <h3 className="font-semibold mb-2 text-[0.95rem]">Cookies und Endgeräte-Speicher</h3>
            <p className="mb-4 text-text-secondary">
              Umami setzt <strong>keine Cookies</strong> und legt <strong>keine Daten im
              localStorage</strong> oder anderen Endgeräte-Speichern ab. TTDSG § 25 ist daher
              nicht einschlägig; ein Cookie-Consent-Banner ist nicht erforderlich.
            </p>

            <h3 className="font-semibold mb-2 text-[0.95rem]">Do Not Track</h3>
            <p className="mb-4 text-text-secondary">
              Unsere Umami-Integration respektiert das <strong>Do-Not-Track-Signal</strong> Ihres
              Browsers. Wenn Sie in den Einstellungen Ihres Browsers DNT aktivieren, werden keine
              Analysedaten an Umami übermittelt.
            </p>

            <h3 className="font-semibold mb-2 text-[0.95rem]">Rechtsgrundlage</h3>
            <p className="mb-4 text-text-secondary">
              Die Verarbeitung erfolgt auf Grundlage von{' '}
              <strong>Art. 6 Abs. 1 lit. f DSGVO</strong> (berechtigtes Interesse). Unser
              berechtigtes Interesse besteht in der anonymen statistischen Auswertung der
              Website-Nutzung zur Verbesserung des Angebots. Da keine personenbezogenen Daten
              dauerhaft gespeichert werden, keine Cookies gesetzt werden und das DNT-Signal
              berücksichtigt wird, überwiegen unsere Interessen die Interessen der betroffenen
              Personen.
            </p>

            <h3 className="font-semibold mb-2 text-[0.95rem]">Speicherdauer</h3>
            <p className="mb-4 text-text-secondary">
              Aggregierte Statistikdaten werden für maximal 14 Monate gespeichert und danach
              automatisch gelöscht.
            </p>

            <h3 className="font-semibold mb-2 text-[0.95rem]">Widerspruchsrecht</h3>
            <p className="text-text-secondary">
              Sie können der Verarbeitung jederzeit widersprechen, indem Sie das{' '}
              <strong>Do-Not-Track-Signal</strong> in Ihrem Browser aktivieren (Firefox:
              Einstellungen → Datenschutz &amp; Sicherheit → „Websites mitteilen, keine Daten zu
              sammeln") oder uns per E-Mail unter{' '}
              <a
                href="mailto:hello@scribably.com"
                className="text-ube-600 dark:text-ube-300 hover:underline"
              >
                hello@scribably.com
              </a>{' '}
              kontaktieren. Im Falle eines Widerspruchs werden keine Analysedaten mehr erhoben.
            </p>
          </section>

          <p className="text-[12px] text-text-tertiary pt-4 border-t border-border-subtle font-mono">
            Vorlage: e-recht24.de · Angepasst für Scribably
          </p>
        </div>
      </div>
    </Layout>
  )
}
