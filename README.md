Gang Up - hack4resilient

# Jalur Air Sosial: A Design Toolkit for Flood-Resilient Kampung Alleys
## Overview
This project creates a comprehensive and contextual design tool kits that can be implemented in alleyways, which are prone to direct damages from urban flooding especially that of high flood-risk areas.

Utilizing the datasets that were given, we determined 3 kampungs with different circumstances and flooding risks as the basis to our design matrix, which are:
1. Kampung Melayu, Jakarta Timur
2. Pademangan, Jakarta Utara
3. Pela Mampang, Jakarta Selatan

The research is used to detect determine alleyway typologies and later on the suitable design tool kit based on: alley width, length, area precipitation, flood risk (avg. flood height, population density, avg. rainfall value), and activities within the alleys.

The matrix is implemented through a growing website prototype called "BedahGang" which allows users to:
1. Generate suitable design tool kit according to the context of their alley
2. Receive cost estimation, section and plan drawings, as well as step-by-step guidebook for each of their suitable design tool kit
3. Learn about other available design tool kits
4. Learn about where the matrix is derived from and what is the vision of BedahGang

## Instructions 
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
cd code/api
uvicorn app:app --reload
```
Di terminal ke dua, navigasi ke folder frontend, lalu jalankan interface.

```shell
cd code/web
npm run dev
```
Jika port tidak terpakai, website akan dijalankan di http://localhost:3000. CTRL+klik link tersebut di terminal Anda. 

## Credits
Dataset Reference

Shabrina, Z., Muharram, F. W., Dhirgantara Putra, D., Rui, J., & Asa, M. (2025). Hack4Resilient Jakarta 2025: Sinking City [Data set]. Zenodo. https://doi.org/10.5281/zenodo.16836145 

## Team Members
- Nadira Natania Indrayanto (Urban Designer)
- Restu Wicaksono (GIS)
- Tara Diandra Ghaisani (UI/UX Designer)
- Mayla Yaffa Ludmilla (Front-End Developer)
- Nayla Zahira (Back-End Developer)
