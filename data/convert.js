/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');
const proj4 = require('proj4');

const contentStream = fs.createReadStream(path.join(__dirname, 'gua.csv'), { encoding: 'utf8' });
Papa.parse(contentStream, {
  encoding: 'utf8',
  header: true,
  complete: (results) => {
    const features = results.data.reduce((arr, row) => {
      if (row.X && row.Y) {
        const c = proj4(
          '+proj=utm +zone=49 +south',
          'EPSG:4326',
          [parseInt(row.X, 10), parseInt(row.Y, 10)],
        );
        const feature = {
          type: 'Feature',
          properties: {
            NAMA: row.NAMA,
            JENIS: row.JENIS,
            STATUS: row.STATUS,
            POTENSI: row.POTENSI,
            SURVEYOR: row.SURVEYOR,
            REFERENSI: row.REFERENSI,
          },
          geometry: {
            type: 'Point',
            coordinates: [c[1], c[0]],
          },
        };
        arr.push(feature);
      }

      return arr;
    }, []);
    const jsonString = JSON.stringify(features);
    const targetFile = path.join(path.dirname(__dirname), 'app/data/generated.ts');
    fs.writeFileSync(
      targetFile,
      `// this file is auto-generated
import type { Feature } from 'geojson';
const generated: Feature[] = ${jsonString};
export default generated;`,
      (error) => { console.log(error); },
    );
  },
});
