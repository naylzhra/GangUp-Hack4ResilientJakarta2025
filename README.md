# hack4resilient

## Installing / Getting started
Anda perlu menginstall pip dan Node.js.
Setelah itu, install package package di bawah ini dengan run kode :
```shell
pip install fastapi uvicorn
pip install fastapi uvicorn[standard] reportlab shapely pydantic
npm install
npm i react-leaflet leaflet
```

Buka 2 terminal.
Di terminal pertama, navigasi ke folder backend, lalu jalankan API.
```shell
cd src/backend
uvicorn app:app --reload
```
Di terminal ke dua, navigasi ke folder frontend, lalu jalankan interface.

```shell
cd src/frontend
npm run dev
```
Jika port tidak terpakai, website akan dijalankan di http://localhost:3000. CTRL+klik link tersebut di terminal Anda. 
