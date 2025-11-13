# 🧮 Calcolatore di Geometria e Algebra Lineare

Una web application moderna costruita con React e TypeScript per eseguire calcoli avanzati di geometria e algebra lineare.

## 🚀 Caratteristiche

### 📊 Calcolatore di Matrici
- **Operazioni di base**: Addizione, sottrazione, moltiplicazione di matrici
- **Moltiplicazione scalare**: Moltiplica una matrice per uno scalare
- **Determinante**: Calcola il determinante di matrici quadrate
- **Inversa**: Calcola la matrice inversa usando l'eliminazione di Gauss-Jordan
- **Trasposta**: Calcola la trasposta di una matrice
- **Supporto**: Matrici fino a 5x5

### 🎯 Calcolatore di Vettori
- **Operazioni vettoriali**: Addizione, sottrazione, prodotto scalare
- **Prodotto vettoriale**: Per vettori 3D (cross product)
- **Normalizzazione**: Calcola vettori unitari
- **Distanze e angoli**: Calcola distanze tra vettori e angoli
- **Analisi proprietà**: Verifica se i vettori sono paralleli o ortogonali
- **Supporto**: Vettori 2D, 3D, 4D e 5D

### ⚖️ Risolutore di Sistemi Lineari (MEG)
- **Metodo di Eliminazione di Gauss**: Risoluzione completa con passaggi dettagliati
- **Sistemi fino a 5x5**: Supporto per sistemi di equazioni lineari
- **Analisi soluzioni**: Rileva sistemi con soluzione unica, infinite soluzioni o inconsistenti
- **Passaggi visualizzati**: Mostra tutti i passaggi dell'eliminazione gaussiana
- **Formato matriciale**: Input intuitivo per coefficienti e termini noti

### 📐 Calcolatore di Geometria
- **Distanze**: Punto-punto, punto-retta (2D/3D), punto-piano
- **Aree e volumi**: Area del triangolo, volume del tetraedro
- **Intersezioni**: Retta-retta (2D), retta-piano (3D)
- **Angoli**: Calcolo angoli tra vettori
- **Trasformazioni**: Riflessioni e rotazioni (2D)
- **Formule avanzate**: Implementazione di formule geometriche complesse

## 🛠️ Tecnologie Utilizzate

- **React 18** con TypeScript
- **Vite** per il build system e development server
- **CSS moderno** con gradients e glassmorphism
- **Classi matematiche personalizzate** per Matrix, Vector e Geometry
- **Design responsive** ottimizzato per desktop e mobile

## 🚦 Installazione e Utilizzo

### Prerequisiti
- Node.js (versione 18 o superiore)
- npm

### Installazione
```bash
# Installa le dipendenze
npm install
```

### Sviluppo
```bash
# Avvia il server di sviluppo
npm run dev

# Apri http://localhost:5173 nel browser
```

### Build per produzione
```bash
# Crea il build ottimizzato
npm run build

# Anteprima del build
npm run preview
```

## 📱 Interfaccia Utente

### Design
- **Tema moderno**: Gradient blu-viola con effetti glassmorphism
- **Navigazione intuitiva**: Tab navigation tra i diversi calcolatori
- **Input dinamici**: Campi input che si adattano alle dimensioni selezionate
- **Risultati chiari**: Visualizzazione formattata dei risultati matematici
- **Responsive**: Ottimizzato per dispositivi desktop e mobile

## 🧮 Esempi di Utilizzo

### Calcolo matrice inversa
1. Seleziona "Matrici" dalla navigazione
2. Scegli operazione "Inversa (A⁻¹)"
3. Imposta dimensioni matrice (es. 2x2)
4. Inserisci i valori della matrice
5. Clicca "Calcola" per ottenere l'inversa

### Risoluzione sistema lineare
1. Seleziona "Sistemi Lineari"
2. Imposta la dimensione del sistema
3. Inserisci coefficienti e termini noti
4. Clicca "Risolvi Sistema"
5. Visualizza la soluzione e i passaggi MEG

### Calcolo prodotto vettoriale
1. Seleziona "Vettori"
2. Imposta dimensione 3D
3. Scegli "Prodotto vettoriale (A × B)"
4. Inserisci le componenti dei vettori
5. Ottieni il risultato del cross product

## 🔬 Algoritmi Implementati

### Eliminazione Gaussiana
- Pivot parziale per stabilità numerica
- Gestione di sistemi singolari
- Rilevamento di sistemi inconsistenti

### Calcolo Determinante
- Algoritmo ricorsivo per matrici piccole
- Espansione di Laplace per matrici grandi
- Ottimizzazioni per matrici triangolari

### Algoritmi Geometrici
- Calcolo distanze con formule vettoriali
- Intersezioni usando sistemi parametrici
- Trasformazioni con matrici di rotazione

---

**Nota**: Questa è una applicazione educativa/professionale per calcoli matematici. Tutti gli algoritmi sono implementati seguendo standard accademici e best practices per la stabilità numerica.