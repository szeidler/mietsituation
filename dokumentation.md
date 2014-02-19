**Dokumentation des Open Data Projektes - Mietsituation Berlin**

# Konzeptionelle Phase

Als Gruppe beschlossen wir, die Datenqualität über die Mietsituation in Berlin zu verbessern. Erste Untersuchungen ergaben, dass von der Berliner Senatsverwaltung für Stadtentwicklung und Umwelt ein Straßenverzeichnis im PDF-Format mit über 35.000 nicht maschinenlesbaren Einträgen über die Wohnlagen in Berlin vorlag.

Unsere Idee war es, diese Daten zu Visualisieren und dem Endnutzer kostenlos ohne Restriktionen zu Verfügung zu stellen.

Der Versuch, die in PDF zugänglichen Daten als auswertbare CSV Daten zu erhalten schlug leider fehlt. Im Kontakt mit der Senatsverwaltung wurden wir von Person zu Person weitergewiesen bis wir den richtigen Ansprechpartner gefunden hatten, welcher jegliche Anfragen ignorierte.

## Aufteilung der Aufgaben

Die schlechte Datenqualität war zunächst eine Herausforderung. Um effektiv vorgehen zu können teilten wir unser Projekt in Unterkategorien auf. Es entstand eine Frontend, eine Backend und eine Datenqualitätsmanagement Gruppe.


# Entwicklungsphase

## Datenqualitätsmanagement

Die Datenqualitätsmanagement-Gruppe entwickelte eine Java Basierte Applikation zum Parsen des existierenden Straßenverzeichnisses in PDF-Form. Das Resultat war ein großer auswertbarer Datensatz, der sowohl als MySQL als auch JSON-Daten vorliegen.


### Parsing:

Da die Daten bezüglich des Mietspiegels, bislang nur in Form einer PDF-Datei vorlagen, sollten diese aus zwei Gründen geparsed werden.

Zum einen werden die Daten, zur grafischen Darstellung, machinenlesbarer Form benötigt und zum anderen entspricht die Bereitstellung im PDF Format nicht dem Prinzip der offenen Daten.

Zum Parsen der PDF-Datei wurde die Java Bibliothek *PDFBox* von der Apache Software Foundation verwendet.

Die PDFBox bietet ein großes Spektrum an Funktionalität zum Lesen von PDF-Dateien und besitzt gleichzeitig eine geringe Lernkurve, so dass sie für den Zweck dieses Projektes ideal geeignet war.

Zunächst haben wir die im Dokument verwendete Adressstruktur in Java-Objekte gekaspelt um eine zukünftige Wiederverwertbarkeit zu gewährleisten.

Das PDF Dokument gliedert sich im Sinne dieses Projektes in drei logische Teile:

1. Einen schriftlichen Einleitungsteil, der für unser Vorhaben uninteressant ist
2. eine Auflistung aller Berliner Stadbezirke
3. die Ausweisung der Wohnlage aller Straßen in den zuvor aufgelisteten Bezirken

Im ersten Programmschritt werden sämtliche Stadtbezirke eingelesen und in Objekten gespeichert. Anschließend werden die Ausweisungen der Wohnlagen eingelesen und an Hand der Kürzel den entsprechenden Bezirken zugewiesen. Auf Grund einer inkonsistenen Anzahl an Leerzeichen zwischen den Wörtern, sowie einer optionalen Ausweisug von Lärmbelästigung in Form eines Sterns (*), mussten diese Daten rückwärts eingelesen werden.


## Geocoding der Adressen

Während des PDF-Parsing Vorganges wird über alle im Straßenverzeichnis vorhandenen Adressen iteriert. Am Ende des Prozesses sollte eine für die Visualisierungsgruppe nutzbare Datenlage erzeugt werden. Dafür war es nötig, zusätzlich zur Qualitätsbewertung der Adresse, die zugehörigen Geodaten zu speichern. Aufgrund der großen Datenmenge von über 35.000 Einträgen, konnten die Geocoding Dienste von Google und OpenStreetMaps nicht genutzt werden, da diese Dienste Datenabfragen in einem solchen Umfang nur begrenzt, oder durch Drittanbieter kommerziell anbieten.

Von einer Abfrage in mehreren Schritten haben wir abgesehen, da wir auf der Datenplattform der Senatsverwaltung für Stadtentwicklung und Umwelt im FIS-Broker einen Datensatz für die Hauskoordinaten gefunden haben. Der Datensatz besteht aus einer kommaseparierten Datei, die unter anderem jede bekannten Adresse in Berlin mit Hausnummer, Hausnummernzusatz, Postleitzahl und Koordinaten enthalten. Von diesem Angebot erhofften wir uns eine vollständige Datenlage, die bestenfalls mit den gleichen Adressformaten wie das Straßenverzeichnis arbeitet (z.B. eine konsistente Nutzung von *straße und *str. Diese Liste haben wir in eine MySQL-Tabelle überführt, um performante dynamische Abfragen auf sie ausführen zu können.

Während des Iterationsprozesses über jede PDF-Zeile rufen wir über eine nach Straßennamen und Hausnummern gefilterte SQL-Abfrage die Koordinaten des Datensatzes ab.

Doch Koordinaten sind nicht gleich Koordinaten. Für die meisten Mapping-Dienste wie Google Maps oder OpenStreetMaps hat sich die Spezifizierung der Datenpunkte mittels Latitude/Longitude Koordinaten etabliert. Zu unserer Überraschung liegen die Koordinaten der Stadtverwaltung jedoch im dem für uns ungewohnten ETRS89/UTM Format vor. Es handelt sich hierbei um ein globales Koordinatensystem. Es verwendet eine andere Projektion, die eine präzisere Positionierung möglich macht. Deshalb ist sie der Standard für Vermessung und Kartographie in Europa geworden.

Um jedoch LonLat-Koordinaten zu exportieren bedurfte es einer Konvertierung von ETRS89/UTM in das LonLat-System. Dafür haben wir die von IBM [[http://www.ibm.com/developerworks/library/j-coordconvert/](http://www.ibm.com/developerworks/library/j-coordconvert/)] veröffentlichte Java-Klasse zur Koordinatenkonvertierung in unseren Parser eingebunden.

An diesem Punkt haben wir ein Adress-Objekt erzeugt, dass alle benötigten Informationen enthält. Zunächst haben wir eine JSON-Datei generiert, die ausschließlich die Koordinaten plus Qualitätsbewertung der entsprechenden Datensätze enthält. Sie sind die Mindestanforderungen, die die Frontend-Gruppe für die Integration mittels Leaflet gestellt hatten.

Während unserer Recherche haben wir festgestellt, dass es auch die Wohnlagenbewertungen der letzten Mietspiegel-Veröffentlichungen des Berliner Senats gibt. Somit ist es denkbar einen Slider auf Zeitbasis einzubauen, der die Veränderungen der Wohnlagen im jeweils im Zwei-Jahres-Takt veröffentlichten Mietspiegel anzeigt. So könnten zum Beispiel Stadtviertel identifiziert werden, in dem es eine deutliche Aufwertung in den letzten Jahren gab.

Um diese potentielle Möglichkeit nicht zu verbauen, haben wir uns dazu entschieden, die Daten zusätzlich in einer MySQL-Tabelle zu speichern. Über eine Abfragebedingung können so die Einträge des jeweiligen Jahres abgerufen und nach Bedarf miteinander verglichen werden. Außerdem hat sich während der Entwicklung der Frontend-Gruppe herausgestellt, dass die große Menge der Datenpunkte in der Javascript-Verarbeitung zu Performance-Schwierigkeiten bei Interaktion mit de Karte führen kann. Browser mit einer weniger robusten Javascript-Engine werden stark ausgelastet und es kann zur Timeouts innerhalb der Darstellung kommen. Die MySQL-Implementierung der Daten bietet hier die Möglichkeit mit dynamischen Abfragen die Anzahl der Datensätze zu verringern, z.B. durch Aggregierung und Kategorisierung oder durch die dynamische Abfrage nur der Standorte, die sich im momentanen Anzeigebereich der Karte befinden.
 

## Frontend zur Visualisierung der Daten

Die Frontend Gruppe beschäftigte sich zunächst intensiv mit der Google Maps API für die Visualisierung des Mitspiegels auf einer Karte in Form einer Heatmap.

Der erste Prototyp auf Basis der Google Maps API wurde fertiggestellt und zunächst mit wenigen Testdaten gefüllt.

Nach längerem Überlegen ist die Entscheidung gefallen um dem Konzept von Open Data treu zu bleiben auf Open Street Maps umzusteigen.

Im nächsten Schritt wurde ein neuer Prototyp der Heatmap auf Basis von Open Street Map mit eingebundenem Leaflet zur Visualisierung entwickelt.
